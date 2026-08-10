import { AssessmentReport, AttributeScore } from '../types';

interface Dictionary {
  [key: string]: { [lang: string]: string };
}

// Key term translations dictionary for standard metrics and report structures
const termDictionary: Dictionary = {
  // Titles & Categories
  'Assessment Report': {
    hi: 'मूल्यांकन रिपोर्ट',
    bn: 'মূল্যায়ন প্রতিবেদন',
    ta: 'மதிப்பீட்டு அறிக்கை',
    te: 'అంచనా నివేదిక',
    mr: 'मूल्यांकन अहवाल',
    gu: 'અહેવાલ оцінка',
    kn: 'ಮೌಲ್ಯಮಾಪನ ವರದಿ',
    ml: 'മൂല്യനിർണ്ണയ റിപ്പോർട്ട്',
    pa: 'ਮੁਲਾਂਕਣ ਰਿਪੋਰਟ',
    ur: 'جائزہ رپورٹ',
    or: 'ମୂଲ୍ୟାଙ୍କନ ରିପୋର୍ଟ',
    as: 'মূল্যায়ন প্ৰতিবেদন',
    ne: 'मूल्याङ्कन प्रतिवेदन',
    sa: 'मूल्याङ्कन प्रतिवेदनम्',
    es: 'Informe de Evaluación',
    fr: 'Rapport d\'Évaluation',
    de: 'Bewertungsbericht',
    ja: '評価レポート',
    zh: '评估报告',
  },
  'Postural Alignment Assessment': {
    hi: 'शारीरिक मुद्रा संरेखण मूल्यांकन',
    bn: 'শারীরিক ভঙ্গিমা মূল্যায়ন',
    ta: 'உடல் நிலை சீரமைப்பு மதிப்பீடு',
    te: 'శరీర భంగిమ అమరిక అంచనా',
    mr: 'शारीरिक स्थिती मूल्यांकन',
    gu: 'શારીરિક મુદ્રા મૂલ્યાંકન',
    kn: 'ದೇಹ ಭಂಗಿ ಮೌಲ್ಯಮಾಪನ',
    ml: 'ശരീര നില മൂല്യനിർണ്ണയം',
    pa: 'ਸਰੀਰਕ ਮੁਦਰਾ ਮੁਲਾਂਕਣ',
    ur: 'جسمانی حالت کا جائزہ',
    es: 'Evaluación de Alineación Postural',
    fr: 'Évaluation de l\'Alignement Postural',
    de: 'Beurteilung der Körperhaltung',
    ja: '姿勢アライメント評価',
    zh: '姿势排列评估',
  },
  'Physical Fitness & Athletic Mechanics': {
    hi: 'शारीरिक फिटनेस एवं एथलेटिक मैकेनिक्स',
    bn: 'শারীরিক ফিটনেস এবং অ্যাথলেটিক মেকানিক্স',
    ta: 'உடற்பயிற்சி மற்றும் த்லchallenge இயக்கவியல்',
    te: 'శారీరక సామర్థ్యం మరియు అథ్లెటిక్ మెకానిక్స్',
    mr: 'शारीरिक क्षमता आणि क्रीडा तंत्र',
    gu: 'શારીરિક ફિટનેસ અને એથ્લેટિક મિકેનિક્સ',
    kn: 'ದೈಹಿಕ ಕ್ಷಮತೆ ಮತ್ತು ಕ್ರೀಡಾ ತಂತ್ರ',
    ml: 'കായികക്ഷമതയും അത്‌ലറ്റിക് മെക്കാനിക്‌സും',
    es: 'Acondicionamiento Físico y Mecánica Deportiva',
    fr: 'Forme Physique et Mécanique Athlétique',
    de: 'Körperliche Fitness & Athletische Mechanik',
    ja: 'フィジカルフィットネス＆アスレチックメカニクス',
    zh: '身体素质与运动力学',
  },
  'Public Speaking & Body Language': {
    hi: 'जनसंभाषण एवं शारीरिक भाषा मूल्यांकन',
    bn: 'জনসমক্ষে বক্তৃতা এবং শারীরিক ভাষা',
    ta: 'பொது பேச்சு மற்றும் உடல் மொழி',
    te: 'ప్రజా ప్రసంగం మరియు శరీర భాష',
    mr: 'वक्तृत्व आणि शारीरिक भाषा',
    gu: 'વક્તૃત્વ અને શારીરિક ભાષા',
    kn: 'ಸಾರ್ವಜನಿಕ ಭಾಷಣ ಮತ್ತು ದೇಹ ಭಾಷೆ',
    ml: 'പ്രസംഗകലയും ശരീരഭാഷയും',
    es: 'Oratoria y Lenguaje Corporal',
    fr: 'Prise de Parole et Langage Corporel',
    de: 'Rhetorik & Körpersprache',
    ja: 'パブリックスピーキング＆ボディランゲージ',
    zh: '演讲与肢体语言',
  },

  // Parameters
  'Spine Straightness': {
    hi: 'रीढ़ की हड्डी का संरेखण',
    bn: 'মেরুদণ্ডের সোজা ভাব',
    ta: 'தண்டுவட நேர்கோடு',
    te: 'వెన్నుముక నిటారుగా ఉండుట',
    mr: 'पाठीच्या कण्याचे संरेखण',
    gu: 'કરોડરજ્જુની સીધાશ',
    kn: 'ಬೆನ್ನೆಲುಬಿನ ನೇರತೆ',
    ml: 'നട്ടെല്ലിന്റെ നേർരേഖ',
    pa: 'ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ ਦੀ ਸਿੱਧ',
    ur: 'ریڑھ کی ہڈی کا سیدھا پن',
    es: 'Rectitud Espinal',
    fr: 'Alignement de la Colonne',
    de: 'Wirbelsäulenausrichtung',
    ja: '脊椎の直立度',
    zh: '脊柱挺直度',
  },
  'Spinal Alignment': {
    hi: 'स्पाइनल एलाइनमेंट',
    bn: 'স্পাইনাল অ্যালাইনমেন্ট',
    ta: 'தண்டுவட அமைவு',
    te: 'వెన్నుముక సమలేఖనం',
    mr: 'पाठीच्या कण्याची स्थिती',
    es: 'Alineación Espinal',
    fr: 'Alignement Spinal',
    de: 'Wirbelsäulenhaltung',
    ja: '脊椎アライメント',
    zh: '脊柱排列',
  },
  'Head Posture': {
    hi: 'सिर की मुद्रा',
    bn: 'মাথার অবস্থান',
    ta: 'தலை அமைவு',
    te: 'తల భంగిమ',
    mr: 'डोक्याची स्थिती',
    gu: 'માથાની મુદ્રા',
    kn: 'ತಲೆಯ ಭಂಗಿ',
    ml: 'തലയുടെ നില',
    es: 'Postura de la Cabeza',
    fr: 'Posture de la Tête',
    de: 'Kopfhaltung',
    ja: '頭部の姿勢',
    zh: '头部姿势',
  },
  'Eye Contact': {
    hi: 'आई कॉन्टैक्ट (दृष्टि संपर्क)',
    bn: 'আই কন্টাক্ট (চোখের যোগাযোগ)',
    ta: 'கண் தொடர்பு',
    te: 'కంటి చూపు అనుసంధానం',
    mr: 'दृष्टी संपर्क',
    gu: 'દ્રષ્ટિ સંપર્ક',
    kn: 'ದೃಷ್ಟಿ ಸಂಪರ್ಕ',
    ml: 'കണ്ണുകളുടെ സമ്പർക്കം',
    es: 'Contacto Visual',
    fr: 'Contact Visuel',
    de: 'Blickkontakt',
    ja: 'アイコンタクト',
    zh: '眼神交流',
  },
  'Shoulder Alignment': {
    hi: 'कंधों का संतुलन एवं संरेखण',
    bn: 'কাঁধের ভারসাম্য',
    ta: 'தோள்பட்டை சீரமைப்பு',
    te: 'భుజాల సమలేఖనం',
    mr: 'खांद्यांचे संरेखण',
    gu: 'ખભાનું સંતુલન',
    kn: 'ಹೆಗಲಿನ ಸಮತೋಲನ',
    ml: 'തോളിന്റെ സമനില',
    es: 'Alineación de Hombros',
    fr: 'Alignement des Épaules',
    de: 'Schultermethode',
    ja: '肩のアライメント',
    zh: '肩部平衡',
  },
  'Core Stability': {
    hi: 'कोर स्थिरता',
    bn: 'কোর স্থিতিশীলতা',
    ta: 'மத்திய உடல் സ്ഥിരത',
    te: 'కోర్ స్థిరత్వం',
    mr: 'गाभा स्थिरता (Core Stability)',
    gu: 'કોર સ્થિરતા',
    kn: 'ಕೋರ್ ಸ್ಥಿರತೆ',
    ml: 'കോർ സ്ഥിരത',
    es: 'Estabilidad del Núcleo',
    fr: 'Stabilité du Tronc',
    de: 'Rumpfstabilität',
    ja: '体幹の安定性',
    zh: '核心稳定性',
  },
  'Foot Position': {
    hi: 'पैरों का स्थान एवं संतुलन',
    bn: 'পায়ের অবস্থান',
    ta: 'பாதத்தின் நிலை',
    te: 'పాదం భంగిమ',
    mr: 'पायांची स्थिती',
    es: 'Posición de los Pies',
    fr: 'Position des Pieds',
    de: 'Fußstellung',
    ja: '足の配置',
    zh: '脚部位置',
  },
  'Vocal Tone': {
    hi: 'स्वर शैली एवं स्पष्टता',
    bn: 'কণ্ঠস্বর এবং স্পষ্টতা',
    ta: 'குரல் தொனி',
    te: 'స్వర స్వభావం',
    mr: 'आवाजाची लय',
    es: 'Tono Vocal',
    fr: 'Tonalité Vocale',
    de: 'Stimmklang',
    ja: '声 plan トーン',
    zh: '声调与音质',
  },

  // Common phrases & status
  'Optimal Alignment': {
    hi: 'उत्कृष्ट संरेखण',
    bn: 'চমৎকার সামঞ্জস্য',
    ta: 'சிறந்த சீரமைப்பு',
    te: 'అద్భుతమైన అమరిక',
    mr: 'उत्कृष्ट संरेखण',
    gu: 'શ્રેષ્ઠ સંતુલન',
    kn: 'ಅುತ್ತಮ ಸಮತೋಲನ',
    ml: 'മികച്ച സമനില',
    es: 'Alineación Óptima',
    fr: 'Alignement Optimal',
    de: 'Optimale Haltung',
    ja: '最適なアライメント',
    zh: '最佳排列',
  },
  'Needs Attention': {
    hi: 'सुधार की आवश्यकता',
    bn: 'মনোযোগ প্রয়োজন',
    ta: 'கவனம் தேவை',
    te: 'శ్రద్ధ అవసరం',
    mr: 'सुधारणा आवश्यक',
    es: 'Requiere Atención',
    fr: 'Nécessite une Attention',
    de: 'Verlangt Aufmerksamkeit',
    ja: '要改善',
    zh: '需要注意',
  },
  'Severe Fault': {
    hi: 'गंभीर त्रुटि',
    bn: 'গুরুতর ত্রুটি',
    ta: 'கடுமையான குறைபாடு',
    te: 'తీవ్రమైన లోపం',
    mr: 'गंभीर दोष',
    es: 'Fallo Grave',
    fr: 'Défaut Majeur',
    de: 'Schwerwiegender Abweichung',
    ja: '重大な欠陥',
    zh: '严重缺陷',
  },
};

// Normalize language target code
function getLangKey(targetLanguage: string): string {
  const langLower = targetLanguage.toLowerCase().trim();
  const codeMap: { [k: string]: string } = {
    'hindi': 'hi', 'hi': 'hi',
    'bengali': 'bn', 'bn': 'bn',
    'tamil': 'ta', 'ta': 'ta',
    'telugu': 'te', 'te': 'te',
    'marathi': 'mr', 'mr': 'mr',
    'gujarati': 'gu', 'gu': 'gu',
    'kannada': 'kn', 'kn': 'kn',
    'malayalam': 'ml', 'ml': 'ml',
    'punjabi': 'pa', 'pa': 'pa',
    'urdu': 'ur', 'ur': 'ur',
    'odia': 'or', 'or': 'or',
    'assamese': 'as', 'as': 'as',
    'nepali': 'ne', 'ne': 'ne',
    'sanskrit': 'sa', 'sa': 'sa',
    'spanish': 'es', 'es': 'es',
    'french': 'fr', 'fr': 'fr',
    'german': 'de', 'de': 'de',
    'japanese': 'ja', 'ja': 'ja',
    'chinese': 'zh', 'zh': 'zh',
  };

  return codeMap[langLower] || langLower.substring(0, 2);
}

/**
 * Translates an AssessmentReport using template rules and dictionary lookup
 * whenever Gemini API is unavailable or rate-limited.
 */
export function translateReportFallback(report: AssessmentReport, targetLanguage: string): AssessmentReport {
  const langKey = getLangKey(targetLanguage);
  console.log(`[FallbackTranslator] Translating report ID "${report.id}" into "${targetLanguage}" (key: ${langKey})`);

  // Helper to translate single phrase or lookup in dictionary
  const translateTerm = (term: string): string => {
    if (!term) return '';
    if (termDictionary[term] && termDictionary[term][langKey]) {
      return termDictionary[term][langKey];
    }
    return term;
  };

  // Language specific prefixes and headers
  const langHeaders: { [k: string]: { titleSuffix: string; summaryPrefix: string; insightPrefix: string; recPrefix: string; strengthLabel: string; impLabel: string; actionLabel: string } } = {
    hi: {
      titleSuffix: 'मूल्यांकन रिपोर्ट',
      summaryPrefix: 'मूल्यांकन सारांश: वीडियो विश्लेषण और गतिज माप के अनुसार, रिपोर्ट प्रदर्शन के प्रमुख संकेतकों को दर्शाती है।',
      insightPrefix: 'एआई कोच अंतर्दृष्टि: इष्टतम प्रदर्शन प्राप्त करने के लिए दैनिक अभ्यास और उचित संरेखण पर ध्यान दें।',
      recPrefix: 'अभ्यास सिफारिश: तकनीक और स्थिरता में सुधार के लिए निरंतर ध्यान केंद्रित करें।',
      strengthLabel: 'मुख्य ताकत: ',
      impLabel: 'सुधार क्षेत्र: ',
      actionLabel: 'कार्य योजना: '
    },
    bn: {
      titleSuffix: 'মূল্যায়ন প্রতিবেদন',
      summaryPrefix: 'মূল্যায়ন সারসংক্ষেপ: ভিডিও বিশ্লেষণ অনুযায়ী কর্মক্ষমতার চিত্র তুলে ধরা হলো।',
      insightPrefix: 'এআই কোচ ইনসাইট: ধারাবাহিক অনুশীলন এবং সঠিক নিয়ন্ত্রণের মাধ্যমে উন্নতি সম্ভব।',
      recPrefix: 'পরামর্শ: কৌশলগত অনুশীলনের উপর জোর দিন।',
      strengthLabel: 'প্রধান শক্তি: ',
      impLabel: 'উন্নতির ক্ষেত্র: ',
      actionLabel: 'কর্ম পরিকল্পনা: '
    },
    ta: {
      titleSuffix: 'மதிப்பீட்டு அறிக்கை',
      summaryPrefix: 'மதிப்பீட்டு சுருக்கம்: வீடியோ பகுப்பாய்வின் மூலம் பெறப்பட்ட செயல்திறன் அளவீடுகள்.',
      insightPrefix: 'AI பயிற்சியாளரின் கருத்து: தொடர்ச்சியான பயிற்சி மூலம் செயல்திறனை அதிகரிக்கலாம்.',
      recPrefix: 'பரிந்துரை: தினசரி உடற்பயிற்சிகளை தவறாமல் செய்யவும்.',
      strengthLabel: 'முக்கிய பலங்கள்: ',
      impLabel: 'மேம்படுத்த வேண்டியவை: ',
      actionLabel: 'செயல் திட்டம்: '
    },
    te: {
      titleSuffix: 'అంచనా నివేదిక',
      summaryPrefix: 'అంచనా సారాంశం: వీడియో విశ్లేషణ ద్వారా నమోదు చేయబడిన పనితీరు కొలతలు.',
      insightPrefix: 'AI కోచ్ అంతర్దృష్టి: సరైన సమలేఖనం కోసం క్రమం తప్పకుండా సాధన చేయండి.',
      recPrefix: 'సిఫార్సు: స్థిరత్వం పెంచడానికి దృష్టి పెట్టండి.',
      strengthLabel: 'ముఖ్యమైన బలాలు: ',
      impLabel: 'మెరుగుపరచాల్సిన రంగాలు: ',
      actionLabel: 'కార్యాచరణ ప్రణాళిక: '
    },
    mr: {
      titleSuffix: 'मूल्यांकन अहवाल',
      summaryPrefix: 'मूल्यांकन सारांश: व्हिडिओ विश्लेषणावर आधारित कामगिरीची आकडेवारी.',
      insightPrefix: 'एआय कोच कडून सल्ला: नियमित सराव आणि योग्य स्थिती सुधारणे आवश्यक आहे.',
      recPrefix: 'शीफारस: शरीराचे संतुलन राखण्यासाठी दैनंदिन व्यायाम करा.',
      strengthLabel: 'प्रमुख शक्ती: ',
      impLabel: 'सुधारणा क्षेत्रे: ',
      actionLabel: 'कृती योजना: '
    },
    gu: {
      titleSuffix: 'મૂલ્યાંકન અહેવાલ',
      summaryPrefix: 'મૂલ્યાંકન સારાંશ: વિડિયો વિશ્લેષણ અને ગતિ માપન દર્શાવે છે.',
      insightPrefix: 'AI કોચ સલાહ: નિયમિત પ્રેક્ટિસથી સુધારો થશે.',
      recPrefix: 'ભલામણ: શારીરિક સંતુલન જાળવી રાખો.',
      strengthLabel: 'મુખ્ય શક્તિઓ: ',
      impLabel: 'સુધારણાના ક્ષેત્રો: ',
      actionLabel: 'કાર્ય યોજના: '
    },
    kn: {
      titleSuffix: 'ಮೌಲ್ಯಮಾಪನ ವರದಿ',
      summaryPrefix: 'ಮೌಲ್ಯಮಾಪನ ಸಾರಾಂಶ: ವೀಡಿಯೊ ವಿಶ್ಲೇಷಣೆ ಆಧಾರಿತ ನಿರ್ವಹಣೆ.',
      insightPrefix: 'AI ಕೋಚ್ ಸಲಹೆ: ದಿನನಿತ್ಯದ ಅಭ್ಯಾಸದಿಂದ ಉತ್ತಮ ಫಲಿತಾಂಶ.',
      recPrefix: 'ಶಿಫಾರಸು: ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಸಮತೋಲನವನ್ನು ಸುಧಾರಿಸಿ.',
      strengthLabel: 'ಮುಖ್ಯ ಸಾಮರ್ಥ್ಯಗಳು: ',
      impLabel: 'ಸುಧಾರಣೆಯ ಕ್ಷೇತ್ರಗಳು: ',
      actionLabel: 'ಕಾರ್ಯ ಯೋಜನೆ: '
    },
    ml: {
      titleSuffix: 'മൂല്യനിർണ്ണയ റിപ്പോർട്ട്',
      summaryPrefix: 'മൂല്യനിർണ്ണയ സംഗ്രഹം: വീഡിയോ വിശകലനത്തെ അടിസ്ഥാനമാക്കിയുള്ള പ്രകടനം.',
      insightPrefix: 'AI കോച്ച് നിർദ്ദേശം: ക്രമമായ പരിശീലനം പ്രകടന മികവ് വർദ്ധിപ്പിക്കും.',
      recPrefix: 'ശിപാർശ: സാങ്കേതിക കൃത്യത പുലർത്തുക.',
      strengthLabel: 'പ്രധാന കരുത്തുകൾ: ',
      impLabel: 'മെച്ചപ്പെടുത്തേണ്ട മേഖലകൾ: ',
      actionLabel: 'കർമ്മ പദ്ധതി: '
    },
    pa: {
      titleSuffix: 'ਮੁਲਾਂਕਣ ਰਿਪੋਰਟ',
      summaryPrefix: 'ਮੁਲਾਂਕਣ ਸੰਖੇਪ: ਵੀਡੀਓ ਵਿਸ਼ਲੇਸ਼ਣ ਦੇ ਅਧਾਰ ਤੇ ਪ੍ਰਦਰਸ਼ਨ।',
      insightPrefix: 'AI ਕੋਚ ਸਲਾਹ: ਲਗਾਤਾਰ ਅਭਿਆਸ ਨਾਲ ਸੁਧਾਰ ਕਰੋ।',
      recPrefix: 'ਸਿਫਾਰਸ਼: ਤਕਨੀਕੀ ਸਥਿਰਤਾ ਬਣਾਏ ਰੱਖੋ।',
      strengthLabel: 'ਮੁੱਖ ਤਾਕਤਾਂ: ',
      impLabel: 'ਸੁਧਾਰ ਦੇ ਖੇਤਰ: ',
      actionLabel: 'ਕਾਰਜ ਯੋਜਨਾ: '
    },
    ur: {
      titleSuffix: 'جائزہ رپورٹ',
      summaryPrefix: 'خلاصہ رپورٹ: ویڈیو تجزیہ پر مبنی کارکردگی کے نکات۔',
      insightPrefix: 'اے آئی کوچ کا مشورہ: مسلسل مشق اور توازن پر توجہ دیں۔',
      recPrefix: 'سفارش: جسمانی حالت کو برقرار رکھیں۔',
      strengthLabel: 'اہم خصوصیات: ',
      impLabel: 'بہتری کے شعبے: ',
      actionLabel: 'لائحہ عمل: '
    },
    es: {
      titleSuffix: 'Informe de Evaluación',
      summaryPrefix: 'Resumen Ejecutivo: Análisis cinemático y evaluación basada en fotogramas de video.',
      insightPrefix: 'Perspectiva del Entrenador IA: Se recomienda práctica enfocada para optimizar la alineación.',
      recPrefix: 'Recomendación: Mantener la consistencia en cada secuencia de movimiento.',
      strengthLabel: 'Puntos Fuertes: ',
      impLabel: 'Áreas de Mejora: ',
      actionLabel: 'Plan de Acción: '
    },
    fr: {
      titleSuffix: 'Rapport d\'Évaluation',
      summaryPrefix: 'Résumé Exécutif : Évaluation cinématique basée sur l\'analyse vidéo.',
      insightPrefix: 'Conseil du Coach IA : Pratiquez régulièrement pour optimiser la posture.',
      recPrefix: 'Recommandation : Axer le travail sur la stabilité et l\'alignement.',
      strengthLabel: 'Points Forts : ',
      impLabel: 'Axes d\'Amélioration : ',
      actionLabel: 'Plan d\'Action : '
    },
    de: {
      titleSuffix: 'Bewertungsbericht',
      summaryPrefix: 'Zusammenfassung: Bewegungsanalyse und Bewertung basierend auf Videoaufnahmen.',
      insightPrefix: 'KI-Coach Erkenntnis: Regelmäßiges Training verbessert Haltung und Präzision.',
      recPrefix: 'Empfehlung: Konzentrieren Sie sich auf Bewegungsstabilität.',
      strengthLabel: 'Stärken: ',
      impLabel: 'Verbesserungsbereiche: ',
      actionLabel: 'Aktionsplan: '
    },
  };

  const header = langHeaders[langKey] || {
    titleSuffix: `${targetLanguage} Assessment Report`,
    summaryPrefix: `Executive Summary (${targetLanguage}): Video assessment and motion measurement completed.`,
    insightPrefix: `AI Coach Insight (${targetLanguage}): Focus on posture and mechanics.`,
    recPrefix: `Recommendation (${targetLanguage}): Maintain core stability and technique.`,
    strengthLabel: 'Strength: ',
    impLabel: 'Improvement: ',
    actionLabel: 'Action Plan: '
  };

  // Translate Category Name & Title
  const categoryTranslated = translateTerm(report.categoryName) || report.categoryName;
  const translatedTitle = `${categoryTranslated} - ${header.titleSuffix}`;

  // Translate Attributes
  const translatedAttributes: AttributeScore[] = report.attributes.map(attr => {
    const translatedName = translateTerm(attr.name);
    const isGood = attr.score >= 70;
    const isFault = attr.criticalFault || attr.score < 50;

    let obsVal = attr.observedValue;
    if (obsVal.includes('alignment')) obsVal = obsVal.replace('alignment', translateTerm('Optimal Alignment'));
    if (obsVal.includes('Needs attention')) obsVal = obsVal.replace('Needs attention', translateTerm('Needs Attention'));

    // Multilingual Attribute Points Generators
    const getExpertAnalysis = (): string => {
      switch (langKey) {
        case 'hi':
          return isGood 
            ? `${translatedName}: वीडियो निष्पादन में उत्कृष्ट संरेखण और नियंत्रण प्रदर्शित किया गया।`
            : `${translatedName}: निष्पादन के दौरान स्थिति में विचलन देखा गया। सुधार की आवश्यकता है।`;
        case 'bn':
          return isGood
            ? `${translatedName}: ভিডিও সম্পাদনে চমৎকার নিয়ন্ত্রণ এবং সঠিক ভঙ্গিমা প্রদর্শিত হয়েছে।`
            : `${translatedName}: সম্পাদনকালে ভঙ্গিমার বিচ্যুতি লক্ষ্য করা গেছে। উন্নতি প্রয়োজন।`;
        case 'ta':
          return isGood
            ? `${translatedName}: வீடியோ செயல்பாட்டில் சிறந்த சீரமைப்பு மற்றும் கட்டுப்பாடு நிரூபிக்கப்பட்டது.`
            : `${translatedName}: செயல்பாட்டின் போது சீரமைப்பில் மாற்றம் காணப்பட்டது. மேம்பாடு தேவை.`;
        case 'te':
          return isGood
            ? `${translatedName}: వీడియో అమలులో అద్భుతమైన సమలేఖనం మరియు నియంత్రణ ప్రదర్శించబడింది.`
            : `${translatedName}: అమలు సమయంలో భంగిమలో వ్యత్యాసం గమనించబడింది. మెరుగుదల అవసరం.`;
        case 'mr':
          return isGood
            ? `${translatedName}: हालचालींमध्ये उत्कृष्ट नियंत्रण आणि योग्य शारीरिक स्थिती दिसून आली.`
            : `${translatedName}: हालचाली दरम्यान विचलन आढळले. सुधारणेची गरज आहे.`;
        case 'gu':
          return isGood
            ? `${translatedName}: શ્રેષ્ઠ સંતુલન અને શારીરિક મુદ્રા દર્શાવવામાં આવી.`
            : `${translatedName}: પ્રદર્શન દરમિયાન શારીરિક મુદ્રામાં તફાવત દેખાયો. સુધારો જરૂરી.`;
        case 'kn':
          return isGood
            ? `${translatedName}: ವೀಡಿಯೊ ನಿರ್ವಹಣೆಯಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಸಮತೋಲನ ಮತ್ತು ನಿಯಂತ್ರಣ.`
            : `${translatedName}: ನಿರ್ವಹಣೆಯ ಸಮಯದಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಕಂಡುಬಂದಿದೆ. ಸುಧಾರಣೆ ಅಗತ್ಯ.`;
        case 'ml':
          return isGood
            ? `${translatedName}: മികച്ച നിയന്ത്രണവും ശരിയായ ശരീരനിലയും കാണിച്ചു.`
            : `${translatedName}: പ്രകടനത്തിൽ ചില വ്യതിയാനങ്ങൾ കണ്ടു. മെച്ചപ്പെടുത്തൽ ആവശ്യം.`;
        case 'pa':
          return isGood
            ? `${translatedName}: ਸ਼ਾਨਦਾਰ ਨਿਯੰਤਰਣ ਅਤੇ ਸਹੀ ਸਰੀਰਕ ਮੁਦਰਾ ਪ੍ਰਦਰਸ਼ਿਤ ਕੀਤੀ ਗਈ।`
            : `${translatedName}: ਪ੍ਰਦਰਸ਼ਨ ਦੌਰਾਨ ਸਰੀਰਕ ਮੁਦਰਾ ਵਿੱਚ ਫਰਕ ਦੇਖਿਆ ਗਿਆ। ਸੁਧਾਰ ਦੀ ਲੋੜ ਹੈ।`;
        case 'ur':
          return isGood
            ? `${translatedName}: کارکردگی میں شاندار توازن اور بہترین توازن کا مظاہرہ۔`
            : `${translatedName}: کارکردگی کے دوران پوزیشن میں انحراف دیکھا گیا۔ بہتری کی ضرورت ہے۔`;
        case 'es':
          return isGood
            ? `${translatedName}: Excelente alineación y control biomecánico demostrado durante la ejecución.`
            : `${translatedName}: Se observó desviación cinemática durante la ejecución. Requiere corrección.`;
        case 'fr':
          return isGood
            ? `${translatedName}: Excellent alignement et contrôle biomécanique démontrés pendant l'exécution.`
            : `${translatedName}: Déviation cinématique observée pendant l'exécution. Correction requise.`;
        case 'de':
          return isGood
            ? `${translatedName}: Hervorragende Ausrichtung und biomechanische Kontrolle während der Ausführung.`
            : `${translatedName}: Kinematische Abweichung während der Ausführung beobachtet. Korrektur erforderlich.`;
        case 'ja':
          return isGood
            ? `${translatedName}: 動作実行において優れたアライメントとコントロールが実証されました。`
            : `${translatedName}: 動作中に運動学的偏差が観察されました。改善が必要です。`;
        case 'zh':
          return isGood
            ? `${translatedName}: 动作执行过程中展现出出色的排列和力学控制。`
            : `${translatedName}: 动作过程中观察到力学偏差，需要进行针对性纠正。`;
        default:
          return `${translatedName}: ${attr.expertAnalysis}`;
      }
    };

    const getObservedEvidence = (): string => {
      switch (langKey) {
        case 'hi':
          return `[फ्रेम विश्लेषण] ${translatedName} निष्पादन के दौरान गति और स्थिति का रिकॉर्ड किया गया विश्लेषण।`;
        case 'bn':
          return `[ফ্রেম বিশ্লেষণ] ${translatedName} সম্পাদনের সময় গতি এবং অবস্থানের পরিমাপ রেকর্ড করা হয়েছে।`;
        case 'ta':
          return `[ஃபிரேம் பகுப்பாய்வு] ${translatedName} செயல்பாட்டின் போது பதிவு செய்யப்பட்ட இயக்க அளவீடு.`;
        case 'te':
          return `[ఫ్రేమ్ విశ్లేషణ] ${translatedName} సమయంలో నమోదు చేయబడిన కదలికల కొలతలు.`;
        case 'mr':
          return `[फ्रेम विश्लेषण] ${translatedName} हालचाली दरम्यान नोंदवलेले मोजमाप.`;
        case 'gu':
          return `[ફ્રેમ વિશ્લેષણ] ${translatedName} દરમિયાન નોંધાયેલ ગતિ વિશ્લેષણ.`;
        case 'kn':
          return `[ಫ್ರೇಮ್ ವಿಶ್ಲೇಷಣೆ] ${translatedName} ನಿರ್ವಹಣೆಯ ಸಂದರ್ಭದಲ್ಲಿ ದಾಖಲಾದ ಚಲನೆಯ ವಿಶ್ಲೇಷಣೆ.`;
        case 'ml':
          return `[ഫ്രെയിം വിശകലനം] ${translatedName} പ്രകടന സമയത്ത് രേഖപ്പെടുത്തിയ ചലന അളവുകൾ.`;
        case 'pa':
          return `[ਫ੍ਰੇਮ ਵਿਸ਼ਲੇਸ਼ਣ] ${translatedName} ਦੌਰਾਨ ਰਿਕਾਰਡ ਕੀਤਾ ਗਿਆ ਗਤੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ।`;
        case 'ur':
          return `[فریم تجزیہ] ${translatedName} کے دوران ریکارڈ شدہ حرکت کا جائزہ۔`;
        case 'es':
          return `[Evidencia de Video] Análisis de fotogramas registrado para ${translatedName}.`;
        case 'fr':
          return `[Preuve Vidéo] Analyse d'images enregistrée pour ${translatedName}.`;
        case 'de':
          return `[Videonachweis] Bildanalyse für ${translatedName} aufgezeichnet.`;
        case 'ja':
          return `[フレーム分析] ${translatedName} の動作中に記録されたモーショントラッキング。`;
        case 'zh':
          return `[视频证据] ${translatedName} 动作期间记录的视频帧与运动追踪。`;
        default:
          return attr.observedEvidence || `[Frame Evidence] Motion measurements recorded for ${translatedName}.`;
      }
    };

    const getTechnicalAnalysis = (): string => {
      switch (langKey) {
        case 'hi':
          return `[तकनीकी विश्लेषण] ${translatedName} के बायोमेकेनिकल मापदंडों का मूल्यांकन। प्राप्तांक: ${attr.score}/100।`;
        case 'bn':
          return `[প্রযুক্তিগত বিশ্লেষণ] ${translatedName} এর বায়োমেকানিকাল পরামিতি পরিমাপ করা হয়েছে। প্রাপ্ত নম্বর: ${attr.score}/100।`;
        case 'ta':
          return `[தொழில்நுட்ப பகுப்பாய்வு] ${translatedName} க்கான பயோமெக்கானிக்கல் அளவீடுகள். மதிப்பெண்: ${attr.score}/100.`;
        case 'te':
          return `[సాంకేతిక విశ్లేషణ] ${translatedName} యొక్క బయోమెకానికల్ కొలతలు. స్కోరు: ${attr.score}/100.`;
        case 'mr':
          return `[तांत्रिक विश्लेषण] ${translatedName} साठी मोजलेले तांत्रिक गुण. गुण: ${attr.score}/100.`;
        case 'gu':
          return `[તકનીકી વિશ્લેષણ] ${translatedName} માટે મૂલ્યાંકન કરાયેલ તાંત્રિક સ્કોર: ${attr.score}/100.`;
        case 'kn':
          return `[ತಾಂತ್ರಿಕ ವಿಶ್ಲೇಷಣೆ] ${translatedName} ಗಾಗಿ ತಾಂತ್ರಿಕ ಮೌಲ್ಯಮಾಪನ. ಅಂಕ: ${attr.score}/100.`;
        case 'ml':
          return `[സാങ്കേതിക വിശകലനം] ${translatedName} ബയോമെക്കാനിക്കൽ സ്കോർ: ${attr.score}/100.`;
        case 'pa':
          return `[ਤਕਨੀਕੀ ਵਿਸ਼ਲੇਸ਼ਣ] ${translatedName} ਲਈ ਤਕਨੀਕੀ ਮੁਲਾਂਕਣ ਅੰਕ: ${attr.score}/100।`;
        case 'ur':
          return `[تکنیکی تجزیہ] ${translatedName} کے لیے تکنیکی اسکور: ${attr.score}/100۔`;
        case 'es':
          return `[Análisis Técnico] Evaluación biomecánica completada para ${translatedName}. Puntuación: ${attr.score}/100.`;
        case 'fr':
          return `[Analyse Technique] Évaluation biomécanique effectuée pour ${translatedName}. Score : ${attr.score}/100.`;
        case 'de':
          return `[Technische Analyse] Biomechanische Bewertung für ${translatedName} abgeschlossen. Punktzahl: ${attr.score}/100.`;
        case 'ja':
          return `[技術的分析] ${translatedName} の生体力学評価が完了しました。スコア: ${attr.score}/100。`;
        case 'zh':
          return `[技术分析] ${translatedName} 生物力学评估已完成。得分：${attr.score}/100。`;
        default:
          return attr.technicalAnalysis || `[Technical Analysis] Kinematic parameters evaluated for ${translatedName}. Score: ${attr.score}/100.`;
      }
    };

    const getCoachingRecommendation = (): string => {
      switch (langKey) {
        case 'hi':
          return `[कोचिंग सुझाव] ${translatedName} में सुधार और स्थिरता के लिए नियमित लक्षित अभ्यास करें।`;
        case 'bn':
          return `[কোচিং পরামর্শ] ${translatedName} এ স্থায়িত্ব বাড়াতে কৌশলগত ড্রিল এবং সেশন অনুসরণ করুন।`;
        case 'ta':
          return `[பயிற்சி பரிந்துரை] ${translatedName} இல் சீரான தன்மையை மேம்படுத்த இலக்கு பயிற்சிகளை மேற்கொள்ளவும்.`;
        case 'te':
          return `[కోచింగ్ సిఫార్సు] ${translatedName} లో స్థిరత్వాన్ని పెంచడానికి క్రమం తప్పకుండా సాధన చేయండి.`;
        case 'mr':
          return `[प्रशिक्षण सल्ला] ${translatedName} मध्ये सातत्य आणि अचूकता वाढवण्यासाठी दररोज सराव करा.`;
        case 'gu':
          return `[ભલામણ] ${translatedName} માં સંતુલન સુધારવા માટે લક્ષિત સત્રો કરો.`;
        case 'kn':
          return `[ಕೋಚಿಂಗ್ ಸಲಹೆ] ${translatedName} ದಲ್ಲಿ ಸ್ಥಿರತೆ ಹೆಚ್ಚಿಸಲು ನಿಯಮಿತ ಅಭ್ಯಾಸ ಮಾಡಿ.`;
        case 'ml':
          return `[പരിശീലന നിർദ്ദേശം] ${translatedName} സ്ഥിരത വർദ്ധിപ്പിക്കാൻ വ്യായാമം ചെയ്യുക.`;
        case 'pa':
          return `[ਸਿਫਾਰਸ਼] ${translatedName} ਵਿੱਚ ਸਥਿਰਤਾ ਵਧਾਉਣ ਲਈ ਨਿਯਮਤ ਅਭਿਆਸ ਕਰੋ।`;
        case 'ur':
          return `[کوچنگ کی ہدایت] ${translatedName} میں توازن کو بہتر بنانے کے لیے باقاعدہ مشق کریں۔`;
        case 'es':
          return `[Recomendación de Entrenamiento] Practique ejercicios específicos para consolidar ${translatedName}.`;
        case 'fr':
          return `[Conseil d'Entraînement] Effectuez des exercices ciblés pour perfectionner ${translatedName}.`;
        case 'de':
          return `[Trainingsempfehlung] Absolvieren Sie gezielte Übungen zur Verbesserung von ${translatedName}.`;
        case 'ja':
          return `[コーチング推奨] ${translatedName} の再現性と精度を高めるためにTargetドリルを実施してください。`;
        case 'zh':
          return `[教练建议] 进行针对性专项练习，以巩固和提升 ${translatedName} 的稳定性。`;
        default:
          return attr.coachingRecommendation || `[Coaching Recommendation] Practice targeted drills to reinforce ${translatedName}.`;
      }
    };

    return {
      ...attr,
      name: translatedName !== attr.name ? translatedName : attr.name,
      observedValue: obsVal,
      expertAnalysis: getExpertAnalysis(),
      observedEvidence: getObservedEvidence(),
      technicalAnalysis: getTechnicalAnalysis(),
      coachingRecommendation: getCoachingRecommendation(),
    };
  });

  // Translate Strengths, Improvements, Action Plan
  const translatedStrengths = (report.strengths || []).map(s => `${header.strengthLabel}${s}`);
  const translatedImprovements = (report.improvements || []).map(i => `${header.impLabel}${i}`);
  const translatedActionPlan = (report.actionPlan || []).map(a => `${header.actionLabel}${a}`);

  return {
    ...report,
    title: translatedTitle,
    categoryName: categoryTranslated,
    summary: `${header.summaryPrefix}\n\n${report.summary}`,
    aiInsight: `${header.insightPrefix}\n\n${report.aiInsight}`,
    attributes: translatedAttributes,
    strengths: translatedStrengths.length > 0 ? translatedStrengths : report.strengths,
    improvements: translatedImprovements.length > 0 ? translatedImprovements : report.improvements,
    actionPlan: translatedActionPlan.length > 0 ? translatedActionPlan : report.actionPlan,
    timelineEvents: (report.timelineEvents || []).map(evt => ({
      ...evt,
      title: `${evt.title}`,
      description: `${evt.description}`,
    }))
  };
}
