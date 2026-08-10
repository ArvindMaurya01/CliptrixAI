import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Presentation, Shield, MessageSquare, 
  BookOpen, Trophy, GraduationCap, Smile, Brain, 
  ChevronLeft, ChevronRight, Clock, Lock, Sparkles
} from 'lucide-react';
import { CategoryInfo } from '../types';

interface CategoryCarouselProps {
  categories: CategoryInfo[];
  onSelectCategory: (categoryKey: string) => void;
}

const ACTIVE_CATEGORY_KEYS = ['interview', 'student', 'athlete'];

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  onSelectCategory
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoints: Mobile=1, Tablet=2, Large Tablet=3, Desktop=4
  const updateVisibleCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width < 640) {
      setVisibleCount(1);
    } else if (width < 768) {
      setVisibleCount(2);
    } else if (width < 1024) {
      setVisibleCount(3);
    } else {
      setVisibleCount(4);
    }
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [updateVisibleCount]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  }, [categories.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  }, [categories.length]);

  // Autoplay every 4 seconds (paused on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Drag / Touch Swipe handler
  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -200) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 200) {
      handlePrev();
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-[var(--accent-1)]" />;
      case 'Presentation':
        return <Presentation className="w-5 h-5 text-[var(--accent-2)]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-[var(--accent-3)]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-[var(--accent-warn)]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[var(--accent-good)]" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-[var(--accent-1)]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-[var(--accent-2)]" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-[var(--accent-3)]" />;
      default:
        return <Brain className="w-5 h-5 text-[var(--accent-1)]" />;
    }
  };

  // Generate slice of categories for continuous loop display
  const visibleCategories = Array.from({ length: visibleCount }, (_, i) => {
    const index = (currentIndex + i) % categories.length;
    return {
      category: categories[index],
      virtualIndex: (currentIndex + i)
    };
  });

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <div
      ref={carouselRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Choose Your Assessment Category"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-7xl mx-auto py-2 focus:outline-none select-none"
    >
      {/* Navigation Buttons (Desktop & Tablet Floating Arrows) */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-5 z-20">
        <button
          onClick={handlePrev}
          aria-label="Previous assessment category"
          className="w-10 h-10 rounded-full glass-panel border border-[var(--border-glass)] flex items-center justify-center text-[var(--text)] hover:text-[var(--accent-1)] hover:border-[var(--accent-1)]/50 hover:scale-110 active:scale-95 transition-all shadow-xl bg-[var(--bg-elevated)]/90 backdrop-blur-md cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 -right-3 md:-right-5 z-20">
        <button
          onClick={handleNext}
          aria-label="Next assessment category"
          className="w-10 h-10 rounded-full glass-panel border border-[var(--border-glass)] flex items-center justify-center text-[var(--text)] hover:text-[var(--accent-1)] hover:border-[var(--accent-1)]/50 hover:scale-110 active:scale-95 transition-all shadow-xl bg-[var(--bg-elevated)]/90 backdrop-blur-md cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Container with Drag and Framer Motion Animation */}
      <div className="overflow-hidden px-1 py-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`grid gap-4 cursor-grab active:cursor-grabbing ${
              visibleCount === 1
                ? 'grid-cols-1'
                : visibleCount === 2
                ? 'grid-cols-2'
                : visibleCount === 3
                ? 'grid-cols-3'
                : 'grid-cols-4'
            }`}
          >
            {visibleCategories.map(({ category, virtualIndex }) => {
              const isActive = ACTIVE_CATEGORY_KEYS.includes(category.key);

              return (
                <div
                  key={`${category.key}-${virtualIndex}`}
                  onClick={() => {
                    if (isActive) {
                      onSelectCategory(category.key);
                    }
                  }}
                  title={!isActive ? "This assessment category is under development and will be available in a future update." : undefined}
                  className={`group relative glass-panel p-5 rounded-2xl flex flex-col justify-between h-[280px] border transition-all duration-500 overflow-hidden ${
                    isActive
                      ? 'bg-[var(--bg-elevated)]/90 border-[var(--border-glass)] hover:border-cyan-400/70 hover:shadow-[0_0_40px_rgba(6,182,212,0.35)] hover:scale-[1.03] -translate-y-0 hover:-translate-y-1.5 cursor-pointer'
                      : 'bg-[var(--bg-elevated)]/60 backdrop-blur-md opacity-75 border-[var(--border-glass)] cursor-not-allowed hover:border-[var(--accent-warn)]/50 hover:bg-[var(--bg-elevated)]/75'
                  }`}
                >
                  {/* Cyber Matrix Micro-Grid Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.12)_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Futuristic Corner HUD Reticles / Brackets */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-400 group-hover:scale-110 transition-all duration-300 pointer-events-none" />
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-400 group-hover:scale-110 transition-all duration-300 pointer-events-none" />
                  <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-400 group-hover:scale-110 transition-all duration-300 pointer-events-none" />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-400 group-hover:scale-110 transition-all duration-300 pointer-events-none" />

                  {/* Laser Scanline Holographic Sweep */}
                  <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-[280px] transition-all duration-1000 ease-in-out pointer-events-none shadow-[0_0_12px_#22d3ee]" />

                  {/* Ambient Cyber Neon Glow */}
                  <div
                    className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
                      isActive
                        ? 'bg-cyan-500/15 group-hover:bg-cyan-400/30 group-hover:scale-125'
                        : 'bg-[var(--accent-warn)]/10'
                    }`}
                  />

                  {/* Hover Tooltip for Coming Soon Cards */}
                  {!isActive && (
                    <div className="absolute inset-x-3 bottom-14 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-[var(--bg-surface)]/95 backdrop-blur-md text-[var(--text)] text-[11px] p-2.5 rounded-xl border border-[var(--accent-warn)]/40 shadow-2xl text-center leading-snug">
                        <div className="flex items-center justify-center gap-1 text-[var(--accent-warn)] font-semibold mb-0.5">
                          <Lock className="w-3 h-3" />
                          <span>Under Development</span>
                        </div>
                        This assessment category is under development and will be available in a future update.
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      {/* Futuristic Icon Ring Container */}
                      <div
                        className={`w-11 h-11 rounded-xl glass-panel flex items-center justify-center shadow-lg transition-all duration-300 relative border ${
                          isActive
                            ? 'bg-[var(--bg-elevated)] border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110'
                            : 'bg-[var(--bg-elevated)]/70 border-white/10 opacity-90'
                        }`}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {getCategoryIcon(category.iconName)}
                      </div>

                      {/* Status Badge with HUD pulse */}
                      {isActive ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                          </span>
                          <span className="uppercase tracking-wider">AVAILABLE</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[var(--accent-warn)]/10 text-[var(--accent-warn)] border border-[var(--accent-warn)]/20 shadow-sm">
                          <Lock className="w-3 h-3" />
                          <span>Coming Soon</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 block">
                        {category.subtitle}
                      </span>
                      <h3
                        className={`text-base font-bold transition-colors mt-0.5 ${
                          isActive
                            ? 'text-[var(--text)] group-hover:text-cyan-300'
                            : 'text-[var(--text)]/80'
                        }`}
                      >
                        {category.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed line-clamp-3 group-hover:text-[var(--text)] transition-colors">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Metadata Bar with Cyber Accents */}
                  <div className="pt-3 border-t border-[var(--border-glass)] group-hover:border-cyan-500/30 flex items-center justify-between text-xs text-[var(--text-muted)] relative z-10 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400/90">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>EST. {category.recommendedDuration}</span>
                    </div>

                    {isActive ? (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 group-hover:translate-x-1 group-hover:text-cyan-300 transition-all flex items-center gap-1">
                        INITIALIZE &rarr;
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold tracking-wider text-[var(--accent-warn)]/90 flex items-center gap-1 opacity-90">
                        <Lock className="w-3 h-3" />
                        <span>🚧 Coming Soon</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-4" role="tablist" aria-label="Carousel pagination">
        {categories.map((cat, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={cat.key}
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to ${cat.title}`}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-8 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] shadow-[0_0_10px_rgba(110,123,255,0.5)]'
                  : 'w-2 bg-[var(--border-glass)] hover:bg-[var(--text-faint)]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

