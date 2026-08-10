import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[var(--accent-good)] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[var(--accent-bad)] shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-[var(--accent-1)] shrink-0" />;
    }
  };

  return (
    <div className="pointer-events-auto glass-panel p-4 flex items-center justify-between gap-3 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200 border border-[var(--border-glass)]">
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-xs font-medium text-[var(--text)] leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[var(--text-faint)] hover:text-[var(--text)] transition-colors p-1"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
