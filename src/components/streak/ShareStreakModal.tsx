import React, { useState, useRef } from 'react';
import { 
  X, Share2, Copy, Download, MessageSquare, Check, Flame, 
  Shield, Users, ArrowRight, ExternalLink, Sparkles
} from 'lucide-react';
import { StreakShareData, UserProfile, ViewState } from '../../types';
import { StreakShareCard } from './StreakShareCard';

interface ShareStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  milestone?: number;
  user?: UserProfile | null;
  onNavigate?: (view: ViewState) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ShareStreakModal: React.FC<ShareStreakModalProps> = ({
  isOpen,
  onClose,
  streak,
  milestone,
  user,
  onNavigate,
  showToast
}) => {
  const [showName, setShowName] = useState(false);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic default message generation based on streak
  const initialMessage = streak >= 30
    ? `30 days of consistency! 🔥 I've been using ClipTrixAI to track and improve my performance every single day. #ClipTrixAI #30DayStreak #AIPerformance`
    : streak >= 7
    ? `I've completed my ClipTrixAI analysis for ${streak} days in a row! 🔥 Staying consistent and improving every day. #ClipTrixAI #Consistency #AIAnalysis`
    : `I'm on a ${streak}-day AI analysis streak on ClipTrixAI! 🔥 Building habit and improving step-by-step. #ClipTrixAI #AIAssessment`;

  const [customMessage, setCustomMessage] = useState(initialMessage);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Safe public share link
  const shareId = Math.random().toString(36).substring(2, 10);
  const shareUrl = `https://cliptrixai.com/streak/${shareId}`;

  const shareData: StreakShareData = {
    streak,
    milestone,
    displayName: user?.name,
    showName,
    showProfilePhoto,
    message: customMessage,
    shareUrl
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${customMessage} ${shareUrl}`);
    setCopied(true);
    if (showToast) showToast('Streak share link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${streak} Day AI Analysis Streak - ClipTrixAI`,
          text: customMessage,
          url: shareUrl,
        });
        if (showToast) showToast('Shared successfully!', 'success');
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCard = () => {
    if (showToast) {
      showToast('Downloading high-res Streak Card for Instagram/Socials...', 'info');
    }
    // Simulate downloading streak card image safely
    const element = cardRef.current;
    if (element) {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 750;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw background gradient
        const grad = ctx.createLinearGradient(0, 0, 600, 750);
        grad.addColorStop(0, '#0c1020');
        grad.addColorStop(0.5, '#12182d');
        grad.addColorStop(1, '#0d1222');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 750);

        // Header
        ctx.fillStyle = '#6e7bff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('ClipTrixAI', 50, 70);

        // Streak Text
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 72px monospace';
        ctx.fillText(`🔥 ${streak} DAYS`, 50, 220);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('Analysis Streak', 50, 280);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '20px sans-serif';
        ctx.fillText('Analyzed performance consistently on ClipTrixAI', 50, 340);
        ctx.fillText('cliptrixai.com', 50, 680);

        const a = document.createElement('a');
        a.download = `cliptrixai-streak-${streak}-days.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    }
  };

  // Social Sharing URLs
  const encodedMsg = encodeURIComponent(customMessage + ' ' + shareUrl);
  const whatsappUrl = `https://wa.me/?text=${encodedMsg}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMsg}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto view-enter">
      <div className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text)]">
                Share Your Achievement
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Show your progress and motivate others to stay consistent.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Share Card Preview */}
          <div className="lg:col-span-6 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block font-mono">
              Visual Card Preview
            </label>
            <StreakShareCard shareData={shareData} cardRef={cardRef} />
          </div>

          {/* Right Column: Controls, Message & Options */}
          <div className="lg:col-span-6 space-y-5">
            {/* Privacy Controls (Default OFF) */}
            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[var(--accent-1)]" />
                <span>Privacy Settings</span>
              </span>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between gap-2 cursor-pointer select-none">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Allow my name on shared streak card
                  </span>
                  <input
                    type="checkbox"
                    checked={showName}
                    onChange={(e) => setShowName(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--accent-1)] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 cursor-pointer select-none">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Include my profile photo
                  </span>
                  <input
                    type="checkbox"
                    checked={showProfilePhoto}
                    onChange={(e) => setShowProfilePhoto(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--accent-1)] cursor-pointer"
                  />
                </label>
              </div>
              <p className="text-[10px] text-[var(--text-faint)] italic">
                *Private videos, scores, and coaching feedback are never shared.
              </p>
            </div>

            {/* Editable Message Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block font-mono">
                Share Caption / Message
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-all resize-none"
              />
            </div>

            {/* Mobile Web Share API Button if available */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via Device Sheet</span>
              </button>
            )}

            {/* Social Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block font-mono">
                Direct Social Platforms
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {/* Instagram Download */}
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  className="p-2.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </button>

                {/* X / Twitter */}
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Share on X</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] border border-[var(--border-glass)] text-xs font-bold text-[var(--text)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCard}
                className="py-2.5 px-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] border border-[var(--border-glass)] text-xs font-bold text-[var(--text)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                title="Download Card Image"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Image</span>
              </button>
            </div>
          </div>
        </div>

        {/* Growth Loop Connection to Referral */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--accent-1)]/15 via-purple-500/10 to-[var(--accent-2)]/15 border border-[var(--accent-1)]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[var(--accent-1)] shrink-0" />
            <div>
              <p className="font-extrabold text-[var(--text)]">
                Invite friends to join your journey
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Earn bonus AI credits when teammates sign up with your referral link.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigate) {
                onNavigate('referral');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--accent-1)] text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Refer & Earn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
