import { CategoryInfo, ShowcaseSlide, AssessmentReport, AssessmentCategoryKey, AttributeScore, SubscriptionPlan } from '../types';

export function getCategoryAttributes(categoryKey: AssessmentCategoryKey): AttributeScore[] {
  let names: string[] = [];
  switch (categoryKey) {
    case 'interview':
      names = [
        'Professional Appearance',
        'Sitting/Standing Posture',
        'Eye Contact',
        'Facial Expressions',
        'Hand Gestures',
        'Voice Clarity',
        'Speaking Pace',
        'Confidence Level',
        'Nervous Movements',
        'Professional Communication'
      ];
      break;
    case 'presentation':
      names = [
        'Presentation Opening',
        'Presenter Posture',
        'Stage Movement',
        'Hand Gestures',
        'Eye Contact',
        'Voice Modulation',
        'Slide Synchronization',
        'Audience Engagement',
        'Presentation Confidence'
      ];
      break;
    case 'leadership':
      names = [
        'Executive Presence',
        'Leadership Posture',
        'Authority',
        'Calmness',
        'Eye Contact',
        'Voice Authority',
        'Hand Gestures',
        'Decision-Making Presence',
        'Confidence'
      ];
      break;
    case 'communication':
      names = [
        'Smile',
        'Warmth',
        'Eye Contact',
        'Listening Behaviour',
        'Communication Clarity',
        'Body Language',
        'Friendliness',
        'Emotional Connection'
      ];
      break;
    case 'teacher':
      names = [
        'Teaching Posture',
        'Eye Contact',
        'Hand Gestures',
        'Board/Screen Interaction',
        'Voice Clarity',
        'Speaking Pace',
        'Student Engagement',
        'Visual Explanation',
        'Teaching Confidence'
      ];
      break;
    case 'athlete':
      names = [
        'Athletic Posture',
        'Body Movement',
        'Motion Analysis',
        'Balance',
        'Coordination',
        'Speed & Agility',
        'Energy Level',
        'Coaching Gestures',
        'Tactical Explanation',
        'Sportsmanship'
      ];
      break;
    case 'student':
      names = [
        'Presentation Posture',
        'Eye Contact',
        'Confidence',
        'Facial Expressions',
        'Hand Gestures',
        'Response Quality',
        'Speaking Clarity',
        'Question Handling',
        'Professional Presentation'
      ];
      break;
    case 'personality':
      names = [
        'Camera Presence',
        'Facial Expressions',
        'Smile',
        'Eye Contact with Camera',
        'Body Language',
        'Voice Variation',
        'Natural Communication',
        'Charisma',
        'Audience Connection'
      ];
      break;
    default:
      names = ['Confidence', 'Vocal Projection', 'Pacing & Coordination', 'Eye Contact'];
  }

  return names.map((name, index) => {
    const randomOffset = Math.floor(Math.random() * 14) - 5; // -5 to +8
    const score = Math.min(99, Math.max(76, 86 + randomOffset + ((index * 3) % 9)));
    const isHigh = score >= 88;
    return {
      name,
      score,
      status: score >= 90 ? 'optimal' : score >= 85 ? 'good' : 'review',
      observedValue: isHigh ? `Showed great strength and steady poise in ${name.toLowerCase()}.` : `Focused effort needed on ${name.toLowerCase()}.`,
      expertAnalysis: isHigh ? `Excellent execution with natural confidence.` : `Tip: Practice this section for a smoother flow.`
    };
  });
}

export function createReportForCategory(categoryKey: AssessmentCategoryKey, videoFileName?: string): AssessmentReport {
  const catInfo = CATEGORIES.find(c => c.key === categoryKey) || CATEGORIES[0];
  const attributes = getCategoryAttributes(categoryKey);
  const avgScore = Math.round(attributes.reduce((acc, curr) => acc + curr.score, 0) / attributes.length);
  const randomId = Math.floor(10000 + Math.random() * 90000);

  const summaries = [
    `Your ${catInfo.title.toLowerCase()} session demonstrated strong engagement, confident posture, and clear communication.`,
    `An impressive ${catInfo.title.toLowerCase()} recording featuring steady vocal modulation and natural eye contact.`,
    `Strong delivery in ${catInfo.title.toLowerCase()} with clear pacing and professional presence.`
  ];

  const strengthsPool = [
    `Exceptional consistency in ${attributes[0]?.name || 'key metric'}.`,
    `Strong overall camera presence and positive posture.`,
    `Clear enunciation and well-calibrated pacing throughout.`,
    `Natural emotional connection and confident delivery.`
  ];

  const improvementsPool = [
    'Maintain steady eye contact during transitional moments.',
    'Refine hand gestures to match your key points.',
    'Keep your vocal projection even during longer sentences.',
    'Pause briefly between major talking points.'
  ];

  const selectedStrengths = [
    strengthsPool[Math.floor(Math.random() * strengthsPool.length)],
    strengthsPool[(Math.floor(Math.random() * strengthsPool.length) + 1) % strengthsPool.length],
    `Solid performance in ${attributes[1]?.name || 'secondary metric'}.`
  ];

  const selectedImprovements = [
    improvementsPool[Math.floor(Math.random() * improvementsPool.length)],
    improvementsPool[(Math.floor(Math.random() * improvementsPool.length) + 1) % improvementsPool.length]
  ];

  return {
    id: `REP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `${catInfo.title} Multimodal Analysis`,
    categoryKey,
    categoryName: catInfo.title,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    duration: `${Math.floor(3 + Math.random() * 3)}m ${Math.floor(10 + Math.random() * 40)}s`,
    overallScore: avgScore,
    scoreBand: avgScore >= 85 ? 'good' : 'warn',
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    videoFileName: videoFileName || `recorded_${categoryKey}_session.mp4`,
    attributes,
    timelineEvents: [
      { timestamp: '00:15', title: 'Strong Start', description: 'Immediate establishment of confident posture and engagement.', type: 'positive' },
      { timestamp: '01:50', title: 'Core Delivery', description: 'Consistent vocal cadence and expressive delivery maintained.', type: 'positive' },
      { timestamp: '03:40', title: 'Clear Finish', description: 'Confident closure with natural eye contact.', type: 'positive' }
    ],
    strengths: selectedStrengths,
    improvements: selectedImprovements,
    actionPlan: [
      'Review recorded playback with focus on posture stability.',
      'Practice 2 targeted simulation rounds focusing on vocal warmth.'
    ],
    aiInsight: `Excellent performance in ${catInfo.title}! Keep up the natural confidence and steady focus.`
  };
}

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'interview',
    title: 'Job Interview',
    subtitle: 'Career Progression',
    description: 'Assess STAR delivery, composure, and professional poise.',
    iconName: 'Briefcase',
    accentColor: '#6E7BFF',
    recommendedDuration: '3 - 5 mins',
    metricsCount: 6
  },
  {
    key: 'student',
    title: 'Student',
    subtitle: 'Student Viva',
    description: 'Examine thesis clarity and critical question handling.',
    iconName: 'GraduationCap',
    accentColor: '#00D9C8',
    recommendedDuration: '5 - 10 mins',
    metricsCount: 6
  },
  {
    key: 'athlete',
    title: 'Athlete & Coach',
    subtitle: 'Performance',
    description: 'Examine post-match composure and tactical articulation.',
    iconName: 'Trophy',
    accentColor: '#6E7BFF',
    recommendedDuration: '2 - 4 mins',
    metricsCount: 6
  },
  {
    key: 'presentation',
    title: 'Pitch & Presentation',
    subtitle: 'Public Speaking',
    description: 'Analyze slide sync, vocal cadence, and audience engagement.',
    iconName: 'Presentation',
    accentColor: '#00D9C8',
    recommendedDuration: '5 - 10 mins',
    metricsCount: 6
  },
  {
    key: 'leadership',
    title: 'Leadership & Executive',
    subtitle: 'Management',
    description: 'Measure executive presence, authority, and decisiveness.',
    iconName: 'Shield',
    accentColor: '#FF5FA2',
    recommendedDuration: '4 - 6 mins',
    metricsCount: 6
  },
  {
    key: 'communication',
    title: 'Interpersonal & Social',
    subtitle: 'Soft Skills',
    description: 'Evaluate warmth, active listening, and social rapport.',
    iconName: 'MessageSquare',
    accentColor: '#FFB454',
    recommendedDuration: '2 - 5 mins',
    metricsCount: 6
  },
  {
    key: 'teacher',
    title: 'Educator & Lecturer',
    subtitle: 'Teaching',
    description: 'Review pacing, tone accessibility, and visual clarity.',
    iconName: 'BookOpen',
    accentColor: '#35E6A4',
    recommendedDuration: '5 - 15 mins',
    metricsCount: 6
  },
  {
    key: 'personality',
    title: 'Media & Personality',
    subtitle: 'On-Camera',
    description: 'Measure charisma index, warmth, and camera connection.',
    iconName: 'Smile',
    accentColor: '#FF5FA2',
    recommendedDuration: '3 - 5 mins',
    metricsCount: 6
  }
];

export const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'show-1',
    categoryKey: 'interview',
    categoryName: 'Job Interview Assessment',
    overallScore: 92,
    scoreBand: 'good',
    description: 'Senior Software Engineering Candidate behavioral round with STAR methodology analysis.',
    attributes: getCategoryAttributes('interview').slice(0, 5).map(attr => ({ name: `${attr.name} AI`, score: attr.score })),
    insight: 'Candidate demonstrated exemplary composure during complex technical inquiries. Minor filler word usage (&quot;um&quot;) detected only twice in 4 minutes.'
  },
  {
    id: 'show-2',
    categoryKey: 'presentation',
    categoryName: 'Series A Investor Pitch',
    overallScore: 88,
    scoreBand: 'good',
    description: 'Startup founder pitching AI enterprise automation platform to venture partners.',
    attributes: getCategoryAttributes('presentation').slice(0, 5).map(attr => ({ name: `${attr.name} AI`, score: attr.score })),
    insight: 'Strong hook and compelling problem statement. Pacing accelerated slightly during financial projection slides (175 WPM).'
  },
  {
    id: 'show-3',
    categoryKey: 'leadership',
    categoryName: 'Executive Town Hall',
    overallScore: 95,
    scoreBand: 'good',
    description: 'VP of Engineering addressing restructuring and remote work policy updates.',
    attributes: getCategoryAttributes('leadership').slice(0, 5).map(attr => ({ name: `${attr.name} AI`, score: attr.score })),
    insight: 'Exceptional empathetic resonance and reassuring cadence. Highly authoritative yet approachable demeanor throughout.'
  },
  {
    id: 'show-4',
    categoryKey: 'athlete',
    categoryName: 'Post-Match Championship Interview',
    overallScore: 84,
    scoreBand: 'good',
    description: 'Team captain reflecting on clutch semi-final victory and upcoming finals.',
    attributes: getCategoryAttributes('athlete').slice(0, 5).map(attr => ({ name: `${attr.name} AI`, score: attr.score })),
    insight: 'Authentic emotion and strong team attribution. Slight vocal fatigue observed in the final 30 seconds.'
  },
  {
    id: 'show-5',
    categoryKey: 'teacher',
    categoryName: 'Advanced Physics Lecture',
    overallScore: 90,
    scoreBand: 'good',
    description: 'University professor explaining quantum entanglement to undergraduate students.',
    attributes: getCategoryAttributes('teacher').slice(0, 5).map(attr => ({ name: `${attr.name} AI`, score: attr.score })),
    insight: 'Brilliant use of pauses after complex axioms. Excellent tonal inflection keeps student attention span high.'
  }
];

export const INITIAL_REPORTS: AssessmentReport[] = [
  createReportForCategory('interview', 'pm_interview_practice_v2.mp4'),
  createReportForCategory('presentation', 'pitch_deck_runthrough_final.mp4'),
  createReportForCategory('leadership', 'town_hall_q3_address.mp4')
];

export const FEATURES_LIST = [
  {
    icon: 'Brain',
    title: 'Multimodal AI Assessment',
    description: 'Analyzes facial micro-expressions, vocal cadence, pitch stability, and semantic word choice simultaneously.'
  },
  {
    icon: 'Activity',
    title: 'Quantitative Attribute Matrix',
    description: 'Breakdown across Confidence, Vocal Projection, Articulation, Pacing, Eye Contact, and Sentiment.'
  },
  {
    icon: 'FileText',
    title: 'Instant PDF Executive Reports',
    description: 'Generate publication-grade PDF summaries with charts, timelines, and actionable improvement plans.'
  },
  {
    icon: 'Zap',
    title: 'Real-Time HUD Scoring',
    description: 'Futuristic glowing telemetry ring tracking performance metrics with sub-second latency simulation.'
  },
  {
    icon: 'ShieldCheck',
    title: 'Enterprise Security & Privacy',
    description: 'Client-side encrypted processing simulation with zero video retention on external servers.'
  },
  {
    icon: 'Sliders',
    title: '8 Specialized Categories',
    description: 'Customized evaluation rubrics tailored for job interviews, pitches, academic defense, and teaching.'
  },
  {
    icon: 'BarChart3',
    title: 'Interactive Charting Suite',
    description: 'Powered by Chart.js for deep-dive radar profiles and longitudinal progress tracking over time.'
  },
  {
    icon: 'Sparkles',
    title: 'Targeted Action Plans',
    description: 'AI-generated prescriptive drills and micro-habits designed to fix identified communication flaws.'
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    track: 'individual',
    name: 'Free',
    price: 0,
    priceLabel: '₹0 / month',
    annualPrice: 0,
    annualPriceLabel: '₹0 / month',
    badge: 'BEST FOR BEGINNERS',
    isPreferred: false,
    description: 'Perfect for trying ClipTrixAI and building an analysis habit.',
    features: [
      '2–3 AI Analysis Credits per month',
      'Local device storage',
      'Maximum 5 cloud videos',
      'Experience AI-powered video analysis',
      'Basic assessment report',
      'ClipTrixAI watermark on analysis reports'
    ],
    credits: '2–3 AI Credits / Month',
    storage: 'Local storage or maximum 5 cloud videos',
    bestFor: 'Athletes, students and new users',
    goal: 'Try ClipTrixAI and experience AI-powered video analysis.',
    cta: 'Get Started for Free',
    annualCta: 'Get Started for Free',
    modalTagline: 'Perfect for getting started with ClipTrixAI.',
    reportsDetail: 'Basic AI analysis report',
    watermarkDetail: 'ClipTrixAI watermark included'
  },
  {
    id: 'pro-athlete',
    track: 'individual',
    name: 'Pro Athlete',
    price: 299,
    priceLabel: '₹299 / month',
    annualPrice: 239,
    annualPriceLabel: '₹239 / month',
    monthlyAnchorPriceLabel: '₹299/mo',
    badge: 'MOST POPULAR',
    isPreferred: true,
    description: 'Best for serious athletes and students who want continuous improvement.',
    features: [
      '20–30 AI Analysis Credits per month',
      'Detailed skeletal analysis',
      'Detailed biomechanical breakdown',
      'Progress tracking over time',
      'Unlimited cloud storage for personal videos',
      'Advanced AI assessment reports',
      'No ClipTrixAI watermark',
      'Suitable for serious athletes and competitive students'
    ],
    credits: '20–30 AI Credits / Month',
    storage: 'Unlimited personal cloud storage',
    bestFor: 'Serious athletes and competitive students',
    goal: 'Designed for athletes and students focused on measurable improvement.',
    cta: 'Start 14-Day Free Trial',
    annualCta: 'Start 14-Day Free Trial',
    modalTagline: 'Designed for athletes and students focused on measurable improvement.',
    analysisDetail: 'Detailed skeletal + biomechanical breakdown',
    reportsDetail: 'Detailed AI performance reports',
    watermarkDetail: 'No ClipTrixAI watermark'
  },
  {
    id: 'coach-starter',
    track: 'professional',
    name: 'Coach Starter',
    price: 1500,
    priceLabel: '₹1,500 / month',
    annualPrice: 1200,
    annualPriceLabel: '₹1,200 / month',
    monthlyAnchorPriceLabel: '₹1,500/mo',
    badge: 'BEST VALUE FOR COACHES',
    isPreferred: true,
    description: 'Manage a small roster and analyze your athletes efficiently.',
    features: [
      'Manage up to 10–15 athletes/teachers',
      'Shared pool of 100 AI Analysis Credits per month',
      'Analyze student/athlete videos',
      'Athlete/teacher roster management',
      'Individual performance reports',
      'Centralized team performance overview',
      'Suitable for independent coaches and trainers'
    ],
    credits: '100 Shared AI Credits / Month',
    storage: 'Shared cloud video repository',
    bestFor: 'Independent coaches and trainers',
    goal: 'Everything a coach needs to manage and analyze a small roster.',
    cta: 'Start 14-Day Free Trial',
    annualCta: 'Start 14-Day Free Trial',
    modalTagline: 'Everything a coach needs to manage and analyze a small roster.',
    rosterDetail: 'Up to 10–15 athletes/teachers',
    managementDetail: 'Athlete/teacher roster management',
    analysisDetail: 'Student/athlete video analysis',
    reportsDetail: 'Individual performance reports'
  },
  {
    id: 'coach-elite',
    track: 'professional',
    name: 'Coach Elite / Academy',
    price: 4000,
    priceLabel: '₹4,000 / month',
    annualPrice: 3200,
    annualPriceLabel: '₹3,200 / month',
    monthlyAnchorPriceLabel: '₹4,000/mo',
    badge: 'ENTERPRISE & ACADEMY',
    isPreferred: false,
    description: 'Built for professional coaches, teams, and sports academies.',
    features: [
      'Unlimited athletes',
      'Multi-coach access',
      'Team messaging',
      'Custom branded reports',
      'Premium multi-angle video analysis',
      'High-volume AI processing',
      'Unlimited AI processing subject to fair-use policy',
      'Advanced team management',
      'Academy-level reporting'
    ],
    credits: 'High-Volume AI Processing',
    storage: 'Enterprise academy cloud archive',
    bestFor: 'Professional coaches, teams and sports academies',
    goal: 'Complete AI-powered performance management for teams and academies.',
    cta: 'Upgrade to Elite',
    annualCta: 'Upgrade to Elite',
    modalTagline: 'Complete AI-powered performance management for teams and academies.',
    rosterDetail: 'Unlimited',
    coachesDetail: 'Multi-coach access',
    analysisDetail: 'Premium multi-angle analysis',
    reportsDetail: 'Custom branded reports',
    communicationDetail: 'Team messaging',
    managementDetail: 'Advanced academy/team management'
  }
];

export const PRICING_PLANS = SUBSCRIPTION_PLANS;

