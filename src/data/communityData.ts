import { Community, CommunityPost, CommunityChallenge, CommunityMembership } from '../types';

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-1',
    name: 'Running Performance & Sprint Tech',
    description: 'A community for runners, sprinters, and endurance athletes to discuss posture, cadence, speed mechanics, and AI biomechanical feedback.',
    category: 'athlete',
    sport: 'Running',
    type: 'public',
    ownerId: 'user-coach-mike',
    ownerName: 'Coach Mike Ross',
    memberCount: 1240,
    postCount: 184,
    rules: 'Be respectful, focus on performance feedback, keep discussions constructive and science-backed.',
    createdAt: '2026-01-15',
    isJoined: true,
    joinStatus: 'active',
    role: 'member',
    isFeatured: true
  },
  {
    id: 'comm-2',
    name: 'Basketball Skills & Agility Hub',
    description: 'Refine shooting mechanics, defensive footwork, vertical jump form, and court decision-making with multi-angle video analysis.',
    category: 'athlete',
    sport: 'Basketball',
    type: 'public',
    ownerId: 'user-draymond',
    ownerName: 'Coach Draymond K.',
    memberCount: 845,
    postCount: 128,
    rules: 'Share video drills, celebrate team milestones, no disrespectful language.',
    createdAt: '2026-02-01',
    isJoined: true,
    joinStatus: 'active',
    role: 'member',
    isFeatured: true
  },
  {
    id: 'comm-3',
    name: 'Academic Defense & Public Speaking',
    description: 'Master viva voce, thesis defenses, presentation body language, vocal modulation, and executive presence.',
    category: 'student',
    sport: 'Public Speaking',
    type: 'public',
    ownerId: 'user-[var(--accent-1)]-prof',
    ownerName: 'Prof. Elena Rostova',
    memberCount: 960,
    postCount: 142,
    rules: 'Provide actionable presentation critique, respect peer practice recordings.',
    createdAt: '2026-02-10',
    isJoined: false,
    joinStatus: 'none',
    isFeatured: true
  },
  {
    id: 'comm-4',
    name: 'Coaching Strategies & Methodology',
    description: 'An elite space for head coaches, biomechanics analysts, and trainers to share periodization models and squad evaluation methods.',
    category: 'coach',
    sport: 'General Sports',
    type: 'private',
    ownerId: 'user-head-coach-alex',
    ownerName: 'Alex Thorne (Academy Director)',
    memberCount: 610,
    postCount: 95,
    rules: 'Verified coaches only. Keep academy strategies confidential, promote peer mentorship.',
    createdAt: '2026-01-20',
    isJoined: false,
    joinStatus: 'none',
    isFeatured: true
  },
  {
    id: 'comm-5',
    name: 'ClipTrixAI Sports Tech & AI',
    description: 'Official group for sports scientists, engineers, and AI enthusiasts discussing computer vision and performance telemetry.',
    category: 'general',
    sport: 'AI & Sports',
    type: 'public',
    ownerId: 'user-cliptrix-team',
    ownerName: 'ClipTrix Technical Team',
    memberCount: 1420,
    postCount: 210,
    rules: 'No spam, keep tech suggestions constructive, report bugs through official support.',
    createdAt: '2026-01-05',
    isJoined: true,
    joinStatus: 'active',
    role: 'member',
    isFeatured: true
  },
  {
    id: 'comm-6',
    name: 'Strength & Conditioning Lab',
    description: 'Barbell velocity tracking, plyometric landing mechanics, recovery protocols, and lifting technique optimization.',
    category: 'athlete',
    sport: 'Strength & Conditioning',
    type: 'public',
    ownerId: 'user-sarah-sc',
    ownerName: 'Sarah Jenkins, CSCS',
    memberCount: 780,
    postCount: 115,
    rules: 'Form safety first. Always cite physical therapy guidelines when offering biomechanical advice.',
    createdAt: '2026-02-15',
    isJoined: false,
    joinStatus: 'none',
    isFeatured: false
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    communityId: 'comm-1',
    communityName: 'Running Performance & Sprint Tech',
    authorId: 'user-arvind-m',
    authorName: 'Arvind Maurya',
    authorRole: 'Sprint Athlete',
    isVerified: true,
    communityRole: 'member',
    type: 'question',
    content: 'What specific drills are helping you improve your stride frequency during the acceleration phase (0-20m)? ClipTrix AI flagged my ground contact time as 0.14s - looking to drop it under 0.12s.',
    likeCount: 34,
    reactionType: '🔥',
    commentCount: 12,
    hasReacted: false,
    isPinned: true,
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'user-coach-mike',
        authorName: 'Coach Mike Ross',
        content: 'Focus on sled pushes at 30% bodyweight to reinforce toe-off angle. Keep posture stacked!',
        likeCount: 8,
        createdAt: '1 hour ago'
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorId: 'user-[var(--accent-1)]-prof',
        authorName: 'David K.',
        content: 'B-skips over low hurdles helped me align hips properly before ground impact.',
        likeCount: 5,
        createdAt: '45 mins ago'
      }
    ]
  },
  {
    id: 'post-2',
    communityId: 'comm-1',
    communityName: 'Running Performance & Sprint Tech',
    authorId: 'user-cliptrix-bot',
    authorName: 'ClipTrix Milestone Bot',
    authorRole: 'System',
    isVerified: true,
    communityRole: 'owner',
    type: 'achievement',
    content: '🔥 Arvind Maurya completed a 7-day AI Analysis Streak! Consistent tracking leads to noticeable biomechanical improvements.',
    likeCount: 58,
    reactionType: '👏',
    commentCount: 4,
    hasReacted: true,
    createdAt: '5 hours ago',
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorId: 'user-sarah-sc',
        authorName: 'Sarah Jenkins',
        content: 'Incredible consistency! Keep pushing those daily assessments.',
        likeCount: 6,
        createdAt: '3 hours ago'
      }
    ]
  },
  {
    id: 'post-3',
    communityId: 'comm-2',
    communityName: 'Basketball Skills & Agility Hub',
    authorId: 'user-marcus-b',
    authorName: 'Marcus Vance',
    authorRole: 'Point Guard',
    isVerified: false,
    communityRole: 'member',
    type: 'tip',
    content: 'TIP: When analyzing your jump shot elbow alignment on ClipTrix AI, record at 60fps from a 45-degree angle. It gives the pose estimation model the best depth resolution!',
    likeCount: 42,
    reactionType: '💪',
    commentCount: 6,
    hasReacted: false,
    createdAt: '1 day ago',
    comments: []
  },
  {
    id: 'post-4',
    communityId: 'comm-3',
    communityName: 'Academic Defense & Public Speaking',
    authorId: 'user-priya-s',
    authorName: 'Priya Sharma',
    authorRole: 'PhD Candidate',
    isVerified: true,
    communityRole: 'member',
    type: 'discussion',
    content: 'Just used ClipTrix AI vocal modulation and eye contact tracking for my thesis defense rehearsal. Raised my clarity index from 72% to 91%! Here are 3 habits that made the difference...',
    likeCount: 89,
    reactionType: '❤️',
    commentCount: 15,
    hasReacted: true,
    createdAt: '2 days ago',
    comments: []
  }
];

export const INITIAL_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'chal-1',
    communityId: 'comm-1',
    title: '7-Day Analysis Challenge',
    description: 'Complete at least one qualifying AI video analysis every day for 7 consecutive days to build a rock-solid habit.',
    participantsCount: 184,
    userProgress: '5 / 7 Days Completed',
    isJoined: true,
    reward: '🔥 7-Day Consistency Badge + 5 Bonus AI Credits',
    daysTotal: 7,
    daysCompleted: 5
  },
  {
    id: 'chal-2',
    communityId: 'comm-[var(--accent-1)]',
    title: '30-Day Performance Consistency Challenge',
    description: 'Maintain a 30-day performance tracking streak. Log movement biomechanics, public speaking practice, or athletic drills.',
    participantsCount: 312,
    userProgress: '12 / 30 Days Completed',
    isJoined: true,
    reward: '🏆 Monthly Master Badge + 25 Bonus AI Credits',
    daysTotal: 30,
    daysCompleted: 12
  },
  {
    id: 'chal-3',
    communityId: 'comm-1',
    title: 'Sprint Cadence & Form Challenge',
    description: 'Analyze 3 sprint sessions this week and optimize ground contact time under 0.15 seconds.',
    participantsCount: 96,
    userProgress: '1 / 3 Sessions Completed',
    isJoined: false,
    reward: '⚡ Sprint Specialist Badge',
    daysTotal: 3,
    daysCompleted: 1
  }
];

export const INITIAL_MEMBERSHIPS: CommunityMembership[] = [
  {
    id: 'm-1',
    communityId: 'comm-1',
    userId: 'user-coach-mike',
    userName: 'Coach Mike Ross',
    role: 'owner',
    status: 'active',
    joinedAt: '2026-01-15'
  },
  {
    id: 'm-2',
    communityId: 'comm-1',
    userId: 'user-arvind-m',
    userName: 'Arvind Maurya',
    role: 'member',
    status: 'active',
    joinedAt: '2026-02-01'
  },
  {
    id: 'm-3',
    communityId: 'comm-1',
    userId: 'user-sarah-sc',
    userName: 'Sarah Jenkins',
    role: 'moderator',
    status: 'active',
    joinedAt: '2026-01-18'
  }
];
