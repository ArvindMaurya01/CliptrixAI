import React, { useState } from 'react';
import { ViewState, UserProfile } from '../types';
import { Sun, Moon, User, Menu, X, LogOut, LayoutDashboard, Shield, Settings as SettingsIcon, Search, Users } from 'lucide-react';
import { CliptrixLogo } from './CliptrixLogo';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: UserProfile | null;
  onToggleTheme: () => void;
  onSignOut: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  user,
  onToggleTheme,
  onSignOut,
  searchQuery = '',
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onSearchChange) {
      onSearchChange(val);
    }
    if (currentView !== 'dashboard' && user) {
      onNavigate('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border-glass)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => {
            if (!user) {
              onNavigate('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              onNavigate('dashboard');
            }
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <CliptrixLogo showText={true} className="w-9 h-9 group-hover:scale-105 transition-transform" />
        </div>

        {/* Search Bar & Community Link */}
        <div className="hidden md:flex flex-1 items-center gap-3 max-w-lg mx-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Search reports, videos, or categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white font-semibold placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[var(--accent-1)] focus:ring-2 focus:ring-[var(--accent-1)]/30 transition-all shadow-md"
            />
          </div>

          <button
            onClick={() => onNavigate('community')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
              currentView === 'community' || currentView === 'community-detail'
                ? 'bg-[var(--accent-1)] text-white shadow-md'
                : 'bg-neutral-200/80 dark:bg-neutral-800/80 text-[var(--text)] hover:bg-[var(--border-glass)] border border-neutral-300/40 dark:border-neutral-700/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Community</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Toggle Capsule */}
          <div className="flex items-center p-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 border border-neutral-300/40 dark:border-neutral-700/40 shadow-sm">
            <button
              onClick={() => {
                const isLight = user ? user.theme === 'light' : document.documentElement.getAttribute('data-theme') === 'light';
                if (!isLight) {
                  onToggleTheme();
                }
              }}
              aria-label="Light Mode"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                (user ? user.theme === 'light' : document.documentElement.getAttribute('data-theme') === 'light')
                  ? 'bg-white text-neutral-900 shadow-md scale-105 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              onClick={() => {
                const isLight = user ? user.theme === 'light' : document.documentElement.getAttribute('data-theme') === 'light';
                if (isLight) {
                  onToggleTheme();
                }
              }}
              aria-label="Dark Mode"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                !(user ? user.theme === 'light' : document.documentElement.getAttribute('data-theme') === 'light')
                  ? 'bg-neutral-900 text-white dark:bg-neutral-800 shadow-md scale-105 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>

          {user ? (
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-[var(--border-glass)]">
              <div 
                onClick={() => onNavigate('settings')}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-3)] flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[var(--text)] leading-tight">{user.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)] capitalize">{user.role}</p>
                </div>
              </div>

              <button
                onClick={onSignOut}
                aria-label="Sign out"
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-bad)] hover:bg-[var(--accent-bad)]/10 transition-colors ml-2"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onNavigate('contact')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'contact'
                    ? 'bg-[var(--accent-1)]/15 text-[var(--accent-1)] border border-[var(--accent-1)]/30 font-bold'
                    : 'text-[var(--text)] hover:bg-[var(--border-glass)]'
                }`}
              >
                Contact us
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-90 transition-all shadow-md cursor-pointer border border-white/10"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[var(--text)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-[var(--border-glass)] p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="relative w-full mb-3">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white font-semibold placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[var(--accent-1)] focus:ring-2 focus:ring-[var(--accent-1)]/30 shadow-md"
            />
          </div>

          <button 
            onClick={() => { 
              onNavigate('community'); 
              setMobileMenuOpen(false); 
            }} 
            className="w-full text-left py-2 px-3 rounded-xl bg-[var(--accent-1)]/15 text-[var(--accent-1)] text-xs font-bold shadow-sm flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Community
          </button>

          {!user && (
            <div className="flex flex-col space-y-3 text-sm font-medium">
              <button 
                onClick={() => { 
                  onNavigate('contact'); 
                  setMobileMenuOpen(false); 
                }} 
                className="w-full text-left py-2 px-3 rounded-xl bg-[var(--border-glass)] text-[var(--text)] text-xs font-bold shadow-sm"
              >
                Contact us
              </button>
              <button 
                onClick={() => { 
                  onNavigate('auth'); 
                  setMobileMenuOpen(false); 
                }} 
                className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] shadow-md"
              >
                Sign In
              </button>
            </div>
          )}

          {user && (
            <div className="flex flex-col space-y-2 pt-2 border-t border-[var(--border-glass)]">
              <button 
                onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 py-2 text-sm text-[var(--text)] font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-[var(--accent-1)]" /> Dashboard
              </button>
              <button 
                onClick={() => { onNavigate('settings'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 py-2 text-sm text-[var(--text)] font-medium"
              >
                <SettingsIcon className="w-4 h-4 text-[var(--accent-2)]" /> Settings
              </button>
              <button 
                onClick={() => { onSignOut(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 py-2 text-sm text-[var(--accent-bad)] font-medium pt-2 border-t border-[var(--border-glass)]"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
