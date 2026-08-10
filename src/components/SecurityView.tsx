import React from 'react';
import { Lock, Key, Server, Shield, Activity, CheckCircle2, ArrowLeft } from 'lucide-react';

interface SecurityViewProps {
  onBack: () => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({ onBack }) => {
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
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Security Protocols
        </span>
      </div>

      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center text-emerald-400 mb-2">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          Security Architecture
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
          User privacy and data protection are our top priorities. Our infrastructure employs state-of-the-art encryption and defense-in-depth security measures.
        </p>
        <div className="text-xs font-mono text-[var(--text-muted)] pt-2">
          Status: All Security Systems Active & Verified
        </div>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Encrypted Storage</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            All uploaded video files, recordings, and diagnostic reports are securely encrypted at rest using advanced industry-standard cryptographic algorithms.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-1)]">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Secure Transmission</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Data transmission across client sessions and backend servers occurs exclusively over secure HTTPS connections with TLS 1.3 encryption protocols.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-2)]">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Industry Standards</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            User information and account credentials are safeguarded with robust security practices aligned with top-tier cloud compliance frameworks.
          </p>
        </div>

        <div className="glass-panel p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[var(--accent-3)]">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">Restricted Access</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Access to personal data and video assets is strictly restricted to authenticated account owners and authorized system verification pipelines.
          </p>
        </div>
      </div>

      {/* Monitoring Card */}
      <div className="glass-panel p-8 space-y-4 border-2 border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text)]">Continuous Monitoring & Updates</h3>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          We perform rigorous, automated security monitoring, vulnerability scans, and system updates around the clock to maintain uncompromised resilience against emerging threats.
        </p>
        <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Zero Vulnerability Detection Rate</span>
        </div>
      </div>
    </div>
  );
};
