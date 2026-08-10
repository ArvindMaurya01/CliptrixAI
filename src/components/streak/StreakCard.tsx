import React, { useState } from 'react';
import { 
  Flame, CheckCircle2, Award, Calendar, Share2, Sparkles, 
  ArrowRight, PlusCircle, RotateCcw, Lock, Check, Zap, Info
} from 'lucide-react';
import { StreakData, UserProfile, ViewState } from '../../types';
import { ShareStreakModal } from './ShareStreakModal';

interface StreakCardProps {
  streakData?: StreakData;
  onStartAnalysis?: () => void;
  onNavigate?: (view: ViewState) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
  user?: UserProfile | null;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streakData,
  onStartAnalysis,
  onNavigate,
  showToast,
  user
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  // Default values strictly set to 0 until backend integration as requested
  const currentStreak = streakData?.currentStreak ?? 0;
  const longestStreak = streakData?.longestStreak ?? 0;
  const weeklyActiveDays = streakData?.weeklyActiveDays ?? 0;
  const totalAnalysisDays = streakData?.totalAnalysisDays ?? 0;
  const lastActiveDate = streakData?.lastActiveDate ?? null;

  // Milestone list definitions
  const milestonesList = [
    { days: 3, label: 'Getting Started' },
    { days: 7, label: 'One Week Strong' },
    { days: 14, label: 'Two Week Champion' },
    { days: 30, label: 'Monthly Consistency' },
    { days: 60, label: 'Dedicated Performer' },
    { days: 100, label: 'Elite Consistency' },
  ];

  // Default weekly calendar days (Mon - Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Custom or calculated weekly status
  const defaultWeeklyStatus = streakData?.weeklyDaysStatus || daysOfWeek.map((day, idx) => {
    // If currentStreak > 0, mock or compute safe indicator
    if (currentStreak > 0 && idx < weeklyActiveDays) {
      return { dayName: day, status: idx === weeklyActiveDays - 1 ? 'current' : 'completed' };
    }
    return { dayName: day, status: 'upcoming' };
  });

  // Calculate if streak is broken (e.g. longest > current and current === 0)
  const isBrokenStreak = longestStreak > 0 && currentStreak === 0;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] space-y-6 relative overflow-hidden gradient-border-card">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-1)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-glass)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[var(--text)] tracking-tight">
              Your Analysis Streak
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Build habit & consistency with qualifying AI video assessments.
            </p>
          </div>
        </div>

        {currentStreak > 0 && (
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span>Share My Streak</span>
          </button>
        )}
      </div>

      {/* MAIN DISPLAY LOGIC: EMPTY / BROKEN / ACTIVE STREAK */}
      {currentStreak === 0 && !isBrokenStreak ? (
        /* EMPTY STATE FOR NEW USER */
        <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Flame className="w-7 h-7 fill-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[var(--text)]">
              🔥 Start Your Streak
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
              Complete your first AI analysis to start building your ClipTrixAI streak. One qualifying video per day keeps your streak growing!
            </p>
          </div>
          <button
            onClick={() => {
              if (onStartAnalysis) onStartAnalysis();
              else if (onNavigate) onNavigate('new-assessment');
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start Analysis</span>
          </button>
        </div>
      ) : isBrokenStreak ? (
        /* BROKEN STREAK STATE */
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[var(--text)]">
              Your streak ended at {longestStreak} days
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Don't worry — every streak starts again. 🔥 Start a new streak today with a quick assessment!
            </p>
          </div>
          <button
            onClick={() => {
              if (onStartAnalysis) onStartAnalysis();
              else if (onNavigate) onNavigate('new-assessment');
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Analyze Now</span>
          </button>
        </div>
      ) : (
        /* ACTIVE STREAK HERO DISPLAY */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-gradient-to-r from-[var(--bg-elevated)] via-[var(--bg-elevated-solid)] to-[var(--bg-elevated)] border border-[var(--border-glass)]">
          <div className="md:col-span-5 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ACTIVE HABIT</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-[var(--text)] font-mono tracking-tight">
              🔥 {currentStreak} <span className="text-2xl text-amber-400 font-extrabold">DAYS</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Keep analyzing to maintain your streak!
            </p>
          </div>

          {/* Weekly Calendar Grid */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[var(--text-muted)]">
              <span>THIS WEEK</span>
              <span>{weeklyActiveDays} / 7 DAYS</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {defaultWeeklyStatus.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    item.status === 'completed'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : item.status === 'current'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-md animate-pulse'
                      : 'bg-[var(--bg-elevated)] border-[var(--border-glass)] text-[var(--text-muted)]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase">{item.dayName}</span>
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : item.status === 'current' ? (
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-[var(--text-muted)]/40 inline-block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4 STREAK STATISTICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
            Current Streak
          </span>
          <span className="text-2xl font-black mono-nums text-[var(--text)] block">
            {currentStreak} <span className="text-xs font-normal text-[var(--text-muted)]">Days</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 block">
            Longest Streak
          </span>
          <span className="text-2xl font-black mono-nums text-[var(--text)] block">
            {longestStreak} <span className="text-xs font-normal text-[var(--text-muted)]">Days</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">
            This Week
          </span>
          <span className="text-2xl font-black mono-nums text-[var(--text)] block">
            {weeklyActiveDays} / 7 <span className="text-xs font-normal text-[var(--text-muted)]">Days</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block">
            Total Analysis Days
          </span>
          <span className="text-2xl font-black mono-nums text-[var(--text)] block">
            {totalAnalysisDays} <span className="text-xs font-normal text-[var(--text-muted)]">Days</span>
          </span>
        </div>
      </div>

      {/* STREAK MILESTONES BADGES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
            Streak Milestones
          </span>
          <span className="text-[10px] text-[var(--text-faint)] font-mono">
            Backend Verified Badges
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {milestonesList.map((m) => {
            const isUnlocked = currentStreak >= m.days || longestStreak >= m.days;
            return (
              <div
                key={m.days}
                className={`p-3 rounded-2xl border text-center space-y-1.5 transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/15 border-amber-500/40 text-[var(--text)] shadow-sm'
                    : 'bg-[var(--bg-elevated)]/50 border-[var(--border-glass)] text-[var(--text-muted)] opacity-60'
                }`}
              >
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 mx-auto">
                  {isUnlocked ? <Award className="w-4 h-4 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-gray-500" />}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-black font-mono">🔥 {m.days} Days</div>
                  <div className="text-[10px] text-[var(--text-faint)] truncate" title={m.label}>
                    {m.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STREAK → REFERRAL & SUBSCRIPTION CONNECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-glass)]">
        {/* Referral Connection */}
        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-[var(--text)]">
              Invite friends to join your journey
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Earn bonus AI credits when teammates start analyzing.
            </p>
          </div>
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('referral');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-[var(--accent-1)] text-white font-bold text-xs hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            Refer & Earn
          </button>
        </div>

        {/* Subscription CTA if habit built */}
        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-[var(--text)]">
              Want deeper performance insights?
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Unlock unlimited AI assessments with Pro Athlete.
            </p>
          </div>
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-[var(--accent-2)] text-white font-bold text-xs hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            Explore Pro
          </button>
        </div>
      </div>

      {/* SHARE STREAK MODAL */}
      <ShareStreakModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        streak={currentStreak}
        milestone={currentStreak >= 7 ? 7 : undefined}
        user={user}
        onNavigate={onNavigate}
        showToast={showToast}
      />
    </div>
  );
};
