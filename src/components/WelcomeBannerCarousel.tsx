import React from 'react';
import { Sparkles } from 'lucide-react';

export const WelcomeBannerCarousel: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass-panel border border-[var(--border-glass)] shadow-sm bg-[var(--bg-elevated)]/60 cursor-default select-none">
      <Sparkles className="w-4 h-4 text-[var(--accent-1)] shrink-0" />
      <span className="text-xs font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] uppercase">
        Welcome To ClipTrixAi
      </span>
    </div>
  );
};
