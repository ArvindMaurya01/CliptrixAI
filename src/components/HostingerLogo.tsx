import React from 'react';

export const HostingerLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h4v16H4V4z" fill="currentColor" />
    <path d="M16 4h4v16h-4V4z" fill="currentColor" />
    <path d="M8 10h8v4H8v-4z" fill="currentColor" />
  </svg>
);
