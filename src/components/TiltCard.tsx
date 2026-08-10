import React, { ReactNode } from 'react';
import { useTilt } from '../hooks/useTilt';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', onClick }) => {
  const tiltRef = useTilt({ max: 8, scale: 1.015, speed: 300 });

  return (
    <div
      ref={tiltRef}
      onClick={onClick}
      className={`transition-transform duration-75 ease-out will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

export default TiltCard;
