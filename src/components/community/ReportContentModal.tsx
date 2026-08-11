import React, { useState } from 'react';
import { X, ShieldAlert, Check } from 'lucide-react';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'post' | 'comment' | 'community';
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  onClose,
  itemType,
  showToast
}) => {
  const [reason, setReason] = useState('Inappropriate Content');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const reasonsList = [
    'Spam or misleading',
    'Harassment or bullying',
    'Inappropriate Content',
    'Hate speech or abuse',
    'Unsolicited self-promotion',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showToast) {
      showToast('Thanks. This content has been reported for review.', 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md view-enter">
      <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-red-500/30 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-3">
          <div className="flex items-center gap-2.5 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-[var(--text)]">
              Report {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
              Reason for reporting
            </label>
            <div className="space-y-1.5">
              {reasonsList.map((r) => (
                <label
                  key={r}
                  onClick={() => setReason(r)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    reason === r
                      ? 'bg-red-500/15 border-red-500/40 text-[var(--text)]'
                      : 'bg-[var(--bg-elevated)] border-[var(--border-glass)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <span>{r}</span>
                  {reason === r && <Check className="w-4 h-4 text-red-400" />}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
              Additional details (Optional)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide extra context if helpful..."
              className="w-full p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border-glass)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors cursor-pointer"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
