import React from 'react';
import { Flame, Award, Sparkles, Share2, ArrowRight, X } from 'lucide-react';

interface StreakCelebrationProps {
  isOpen: boolean;
  streak: number;
  milestoneTitle?: string;
  onClose: () => void;
  onShare: () => void;
}

export const StreakCelebration: React.FC<StreakCelebrationProps> = ({
  isOpen,
  streak,
  milestoneTitle,
  onClose,
  onShare
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md view-enter">
      <div className="relative w-full max-w-md glass-panel p-8 rounded-3xl border-2 border-amber-500/50 shadow-2xl text-center space-y-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--accent-1)]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-amber-600/25 border-2 border-amber-400/50 shadow-lg mx-auto">
            <Flame className="w-12 h-12 text-amber-400 fill-amber-400 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>STREAK MILESTONE ACHIEVED</span>
          </div>

          <h2 className="text-3xl font-black text-[var(--text)] tracking-tight">
            🔥 AMAZING!
          </h2>

          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 font-mono">
            {streak} DAY STREAK
          </div>

          {milestoneTitle && (
            <p className="text-xs font-bold text-cyan-300 uppercase font-mono tracking-wider">
              "{milestoneTitle}" Badge Unlocked
            </p>
          )}

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
            You've completed AI video analysis for <strong className="text-[var(--text)]">{streak} consecutive days</strong>. Keep the momentum going!
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onShare();
            }}
            className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent-1)]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-300" />
            <span>Share My Streak</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] glass-panel hover:bg-[var(--border-glass)] transition-colors cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
