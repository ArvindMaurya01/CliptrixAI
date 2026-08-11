import React from 'react';
import { CliptrixLogo } from './CliptrixLogo';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800 relative overflow-hidden pt-12 pb-12 px-6 sm:px-12 mt-0">
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10 mb-16">
        {/* Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <div 
            onClick={() => {
              if (onNavigate) {
                onNavigate('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2 cursor-pointer inline-flex group"
          >
            <CliptrixLogo showText={true} className="w-8 h-8 group-hover:scale-105 transition-transform" textClassName="text-base font-bold text-white tracking-tight" />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            AI video assessment and report generation for education, sport, hiring, and communication training.
          </p>
        </div>

        {/* Product Links */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400">PRODUCT</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#categories" className="hover:text-white transition-colors">Categories</a></li>
            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            <li>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('community');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="hover:text-[var(--accent-1)] font-semibold text-neutral-300 transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                <span>Community</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400">COMPANY</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                About
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Careers
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400">LEGAL</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Privacy
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Terms
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('security');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Security
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('referral');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="hover:text-amber-400 font-semibold text-amber-300/90 transition-colors text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>Referral Program</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  EARN
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 relative z-10">
        <div>
          © 2026 AI Video Analysis Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>• STATUS: ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
