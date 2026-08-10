import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Globe, ChevronDown, Search, Check } from 'lucide-react';
import { SupportedLanguages, LanguageOption } from '../data/supportedLanguages';

interface ReportLanguageSelectorProps {
  selectedLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
  disabled?: boolean;
}

export const ReportLanguageSelector: React.FC<ReportLanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const [portalPosition, setPortalPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    isUpward: boolean;
  }>({ left: 0, width: 280, isUpward: false });

  // Filtered languages based on search query
  const filteredLanguages = SupportedLanguages.ALL.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Recalculate portal popover position relative to viewport
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const dropdownHeight = 320; // Maximum expected dropdown height
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const isUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    // Align width to trigger button width (minimum 280px)
    const width = Math.max(rect.width, 280);

    // Clamp left position within viewport padding
    let left = rect.left;
    if (left + width > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - width - 12);
    }

    if (isUpward) {
      setPortalPosition({
        bottom: viewportHeight - rect.top + 8,
        left,
        width,
        isUpward: true,
      });
    } else {
      setPortalPosition({
        top: rect.bottom + 8,
        left,
        width,
        isUpward: false,
      });
    }
  }, []);

  // Update position on open, scroll, or window resize
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  // Reset active index when filtered items change
  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation logic
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredLanguages.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredLanguages.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredLanguages[activeIndex]) {
        onSelectLanguage(filteredLanguages[activeIndex]);
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listContainerRef.current) {
      const activeEl = listContainerRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex, isOpen]);

  // Render Portal Dropdown at document.body level
  const renderPortalDropdown = () => {
    if (!isOpen) return null;

    const style: React.CSSProperties = {
      position: 'fixed',
      left: `${portalPosition.left}px`,
      width: `${portalPosition.width}px`,
      maxWidth: 'calc(100vw - 24px)',
      zIndex: 9999,
      ...(portalPosition.isUpward
        ? { bottom: `${portalPosition.bottom}px` }
        : { top: `${portalPosition.top}px` }),
    };

    return ReactDOM.createPortal(
      <div
        ref={dropdownRef}
        id="language-select-dropdown"
        role="listbox"
        aria-label="Supported Languages"
        style={style}
        onKeyDown={handleKeyDown}
        className="p-3 rounded-2xl bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] shadow-2xl backdrop-blur-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/10 dark:ring-white/10"
      >
        {/* Search Box - Fixed at top of popover */}
        <div className="relative sticky top-0 z-10 bg-[var(--bg-elevated-solid)] pt-0.5 pb-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search language..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--bg)] text-xs font-medium text-[var(--text)] placeholder-[var(--text-muted)] border border-[var(--border-glass)] focus:border-[var(--accent-1)] focus:ring-1 focus:ring-[var(--accent-1)]/30 outline-none transition-all"
          />
        </div>

        {/* Scrollable Language List */}
        <div 
          ref={listContainerRef}
          className="max-h-[240px] overflow-y-auto space-y-1 custom-scrollbar pr-1"
        >
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((lang, index) => {
              const isSelected = lang.code === selectedLanguage.code;
              const isActive = index === activeIndex;

              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectLanguage(lang);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-1)]/20 text-[var(--accent-1)] font-bold border border-[var(--accent-1)]/30'
                      : isActive
                      ? 'bg-[var(--accent-1)]/10 text-[var(--accent-1)] font-medium'
                      : 'text-[var(--text)] hover:bg-[var(--accent-1)]/10 hover:text-[var(--accent-1)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base leading-none shrink-0">{lang.flagEmoji}</span>
                    <span className={`font-semibold truncate ${isSelected ? 'text-[var(--accent-1)]' : 'text-[var(--text)]'}`}>
                      {lang.name}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-normal truncate">
                      ({lang.nativeName})
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[var(--accent-1)]" />}
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-[var(--text-muted)] font-medium">
              No matching language found.
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="space-y-2.5 w-full">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-1)]">
        <Globe className="w-4 h-4 shrink-0 text-[var(--accent-1)]" />
        <span>Report Language</span>
      </div>

      <div className="relative w-full">
        <button
          ref={triggerRef}
          id="language-select-trigger"
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls="language-select-dropdown"
          className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated-solid)] text-xs font-semibold text-[var(--text)] border border-[var(--border-glass)] hover:border-[var(--accent-1)]/50 focus:border-[var(--accent-1)] focus:ring-2 focus:ring-[var(--accent-1)]/20 outline-none transition-all flex items-center justify-between gap-3 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-base leading-none shrink-0">{selectedLanguage.flagEmoji}</span>
            <span className="font-bold text-[var(--text)] truncate">{selectedLanguage.name}</span>
            <span className="text-[var(--text-muted)] font-normal text-[11px] truncate">
              ({selectedLanguage.nativeName})
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[var(--accent-1)]' : ''
            }`}
          />
        </button>

        {renderPortalDropdown()}
      </div>

      {/* Selected Language Indicator Chip */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-0.5 px-1 font-mono">
        <span>Active Target:</span>
        <span className="font-bold text-[var(--accent-1)] bg-[var(--accent-1)]/15 border border-[var(--accent-1)]/30 px-3 py-1 rounded-full text-[11px] shadow-sm flex items-center gap-1.5">
          <span>{selectedLanguage.flagEmoji}</span>
          <span>{selectedLanguage.name} ({selectedLanguage.nativeName})</span>
        </span>
      </div>
    </div>
  );
};
