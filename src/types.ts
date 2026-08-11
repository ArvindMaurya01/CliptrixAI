export type ViewState = 'landing' | 'auth' | 'dashboard' | 'new-assessment' | 'report' | 'settings' | 'admin' | 'privacy' | 'terms' | 'security' | 'contact' | 'referral' | 'shared-streak' | 'community' | 'community-detail';

export type CommunityCategory = 'athlete' | 'student' | 'coach' | 'general';
export type CommunityType = 'public' | 'private';
export type CommunityRole = 'owner' | 'moderator' | 'member';
export type CommunityPostType = 'discussion' | 'question' | 'tip' | 'achievement';

export interface Community {
  id: string;
  name: string;
  description: string;
  category: CommunityCategory;
  sport?: string;
  type: CommunityType;
  imageUrl?: string;
  ownerId: string;
  ownerName?: string;
  memberCount: number;
  postCount: number;
  rules?: string;
  createdAt: string;
  isJoined?: boolean;
  joinStatus?: 'active' | 'pending' | 'none';
  role?: CommunityRole;
  isFeatured?: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likeCount: number;
  createdAt: string;
  hasReacted?: boolean;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  communityName?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  isVerified?: boolean;
  communityRole?: CommunityRole;
  type: CommunityPostType;
  content: string;
  mediaUrl?: string;
  likeCount: number;
  reactionType?: string;
  commentCount: number;
  hasReacted?: boolean;
  isPinned?: boolean;
  createdAt: string;
  comments?: CommunityComment[];
}

export interface CommunityMembership {
  id: string;
  communityId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: CommunityRole;
  status: 'active' | 'pending' | 'banned';
  joinedAt: string;
}

export interface CommunityChallenge {
  id: string;
  communityId?: string;
  title: string;
  description: string;
  participantsCount: number;
  userProgress: string;
  isJoined: boolean;
  reward: string;
  daysTotal: number;
  daysCompleted: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalAnalysisDays: number;
  weeklyActiveDays: number;
  lastActiveDate: string | null;
  milestones: number[];
  weeklyDaysStatus?: { dayName: string; status: 'completed' | 'current' | 'upcoming' | 'missed' }[];
}

export interface StreakShareData {
  streak: number;
  milestone?: number;
  displayName?: string;
  showName: boolean;
  showProfilePhoto: boolean;
  message: string;
  shareUrl: string;
}

export type AssessmentCategoryKey = 
  | 'student' 
  | 'teacher' 
  | 'athlete' 
  | 'interview' 
  | 'communication' 
  | 'personality' 
  | 'leadership' 
  | 'presentation';

export interface AttributeScore {
  name: string;
  score: number; // 0-100
  status: 'optimal' | 'good' | 'review' | 'critical';
  observedValue: string;
  expertAnalysis: string;
  confidence?: number;
  criticalFault?: boolean;
  observedEvidence?: string;
  technicalAnalysis?: string;
  coachingRecommendation?: string;
}

export interface AssessmentReport {
  id: string;
  title: string;
  categoryKey: AssessmentCategoryKey;
  categoryName: string;
  date: string;
  duration: string;
  overallScore: number;
  scoreBand: 'good' | 'warn' | 'bad';
  summary: string;
  attributes: AttributeScore[];
  timelineEvents: { timestamp: string; title: string; description: string; type: 'positive' | 'neutral' | 'improvement' }[];
  strengths: string[];
  improvements: string[];
  actionPlan: string[];
  aiInsight: string;
  videoFileName?: string;
}

export interface CategoryInfo {
  key: AssessmentCategoryKey;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  accentColor: string;
  recommendedDuration: string;
  metricsCount: number;
}

export interface ShowcaseSlide {
  id: string;
  categoryKey: AssessmentCategoryKey;
  categoryName: string;
  overallScore: number;
  scoreBand: 'good' | 'warn' | 'bad';
  description: string;
  attributes: { name: string; score: number }[];
  insight: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  roleType?: 'admin' | 'user';
  avatarUrl: string;
  theme: 'dark' | 'light';
  notifications: {
    emailAlerts: boolean;
    reportReady: boolean;
    weeklyDigest: boolean;
  };
}

export interface SubscriptionPlan {
  id: string;
  track: 'individual' | 'professional';
  name: string;
  price: number;
  priceLabel: string;
  annualPrice?: number;
  annualPriceLabel?: string;
  monthlyAnchorPriceLabel?: string;
  badge?: string;
  isPreferred?: boolean;
  description: string;
  features: string[];
  credits: string;
  storage: string;
  bestFor: string;
  goal: string;
  cta: string;
  annualCta?: string;
  modalTagline?: string;
  analysisDetail?: string;
  reportsDetail?: string;
  watermarkDetail?: string;
  rosterDetail?: string;
  managementDetail?: string;
  communicationDetail?: string;
  coachesDetail?: string;
}

export interface ReferralReward {
  type: 'athlete' | 'coach' | 'athlete-to-coach';
  title: string;
  description: string;
  reward: string;
  qualification: string;
}

export interface ReferralStats {
  referralCode: string;
  successfulReferrals: number;
  creditsEarned: number;
  walletCredits: number;
  pendingRewards: number;
}

