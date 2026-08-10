import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <>
      <div className="aurora-mesh">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>
      <div className="noise-overlay"></div>
    </>
  );
};
