const prisma = require('../prisma');

const getAuditLogs = async (req, res) => {
  try {
    const { action, search, limit = 100 } = req.query;

    const where = {};
    if (action) where.action = action;
    if (search) {
      where.OR = [
        { operatorName: { contains: search } },
        { affectedTokenNumber: { contains: search } },
        { farmerName: { contains: search } },
        { reason: { contains: search } }
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: Number(limit)
    });

    res.json({ logs });
  } catch (error) {
    console.error('Audit log fetch error:', error);
    res.status(500).json({ message: 'Error retrieving audit logs.' });
  }
};

module.exports = {
  getAuditLogs
};
