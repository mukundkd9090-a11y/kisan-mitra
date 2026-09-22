const prisma = require('../prisma');

const MSP_DATA = {
  Wheat: { msp: 2425, unit: 'per quintal', season: 'Rabi 2026', maxMoisture: '12%' },
  Rice: { msp: 2300, unit: 'per quintal', season: 'Kharif 2026', maxMoisture: '14%' },
  Paddy: { msp: 2320, unit: 'per quintal', season: 'Kharif 2026', maxMoisture: '14%' },
  Mustard: { msp: 5950, unit: 'per quintal', season: 'Rabi 2026', maxMoisture: '8%' },
  Maize: { msp: 2225, unit: 'per quintal', season: 'Kharif 2026', maxMoisture: '12%' },
  Pulses: { msp: 7000, unit: 'per quintal', season: 'Rabi/Kharif 2026', maxMoisture: '10%' },
  Sugarcane: { msp: 340, unit: 'per quintal (FRP)', season: '2026', maxMoisture: 'Standard' }
};

const handleAgyaChat = async (req, res) => {
  try {
    const { message, language = 'en', tokenNumber, userId } = req.body;

    if (!message || message.trim === '') {
      return res.status(400).json({ message: 'Message cannot be empty.' });
    }

    const text = message.toLowerCase;
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(message);

    // 1. Check if asking about a Token / Queue status
    const tokenMatch = message.match(/TKN-[A-Z]{2}-2026-\d{4,5}/i) || (tokenNumber ? [tokenNumber] : null);
    
    if (text.includes('token') || text.includes('status') || text.includes('queue') || text.includes('स्थिति') || text.includes('टोकन') || text.includes('कतार') || text.includes('नंबर') || tokenMatch) {
      let token = null;
      if (tokenMatch) {
        token = await prisma.token.findUnique({
          where: { tokenNumber: tokenMatch[0].toUpperCase },
          include: { centre: true, farmer: true }
        });
      } else if (userId || (req.user && req.user.id)) {
        const uId = userId || req.user.id;
        token = await prisma.token.findFirst({
          where: { farmerId: uId },
          include: { centre: true, farmer: true },
          orderBy: { createdAt: 'desc' }
        });
      }

      if (token) {
        const stageTranslations = {
          GENERATED: { en: 'Token Generated (Pending Arrival)', hi: 'टोकन जनरेट (पहुंचना बाकी)' },
          DOCS_VERIFIED: { en: 'Documents Verified', hi: 'दस्तावेज़ सत्यापित' },
          PRODUCE_RECEIVED: { en: 'Produce at Weighbridge', hi: 'फसल वे-ब्रिज पर' },
          QUALITY_CHECKED: { en: 'Quality Checked', hi: 'गुणवत्ता जांची गई' },
          ACCEPTED: { en: 'Produce Accepted', hi: 'फसल स्वीकृत' },
          REJECTED: { en: 'Produce Rejected', hi: 'फसल अस्वीकृत' },
          PAYMENT_PROCESSED: { en: 'Payment Disbursed via DBT', hi: 'DBT भुगतान पूरा' }
        };

        const stageText = stageTranslations[token.stage] || { en: token.stage, hi: token.stage };

        if (isHindi) {
          return res.json({
            reply: `नमस्ते किसान भाई! आपके टोकन **${token.tokenNumber}** की वर्तमान स्थिति **"${stageText.hi}"** है।\n\n- 📍 **प्रोक्योरमेंट सेंटर:** ${token.centre.name}\n- 🔢 **कतार स्थिति:** आप कतार में #${token.queuePosition} स्थान पर हैं।\n- ⏰ **अनुमानित स्लॉट:** ${token.arrivalWindowStart} से ${token.arrivalWindowEnd}\n- ⏳ **अनुमानित प्रतीक्षा समय:** लगभग ${token.estimatedWaitMinutes} मिनट\n- 🌾 **फसल:** ${token.cropType} (${token.estimatedQuantity} क्विंटल)`,
            suggestions: ["दस्तावेज़ क्या चाहिए?", "गेहूं का MSP रेट", "नजदीकी मंडी कहां है?"]
          });
        } else {
          return res.json({
            reply: `Namaste! Here is the live status for Token **${token.tokenNumber}**:\n\n- 📌 **Current Stage:** ${stageText.en}\n- 📍 **Procurement Centre:** ${token.centre.name}\n- 🔢 **Live Queue Position:** #${token.queuePosition}\n- ⏰ **Arrival Window:** ${token.arrivalWindowStart} – ${token.arrivalWindowEnd}\n- ⏳ **Estimated Waiting Time:** ~${token.estimatedWaitMinutes} mins\n- 🌾 **Crop:** ${token.cropType} (${token.estimatedQuantity} Quintals)`,
            suggestions: ["Required Documents", "Wheat MSP Rate 2026", "Nearest Procurement Centres"]
          });
        }
      }
    }

    // 2. Documents required
    if (text.includes('document') || text.includes('docs') || text.includes('दस्तावेज') || text.includes('कागजात') || text.includes('कागज़')) {
      if (isHindi) {
        return res.json({
          reply: `📋 **प्रोक्योरमेंट सेंटर पर आवश्यक दस्तावेज़:**\n\n1. **आधार कार्ड** (Aadhaar Card)\n2. **बैंक पासबुक** (Aadhaar-linked Bank Account for DBT)\n3. **भूमि अभिलेख** (खसरा / खतौनी / Land Record)\n4. **किसान पंजीकरण प्रति / टोकन स्लिप** (Digital Token Pass)\n5. **फसल बुवाई स्व-घोषणा पत्र** (Crop Sowing Declaration)\n\n*सलाह: नमी 12% से कम रखें ताकि आपका लॉट प्रथम प्रयास में स्वीकार हो सके।*`,
          suggestions: ["टोकन स्टेटस देखें", "गेहूं MSP दर", "नमी की सीमा कितनी होनी चाहिए?"]
        });
      } else {
        return res.json({
          reply: `📋 **Mandatory Documents for Procurement:**\n\n1. **Aadhaar Card** (Original + Photocopy)\n2. **Aadhaar-Linked Bank Passbook** (Active for Direct Benefit Transfer - DBT)\n3. **Land Ownership Record** (Khasra / Khatauni / Revenue Slip)\n4. **KisanMitra Digital Token Slip** (Printed or SMS on Phone)\n5. **Farmer Registration Certificate** (Kisan ID / Samman Nidhi ID)\n\n💡 *Tip: Ensure crop moisture is below 12% for instant Grade-A acceptance.*`,
          suggestions: ["Check My Token Status", "Latest MSP Rates", "Where is nearest Mandi?"]
        });
      }
    }

    // 3. MSP Rates
    if (text.includes('msp') || text.includes('rate') || text.includes('price') || text.includes('दाम') || text.includes('दर') || text.includes('मूल्य') || text.includes('भाव')) {
      if (isHindi) {
        return res.json({
          reply: `🌾 **वर्ष 2026 के लिए सरकारी न्यूनतम समर्थन मूल्य (MSP):**\n\n- **गेहूं (Wheat):** ₹2,425 / क्विंटल (अधिकतम नमी: 12%)\n- **धान (Paddy/Rice):** ₹2,300 - ₹2,320 / क्विंटल\n- **सरसों (Mustard):** ₹5,950 / क्विंटल\n- **मक्का (Maize):** ₹2,225 / क्विंटल\n- **चना / दालें (Pulses):** ₹7,000 / क्विंटल\n- **गन्ना (Sugarcane):** ₹340 / क्विंटल (FRP)\n\n*भुगतान सीधे आपके बैंक खाते में 24 से 48 घंटे में DBT द्वारा प्रेषित किया जाता है।*`,
          suggestions: ["टोकन कैसे बनाएं?", "दस्तावेज़ की सूची", "प्रतीक्षा समय कैसे पता करें?"]
        });
      } else {
        return res.json({
          reply: `🌾 **Official Minimum Support Price (MSP) Rates (2026):**\n\n- **Wheat:** ₹2,425 / Quintal (Max moisture: 12%)\n- **Paddy / Rice:** ₹2,300 – ₹2,320 / Quintal\n- **Mustard:** ₹5,950 / Quintal (Max moisture: 8%)\n- **Maize:** ₹2,225 / Quintal\n- **Gram / Pulses:** ₹7,000 / Quintal\n- **Sugarcane:** ₹340 / Quintal (FRP)\n\n*Direct Benefit Transfer (DBT) is credited directly to your bank account within 24–48 hours of acceptance.*`,
          suggestions: ["Generate New Token", "Required Documents", "Check Token Status"]
        });
      }
    }

    // 4. Nearest Mandi / Centres / States
    if (text.includes('centre') || text.includes('center') || text.includes('mandi') || text.includes('मंडी') || text.includes('केंद्र') || text.includes('कहाँ') || text.includes('where')) {
      if (isHindi) {
        return res.json({
          reply: `📍 **KisanMitra समर्थित राज्य और प्रमुख प्रोक्योरमेंट सेंटर:**\n\n- **उत्तर प्रदेश:** लखनऊ (मोहान रोड मंडी), कानपुर (नौबस्ता मंडी), वाराणसी, मेरठ\n- **बिहार:** पटना (मीठापुर केंद्र), गया (चाकंद मंडी), मुजफ्फरपुर\n- **मध्य प्रदेश:** भोपाल (करौंद कृषि मंडी), इंदौर (लक्ष्मी बाई नगर मंडी), जबलपुर\n- **झारखंड:** रांची (पंडरा बाजार समिति), जमशेदपुर\n- **केरल:** तिरुवनंतपुरम, कोझिकोड, पलक्कड़\n- **तमिलनाडु:** चेन्नई (कोयम्बेडु), कोयंबटूर, तंजावुर\n\n*आप डैशबोर्ड से अपने जिले का निकटतम सेंटर चुनकर तुरंत टोकन ले सकते हैं।*`,
          suggestions: ["टोकन जनरेट करें", "दस्तावेज क्या लगेंगे?", "कतार स्थिति जांचें"]
        });
      } else {
        return res.json({
          reply: `📍 **KisanMitra Procurement Centres Network:**\n\n- **Uttar Pradesh:** Lucknow (Mohan Road Mandi), Kanpur (Naubasta), Varanasi, Meerut\n- **Bihar:** Patna (Mithapur), Gaya (Chakand), Muzaffarpur\n- **Madhya Pradesh:** Bhopal (Karond Mandi), Indore (Laxmi Bai Nagar), Jabalpur\n- **Jharkhand:** Ranchi (Pandra Bazaar), Jamshedpur\n- **Kerala:** Thiruvananthapuram, Kozhikode, Palakkad\n- **Tamil Nadu:** Chennai (Koyambedu), Coimbatore, Thanjavur\n\n*You can select your state & district in the Farmer Dashboard to book your preferred arrival slot.*`,
          suggestions: ["Book Token Now", "Check Live Queue", "MSP Rates 2026"]
        });
      }
    }

    // 5. General Greeting or Fallback
    if (isHindi) {
      return res.json({
        reply: `नमस्ते किसान भाई! मैं **आज्ञा (Agya)**, आपकी डिजिटल मंडी सहायक। 😊\n\nमैं आपकी क्या सहायता कर सकती हूँ?\n- टोकन की लाइव स्थिति और कतार समय\n- सरकारी MSP मूल्य 2026\n- आवश्यक दस्तावेज़\n- नजदीकी प्रोक्योरमेंट केंद्र और मौसम सलाह`,
        suggestions: ["मेरा टोकन स्टेटस बताओ", "गेहूं का MSP क्या है?", "आवश्यक दस्तावेज़", "निकटतम मंडी"]
      });
    } else {
      return res.json({
        reply: `Namaste! I am **Agya**, your AI Procurement Assistant for KisanMitra. 😊\n\nI can help you with:\n- Real-time Token & Queue wait time tracking\n- 2026 MSP support prices and moisture norms\n- Required documentation for Mandi entry\n- Selecting nearest procurement centre & arrival slots`,
        suggestions: ["What is my token status?", "Wheat MSP Rate 2026", "Which documents are required?", "Find Nearest Mandi"]
      });
    }
  } catch (error) {
    console.error('Agya chat error:', error);
    res.status(500).json({ message: 'Agya service encountered an error.' });
  }
};

module.exports = {
  handleAgyaChat
};
