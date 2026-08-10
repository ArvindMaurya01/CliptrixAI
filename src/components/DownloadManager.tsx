import React, { useState } from 'react';
import { FileText, Download, Loader2, FileCode } from 'lucide-react';
import { AssessmentReport } from '../types';
import { generatePdfReport } from '../utils/pdfExport';
import { generateDocxReport } from '../utils/docxExport';
import { generateTxtReport } from '../utils/txtExport';

interface DownloadManagerProps {
  report: AssessmentReport;
  languageName: string;
  reportElementRef?: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({
  report,
  languageName,
  reportElementRef,
  disabled = false,
  onShowToast,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'docx' | 'txt' | null>(null);

  const handleDownloadPdf = async () => {
    try {
      setDownloadingFormat('pdf');
      onShowToast(`Preparing PDF report in ${languageName}...`, 'info');
      await generatePdfReport(report, languageName, reportElementRef?.current);
      onShowToast(`Downloaded PDF report in ${languageName}`, 'success');
    } catch (e: any) {
      console.error(e);
      onShowToast(`Failed to download PDF report. ${e.message || ''}`, 'error');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setDownloadingFormat('docx');
      onShowToast(`Generating DOCX report in ${languageName}...`, 'info');
      await generateDocxReport(report, languageName);
      onShowToast(`Downloaded DOCX report in ${languageName}`, 'success');
    } catch (e: any) {
      console.error(e);
      onShowToast(`Failed to download DOCX report. ${e.message || ''}`, 'error');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadTxt = () => {
    try {
      setDownloadingFormat('txt');
      onShowToast(`Generating TXT report in ${languageName}...`, 'info');
      generateTxtReport(report, languageName);
      onShowToast(`Downloaded TXT report in ${languageName}`, 'success');
    } catch (e: any) {
      console.error(e);
      onShowToast(`Failed to download TXT report. ${e.message || ''}`, 'error');
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Download PDF Button */}
      <button
        onClick={handleDownloadPdf}
        disabled={disabled || downloadingFormat !== null}
        className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[var(--accent-2)] to-[var(--accent-1)] hover:opacity-95 active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloadingFormat === 'pdf' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>Download PDF</span>
      </button>

      {/* Download DOCX Button */}
      <button
        onClick={handleDownloadDocx}
        disabled={disabled || downloadingFormat !== null}
        className="px-5 py-2.5 rounded-2xl text-xs font-bold text-[var(--text)] glass-panel bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] hover:border-[var(--accent-1)]/40 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloadingFormat === 'docx' ? (
          <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-1)]" />
        ) : (
          <FileText className="w-4 h-4 text-[var(--accent-1)]" />
        )}
        <span>Download DOCX</span>
      </button>

      {/* Download TXT Button */}
      <button
        onClick={handleDownloadTxt}
        disabled={disabled || downloadingFormat !== null}
        className="px-5 py-2.5 rounded-2xl text-xs font-bold text-[var(--text)] glass-panel bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] hover:border-[var(--accent-2)]/40 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloadingFormat === 'txt' ? (
          <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-2)]" />
        ) : (
          <FileCode className="w-4 h-4 text-[var(--accent-2)]" />
        )}
        <span>Download TXT</span>
      </button>
    </div>
  );
};
