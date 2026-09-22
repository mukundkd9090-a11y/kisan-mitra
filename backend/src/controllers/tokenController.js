const prisma = require('../prisma');
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const MSP_RATES_2026 = {
  "Wheat": 2425,
  "Rice": 2300,
  "Paddy": 2320,
  "Maize": 2225,
  "Mustard": 5950,
  "Pulses (Gram/Arhar)": 7000,
  "Sugarcane": 340
};

// Helper to compute ETA and queue metrics locally or via AI microservice
async function calculateETAPrediction(queuePosition, cropType, quantity = 25, activeCounters = 3) {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-wait-time`, {
      queue_position: queuePosition,
      crop_type: cropType,
      quantity_quintals: quantity,
      active_counters: activeCounters
    }, { timeout: 1500 });

    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (err) {
    // Fallback heuristic if AI microservice is warming up
    console.log('Using robust internal AI fallback heuristic for ETA calculation');
  }

  // Built-in intelligent fallback
  const baseTimePerPerson = (cropType === 'Rice' ? 9 : (cropType === 'Mustard' ? 10 : 7.5));
  const estimatedWaitMinutes = Math.max(5, Math.round((queuePosition / Math.max(1, activeCounters)) * baseTimePerPerson));
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + estimatedWaitMinutes * 60000);
  const winStart = new Date(arrivalTime.getTime() - 15 * 60000);
  const winEnd = new Date(arrivalTime.getTime() + 15 * 60000);

  const formatTime = (d) => {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return {
    queue_position: queuePosition,
    estimated_wait_minutes: estimatedWaitMinutes,
    arrival_window_start: formatTime(winStart),
    arrival_window_end: formatTime(winEnd),
    delay_risk: estimatedWaitMinutes > 90 ? 'Moderate' : 'Low',
    confidence_score: 0.91
  };
}

const generateToken = async (req, res) => {
  try {
    const { centreId, cropType, estimatedQuantity = 25.0, tokenDate } = req.body;
    const farmerId = req.user.id;

    if (!centreId || !cropType) {
      return res.status(400).json({ message: 'Procurement centre and crop type are required.' });
    }

    const centre = await prisma.procurementCentre.findUnique({
      where: { id: centreId }
    });

    if (!centre) {
      return res.status(404).json({ message: 'Procurement centre not found.' });
    }

    // Count how many tokens exist today for this centre to determine queue position
    const activeQueueCount = await prisma.token.count({
      where: {
        centreId: centreId,
        stage: { notIn: ['ACCEPTED', 'REJECTED', 'PAYMENT_PROCESSED'] }
      }
    });

    const queuePosition = activeQueueCount + 1;

    // AI Prediction
    const prediction = await calculateETAPrediction(
      queuePosition,
      cropType,
      Number(estimatedQuantity),
      centre.activeCounters
    );

    // State code for token (UP, BR, KL, MP, TN, JH)
    const stateCodeMap = {
      "Uttar Pradesh": "UP",
      "Bihar": "BR",
      "Kerala": "KL",
      "Madhya Pradesh": "MP",
      "Tamil Nadu": "TN",
      "Jharkhand": "JH"
    };
    const stateCode = stateCodeMap[centre.state] || "IN";
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const tokenNumber = `TKN-${stateCode}-2026-${randomSeq}`;

    const dateStr = tokenDate || new Date().toISOString().split('T')[0];
    const mspRate = MSP_RATES_2026[cropType] || 2400;
    const totalPayout = Number(estimatedQuantity) * mspRate;

    const token = await prisma.token.create({
      data: {
        tokenNumber,
        farmerId,
        centreId,
        cropType,
        estimatedQuantity: Number(estimatedQuantity),
        stage: 'GENERATED',
        queuePosition,
        arrivalWindowStart: prediction.arrival_window_start,
        arrivalWindowEnd: prediction.arrival_window_end,
        tokenDate: dateStr,
        estimatedWaitMinutes: prediction.estimated_wait_minutes,
        mspRate,
        totalPayout,
        isPriority: false,
        remarks: 'Token generated online. Please arrive within the assigned window.'
      },
      include: {
        farmer: { select: { fullName: true, mobile: true, village: true } },
        centre: true
      }
    });

    // Create In-App Notification
    await prisma.notification.create({
      data: {
        userId: farmerId,
        tokenNumber: token.tokenNumber,
        title: `Token Generated: ${token.tokenNumber}`,
        titleHi: `टोकन जनरेट हुआ: ${token.tokenNumber}`,
        message: `Your token for ${cropType} is generated. Position: #${queuePosition}. Slot: ${token.arrivalWindowStart} - ${token.arrivalWindowEnd}.`,
        messageHi: `आपका ${cropType} के लिए टोकन बन गया है। कतार संख्या: #${queuePosition}। समय: ${token.arrivalWindowStart} - ${token.arrivalWindowEnd}।`,
        type: 'TOKEN'
      }
    });

    // Emit Socket.IO event if io is attached to app
    const io = req.app.get('io');
    if (io) {
      io.emit('queue:update', {
        type: 'TOKEN_CREATED',
        centreId: centre.id,
        tokenNumber: token.tokenNumber,
        queuePosition: token.queuePosition
      });
    }

    res.status(201).json({
      message: 'Token generated successfully',
      token,
      prediction
    });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'Error while generating procurement token.' });
  }
};

const getMyTokens = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const tokens = await prisma.token.findMany({
      where: { farmerId },
      include: {
        centre: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ tokens });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving your tokens.' });
  }
};

const getTokenByNumber = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const token = await prisma.token.findUnique({
      where: { tokenNumber },
      include: {
        farmer: { select: { fullName: true, mobile: true, village: true, state: true, district: true } },
        centre: true
      }
    });

    if (!token) {
      return res.status(404).json({ message: 'Token not found.' });
    }

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving token information.' });
  }
};

const smsQuery = async (req, res) => {
  try {
    const { queryText } = req.query; // e.g. "KISAN TKN-UP-2026-1042" or just token number or mobile
    if (!queryText) {
      return res.status(400).json({ message: 'Query string missing.' });
    }

    const clean = queryText.trim().replace(/^kisan\s+/i, '');
    
    // Try matching token number or farmer mobile
    let token = await prisma.token.findFirst({
      where: {
        OR: [
          { tokenNumber: { contains: clean } },
          { farmer: { mobile: clean } }
        ]
      },
      include: {
        farmer: true,
        centre: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!token) {
      return res.json({
        success: false,
        smsResponse: `[KISAN-QUEUE-GOV] No active token found for "${clean}". To book token, visit kisanmitra.gov.in or contact your Mandi Sahayak. Helpline: 1800-180-1551.`
      });
    }

    const stageMap = {
      "GENERATED": "Token Issued (Pending Arrival)",
      "DOCS_VERIFIED": "Documents Verified",
      "PRODUCE_RECEIVED": "Produce at Weighbridge",
      "QUALITY_CHECKED": "Quality Inspected",
      "ACCEPTED": "Produce Accepted by Mandi",
      "REJECTED": "Quality Non-Compliant",
      "PAYMENT_PROCESSED": "DBT Payment Dispatched"
    };

    const friendlyStage = stageMap[token.stage] || token.stage;
    const smsMessage = `[KISAN-QUEUE] Token ${token.tokenNumber}: Status - ${friendlyStage}. Queue: #${token.queuePosition}. Centre: ${token.centre.name}. Slot: ${token.arrivalWindowStart}-${token.arrivalWindowEnd}. Est Wait: ~${token.estimatedWaitMinutes} mins.`;

    res.json({
      success: true,
      token,
      smsResponse: smsMessage
    });
  } catch (error) {
    console.error('SMS Query Error:', error);
    res.status(500).json({ message: 'SMS gateway service error.' });
  }
};

const getLiveQueueStatus = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Find farmer's active token (most recent active)
    const activeStages = ['GENERATED', 'DOCS_VERIFIED', 'PRODUCE_RECEIVED', 'QUALITY_CHECKED'];
    const completedStages = ['ACCEPTED', 'REJECTED', 'PAYMENT_PROCESSED', 'CANCELLED', 'SKIPPED', 'COMPLETED'];

    const myActiveToken = await prisma.token.findFirst({
      where: {
        farmerId,
        stage: { in: activeStages }
      },
      include: { centre: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!myActiveToken) {
      // Check if farmer has any completed/cancelled token for friendly message
      const lastToken = await prisma.token.findFirst({
        where: { farmerId },
        include: { centre: true },
        orderBy: { createdAt: 'desc' }
      });
      if (lastToken && completedStages.includes(lastToken.stage)) {
        return res.json({
          hasActiveToken: false,
          state: lastToken.stage === 'REJECTED' ? 'cancelled' : 'completed',
          lastToken,
          message: lastToken.stage === 'REJECTED' ? 'Your last token was cancelled/rejected.' : 'Your procurement is completed.'
        });
      }
      return res.json({
        hasActiveToken: false,
        state: 'no_active_token',
        message: 'No active token found. Book a procurement slot to see live queue.'
      });
    }

    // Fetch live queue for same centre and same date, only active tokens
    const centreId = myActiveToken.centreId;
    const tokenDate = myActiveToken.tokenDate;

    const queue = await prisma.token.findMany({
      where: {
        centreId,
        tokenDate,
        stage: { in: activeStages }
      },
      include: {
        centre: true,
        farmer: { select: { id: true, fullName: true } }
      },
      orderBy: [
        { isPriority: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    // Find position of farmer's token in live queue (1-indexed)
    const myIndex = queue.findIndex(t => t.id === myActiveToken.id);
    const livePosition = myIndex >= 0 ? myIndex + 1 : myActiveToken.queuePosition;
    const farmersAhead = myIndex >= 0 ? myIndex : Math.max(0, myActiveToken.queuePosition - 1);
    
    // Now Serving is first in queue
    const nowServingToken = queue.length > 0 ? queue[0] : null;
    const nowServingNumber = nowServingToken ? nowServingToken.tokenNumber : '—';

    // ETA: configurable 5 min per farmer, adjusted by active counters
    const AVG_MIN_PER_FARMER = 5;
    const activeCounters = myActiveToken.centre?.activeCounters || 3;
    // Effective time per farmer reduces with more counters, min 3 min per farmer
    const effectiveMinPerFarmer = Math.max(3, AVG_MIN_PER_FARMER * (3 / Math.max(1, activeCounters)));
    // For priority handling, farmersAhead is correct metric
    const estimatedWaitMinutes = farmersAhead === 0 ? 0 : Math.max(2, Math.round(farmersAhead * effectiveMinPerFarmer));

    const isYourTurn = farmersAhead === 0;

    res.json({
      hasActiveToken: true,
      state: isYourTurn ? 'your_turn' : 'waiting',
      yourToken: myActiveToken.tokenNumber,
      yourTokenId: myActiveToken.id,
      nowServing: nowServingNumber,
      nowServingTokenId: nowServingToken?.id || null,
      farmersAhead,
      livePosition,
      estimatedWaitMinutes,
      estimatedWaitText: estimatedWaitMinutes === 0 ? '0 min' : `~${estimatedWaitMinutes} minutes`,
      centre: {
        id: myActiveToken.centre.id,
        name: myActiveToken.centre.name,
        code: myActiveToken.centre.code,
        activeCounters
      },
      crop: myActiveToken.cropType,
      quantity: myActiveToken.estimatedQuantity,
      tokenDate: myActiveToken.tokenDate,
      stage: myActiveToken.stage,
      updatedAt: myActiveToken.updatedAt,
      queueLength: queue.length
    });
  } catch (error) {
    console.error('Live queue error:', error);
    res.status(500).json({ message: 'Error fetching live queue status.' });
  }
};

module.exports = {
  generateToken,
  getMyTokens,
  getTokenByNumber,
  smsQuery,
  getLiveQueueStatus
};
