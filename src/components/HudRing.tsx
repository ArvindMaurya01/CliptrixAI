import React, { useEffect, useState } from 'react';

interface HudRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const HudRing: React.FC<HudRingProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
  label
}) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  const getScoreBandColor = (s: number) => {
    if (s >= 90) return 'text-[#35E6A4] bg-[#35E6A4]/10 border-[#35E6A4]/30';
    if (s >= 75) return 'text-[#00D9C8] bg-[#00D9C8]/10 border-[#00D9C8]/30';
    if (s >= 60) return 'text-[#FFB454] bg-[#FFB454]/10 border-[#FFB454]/30';
    return 'text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/30';
  };

  const getBadgeText = (s: number) => {
    if (s >= 90) return 'Exceptional';
    if (s >= 75) return 'Proficient';
    if (s >= 60) return 'Developing';
    return 'Needs Work';
  };

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="hudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-1)" />
            <stop offset="60%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="var(--accent-3)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-glass)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#hudGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          filter="url(#glow)"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>

      {/* Center Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold mono-nums tracking-tight text-[var(--text)] drop-shadow-[0_0_10px_rgba(110,123,255,0.4)]">
          {currentScore}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
          {label || 'Score'}
        </span>
      </div>

      {/* Pill badge underneath */}
      <div className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getScoreBandColor(currentScore)}`}>
        {getBadgeText(currentScore)}
      </div>
    </div>
  );
};
