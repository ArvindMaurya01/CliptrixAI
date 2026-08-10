import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Shield, Bell, Moon, Sun, Save } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser, onShowToast }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [emailAlerts, setEmailAlerts] = useState(user.notifications.emailAlerts);
  const [reportReady, setReportReady] = useState(user.notifications.reportReady);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      notifications: { ...user.notifications, emailAlerts, reportReady }
    });
    onShowToast('Settings updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 view-enter pb-16">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">Workspace Settings</h2>
        <p className="text-xs text-[var(--text-muted)]">Manage your professional profile, notification preferences, and account security.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="glass-panel p-8 space-y-6">
          <h3 className="text-base font-bold text-[var(--text)]">Profile Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--text)]">Display Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--text)]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Appearance Card */}
        <div className="glass-panel p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--text)]">Appearance Theme</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Select your preferred visual atmosphere.</p>
            </div>
            <div className="flex items-center p-1.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 border border-neutral-300/40 dark:border-neutral-700/40 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  onUpdateUser({ theme: 'light' });
                  document.documentElement.setAttribute('data-theme', 'light');
                  onShowToast('Switched to Aurora Light theme', 'info');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  user.theme === 'light'
                    ? 'bg-white text-neutral-900 shadow-md scale-105 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateUser({ theme: 'dark' });
                  document.documentElement.removeAttribute('data-theme');
                  onShowToast('Switched to Aurora Dark theme', 'info');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  user.theme === 'dark'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-700 shadow-md scale-105 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="glass-panel p-8 space-y-6">
          <h3 className="text-base font-bold text-[var(--text)]">Notification Preferences</h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl glass-panel bg-[var(--bg-elevated)] cursor-pointer">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[var(--text)]">Email Alerts</p>
                <p className="text-[10px] text-[var(--text-muted)]">Receive important updates regarding AI analysis completion.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--accent-1)] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl glass-panel bg-[var(--bg-elevated)] cursor-pointer">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[var(--text)]">Instant Report Ready</p>
                <p className="text-[10px] text-[var(--text-muted)]">Get notified the second your video assessment telemetry is computed.</p>
              </div>
              <input
                type="checkbox"
                checked={reportReady}
                onChange={(e) => setReportReady(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--accent-1)] cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 active:scale-95 transition-all shadow-xl shadow-[var(--accent-1)]/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
