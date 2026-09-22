const prisma = require('../prisma');

const STAGES = [
  'GENERATED',
  'DOCS_VERIFIED',
  'PRODUCE_RECEIVED',
  'QUALITY_CHECKED',
  'ACCEPTED',
  'REJECTED',
  'PAYMENT_PROCESSED'
];

const getQueueForAdmin = async (req, res) => {
  try {
    const { centreId, crop, stage, search } = req.query;

    const where = {};
    if (centreId) where.centreId = centreId;
    if (crop) where.cropType = crop;
    if (stage) {
      where.stage = stage;
    } else {
      // Default: exclude already completed payments unless explicitly filtered
      where.stage = { notIn: ['PAYMENT_PROCESSED', 'REJECTED'] };
    }

    if (search) {
      where.OR = [
        { tokenNumber: { contains: search } },
        { farmer: { fullName: { contains: search } } },
        { farmer: { mobile: { contains: search } } }
      ];
    }

    const tokens = await prisma.token.findMany({
      where,
      include: {
        farmer: {
          select: { id: true, fullName: true, mobile: true, village: true, district: true, state: true }
        },
        centre: true
      },
      orderBy: [
        { isPriority: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    // Re-index queue positions based on active waiting list
    const activeTokens = tokens.map((t, idx) => ({
      ...t,
      currentLivePosition: idx + 1
    }));

    res.json({ tokens: activeTokens });
  } catch (error) {
    console.error('Error fetching admin queue:', error);
    res.status(500).json({ message: 'Error retrieving queue data.' });
  }
};

const updateTokenStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, qualityGrade, moisturePercent, netWeightQuintal, remarks, mspRate } = req.body;
    const operator = req.user;

    const token = await prisma.token.findUnique({
      where: { id },
      include: { farmer: true, centre: true }
    });

    if (!token) {
      return res.status(404).json({ message: 'Token not found.' });
    }

    const updateData = { stage };
    if (qualityGrade !== undefined) updateData.qualityGrade = qualityGrade;
    if (moisturePercent !== undefined) updateData.moisturePercent = Number(moisturePercent);
    if (netWeightQuintal !== undefined) updateData.netWeightQuintal = Number(netWeightQuintal);
    if (remarks !== undefined) updateData.remarks = remarks;

    // Calculate total payout if accepted or payment processed
    const rate = mspRate || token.mspRate || 2425;
    const weight = netWeightQuintal || token.netWeightQuintal || token.estimatedQuantity;
    if (stage === 'ACCEPTED' || stage === 'PAYMENT_PROCESSED') {
      updateData.mspRate = Number(rate);
      updateData.totalPayout = Number(rate) * Number(weight);
    }

    const updatedToken = await prisma.token.update({
      where: { id },
      data: updateData,
      include: { farmer: true, centre: true }
    });

    // Generate bilingual notification message based on stage
    const stageNotifs = {
      DOCS_VERIFIED: {
        en: `Your documents for token ${token.tokenNumber} are verified. Proceed to weighbridge.`,
        hi: `टोकन ${token.tokenNumber} के दस्तावेज़ सत्यापित हो गए हैं। कृपया वे-ब्रिज पर जाएं।`
      },
      PRODUCE_RECEIVED: {
        en: `Your produce is received at weighbridge. Net weight being recorded.`,
        hi: `आपकी फसल वे-ब्रिज पर प्राप्त हो गई है। वजन दर्ज किया जा रहा है।`
      },
      QUALITY_CHECKED: {
        en: `Quality inspection complete. Grade: ${qualityGrade || 'FAQ'}, Moisture: ${moisturePercent || '12'}%.`,
        hi: `गुणवत्ता परीक्षण पूरा हुआ। ग्रेड: ${qualityGrade || 'FAQ'}, नमी: ${moisturePercent || '12'}%।`
      },
      ACCEPTED: {
        en: `Produce ACCEPTED! ₹${updatedToken.totalPayout || 'Approved'} will be disbursed to your bank account.`,
        hi: `फसल स्वीकार कर ली गई है! ₹${updatedToken.totalPayout || 'स्वीकृत'} सीधे बैंक खाते में भेजे जाएंगे।`
      },
      REJECTED: {
        en: `Produce rejected: ${remarks || 'Moisture or quality beyond permissible tolerance.'}`,
        hi: `फसल अस्वीकार: ${remarks || 'नमी या गुणवत्ता तय मानकों से अधिक है।'}`
      },
      PAYMENT_PROCESSED: {
        en: `Payment of ₹${updatedToken.totalPayout} successfully credited via DBT. Transaction ref: PFMS-${Math.floor(100000 + Math.random * 900000)}.`,
        hi: `₹${updatedToken.totalPayout} का भुगतान DBT द्वारा आपके खाते में भेज दिया गया है। संदर्भ: PFMS-${Math.floor(100000 + Math.random * 900000)}।`
      }
    };

    const notifContent = stageNotifs[stage] || {
      en: `Token status updated to ${stage}.`,
      hi: `टोकन स्थिति अपडेट हुई: ${stage}।`
    };

    await prisma.notification.create({
      data: {
        userId: token.farmerId,
        tokenNumber: token.tokenNumber,
        title: `Procurement Status: ${stage.replace('_', ' ')}`,
        titleHi: `प्रोक्योरमेंट स्थिति: ${stage.replace('_', ' ')}`,
        message: notifContent.en,
        messageHi: notifContent.hi,
        type: stage === 'PAYMENT_PROCESSED' ? 'PAYMENT' : 'STATUS'
      }
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        operatorId: operator.id,
        operatorName: operator.fullName,
        action: `STAGE_TRANSITION_${stage}`,
        reason: remarks || `Advanced to ${stage}`,
        affectedTokenNumber: token.tokenNumber,
        farmerName: token.farmer.fullName,
        details: `Grade: ${qualityGrade || 'N/A'}, Moisture: ${moisturePercent || 'N/A'}%, Weight: ${netWeightQuintal || token.estimatedQuantity} Qtl`
      }
    });

    // Broadcast via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('token:status_changed', {
        token: updatedToken,
        stage,
        farmerId: token.farmerId
      });
      io.emit('queue:update', {
        type: 'STAGE_UPDATED',
        tokenNumber: token.tokenNumber
      });
    }

    res.json({
      message: `Token stage updated to ${stage}`,
      token: updatedToken
    });
  } catch (error) {
    console.error('Error updating stage:', error);
    res.status(500).json({ message: 'Failed to update token stage.' });
  }
};

const moveToPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const operator = req.user;

    if (!reason || reason.trim.length < 5) {
      return res.status(400).json({ message: 'Mandatory justification reason required for audit compliance.' });
    }

    const token = await prisma.token.findUnique({
      where: { id },
      include: { farmer: true, centre: true }
    });

    if (!token) {
      return res.status(404).json({ message: 'Token not found.' });
    }

    const updatedToken = await prisma.token.update({
      where: { id },
      data: {
        isPriority: true,
        priorityReason: reason,
        queuePosition: 1,
        estimatedWaitMinutes: 5,
        remarks: `Priority elevated: ${reason}`
      },
      include: { farmer: true, centre: true }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        operatorId: operator.id,
        operatorName: operator.fullName,
        action: 'PRIORITY_OVERRIDE',
        reason: reason,
        affectedTokenNumber: token.tokenNumber,
        farmerName: token.farmer.fullName,
        details: `Farmer bumped to Top #1 position. Justification: ${reason}`
      }
    });

    // Farmer Notification
    await prisma.notification.create({
      data: {
        userId: token.farmerId,
        tokenNumber: token.tokenNumber,
        title: 'Priority Queue Elevation',
        titleHi: 'प्राथमिकता कतार में अग्रिम स्थान',
        message: `Your token ${token.tokenNumber} has been given priority entry. Reason: ${reason}. Please proceed to counter.`,
        messageHi: `आपके टोकन ${token.tokenNumber} को प्राथमिकता दी गई है। कारण: ${reason}। कृपया काउंटर पर संपर्क करें।`,
        type: 'TOKEN'
      }
    });

    // Real-time broadcast
    const io = req.app.get('io');
    if (io) {
      io.emit('queue:update', {
        type: 'PRIORITY_OVERRIDE',
        tokenNumber: token.tokenNumber,
        farmerId: token.farmerId
      });
    }

    res.json({
      message: 'Token elevated to priority queue successfully',
      token: updatedToken
    });
  } catch (error) {
    console.error('Priority override error:', error);
    res.status(500).json({ message: 'Error elevating token priority.' });
  }
};

const bulkBroadcast = async (req, res) => {
  try {
    const { title, titleHi, message, messageHi, targetCrop, targetState, targetCentreId } = req.body;
    const operator = req.user;

    if (!title || !message) {
      return res.status(400).json({ message: 'Broadcast title and message are required.' });
    }

    // Find recipient users
    const where = { role: 'FARMER' };
    if (targetState) where.state = targetState;

    const farmers = await prisma.user.findMany({
      where,
      select: { id: true, mobile: true, fullName: true }
    });

    // Create notifications in batch
    const notifPromises = farmers.map(f =>
      prisma.notification.create({
        data: {
          userId: f.id,
          title: title,
          titleHi: titleHi || title,
          message: message,
          messageHi: messageHi || message,
          type: 'BROADCAST'
        }
      })
    );
    await Promise.all(notifPromises);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        operatorId: operator.id,
        operatorName: operator.fullName,
        action: 'BULK_MANDI_BROADCAST',
        reason: `Target: ${targetState || 'All States'}, Crop: ${targetCrop || 'All'}`,
        details: `Broadcasted to ${farmers.length} registered farmers. Message: "${title}"`
      }
    });

    // Emit Socket.IO event to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('broadcast:alert', {
        title,
        titleHi: titleHi || title,
        message,
        messageHi: messageHi || message,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      message: `Broadcast successfully sent to ${farmers.length} farmers.`,
      recipientCount: farmers.length
    });
  } catch (error) {
    console.error('Bulk broadcast error:', error);
    res.status(500).json({ message: 'Error sending broadcast.' });
  }
};

const getMandiMetrics = async (req, res) => {
  try {
    const { centreId } = req.query;
    const where = {};
    if (centreId) where.centreId = centreId;

    const totalTokensToday = await prisma.token.count({ where });
    const inQueue = await prisma.token.count({
      where: {
        ...where,
        stage: { in: ['GENERATED', 'DOCS_VERIFIED', 'PRODUCE_RECEIVED', 'QUALITY_CHECKED'] }
      }
    });
    const completed = await prisma.token.count({
      where: {
        ...where,
        stage: { in: ['ACCEPTED', 'PAYMENT_PROCESSED'] }
      }
    });
    const rejected = await prisma.token.count({
      where: {
        ...where,
        stage: 'REJECTED'
      }
    });

    // Calculate approximate average waiting time (mins)
    const tokensWithWait = await prisma.token.findMany({
      where,
      select: { estimatedWaitMinutes: true },
      take: 50
    });
    const avgWait = tokensWithWait.length > 0
      ? Math.round(tokensWithWait.reduce((acc, t) => acc + t.estimatedWaitMinutes, 0) / tokensWithWait.length)
      : 25;

    res.json({
      metrics: {
        totalTokensToday,
        inQueue,
        completed,
        rejected,
        avgWaitMinutes: avgWait,
        activeWeighbridges: 4,
        operationalEfficiency: '94.2%'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating mandi metrics.' });
  }
};

module.exports = {
  getQueueForAdmin,
  updateTokenStage,
  moveToPriority,
  bulkBroadcast,
  getMandiMetrics
};
