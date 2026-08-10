import React from 'react';
import { ShieldCheck, Database, Lock, UserCheck, Trash2, ArrowLeft, Eye } from 'lucide-react';

interface PrivacyViewProps {
  onBack: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 view-enter">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20">
          Privacy Policy
        </span>
      </div>

      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-1)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center text-[var(--accent-1)] mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
          At AI Video Analysis Inc., we are deeply committed to protecting your privacy and ensuring transparency regarding how your personal information and video assets are handled.
        </p>
        <div className="text-xs font-mono text-[var(--text-muted)] pt-2">
          Last updated: July 31, 2026
        </div>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-1)]">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Data We Collect</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            To provide our professional video assessment service, we collect essential user information including your full name, email address, and uploaded video files or webcam recordings submitted for diagnostic evaluation.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-2)]">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Purpose of Video Usage</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Uploaded videos and multimedia assets are used strictly and exclusively for generating real-time AI performance analysis, telemetry scoring, and executive report synthesis.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-3)]">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Third-Party Sharing</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            User data and uploaded media are never sold, rented, or monetized with third-party advertisers or external data brokers under any circumstances.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Storage & Security</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            All collected information and video assets are securely stored in encrypted cloud repositories protected by rigorous access controls and robust security architectures.
          </p>
        </div>
      </div>

      {/* Deletion Request Card */}
      <div className="glass-panel p-8 space-y-4 border-2 border-[var(--accent-1)]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-amber-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text)]">Data Deletion Requests</h3>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          You maintain full ownership of your data. Users can request permanent deletion of their account records, assessment history, and uploaded video artifacts at any time by contacting our support team or submitting a request through the admin dashboard.
        </p>
      </div>
    </div>
  );
};
