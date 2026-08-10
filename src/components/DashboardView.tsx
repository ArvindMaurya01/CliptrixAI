import React, { useState } from 'react';
import { AssessmentReport, StreakData, UserProfile, ViewState } from '../types';
import { HudRing } from './HudRing';
import { PlusCircle, FileText, Download, TrendingUp, Award, Clock, ArrowRight, Sparkles, Search, X } from 'lucide-react';
import { generatePdfReport } from '../utils/pdfExport';
import { StreakCard } from './streak/StreakCard';

interface DashboardViewProps {
  reports: AssessmentReport[];
  onStartNew: () => void;
  onSelectReport: (report: AssessmentReport) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  streakData?: StreakData;
  onNavigate?: (view: ViewState) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
  user?: UserProfile | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onStartNew,
  onSelectReport,
  searchQuery: externalSearchQuery,
  onSearchChange,
  streakData,
  onNavigate,
  showToast,
  user
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : localSearch;
  const setSearchQuery = onSearchChange || setLocalSearch;

  const filteredReports = reports.filter((rep) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = rep.title.toLowerCase().includes(query);
    const categoryMatch = rep.categoryName.toLowerCase().includes(query);
    const summaryMatch = rep.summary.toLowerCase().includes(query);
    return titleMatch || categoryMatch || summaryMatch;
  });

  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((acc, r) => acc + r.overallScore, 0) / reports.length)
    : 0;

  return (
    <div className="space-y-8 view-enter">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 relative overflow-hidden gradient-border-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            Executive Assessment Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl">
            Review your multimodal assessment history, analyze attribute trajectories, and export publication-grade reports.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="px-6 py-3.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 active:scale-95 transition-all shadow-xl shadow-[var(--accent-1)]/20 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 space-y-2">
          <div className="flex justify-between items-center text-[var(--text-muted)]">
            <span className="text-xs font-medium uppercase tracking-wider">Total Reports</span>
            <FileText className="w-4 h-4 text-[var(--accent-1)]" />
          </div>
          <p className="text-3xl font-bold mono-nums text-[var(--text)]">{reports.length}</p>
          <p className="text-[10px] text-[var(--accent-good)] flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +2 new this week
          </p>
        </div>

        <div className="glass-panel p-6 space-y-2">
          <div className="flex justify-between items-center text-[var(--text-muted)]">
            <span className="text-xs font-medium uppercase tracking-wider">Average Score</span>
            <Award className="w-4 h-4 text-[var(--accent-2)]" />
          </div>
          <p className="text-3xl font-bold mono-nums text-[var(--text)]">{avgScore} <span className="text-sm font-normal text-[var(--text-muted)]">/ 100</span></p>
          <p className="text-[10px] text-[var(--accent-2)] font-medium">Top 10% benchmark rating</p>
        </div>

        <div className="glass-panel p-6 space-y-2">
          <div className="flex justify-between items-center text-[var(--text-muted)]">
            <span className="text-xs font-medium uppercase tracking-wider">Categories Used</span>
            <Sparkles className="w-4 h-4 text-[var(--accent-3)]" />
          </div>
          <p className="text-3xl font-bold mono-nums text-[var(--text)]">3</p>
          <p className="text-[10px] text-[var(--text-muted)]">Interview, Pitch, Leadership</p>
        </div>

        <div className="glass-panel p-6 space-y-2">
          <div className="flex justify-between items-center text-[var(--text-muted)]">
            <span className="text-xs font-medium uppercase tracking-wider">Practice Time</span>
            <Clock className="w-4 h-4 text-[var(--accent-warn)]" />
          </div>
          <p className="text-3xl font-bold mono-nums text-[var(--text)]">19m</p>
          <p className="text-[10px] text-[var(--text-muted)]">Across all simulations</p>
        </div>
      </div>

      {/* Your Analysis Streak Section */}
      <StreakCard
        streakData={streakData}
        onStartAnalysis={onStartNew}
        onNavigate={onNavigate}
        showToast={showToast}
        user={user}
      />

      {/* Recent Reports Section & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--text)]">Assessment Reports</h3>
            <p className="text-xs text-[var(--text-muted)]">Showing {filteredReports.length} of {reports.length} reports</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category, summary..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-panel text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-1)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="glass-panel p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-40" />
            <h4 className="text-sm font-semibold text-[var(--text)]">No matching assessment reports</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              We couldn't find any reports matching "{searchQuery}". Try searching with another keyword or clear your search.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-full text-xs font-medium text-[var(--accent-1)] glass-panel hover:bg-[var(--border-glass)] transition-all"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--accent-1)]/50 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="shrink-0">
                    <HudRing score={rep.overallScore} size={70} strokeWidth={6} label="" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20">
                        {rep.categoryName}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] mono-nums">{rep.date} ({rep.duration})</span>
                    </div>
                    <h4 
                      onClick={() => onSelectReport(rep)}
                      className="text-base font-bold text-[var(--text)] cursor-pointer group-hover:text-[var(--accent-1)] transition-colors"
                    >
                      {rep.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-2xl">
                      {rep.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border-glass)]">
                  <button
                    onClick={() => generatePdfReport(rep)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[var(--text)] glass-panel hover:bg-[var(--border-glass)] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--accent-2)]" />
                    <span>PDF Export</span>
                  </button>

                  <button
                    onClick={() => onSelectReport(rep)}
                    className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

