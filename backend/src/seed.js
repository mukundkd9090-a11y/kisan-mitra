const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

async function main() {
  console.log('🌱 Starting KisanMitra Database Seeding...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany();
await prisma.notification.deleteMany();
await prisma.token.deleteMany();
await prisma.procurementCentre.deleteMany();
await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('kisan123', 10);

  // 2. Create Mandi Admin Users
  const adminLucknow = await prisma.user.create({
    data: {
      fullName: 'Vijay Sharma (Mandi Officer)',
      mobile: '9876543210',
      email: 'admin.lucknow@kisanmitra.gov.in',
      password: passwordHash,
      role: 'ADMIN',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      village: 'Mohan Road Sector'
    }
  });

  const adminPatna = await prisma.user.create({
    data: {
      fullName: 'Amit Sinha (Mandi Incharge)',
      mobile: '9876543211',
      email: 'admin.patna@kisanmitra.gov.in',
      password: passwordHash,
      role: 'ADMIN',
      state: 'Bihar',
      district: 'Patna',
      village: 'Mithapur Mandi'
    }
  });

  // 3. Create Demo Farmers across states
  const farmerUP = await prisma.user.create({
    data: {
      fullName: 'Ramesh Kumar',
      mobile: '9811223344',
      email: 'ramesh.farmer@gmail.com',
      password: passwordHash,
      role: 'FARMER',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      village: 'Malihabad'
    }
  });

  const farmerBihar = await prisma.user.create({
    data: {
      fullName: 'Sunita Devi',
      mobile: '9822334455',
      email: 'sunita.devi@gmail.com',
      password: passwordHash,
      role: 'FARMER',
      state: 'Bihar',
      district: 'Patna',
      village: 'Phulwari Sharif'
    }
  });

  const farmerMP = await prisma.user.create({
    data: {
      fullName: 'Rajesh Patel',
      mobile: '9833445566',
      email: 'rajesh.patel@gmail.com',
      password: passwordHash,
      role: 'FARMER',
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      village: 'Berasia'
    }
  });

  const farmerTN = await prisma.user.create({
    data: {
      fullName: 'Murugan Selvam',
      mobile: '9844556677',
      email: 'murugan.s@gmail.com',
      password: passwordHash,
      role: 'FARMER',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      village: 'Papanasam'
    }
  });

  const farmerKerala = await prisma.user.create({
    data: {
      fullName: 'Anoop Nair',
      mobile: '9855667788',
      email: 'anoop.nair@gmail.com',
      password: passwordHash,
      role: 'FARMER',
      state: 'Kerala',
      district: 'Palakkad',
      village: 'Chittur'
    }
  });

  const farmerJharkhand = await prisma.user.create({
    data: {
      fullName: 'Birsa Munda',
      mobile: '9866778899',
      email: 'birsa.munda@gmail.com',
      password: passwordHash,
      role: 'FARMER',
      state: 'Jharkhand',
      district: 'Ranchi',
      village: 'Nagri'
    }
  });

  // 4. Create Procurement Centres in 6 States
  const centresData = [
    {
      name: 'Mohan Road Krishi Mandi Centre',
      code: 'UP-LKO-01',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      address: 'Mohan Road, Near Kisan Path, Lucknow, UP - 226017',
      capacityPerDay: 200,
      activeCounters: 4,
      contactNumber: '0522-2987654'
    },
    {
      name: 'Naubasta Naveen Mandi Sthal',
      code: 'UP-KNP-01',
      state: 'Uttar Pradesh',
      district: 'Kanpur',
      address: 'Naubasta Bypass Road, Kanpur, UP - 208021',
      capacityPerDay: 180,
      activeCounters: 3,
      contactNumber: '0512-2876543'
    },
    {
      name: 'Mithapur Krishi Utpadan Samiti',
      code: 'BR-PAT-01',
      state: 'Bihar',
      district: 'Patna',
      address: 'Mithapur Farm Area, Patna, Bihar - 800001',
      capacityPerDay: 160,
      activeCounters: 3,
      contactNumber: '0612-2554321'
    },
    {
      name: 'Chakand Anaj Mandi',
      code: 'BR-GAY-01',
      state: 'Bihar',
      district: 'Gaya',
      address: 'Chakand Main Road, Gaya, Bihar - 823004',
      capacityPerDay: 120,
      activeCounters: 2,
      contactNumber: '0631-2443322'
    },
    {
      name: 'Karond Krishi Upaj Mandi',
      code: 'MP-BPL-01',
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      address: 'Karond Chauraha, Berasia Road, Bhopal, MP - 462038',
      capacityPerDay: 250,
      activeCounters: 5,
      contactNumber: '0755-2741122'
    },
    {
      name: 'Laxmi Bai Nagar Mandi',
      code: 'MP-IND-01',
      state: 'Madhya Pradesh',
      district: 'Indore',
      address: 'Sanwer Road Industrial Area, Indore, MP - 452015',
      capacityPerDay: 220,
      activeCounters: 4,
      contactNumber: '0731-2559988'
    },
    {
      name: 'Palakkad Paddy Procurement Depot',
      code: 'KL-PLK-01',
      state: 'Kerala',
      district: 'Palakkad',
      address: 'Civil Station Road, Palakkad, Kerala - 678001',
      capacityPerDay: 140,
      activeCounters: 3,
      contactNumber: '0491-2521144'
    },
    {
      name: 'Thiruvananthapuram Central Depot',
      code: 'KL-TVM-01',
      state: 'Kerala',
      district: 'Thiruvananthapuram',
      address: 'Chalai Market Yard, Thiruvananthapuram, Kerala - 695036',
      capacityPerDay: 110,
      activeCounters: 2,
      contactNumber: '0471-2475566'
    },
    {
      name: 'Thanjavur Direct Purchase Centre (DPC)',
      code: 'TN-TNJ-01',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      address: 'Delta Agri Complex, Thanjavur, Tamil Nadu - 613001',
      capacityPerDay: 190,
      activeCounters: 4,
      contactNumber: '04362-277889'
    },
    {
      name: 'Koyambedu Wholesale Grain Yard',
      code: 'TN-CHN-01',
      state: 'Tamil Nadu',
      district: 'Chennai',
      address: 'Market Yard Gate 4, Koyambedu, Chennai, TN - 600107',
      capacityPerDay: 150,
      activeCounters: 3,
      contactNumber: '044-24798800'
    },
    {
      name: 'Pandra Bazaar Samiti Yard',
      code: 'JH-RNC-01',
      state: 'Jharkhand',
      district: 'Ranchi',
      address: 'Pandra Market Yard, Ratu Road, Ranchi, JH - 834005',
      capacityPerDay: 130,
      activeCounters: 3,
      contactNumber: '0651-2281144'
    },
    {
      name: 'Jamshedpur Grain Market Depot',
      code: 'JH-JSR-01',
      state: 'Jharkhand',
      district: 'Jamshedpur',
      address: 'Krishi Sthal, Sakchi, Jamshedpur, JH - 831001',
      capacityPerDay: 100,
      activeCounters: 2,
      contactNumber: '0657-2435566'
    }
  ];

  const createdCentres = [];
  for (const c of centresData) {
    const centre = await prisma.procurementCentre.create({ data: c });
    createdCentres.push(centre);
  }

  const lkoCentre = createdCentres[0];
  const patnaCentre = createdCentres[2];
  const bhopalCentre = createdCentres[4];

  // 5. Seed Active Tokens with various stages for testing
  const tokensToCreate = [
    {
      tokenNumber: 'TKN-UP-2026-00142',
      farmerId: farmerUP.id,
      centreId: lkoCentre.id,
      cropType: 'Wheat',
      estimatedQuantity: 35.0,
      stage: 'QUALITY_CHECKED',
      queuePosition: 3,
      arrivalWindowStart: '01:30 PM',
      arrivalWindowEnd: '02:00 PM',
      tokenDate: '2026-09-02',
      estimatedWaitMinutes: 24,
      qualityGrade: 'Grade A (FAQ)',
      moisturePercent: 11.2,
      netWeightQuintal: 35.5,
      mspRate: 2425,
      totalPayout: 86087.5,
      isPriority: false,
      remarks: 'Moisture compliant (11.2%). Recommended for prompt acceptance.'
    },
    {
      tokenNumber: 'TKN-UP-2026-00143',
      farmerId: farmerUP.id,
      centreId: lkoCentre.id,
      cropType: 'Mustard',
      estimatedQuantity: 20.0,
      stage: 'PAYMENT_PROCESSED',
      queuePosition: 1,
      arrivalWindowStart: '09:00 AM',
      arrivalWindowEnd: '09:30 AM',
      tokenDate: '2026-09-01',
      estimatedWaitMinutes: 0,
      qualityGrade: 'Superior',
      moisturePercent: 7.5,
      netWeightQuintal: 20.2,
      mspRate: 5950,
      totalPayout: 120190.0,
      isPriority: false,
      remarks: 'Payment settled via PFMS DBT. Ref: PFMS-883921.'
    },
    {
      tokenNumber: 'TKN-BR-2026-00108',
      farmerId: farmerBihar.id,
      centreId: patnaCentre.id,
      cropType: 'Paddy',
      estimatedQuantity: 40.0,
      stage: 'DOCS_VERIFIED',
      queuePosition: 6,
      arrivalWindowStart: '02:15 PM',
      arrivalWindowEnd: '02:45 PM',
      tokenDate: '2026-09-02',
      estimatedWaitMinutes: 48,
      qualityGrade: null,
      moisturePercent: null,
      netWeightQuintal: null,
      mspRate: 2320,
      totalPayout: 92800.0,
      isPriority: false,
      remarks: 'Aadhaar & Land Khasra verified. Directing to weighbridge scale #2.'
    },
    {
      tokenNumber: 'TKN-MP-2026-00215',
      farmerId: farmerMP.id,
      centreId: bhopalCentre.id,
      cropType: 'Wheat',
      estimatedQuantity: 50.0,
      stage: 'GENERATED',
      queuePosition: 12,
      arrivalWindowStart: '03:00 PM',
      arrivalWindowEnd: '03:30 PM',
      tokenDate: '2026-09-02',
      estimatedWaitMinutes: 85,
      qualityGrade: null,
      moisturePercent: null,
      netWeightQuintal: null,
      mspRate: 2425,
      totalPayout: 121250.0,
      isPriority: false,
      remarks: 'Token generated online. Please arrive within the assigned window.'
    },
    {
      tokenNumber: 'TKN-UP-2026-00155',
      farmerId: farmerUP.id,
      centreId: lkoCentre.id,
      cropType: 'Wheat',
      estimatedQuantity: 28.0,
      stage: 'PRODUCE_RECEIVED',
      queuePosition: 2,
      arrivalWindowStart: '01:00 PM',
      arrivalWindowEnd: '01:30 PM',
      tokenDate: '2026-09-02',
      estimatedWaitMinutes: 12,
      qualityGrade: null,
      moisturePercent: 11.8,
      netWeightQuintal: 28.4,
      mspRate: 2425,
      totalPayout: 68870.0,
      isPriority: true,
      priorityReason: 'Elderly Farmer (>70 yrs) with minor vehicle leak',
      remarks: 'Priority clearance authorized by Mandi Officer.'
    }
  ];

  for (const t of tokensToCreate) {
    await prisma.token.create({ data: t });
  }

  // 6. Seed Sample Notifications
  const notifs = [
    {
      userId: farmerUP.id,
      tokenNumber: 'TKN-UP-2026-00142',
      title: 'Quality Check Completed',
      titleHi: 'गुणवत्ता परीक्षण पूर्ण हुआ',
      message: 'Your Wheat produce (Token TKN-UP-2026-00142) has passed Grade A FAQ with 11.2% moisture.',
      messageHi: 'आपकी गेहूं की फसल (टोकन TKN-UP-2026-00142) 11.2% नमी के साथ ग्रेड A में उत्तीर्ण हुई।',
      type: 'STATUS'
    },
    {
      userId: farmerUP.id,
      tokenNumber: 'TKN-UP-2026-00143',
      title: 'DBT Payment Dispatched',
      titleHi: 'DBT भुगतान भेजा गया',
      message: '₹1,20,190.00 has been credited to your bank account for Mustard token TKN-UP-2026-00143.',
      messageHi: 'सरसों टोकन TKN-UP-2026-00143 के लिए ₹1,20,190.00 आपके बैंक खाते में जमा कर दिए गए हैं।',
      type: 'PAYMENT'
    },
    {
      userId: farmerBihar.id,
      tokenNumber: 'TKN-BR-2026-00108',
      title: 'Documents Verified',
      titleHi: 'दस्तावेज़ सत्यापित हुए',
      message: 'Land and identity records verified. Queue Position #6. Please proceed to weighbridge.',
      messageHi: 'जमीन और पहचान के रिकॉर्ड सत्यापित। कतार स्थिति #6। कृपया वे-ब्रिज की ओर बढ़ें।',
      type: 'STATUS'
    }
  ];

  for (const n of notifs) {
    await prisma.notification.create({ data: n });
  }

  // 7. Seed Audit Logs
  const auditEntries = [
    {
      operatorId: adminLucknow.id,
      operatorName: 'Vijay Sharma (Mandi Officer)',
      action: 'PRIORITY_OVERRIDE',
      reason: 'Elderly Farmer (>70 yrs) with minor vehicle leak',
      affectedTokenNumber: 'TKN-UP-2026-00155',
      farmerName: 'Ramesh Kumar',
      details: 'Priority queue position granted. Audit log registered as per SOP.'
    },
    {
      operatorId: adminLucknow.id,
      operatorName: 'Vijay Sharma (Mandi Officer)',
      action: 'STAGE_TRANSITION_QUALITY_CHECKED',
      reason: 'Lab moisture test passed',
      affectedTokenNumber: 'TKN-UP-2026-00142',
      farmerName: 'Ramesh Kumar',
      details: 'Grade: Grade A (FAQ), Moisture: 11.2%, Net Weight: 35.5 Qtl'
    },
    {
      operatorId: adminPatna.id,
      operatorName: 'Amit Sinha (Mandi Incharge)',
      action: 'BULK_MANDI_BROADCAST',
      reason: 'Target: Bihar, Crop: Paddy',
      details: 'Broadcasted: "Weighbridge #2 operational for rapid intake."'
    }
  ];

  for (const a of auditEntries) {
    await prisma.auditLog.create({ data: a });
  }

  console.log('✅ KisanMitra Database Seeded Successfully!');
  console.log('--------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('1. Farmer Login:');
  console.log('   Mobile: 9811223344 (or Ramesh Kumar)');
  console.log('   Password: kisan123');
  console.log('2. Admin Login:');
  console.log('   Mobile: 9876543210 (or admin.lucknow@kisanmitra.gov.in)');
  console.log('   Password: kisan123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
