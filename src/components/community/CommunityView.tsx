import React, { useState } from 'react';
import { 
  Users, Plus, Search, Sparkles, Flame, Trophy, Globe, Lock, ArrowRight, 
  MessageSquare, Share2, Shield, Heart, Lightbulb, HelpCircle, Check, Filter, UserCheck, Award
} from 'lucide-react';
import { 
  Community, CommunityCategory, CommunityPost, CommunityChallenge, 
  UserProfile, StreakData 
} from '../../types';
import { CreateCommunityModal } from './CreateCommunityModal';

interface CommunityViewProps {
  communities: Community[];
  posts: CommunityPost[];
  challenges: CommunityChallenge[];
  user: UserProfile | null;
  streakData?: StreakData;
  onSelectCommunity: (communityId: string) => void;
  onToggleJoinCommunity: (communityId: string) => void;
  onCreateCommunity: (communityData: Partial<Community>) => void;
  onNavigate: (view: any) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  communities,
  posts,
  challenges,
  user,
  streakData,
  onSelectCommunity,
  onToggleJoinCommunity,
  onCreateCommunity,
  onNavigate,
  showToast
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Category Tabs
  const categoriesList = [
    { id: 'all', label: 'All Communities' },
    { id: 'athlete', label: 'Athletes' },
    { id: 'student', label: 'Students & Academics' },
    { id: 'coach', label: 'Coaches & Trainers' },
    { id: 'general', label: 'General & AI Tech' },
    { id: 'my-communities', label: 'My Communities' }
  ];

  // Filtered Communities
  const filteredCommunities = communities.filter((c) => {
    if (activeCategory === 'my-communities') {
      return c.isJoined || c.role === 'owner';
    }
    if (activeCategory !== 'all' && c.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.sport && c.sport.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const featuredCommunities = communities.filter((c) => c.isFeatured);
  const myCommunities = communities.filter((c) => c.isJoined || c.role === 'owner');

  return (
    <div className="space-y-10 view-enter pb-16">
      {/* 1. HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-glass)] p-8 sm:p-12 shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-neutral-950 space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-1)]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--accent-2)]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-1)]/25 border border-[var(--accent-1)]/40 text-[var(--accent-2)] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ClipTrixAI Community Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            ClipTrixAI Community
          </h1>

          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
            Connect with athletes, students, coaches, and performance enthusiasts. Learn from others, share your progress, and improve together through AI-backed biomechanical feedback.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:opacity-95 shadow-xl shadow-[var(--accent-1)]/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/10"
            >
              <Plus className="w-4 h-4" />
              <span>Create Community</span>
            </button>

            <a
              href="#explore-communities"
              className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Communities</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORIES BAR */}
      <div id="explore-communities" className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search communities by name, topic, or sport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-all font-medium placeholder:text-[var(--text-faint)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[var(--accent-1)] text-white shadow-md'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-glass)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MY COMMUNITIES SUMMARY (if logged in & joined) */}
      {user && myCommunities.length > 0 && activeCategory === 'all' && !searchQuery && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[var(--text)] tracking-tight flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>My Communities</span>
            </h3>
            <button
              onClick={() => setActiveCategory('my-communities')}
              className="text-xs font-bold text-[var(--accent-1)] hover:underline cursor-pointer"
            >
              View All ({myCommunities.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myCommunities.slice(0, 3).map((comm) => (
              <div
                key={comm.id}
                onClick={() => onSelectCommunity(comm.id)}
                className="p-5 rounded-2xl glass-panel border border-[var(--border-glass)] hover:border-[var(--accent-1)]/50 transition-all cursor-pointer space-y-3 group shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-2)] flex items-center justify-center text-white font-bold text-sm">
                    {comm.name.charAt(0)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    Joined ✓
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-[var(--text)] group-hover:text-[var(--accent-1)] transition-colors line-clamp-1">
                    {comm.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5">
                    {comm.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-faint)] font-mono pt-2 border-t border-[var(--border-glass)]">
                  <span>👥 {comm.memberCount} members</span>
                  <span>💬 {comm.postCount} posts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FEATURED COMMUNITIES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-[var(--text)] tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Featured Communities</span>
          </h3>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {filteredCommunities.length} Available
          </span>
        </div>

        {filteredCommunities.length === 0 ? (
          <div className="p-8 rounded-3xl glass-panel border border-[var(--border-glass)] text-center space-y-3">
            <Users className="w-10 h-10 text-[var(--text-faint)] mx-auto" />
            <h4 className="text-base font-bold text-[var(--text)]">No communities found</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              Try another category or search term, or create your own community.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] cursor-pointer"
            >
              Create Community
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((comm) => (
              <div
                key={comm.id}
                className="p-6 rounded-3xl glass-panel border border-[var(--border-glass)] hover:border-[var(--accent-1)]/40 transition-all space-y-4 shadow-lg flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Category & Access Pill */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--accent-1)]/15 text-[var(--accent-1)] border border-[var(--accent-1)]/30">
                      {comm.category}
                    </span>
                    {comm.type === 'public' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Public
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-2)] flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                      {comm.name.charAt(0)}
                    </div>
                    <div>
                      <h4
                        onClick={() => onSelectCommunity(comm.id)}
                        className="text-base font-extrabold text-[var(--text)] group-hover:text-[var(--accent-1)] transition-colors cursor-pointer line-clamp-1"
                      >
                        {comm.name}
                      </h4>
                      {comm.sport && (
                        <p className="text-[11px] text-[var(--text-faint)] font-mono">
                          Topic: {comm.sport}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {comm.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--border-glass)]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[var(--accent-1)]" />
                      <span>{comm.memberCount} members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{comm.postCount} posts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCommunity(comm.id)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[var(--text)] bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] border border-[var(--border-glass)] transition-all cursor-pointer text-center"
                    >
                      View Group
                    </button>

                    <button
                      onClick={() => onToggleJoinCommunity(comm.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        comm.isJoined
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white border-transparent hover:opacity-90 shadow-md'
                      }`}
                    >
                      {comm.isJoined ? 'Joined ✓' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. COMMUNITY CHALLENGES & STREAKS CONNECTION */}
      <div className="p-8 rounded-3xl glass-panel border border-[var(--border-glass)] bg-gradient-to-br from-slate-900 via-indigo-950 to-neutral-950 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Community Challenges</span>
            </div>
            <h3 className="text-xl font-black text-white">
              Practice Together, Build Your Streak
            </h3>
            <p className="text-xs text-slate-100 max-w-2xl font-medium">
              Complete community challenges to level up your AI analysis streak, earn badges, and share your milestones.
            </p>
          </div>

          {streakData && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-center font-mono">
              <span className="text-xl font-black text-amber-300">{streakData.currentStreak} 🔥</span>
              <p className="text-[10px] text-amber-100 font-semibold">Current Streak</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((chal) => (
            <div key={chal.id} className="p-5 rounded-2xl bg-slate-900/80 border border-white/15 space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-extrabold text-white">{chal.title}</h4>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/25 text-amber-200 border border-amber-500/40">
                  {chal.participantsCount} Joined
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-normal">{chal.description}</p>
              
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-amber-300 font-mono text-[11px] font-semibold">{chal.reward}</span>
                <button
                  onClick={() => onNavigate('new-assessment')}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white bg-[var(--accent-1)] hover:opacity-90 cursor-pointer"
                >
                  Participate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. REFERRAL PROGRAM INTEGRATION */}
      <div className="p-6 rounded-3xl glass-panel border border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-extrabold text-[var(--text)]">Invite your teammates to ClipTrixAI</h4>
          <p className="text-xs text-[var(--text-muted)] max-w-xl">
            Build your team community and earn bonus AI credits when teammates sign up using your referral code.
          </p>
        </div>

        <button
          onClick={() => onNavigate('referral')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Refer & Earn Credits</span>
        </button>
      </div>

      {/* Create Community Modal */}
      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCommunity={onCreateCommunity}
        showToast={showToast}
      />
    </div>
  );
};
