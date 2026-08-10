export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flagEmoji?: string;
}

export class SupportedLanguages {
  static readonly ALL: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English', flagEmoji: '🇬🇧' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flagEmoji: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flagEmoji: '🇮🇳' },
    { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', flagEmoji: '🇮🇳' },
    { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', flagEmoji: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flagEmoji: '🇮🇳' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flagEmoji: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flagEmoji: '🇮🇳' },
    { code: 'ks', name: 'Kashmiri', nativeName: 'कश्मीरी / كَشْمِيْرِي', flagEmoji: '🇮🇳' },
    { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', flagEmoji: '🇮🇳' },
    { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flagEmoji: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flagEmoji: '🇮🇳' },
    { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্ / মেতেই', flagEmoji: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flagEmoji: '🇮🇳' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flagEmoji: '🇳🇵' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flagEmoji: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flagEmoji: '🇮🇳' },
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flagEmoji: '🇮🇳' },
    { code: 'sat', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', flagEmoji: '🇮🇳' },
    { code: 'sd', name: 'Sindhi', nativeName: 'सिंधी / سنڌي', flagEmoji: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flagEmoji: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flagEmoji: '🇮🇳' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flagEmoji: '🇵🇰' },
  ];

  static getByCode(code: string): LanguageOption {
    return this.ALL.find(l => l.code === code) || this.ALL[0];
  }

  static getByName(name: string): LanguageOption {
    return this.ALL.find(l => l.name.toLowerCase() === name.toLowerCase()) || this.ALL[0];
  }
}
