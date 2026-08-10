import React from 'react';
import { Languages, Loader2, Sparkles } from 'lucide-react';

interface TranslateReportButtonProps {
  isTranslating: boolean;
  progress: number;
  statusText?: string;
  onTranslate: () => void;
  disabled?: boolean;
}

export const TranslateReportButton: React.FC<TranslateReportButtonProps> = ({
  isTranslating,
  progress,
  statusText = 'Translating Report...',
  onTranslate,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <button
        onClick={onTranslate}
        disabled={disabled || isTranslating}
        className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:opacity-95 active:scale-98 transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isTranslating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>🌐 Translating Report...</span>
          </>
        ) : (
          <>
            <Languages className="w-4 h-4" />
            <span>🌐 Translate Report</span>
          </>
        )}
      </button>

      {isTranslating && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--accent-1)]">
            <span className="flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3 h-3" />
              {statusText}
            </span>
            <span className="font-bold">{progress}%</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[var(--border-glass)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
