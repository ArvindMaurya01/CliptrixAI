import React, { useState, useRef } from 'react';
import { AssessmentReport, StreakData, UserProfile, ViewState } from '../types';
import { HudRing } from './HudRing';
import { generatePdfReport } from '../utils/pdfExport';
import { SupportedLanguages, LanguageOption } from '../data/supportedLanguages';
import { TranslationService } from '../services/translationService';
import { TranslationCache } from '../services/translationCache';
import { ReportLanguageSelector } from './ReportLanguageSelector';
import { TranslateReportButton } from './TranslateReportButton';
import { DownloadManager } from './DownloadManager';
import { ShareStreakModal } from './streak/ShareStreakModal';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Filler, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Download, Share2, Printer, ArrowLeft, Sparkles, CheckCircle2, Target, Copy, MessageCircle, Send, Mail, Globe, X, XCircle, Loader2, Flame } from 'lucide-react';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Filler, 
  Title, 
  Tooltip, 
  Legend
);

interface ReportViewProps {
  report: AssessmentReport;
  onBack: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  streakData?: StreakData;
  user?: UserProfile | null;
  onNavigate?: (view: ViewState) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onBack, onShowToast, streakData, user, onNavigate }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(SupportedLanguages.ALL[0]);
  const [displayedReport, setDisplayedReport] = useState<AssessmentReport>(report);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationStatusText, setTranslationStatusText] = useState('Translating Report...');
  const [translationError, setTranslationError] = useState(false);
  const [translationErrorMessage, setTranslationErrorMessage] = useState<string | null>(null);
  const [translationSuccessMessage, setTranslationSuccessMessage] = useState<string | null>(null);

  const reportContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang);
    setTranslationError(false);
    setTranslationErrorMessage(null);
    setTranslationSuccessMessage(null);

    if (lang.code === 'en') {
      setDisplayedReport(report);
      onShowToast('Loaded default English master report.', 'info');
    } else {
      const cached = TranslationCache.get(report.id, lang.code);
      if (cached) {
        setDisplayedReport(cached);
        setTranslationSuccessMessage(`Loaded cached ${lang.name} translation.`);
        onShowToast(`Loaded cached ${lang.name} report.`, 'info');
      }
    }
  };

  const handleTranslate = async () => {
    if (selectedLang.code === 'en') {
      setDisplayedReport(report);
      setTranslationError(false);
      setTranslationErrorMessage(null);
      setTranslationSuccessMessage(null);
      onShowToast('Loaded default English master report.', 'info');
      return;
    }

    const cached = TranslationCache.get(report.id, selectedLang.code);
    if (cached) {
      setDisplayedReport(cached);
      setTranslationError(false);
      setTranslationErrorMessage(null);
      setTranslationSuccessMessage(`Loaded cached ${selectedLang.name} translation. Export buttons updated.`);
      onShowToast(`Loaded cached ${selectedLang.name} report.`, 'success');
      return;
    }

    setIsTranslating(true);
    setTranslationError(false);
    setTranslationErrorMessage(null);
    setTranslationSuccessMessage(null);
    setTranslationProgress(15);
    setTranslationStatusText(`Connecting to Gemini AI for ${selectedLang.name} translation...`);

    try {
      const translated = await TranslationService.translateReport(
        report,
        selectedLang.name,
        selectedLang.code,
        (progress, status) => {
          setTranslationProgress(progress);
          setTranslationStatusText(status);
        }
      );

      setDisplayedReport(translated);
      setTranslationError(false);
      setTranslationSuccessMessage(`Report translated into ${selectedLang.name} successfully! PDF, DOCX, and TXT downloads reflect this active translation.`);
      onShowToast(`Report translated into ${selectedLang.name} successfully!`, 'success');
    } catch (err: any) {
      console.error('Translation failed in ReportView:', err);
      const detailedReason = err?.message || 'Unknown network or translation API error.';
      setTranslationError(true);
      setTranslationErrorMessage(detailedReason);
      onShowToast(`❌ Translation failed: ${detailedReason}`, 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const shareUrl = window.location.href;
  const shareText = `Check out my AI Assessment Report (${report.title}) - Score: ${report.overallScore}/100 [Report ID: ${report.id}]`;

  const handleShare = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${shareUrl}`)}`, '_blank');
        onShowToast('Opened WhatsApp share', 'success');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        onShowToast('Opened Facebook share', 'success');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        onShowToast('Opened Twitter/X share', 'success');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        onShowToast('Opened LinkedIn share', 'success');
        break;
      case 'instagram':
        navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
        onShowToast('Report link & details copied for Instagram bio/story!', 'success');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(`AI Assessment Report: ${report.title}`)}&body=${encodeURIComponent(`${shareText}\n\nLink: ${shareUrl}`)}`);
        onShowToast('Opened email client', 'success');
        break;
      case 'copy':
      default:
        navigator.clipboard.writeText(shareUrl);
        onShowToast('Report link copied to clipboard!', 'success');
        break;
    }
    setShowShareModal(false);
  };

  const barChartData = {
    labels: report.attributes.map(a => a.name),
    datasets: [
      {
        label: 'Attribute Score',
        data: report.attributes.map(a => a.score),
        backgroundColor: 'rgba(110, 123, 255, 0.7)',
        borderColor: '#6E7BFF',
        borderWidth: 2,
        borderRadius: 6,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9AA3B8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9AA3B8', font: { size: 10 } }
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-good)]/10 text-[var(--accent-good)] border border-[var(--accent-good)]/30">Optimal</span>;
      case 'good':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-2)]/10 text-[var(--accent-2)] border border-[var(--accent-2)]/30">Good</span>;
      case 'review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-warn)]/10 text-[var(--accent-warn)] border border-[var(--accent-warn)]/30">Review</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-bad)]/10 text-[var(--accent-bad)] border border-[var(--accent-bad)]/30">Critical</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 view-enter">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl glass-panel bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent-1)]/40 transition-all flex items-center gap-2 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--accent-1)]" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Analysis Complete Streak Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-[var(--bg-elevated)] to-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-emerald-400">
              <span>Analysis Complete! 🎉</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-[var(--text)] flex items-center gap-1.5 justify-center sm:justify-start">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>You're now on a {streakData?.currentStreak ?? 1}-day streak!</span>
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Your performance has been evaluated and recorded toward your active streak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowStreakModal(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span>Share Streak</span>
          </button>
        </div>
      </div>

      {/* Unified Report Tools, Share, Print & Multilingual Export Center Card */}
      <div className="glass-panel p-6 sm:p-8 gradient-border-card space-y-6 mb-6">
        {/* Header Title & Quick Actions (Share & Print) in ONE Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-glass)] pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20 shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
                <span>Report Tools & Multilingual Export Center</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Translate assessment report via Gemini AI, share securely, print, or download PDF, DOCX &amp; TXT.
              </p>
            </div>
          </div>

          {/* Quick Actions (Share Report & Print) */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center relative">
            {/* Share Report Button & Popup */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowShareModal(!showShareModal)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Report</span>
              </button>

              {showShareModal && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-3xl glass-panel bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] shadow-2xl z-50 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/10 dark:ring-white/10">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-glass)]">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Share Assessment Report</h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-mono">Report ID: {report.id} &bull; Score: {report.overallScore}/100</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowShareModal(false)}
                      className="w-6 h-6 rounded-full glass-panel flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleShare('whatsapp')}
                      className="p-3 rounded-2xl glass-panel bg-[var(--bg)]/80 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all flex flex-col items-center gap-2 group cursor-pointer text-center"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text)]">WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare('facebook')}
                      className="p-3 rounded-2xl glass-panel bg-[var(--bg)]/80 hover:bg-blue-600/10 hover:border-blue-600/40 transition-all flex flex-col items-center gap-2 group cursor-pointer text-center"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text)]">Facebook</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare('twitter')}
                      className="p-3 rounded-2xl glass-panel bg-[var(--bg)]/80 hover:bg-sky-400/10 hover:border-sky-400/40 transition-all flex flex-col items-center gap-2 group cursor-pointer text-center"
                    >
                      <div className="w-9 h-9 rounded-xl bg-sky-400/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Send className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text)]">Twitter / X</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare('linkedin')}
                      className="p-3 rounded-2xl glass-panel bg-[var(--bg)]/80 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all flex flex-col items-center gap-2 group cursor-pointer text-center"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text)]">LinkedIn</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare('instagram')}
                      className="p-3 rounded-2xl glass-panel bg-[var(--bg)]/80 hover:bg-pink-500/10 hover:border-pink-500/40 transition-all flex flex-col items-center gap-2 group cursor-pointer text-center"
                    >
                      <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text)]">Instagram</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare('email')}
                      className="p-3 rounded-2xl glass-panel bg-[var(--bg)]/80 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all flex flex-col items-center gap-2 group cursor-pointer text-center"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text)]">Email</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[var(--border-glass)]">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Secure Share Link</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="w-full px-3.5 py-2.5 rounded-xl text-[11px] text-[var(--text)] font-mono bg-[var(--bg)] border border-[var(--border-glass)] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleShare('copy')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--accent-1)] hover:opacity-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[var(--text)] glass-panel bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-[var(--accent-3)]" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* 1. Report Language Selector */}
        <div className="w-full max-w-xl">
          <ReportLanguageSelector
            selectedLanguage={selectedLang}
            onSelectLanguage={handleSelectLanguage}
            disabled={isTranslating}
          />
        </div>

        {/* 2. Translate Report Button */}
        <div className="pt-1">
          <TranslateReportButton
            isTranslating={isTranslating}
            progress={translationProgress}
            statusText={translationStatusText}
            onTranslate={handleTranslate}
            disabled={isTranslating}
          />
        </div>

        {/* 3. Download Buttons */}
        <div className="pt-2 border-t border-[var(--border-glass)]/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold text-[var(--accent-1)] uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Download Translated Report ({selectedLang.name})</span>
            </span>
            {selectedLang.code !== 'en' && (
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Active Language: {selectedLang.name}
              </span>
            )}
          </div>
          <DownloadManager
            report={displayedReport}
            languageName={selectedLang.name}
            reportElementRef={reportContainerRef}
            disabled={isTranslating}
            onShowToast={onShowToast}
          />
        </div>

        {/* 4. Translation Status Card (Success / Error / Loading) */}
        {isTranslating && (
          <div className="p-4 rounded-2xl bg-[var(--accent-1)]/10 border border-[var(--accent-1)]/30 text-[var(--accent-1)] text-xs font-semibold space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--accent-1)] shrink-0" />
                <span className="font-bold text-sm text-[var(--text)]">{translationStatusText}</span>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent-1)]/20 text-[var(--accent-1)]">
                {translationProgress}%
              </span>
            </div>
            <div className="w-full bg-[var(--bg)] rounded-full h-2 overflow-hidden border border-[var(--border-glass)]">
              <div 
                className="bg-gradient-to-r from-[var(--accent-2)] to-[var(--accent-1)] h-full transition-all duration-300 rounded-full" 
                style={{ width: `${translationProgress}%` }}
              />
            </div>
          </div>
        )}

        {!isTranslating && translationError && (
          <div className="p-4.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 space-y-1.5">
                <p className="font-bold text-sm text-rose-300">Translation Failed</p>
                <p className="text-xs text-rose-200/90 font-mono bg-black/30 p-3 rounded-xl border border-rose-500/20 break-words leading-relaxed">
                  {translationErrorMessage || 'An unexpected error occurred while communicating with Gemini.'}
                </p>
                <p className="text-[11px] text-rose-300/80">
                  The original English report remains active below. You can try again or select another language.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isTranslating && !translationError && translationSuccessMessage && selectedLang.code !== 'en' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <p className="font-bold text-sm text-emerald-300">Active Language: {selectedLang.name}</p>
                <p className="text-xs text-emerald-200/80">{translationSuccessMessage}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => handleSelectLanguage(SupportedLanguages.ALL[0])}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold text-xs border border-emerald-500/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Reset to English
            </button>
          </div>
        )}
      </div>

      {/* Rendered Assessment Report Document Container */}
      <div ref={reportContainerRef} className="space-y-8">
        {/* Header Info */}
        <div className="glass-panel p-8 gradient-border-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20">
                {displayedReport.categoryName}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--accent-2)]/10 text-[var(--accent-2)] border border-[var(--accent-2)]/20">
                ID: {displayedReport.id}
              </span>
              <span className="text-xs text-[var(--text-muted)] mono-nums">{displayedReport.date} &bull; {displayedReport.duration}</span>
              {selectedLang.code !== 'en' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  🌐 Translated ({selectedLang.name})
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
              {displayedReport.title}
            </h1>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
              {displayedReport.summary}
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="glass-panel p-6 text-center space-y-2 bg-[var(--bg-elevated)]">
              <HudRing score={displayedReport.overallScore} size={140} strokeWidth={9} label="Overall Index" />
            </div>
          </div>
        </div>

        {/* Attribute Score Distribution Chart */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Attribute Score Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Bar data={{
              labels: displayedReport.attributes.map(a => a.name),
              datasets: [
                {
                  label: 'Attribute Score',
                  data: displayedReport.attributes.map(a => a.score),
                  backgroundColor: 'rgba(110, 123, 255, 0.7)',
                  borderColor: '#6E7BFF',
                  borderWidth: 2,
                  borderRadius: 6,
                }
              ]
            }} options={barChartOptions} />
          </div>
        </div>

        {/* Quantitative Attribute Matrix Table */}
        <div className="glass-panel p-6 space-y-6">
          <h3 className="text-lg font-bold text-[var(--text)]">Quantitative Attribute Matrix</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-glass)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-4 font-semibold">Attribute</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Observed Value</th>
                  <th className="py-3 px-4 font-semibold">Expert Behavioral Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-glass)] text-xs text-[var(--text)]">
                {displayedReport.attributes.map((attr, idx) => (
                  <tr key={`attr-${idx}-${attr.name}`} className="hover:bg-[var(--border-glass)]/30 transition-colors">
                    <td className="py-4 px-4 font-bold">
                      <div className="space-y-1">
                        <span>{attr.name}</span>
                        {attr.criticalFault && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40">
                            Critical Fault
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 mono-nums font-bold text-[var(--accent-1)]">
                      <div className="space-y-0.5">
                        <span>{attr.score}/100</span>
                        {attr.confidence !== undefined && (
                          <div className="text-[9px] text-[var(--text-muted)] font-mono">
                            Conf: {Math.round(attr.confidence * 100)}%
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(attr.status)}</td>
                    <td className="py-4 px-4 text-[var(--text-muted)] max-w-xs">{attr.observedEvidence || attr.observedValue}</td>
                    <td className="py-4 px-4 text-[var(--text-muted)] max-w-md space-y-1">
                      {attr.technicalAnalysis ? (
                        <div>
                          <p>{attr.technicalAnalysis}</p>
                          {attr.coachingRecommendation && (
                            <p className="mt-1.5 text-[11px] font-semibold text-[var(--accent-1)] bg-[var(--accent-1)]/10 p-2 rounded-xl border border-[var(--accent-1)]/20">
                              <strong>Rec:</strong> {attr.coachingRecommendation}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p>{attr.expertAnalysis}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessment Timeline */}
        {displayedReport.timelineEvents && displayedReport.timelineEvents.length > 0 && (
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-lg font-bold text-[var(--text)]">Assessment Timeline & Key Moments</h3>
            <div className="space-y-4">
              {displayedReport.timelineEvents.map((evt, idx) => (
                <div key={`evt-${idx}-${evt.timestamp}`} className="flex gap-4 items-start p-4 rounded-xl glass-panel bg-[var(--bg-elevated)]">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20 shrink-0">
                    {evt.timestamp}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[var(--text)]">{evt.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Targeted Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent-good)]" />
              <span>Key Strengths</span>
            </h3>
            <ul className="space-y-3">
              {displayedReport.strengths.map((str, idx) => (
                <li key={`strength-${idx}-${str.slice(0, 15)}`} className="flex items-start gap-3 text-xs text-[var(--text)] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-good)] mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--accent-2)]" />
              <span>Targeted Action Plan</span>
            </h3>
            <ul className="space-y-3">
              {displayedReport.actionPlan.map((act, idx) => (
                <li key={`action-${idx}-${act.slice(0, 15)}`} className="flex items-start gap-3 text-xs text-[var(--text)] leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent-2)]/10 text-[var(--accent-2)] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Expert Insight Glass Callout */}
        <div className="p-6 rounded-2xl glass-panel border border-[var(--accent-1)]/40 bg-gradient-to-br from-[var(--accent-1)]/10 to-[var(--accent-2)]/10 flex items-start gap-4 shadow-xl">
          <Sparkles className="w-6 h-6 text-[var(--accent-1)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-1)]">AI Expert Prescriptive Insight</h4>
            <p className="text-sm text-[var(--text)] font-medium leading-relaxed">{displayedReport.aiInsight}</p>
          </div>
        </div>
      </div>

      {/* Share Streak Modal */}
      <ShareStreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        streak={streakData?.currentStreak ?? 1}
        milestone={(streakData?.currentStreak ?? 1) >= 7 ? 7 : undefined}
        user={user}
        onNavigate={onNavigate}
        showToast={onShowToast}
      />
    </div>
  );
};

