import React from 'react';
import { Flame, Sparkles, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StreakShareData } from '../../types';

interface StreakShareCardProps {
  shareData: StreakShareData;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export const StreakShareCard: React.FC<StreakShareCardProps> = ({ shareData, cardRef }) => {
  const { streak, milestone, displayName, showName, showProfilePhoto, shareUrl } = shareData;

  const milestoneTitle = milestone === 3 ? "Getting Started"
    : milestone === 7 ? "One Week Strong"
    : milestone === 14 ? "Two Week Champion"
    : milestone === 30 ? "Monthly Consistency"
    : milestone === 60 ? "Dedicated Performer"
    : milestone === 100 ? "Elite Consistency"
    : null;

  return (
    <div 
      ref={cardRef}
      className="relative w-full max-w-sm mx-auto overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#0c1020] via-[#12182d] to-[#0d1222] border-2 border-[var(--accent-1)]/50 text-white shadow-2xl space-y-5"
      id="cliptrix-streak-share-card"
    >
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-1)]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--accent-1)] via-indigo-500 to-[var(--accent-2)] flex items-center justify-center font-black text-white text-sm shadow-md">
            CT
          </div>
          <div>
            <span className="text-sm font-black tracking-tight block leading-none text-white">
              ClipTrix<span className="text-[var(--accent-1)]">AI</span>
            </span>
            <span className="text-[9px] font-mono text-cyan-300/80 uppercase tracking-widest block mt-0.5">
              AI Video Assessment
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>STREAK VERIFIED</span>
        </span>
      </div>

      {/* Main Streak Counter */}
      <div className="text-center py-2 space-y-2 relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-red-500/20 border-2 border-amber-400/40 shadow-inner mx-auto relative group">
          <Flame className="w-12 h-12 text-amber-400 fill-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse" />
        </div>

        <div className="space-y-0.5">
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono drop-shadow-md">
            {streak} <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">DAYS</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">
            Consecutive AI Analysis Streak
          </p>
        </div>

        {milestoneTitle && (
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-cyan-300 border border-cyan-400/30">
              <Award className="w-3.5 h-3.5 text-cyan-300" />
              <span>{milestoneTitle} Milestone</span>
            </span>
          </div>
        )}
      </div>

      {/* Motivational Tagline */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-indigo-100 font-medium leading-relaxed relative z-10">
        "I've analyzed my performance for <strong className="text-amber-300">{streak} consecutive days</strong> on ClipTrixAI. Staying consistent and improving every day!"
      </div>

      {/* User Info (Privacy Guarded) */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 relative z-10 text-xs text-indigo-200">
        <div className="flex items-center gap-2">
          {showProfilePhoto ? (
            <div className="w-7 h-7 rounded-full bg-[var(--accent-1)]/30 border border-[var(--accent-1)]/50 flex items-center justify-center font-bold text-xs text-white">
              {displayName ? displayName.slice(0, 1).toUpperCase() : 'U'}
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
          <span className="font-semibold text-white">
            {showName && displayName ? displayName : 'ClipTrixAI User'}
          </span>
        </div>

        <span className="text-[10px] font-mono text-cyan-300/80 font-bold">
          cliptrixai.com
        </span>
      </div>
    </div>
  );
};
