import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, FileText, Settings as SettingsIcon, Sparkles, PlusCircle, Gift, Flame, Activity, ShieldCheck, ChevronRight, Users } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { key: 'dashboard' as ViewState, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'community' as ViewState, label: 'Community', icon: Users },
    { key: 'new-assessment' as ViewState, label: 'New Assessment', icon: PlusCircle, highlight: true },
    { key: 'report' as ViewState, label: 'Sample Report', icon: FileText },
    { key: 'referral' as ViewState, label: 'Refer & Earn', icon: Gift },
    { key: 'settings' as ViewState, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-[240px] shrink-0 hidden md:flex flex-col justify-between sticky top-20 h-[calc(100vh-5.5rem)] p-4 rounded-3xl glass-panel border border-[var(--border-glass)] bg-gradient-to-b from-[var(--bg-elevated)] via-[var(--bg-elevated-solid)] to-[var(--bg-elevated)] shadow-2xl relative overflow-hidden backdrop-blur-xl group">
      {/* Subtle Futuristic Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--accent-1)]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-36 h-36 bg-[var(--accent-2)]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-1)]/50 to-transparent" />

      <div className="space-y-5 relative z-10">
        {/* System Telemetry Header Status */}
        <div className="px-3 py-2 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block -ml-3.5" />
            <span className="uppercase tracking-widest text-[9px]">AI CORE ONLINE</span>
          </div>
          <span className="text-[var(--text-faint)] font-semibold">99.9%</span>
        </div>

        {/* Quick Start CTA Card */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[var(--accent-1)]/15 via-indigo-900/20 to-[var(--accent-2)]/15 border border-[var(--accent-1)]/30 text-center space-y-2.5 overflow-hidden group/cta hover:border-[var(--accent-1)]/60 transition-all shadow-lg">
          <div className="absolute -right-3 -top-3 w-12 h-12 bg-[var(--accent-1)]/20 rounded-full blur-md pointer-events-none" />
          
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-1)] animate-pulse" />
            <span>AI Assessment</span>
          </div>

          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-[var(--text)] tracking-tight">Ready to Assess?</h4>
            <p className="text-[10px] text-[var(--text-muted)] leading-tight">Instant multi-modal motion & form tracking.</p>
          </div>

          <button
            onClick={() => onNavigate('new-assessment')}
            className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:shadow-lg hover:shadow-[var(--accent-1)]/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start Assessment</span>
          </button>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-faint)]">
            Navigation Console
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group/btn cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--accent-1)]/20 via-indigo-500/10 to-transparent text-[var(--text)] border border-[var(--accent-1)]/40 shadow-md backdrop-blur-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {/* Left Active Glow Pill */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-[var(--accent-1)] to-[var(--accent-2)] shadow-[0_0_10px_var(--accent-1)]" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover/btn:scale-110 ${isActive ? 'text-[var(--accent-1)] drop-shadow-[0_0_8px_rgba(110,123,255,0.6)]' : 'text-[var(--text-muted)]'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>

                  {isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--accent-1)]" />
                  ) : item.highlight ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400/80 animate-ping" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & Enterprise Security */}
      <div className="pt-3 border-t border-[var(--border-glass)] space-y-2 relative z-10">
        <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[9px] uppercase font-bold text-[var(--text)]">ENT SECURE</span>
          </div>
          <span className="font-mono text-[9px] text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">v3.4</span>
        </div>

        <div className="text-center">
          <p className="text-[9px] font-mono text-[var(--text-faint)] tracking-wider uppercase">ClipTrix Neural Engine</p>
        </div>
      </div>
    </aside>
  );
};

