import React from 'react';
import { FileText, Scale, AlertTriangle, UserX, Clock, ShieldAlert, ArrowLeft } from 'lucide-react';

interface TermsViewProps {
  onBack: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onBack }) => {
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
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--accent-2)]/10 text-[var(--accent-2)] border border-[var(--accent-2)]/20">
          Terms of Service
        </span>
      </div>

      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-2)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center text-[var(--accent-2)] mb-2">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          Terms of Service
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
          Please review these terms carefully before utilizing our AI video assessment platform and telemetry services.
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
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Content Ownership</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Users must upload only video content that they own or have explicit legal permission and rights to use for evaluation and diagnostic processing.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-2)]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Informational Purpose</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            AI-generated reports, scores, and behavioral insights are provided strictly for informational and coaching purposes and do not constitute formal professional or legal certifications.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-3)]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">User Responsibility</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Users bear sole and absolute responsibility for all video files, metadata, and queries submitted through their authenticated account session.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-red-400">
              <UserX className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Prohibited Conduct</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Misuse of the platform, uploading illegal or malicious content, or engaging in copyright violations is strictly prohibited and constitutes a breach of service terms.
          </p>
        </div>
      </div>

      {/* Additional Terms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Account Suspension</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            The platform administration reserves the right to suspend or terminate user accounts immediately upon detecting policy violations, security breaches, or abusive activity.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-1)]">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Modifications to Terms</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            These terms may be updated periodically to reflect platform enhancements or regulatory adjustments. Continued use of the service constitutes agreement to updated terms.
          </p>
        </div>
      </div>
    </div>
  );
};
