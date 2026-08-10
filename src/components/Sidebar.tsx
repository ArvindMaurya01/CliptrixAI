import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, FileText, Settings as SettingsIcon, Sparkles, PlusCircle, Gift } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { key: 'dashboard' as ViewState, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'new-assessment' as ViewState, label: 'New Assessment', icon: PlusCircle, highlight: true },
    { key: 'report' as ViewState, label: 'Sample Report', icon: FileText },
    { key: 'referral' as ViewState, label: 'Refer & Earn', icon: Gift },
    { key: 'settings' as ViewState, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-[232px] shrink-0 hidden md:block sticky top-20 h-[calc(100vh-5rem)] p-4 glass-panel flex flex-col justify-between">
      <div className="space-y-6">
        {/* Quick Start CTA */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--accent-1)]/10 to-[var(--accent-2)]/10 border border-[var(--accent-1)]/30 text-center">
          <Sparkles className="w-5 h-5 text-[var(--accent-1)] mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-[var(--text)]">Ready to Assess?</h4>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Upload a video or record live.</p>
          <button
            onClick={() => onNavigate('new-assessment')}
            className="mt-3 w-full py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 active:scale-95 transition-all shadow-md shadow-[var(--accent-1)]/20"
          >
            Start Assessment
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--accent-1)]/20 to-[var(--accent-2)]/20 text-[var(--text)] border border-[var(--accent-1)]/40 shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-glass)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent-1)]' : 'text-[var(--text-muted)]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-[var(--border-glass)] text-center">
        <p className="text-[10px] font-mono text-[var(--text-faint)]">ClipTrix AI v3.4 Aurora</p>
        <p className="text-[9px] text-[var(--text-muted)] mt-0.5">Enterprise Secure Edition</p>
      </div>
    </aside>
  );
};
