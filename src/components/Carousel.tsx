import React, { useState, useEffect, useRef } from 'react';
import { SHOWCASE_SLIDES } from '../data/mockData';
import { HudRing } from './HudRing';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CarouselProps {
  onSelectCategory?: (categoryKey: string) => void;
}

export const Carousel: React.FC<CarouselProps> = ({ onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slides = SHOWCASE_SLIDES;

  useEffect(() => {
    if (isPaused) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
    touchStartX.current = null;
  };

  const slide = slides[currentIndex];

  return (
    <section 
      className="py-16 px-4 max-w-6xl mx-auto focus:outline-none"
      aria-roledescription="carousel"
      aria-label="Sample Reports Showcase"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Showcase</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text)]">
          See What an AI Assessment Report Looks Like
        </h2>
        <p className="mt-2 text-[var(--text-muted)] max-w-xl mx-auto">
          Every category delivers precision telemetry, attribute matrices, and actionable growth paths.
        </p>
      </div>

      <div className="relative glass-panel p-6 md:p-10 transition-all duration-300">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[var(--text)] hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-[var(--text)] hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: HUD Ring & Category Header */}
          <div className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left space-y-4">
            <span className="text-xs uppercase tracking-widest text-[var(--accent-2)] font-semibold">
              Slide {currentIndex + 1} of {slides.length}
            </span>
            <h3 className="text-2xl font-bold text-[var(--text)]">
              {slide.categoryName}
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {slide.description}
            </p>

            <div className="pt-2">
              <HudRing score={slide.overallScore} size={130} label="Overall Score" />
            </div>

            {onSelectCategory && (
              <button
                onClick={() => onSelectCategory(slide.categoryKey)}
                className="mt-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 active:scale-95 transition-all shadow-md"
              >
                Try This Assessment Category
              </button>
            )}
          </div>

          {/* Right: Attribute Bars & AI Insight */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Key Evaluated Attributes
              </h4>
              {slide.attributes.map((attr, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[var(--text)]">{attr.name}</span>
                    <span className="mono-nums text-[var(--accent-1)] font-bold">{attr.score}/100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--border-glass)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] transition-all duration-1000 ease-out"
                      style={{ width: `${attr.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insight Callout */}
            <div className="p-4 rounded-xl bg-[var(--accent-1)]/5 border border-[var(--accent-1)]/20 flex gap-3 items-start">
              <Sparkles className="w-5 h-5 text-[var(--accent-1)] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-1)]">
                  AI Prescriptive Insight
                </h5>
                <p 
                  className="text-xs text-[var(--text)] mt-1 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: slide.insight }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? 'w-8 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)]' 
                  : 'w-2 bg-[var(--border-glass)] hover:bg-[var(--text-faint)]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
