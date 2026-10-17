export const RECOMMENDATION_TEMPLATES: Record<string, Record<string, string>> = {
  OTP_REQUEST: {
    en: 'Never share an OTP, PIN, or authentication code with someone who contacted you unexpectedly.',
    hi: 'किसी भी अप्रत्याशित संपर्क पर अपना ओटीपी (OTP), पिन या पासवर्ड साझा न करें।',
    hinglish: 'Kripya apna OTP, PIN ya authentication code kisi ke saath bhi share na karein.',
  },
  FINANCIAL_REQUEST: {
    en: 'Do not transfer money based only on this message.',
    hi: 'केवल इस संदेश के आधार पर कोई धन हस्तांतरण या भुगतान न करें।',
    hinglish: 'Sirf is message ke aadhar par kisi ko bhi paise transfer na karein.',
  },
  EXTERNAL_ACTION: {
    en: 'Do not click the link. Open the official app or website independently.',
    hi: 'संदेश में दिए लिंक पर क्लिक न करें। आधिकारिक ऐप या वेबसाइट को अलग से खोलें।',
    hinglish: 'Is link par click na karein. Official app ya website ko browser me alag se kholein.',
  },
  AUTHORITY_IMPERSONATION: {
    en: 'Verify the request through an official channel.',
    hi: 'किसी भी आधिकारिक चैनल या अधिकृत कस्टमर केयर के माध्यम से अनुरोध की पुष्टि करें।',
    hinglish: 'Request ko kisi official customer care ya authorized branch ke through verify karein.',
  },
  THREAT: {
    en: 'Do not make a payment simply because the message threatens account suspension or legal action.',
    hi: 'खाता बंद करने या कानूनी कार्रवाई की धमकी से घबराकर कोई भुगतान या कदम न उठाएं।',
    hinglish: 'Account block ya legal action ki dhamki se dar kar koi payment ya step na lein.',
  },
  UNREALISTIC_REWARD: {
    en: 'Treat guaranteed high returns or surprise prizes with extreme skepticism. Legitimate opportunities carry natural risks.',
    hi: 'गारंटीड भारी मुनाफे या अप्रत्याशित पुरस्कारों के दावों से सावधान रहें। कोई भी वैध निवेश जोखिम-मुक्त नहीं होता।',
    hinglish: 'Guaranteed high returns ya achanak mile prize claims par vishwas na karein.',
  },
  SECRECY_PRESSURE: {
    en: 'Scammers urge secrecy to prevent second opinions. Discuss this message openly with family or colleagues.',
    hi: 'गोपनीयता का दबाव बनाने वाले संदेशों से बचें। इस संदेश पर अपने परिवार या भरोसेमंद लोगों से चर्चा करें।',
    hinglish: 'Kissi ke kehne par baat chhupayein mat. Is message ko turant family se discuss karein.',
  },
  IDENTITY_PRESSURE: {
    en: 'Never send identity documents (Aadhaar, PAN, Passport) across unverified chat or SMS channels.',
    hi: 'असमर्थित संदेशों पर कभी भी पहचान पत्र (आधार, पैन, आदि) न भेजें।',
    hinglish: 'Kabhi bhi WhatsApp ya SMS par apna Aadhaar, PAN card share na karein.',
  },
};

export const FAMILY_WARNING_RECOMMENDATIONS: Record<string, string> = {
  en: 'Consider warning a family member before taking action.',
  hi: 'कोई भी कदम उठाने से पहले अपने परिवार के किसी सदस्य को सचेत करें।',
  hinglish: 'Koi bhi action lene se pehle apne parivaar ke kisi member ko zaroor batayein.',
};

export const LEGITIMATE_RECOMMENDATION: Record<string, string> = {
  en: 'No high-risk social engineering signals were detected in this message. Always exercise routine digital caution.',
  hi: 'इस संदेश में कोई उच्च जोखिम वाले संकेत नहीं मिले हैं। सामान्य डिजिटल सतर्कता बनाए रखें।',
  hinglish: 'Is message me koi high-risk scam signals nahi mile. Normal digital caution maintain karein.',
};

export function generateRecommendations(
  tactics: string[],
  riskLevel: string,
  language: string = 'en'
): string[] {
  const l = language.toLowerCase();
  const lang = l === 'hi' || l === 'hinglish' ? l : 'en';
  const recs: string[] = [];
  const seenKeys = new Set<string>();

  for (const tactic of tactics) {
    const tClean = tactic.trim().toUpperCase();
    if (tClean in RECOMMENDATION_TEMPLATES && !seenKeys.has(tClean)) {
      seenKeys.add(tClean);
      recs.push(RECOMMENDATION_TEMPLATES[tClean][lang]);
    }
  }

  // High or Critical risk alert
  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    recs.push(FAMILY_WARNING_RECOMMENDATIONS[lang]);
  }

  // If no tactics were detected
  if (recs.length === 0) {
    recs.push(LEGITIMATE_RECOMMENDATION[lang]);
  }

  return recs;
}
