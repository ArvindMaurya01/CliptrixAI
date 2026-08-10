import React from 'react';
import { Flame, Sparkles, ArrowRight, ShieldCheck, Trophy, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ViewState } from '../../types';

interface SharedStreakViewProps {
  streak?: number;
  userName?: string;
  onNavigate?: (view: ViewState) => void;
  onBack?: () => void;
}

export const SharedStreakView: React.FC<SharedStreakViewProps> = ({
  streak = 7,
  userName = 'ClipTrixAI User',
  onNavigate,
  onBack
}) => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-[var(--text)] view-enter">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
        <button
          onClick={() => {
            if (onBack) onBack();
            else if (onNavigate) onNavigate('landing');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs font-semibold hover:border-[var(--accent-1)]/50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--accent-1)]" />
          <span>Back to ClipTrixAI</span>
        </button>

        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
          PUBLIC STREAK ACHIEVEMENT
        </span>
      </div>

      {/* Main Public Hero Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-amber-500/40 text-center space-y-8 relative overflow-hidden shadow-2xl gradient-border-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--accent-1)]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-red-500/25 border-2 border-amber-400/50 shadow-xl mx-auto">
            <Flame className="w-14 h-14 text-amber-400 fill-amber-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-300 block">
              VERIFIED AI ANALYSIS STREAK
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-[var(--text)] tracking-tight font-mono">
              🔥 {streak} DAY STREAK
            </h1>
          </div>

          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
            <strong className="text-[var(--text)]">{userName}</strong> has completed a <span className="text-amber-400 font-bold">{streak}-day</span> ClipTrixAI analysis streak!
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs max-w-2xl mx-auto relative z-10">
          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
            <p className="font-bold text-[var(--text)]">Daily Practice</p>
            <p className="text-[11px] text-[var(--text-muted)]">Consistent video analysis</p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1 text-center">
            <Trophy className="w-5 h-5 text-amber-400 mx-auto" />
            <p className="font-bold text-[var(--text)]">AI Feedback</p>
            <p className="text-[11px] text-[var(--text-muted)]">Multimodal evaluation</p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1 text-center">
            <ShieldCheck className="w-5 h-5 text-[var(--accent-1)] mx-auto" />
            <p className="font-bold text-[var(--text)]">Verified Habit</p>
            <p className="text-[11px] text-[var(--text-muted)]">Server-backed streak</p>
          </div>
        </div>

        {/* Call to Action for Public Viewer */}
        <div className="pt-4 space-y-3 relative z-10">
          <h3 className="text-xl font-bold text-[var(--text)]">
            Ready to build your own analysis streak?
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('new-assessment');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:scale-105 transition-all shadow-xl shadow-[var(--accent-1)]/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Start Your Streak</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (onNavigate) onNavigate('landing');
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl text-xs sm:text-sm font-semibold text-[var(--text)] glass-panel hover:bg-[var(--border-glass)] border border-[var(--border-glass)] transition-colors cursor-pointer"
            >
              Learn More About ClipTrixAI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
