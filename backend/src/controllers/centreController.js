const prisma = require('../prisma');

const STATES_DATA = {
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Agra"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Begusarai"],
  "Kerala": ["Thiruvananthapuram", "Kozhikode", "Palakkad", "Thrissur", "Ernakulam", "Kottayam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Thanjavur", "Tiruchirappalli", "Salem"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh"]
};

const getStatesAndDistricts = (req, res) => {
  res.json({ states: STATES_DATA });
};

const getCentres = async (req, res) => {
  try {
    const { state, district } = req.query;
    const where = { isActive: true };
    if (state) where.state = state;
    if (district) where.district = district;

    const centres = await prisma.procurementCentre.findMany({
      where,
      include: {
        _count: {
          select: {
            tokens: {
              where: {
                stage: { notIn: ['ACCEPTED', 'REJECTED', 'PAYMENT_PROCESSED'] }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formatted = centres.map(c => ({
      id: c.id,
      name: c.name,
      code: c.code,
      state: c.state,
      district: c.district,
      address: c.address,
      capacityPerDay: c.capacityPerDay,
      activeCounters: c.activeCounters,
      contactNumber: c.contactNumber,
      activeQueueCount: c._count.tokens
    }));

    res.json({ centres: formatted });
  } catch (error) {
    console.error('Error fetching centres:', error);
    res.status(500).json({ message: 'Error retrieving procurement centres.' });
  }
};

const getCentreById = async (req, res) => {
  try {
    const { id } = req.params;
    const centre = await prisma.procurementCentre.findUnique({
      where: { id },
      include: {
        tokens: {
          where: { stage: { notIn: ['ACCEPTED', 'REJECTED', 'PAYMENT_PROCESSED'] } },
          orderBy: [{ isPriority: 'desc' }, { createdAt: 'asc' }],
          include: { farmer: { select: { fullName: true, mobile: true, village: true } } }
        }
      }
    });

    if (!centre) {
      return res.status(404).json({ message: 'Procurement centre not found.' });
    }

    res.json({ centre });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving centre details.' });
  }
};

module.exports = {
  getStatesAndDistricts,
  getCentres,
  getCentreById
};
