import React from 'react';

export const CliptrixLogo: React.FC<{ 
  className?: string; 
  showText?: boolean; 
  textClassName?: string;
  iconOnlyClassName?: string;
}> = ({ 
  className = "w-10 h-10", 
  showText = false,
  textClassName = "text-lg font-bold tracking-tight",
  iconOnlyClassName = "w-10 h-10"
}) => {
  const svgContent = (
    <svg className={className || iconOnlyClassName} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
        <linearGradient id="purpleMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9D00FF" />
          <stop offset="100%" stopColor="#FF007A" />
        </linearGradient>
      </defs>
      {/* Outer Play Triangle / Arrow outline shape */}
      <path
        d="M22 15C18 12 12 15 12 20V80C12 85 18 88 22 85L82 55C86 53 86 47 82 45L22 15Z"
        fill="url(#cyanBlue)"
        fillOpacity="0.15"
      />
      <path
        d="M20 18C17 16 13 18 13 22V78C13 82 17 84 20 82L78 52C81 50 81 46 78 44L20 18Z"
        stroke="url(#cyanBlue)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner dynamic cut segments (magenta/purple accent piece) */}
      <path
        d="M48 30L78 44L58 64L48 30Z"
        fill="url(#purpleMagenta)"
      />
      <path
        d="M42 58L54 74L38 82L30 68L42 58Z"
        fill="url(#purpleMagenta)"
      />
      {/* Inner white / light accent split bars */}
      <line x1="50" y1="46" x2="42" y2="58" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="56" x2="50" y2="68" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  if (!showText) {
    return svgContent;
  }

  return (
    <div className="flex items-center -space-x-1">
      {svgContent}
      <span className={`${textClassName} font-sans`}>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00F0FF] dark:from-[#9D00FF] dark:to-[#FF007A]">ClipTrix</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00F0FF] dark:from-[#9D00FF] dark:to-[#FF007A]">AI</span>
      </span>
    </div>
  );
};

