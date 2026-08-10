import React, { useState, useEffect } from 'react';
import { CATEGORIES, SUBSCRIPTION_PLANS } from '../data/mockData';
import { ViewState, SubscriptionPlan } from '../types';
import { CategoryCarousel } from './CategoryCarousel';
import { TiltCard } from './TiltCard';
import { WelcomeBannerCarousel } from './WelcomeBannerCarousel';
import { saveOrderRecord } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Briefcase, Presentation, Shield, 
  MessageSquare, BookOpen, Trophy, GraduationCap, Smile, 
  Brain, Check, Video, Target, Globe, FileText, Layers, X,
  CheckCircle2, Info, CreditCard, Zap, ShieldCheck, Cpu, Clock, Lock,
  Gift
} from 'lucide-react';

const SHOWCASE_FEATURES = [
  {
    icon: Video,
    title: 'AI Video Analysis',
    description: 'Frame-by-frame Gemini vision scoring & multimodal feedback',
    tag: 'VISION AI'
  },
  {
    icon: Target,
    title: 'Objective Scoring Engine',
    description: 'Weighted evaluation rubrics & critical fault detection',
    tag: 'PRECISION'
  },
  {
    icon: Globe,
    title: 'Multi-Language Reports',
    description: 'Instant auto-translation of reports into 20+ languages',
    tag: 'GLOBAL'
  },
  {
    icon: FileText,
    title: 'Instant PDF/DOCX Export',
    description: 'Publication-grade executive reports with HUD charts',
    tag: 'EXPORT'
  },
  {
    icon: Layers,
    title: 'Category-Specific Rubrics',
    description: 'Tailored metrics for sports, interviews, presentations & teaching',
    tag: 'RUBRICS'
  }
];

interface LandingViewProps {
  onStartAssessment: (categoryKey?: string) => void;
  onNavigateAuth: () => void;
  onNavigate?: (view: ViewState) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartAssessment,
  onNavigateAuth,
  onNavigate,
  onShowToast
}) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isFeatureHovered, setIsFeatureHovered] = useState(false);
  const [localToastMessage, setLocalToastMessage] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [comingSoonPlan, setComingSoonPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    if (isFeatureHovered) return;
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % SHOWCASE_FEATURES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isFeatureHovered]);

  const handlePlanSelectCTA = async (e: React.MouseEvent, plan: SubscriptionPlan) => {
    e.stopPropagation();

    try {
      await saveOrderRecord({
        plan_name: plan.name,
        price: billingCycle === 'annual' && plan.annualPrice ? `₹${plan.annualPrice}/mo (Annual)` : plan.priceLabel,
        user_email: 'user@cliptrix.ai',
        status: 'active'
      });
    } catch (err) {
      console.error(err);
    }

    if (onShowToast) {
      onShowToast(`Redirecting to Sign In for ${plan.name} (${plan.priceLabel})...`, 'success');
    }
    onNavigateAuth();
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    },
    viewport: { once: false, amount: 0.1 }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 35, scale: 0.96 },
    whileInView: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
    viewport: { once: false, amount: 0.1 }
  };

  const individualPlans = SUBSCRIPTION_PLANS.filter(p => p.track === 'individual');
  const professionalPlans = SUBSCRIPTION_PLANS.filter(p => p.track === 'professional');

  const getBadgeStyle = (badge?: string) => {
    if (badge === 'MOST POPULAR') {
      return 'bg-gradient-to-r from-[var(--accent-1)] via-purple-600 to-[var(--accent-3)] text-white shadow-lg shadow-[var(--accent-1)]/30 border border-white/20 font-extrabold';
    }
    if (badge === 'BEST VALUE FOR COACHES') {
      return 'bg-gradient-to-r from-[var(--accent-2)] via-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30 border border-white/20 font-extrabold';
    }
    if (badge === 'ENTERPRISE & ACADEMY') {
      return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md border border-amber-300/40 font-extrabold';
    }
    return 'bg-[var(--bg-elevated-solid)] text-[var(--text-muted)] border border-[var(--border-glass)] font-semibold';
  };  const renderModalBreakdown = (plan: SubscriptionPlan) => {
    switch (plan.id) {
      case 'free':
        return (
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Credits</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">2–3 AI credits/mo</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Storage</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block truncate">Max 5 videos</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Reports</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">Basic AI Report</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Watermark</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">With Watermark</span>
            </div>
          </div>
        );
      case 'pro-athlete':
        return (
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">AI Credits</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">20–30 credits/mo</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Analysis</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block truncate">Skeletal + Biomechanical</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Storage</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">Unlimited Cloud</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Watermark</span>
              <span className="text-[var(--accent-good)] font-semibold mt-0.5 block">No Watermark</span>
            </div>
          </div>
        );
      case 'coach-starter':
        return (
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Roster</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">10–15 Athletes</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">AI Credits</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">100 Shared/mo</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Management</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block truncate">Athlete Roster</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Reports</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">Individual Reports</span>
            </div>
          </div>
        );
      case 'coach-elite':
        return (
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Athletes</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">Unlimited</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Coaches</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">Multi-Coach Access</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">AI Processing</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">High Volume</span>
            </div>
            <div className="bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-glass)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase font-mono font-bold">Reports</span>
              <span className="text-[var(--text)] font-semibold mt-0.5 block">Custom Branded</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCard = (plan: SubscriptionPlan) => {
    const isPreferred = plan.isPreferred || plan.badge === 'MOST POPULAR' || plan.badge === 'BEST VALUE FOR COACHES';

    return (
      <div key={plan.id} className="h-full pt-4">
        <TiltCard className="h-full">
          <div
            className={`p-6 flex flex-col justify-between relative h-full rounded-2xl transition-all duration-300 group ${
              isPreferred
                ? 'border-2 border-[var(--accent-1)]/80 bg-[var(--bg-elevated-solid)] shadow-[0_0_35px_rgba(110,123,255,0.2)] md:-translate-y-2 md:scale-[1.02]'
                : 'glass-panel border border-[var(--border-glass)] hover:border-[var(--accent-1)]/60 hover:shadow-[0_0_25px_rgba(110,123,255,0.15)]'
            }`}
          >
            {/* Background effects container with overflow-hidden */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              {/* Top Animated Bar */}
              {isPreferred ? (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--accent-1)] via-purple-500 to-[var(--accent-2)] animate-pulse" />
              ) : (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-1)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              {/* Corner Tech Notches */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-[var(--accent-1)]/40" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-[var(--accent-1)]/40" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-[var(--accent-1)]/20" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-[var(--accent-1)]/20" />
            </div>

            {/* Glowing Badge positioned outside overflow */}
            {plan.badge && (
              <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getBadgeStyle(plan.badge)} flex items-center gap-1.5 z-30 shadow-lg`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span>{plan.badge}</span>
              </div>
            )}

            <div className="space-y-4 pt-1 relative z-10">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-extrabold text-[var(--text)] group-hover:text-[var(--accent-1)] transition-colors flex items-center gap-2">
                    <span>{plan.name}</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--accent-1)] border border-[var(--border-glass)] font-bold tracking-widest">
                    {plan.track === 'individual' ? 'TRACK A' : 'TRACK B'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Anchor Pricing Block HUD Box */}
              <div className="py-3 px-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-1)]/5 rounded-full blur-xl pointer-events-none" />
                {billingCycle === 'annual' && plan.price > 0 ? (
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold line-through text-[var(--text-faint)]">
                        {plan.monthlyAnchorPriceLabel}
                      </span>
                      <span className="text-3xl font-black mono-nums text-[var(--text)]">
                        ₹{plan.annualPrice}
                      </span>
                      <span className="text-xs font-semibold text-[var(--text-muted)]">/ month</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--accent-good)] pt-0.5">
                      <span>Billed annually at ₹{(plan.annualPrice! * 12).toLocaleString()} / yr</span>
                      <span className="px-2 py-0.5 rounded-full bg-[var(--accent-good)]/15 border border-[var(--accent-good)]/30 text-[9px] uppercase font-black tracking-widest text-[var(--accent-good)]">
                        SAVE 20%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5 relative z-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black mono-nums text-[var(--text)]">{plan.priceLabel}</span>
                    </div>
                    <p className="text-[11px] font-medium text-[var(--text-muted)]">
                      {plan.price === 0 ? 'Free forever • No credit card required' : 'Billed monthly'}
                    </p>
                  </div>
                )}
              </div>

              {/* Plan Specifications Details */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-mono uppercase font-bold text-[var(--accent-1)] tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-[var(--accent-1)]" />
                  <span>Plan Specifications</span>
                </div>
                {renderModalBreakdown(plan)}
              </div>

              {/* Key Capabilities */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-glass)]">
                <div className="text-[10px] font-mono uppercase font-bold text-[var(--accent-1)] tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[var(--accent-1)]" />
                  <span>Included Capabilities</span>
                </div>
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-[var(--text)] leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-good)] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 space-y-3 relative z-10">
              <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-[11px] text-[var(--text-muted)] flex items-start gap-2">
                <Target className="w-3.5 h-3.5 text-[var(--accent-1)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--text)]">Primary Goal: </span>
                  {plan.goal}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handlePlanSelectCTA(e, plan)}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 group/btn relative overflow-hidden ${
                  isPreferred
                    ? 'text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:opacity-95 shadow-[var(--accent-1)]/25 hover:scale-[1.01] active:scale-[0.99]'
                    : 'text-[var(--text)] glass-panel hover:bg-[var(--border-glass)] hover:text-[var(--accent-1)] border border-[var(--border-glass)] hover:border-[var(--accent-1)]/50'
                }`}
              >
                {/* Button shine sweep */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover/btn:translate-x-[300%] transition-transform duration-700 pointer-events-none" />

                {plan.id !== 'free' && (
                  <CreditCard className="w-4 h-4 shrink-0" />
                )}
                <span>{billingCycle === 'annual' ? (plan.annualCta || plan.cta) : plan.cta}</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </TiltCard>
      </div>
    );
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-2 view-enter overflow-x-hidden relative">
      {/* Local Notification Toast */}
      {localToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel border border-[var(--accent-1)]/40 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Info className="w-5 h-5 text-[var(--accent-1)] shrink-0" />
          <p className="text-xs font-semibold text-[var(--text)]">{localToastMessage}</p>
          <button 
            onClick={() => setLocalToastMessage(null)}
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: false, amount: 0.1 }}
        className="py-6 px-4 max-w-7xl mx-auto text-center lg:text-left"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-4">
            <WelcomeBannerCarousel />

            <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-[var(--text)]">
              Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">video</span> assessment <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)]">engine</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Upload raw footage to extract micro-expressions, vocal pacing, and structural posture in ninety seconds. Get immediate diagnostics mapped to real performance benchmarks.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                onClick={() => onStartAssessment()}
                className="relative group overflow-hidden w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_30px_rgba(110,123,255,0.4)] hover:shadow-[0_0_50px_rgba(110,123,255,0.7)] flex items-center justify-center gap-3 cursor-pointer border border-white/25 mx-auto lg:mx-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
                <span className="tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-100 uppercase">
                  Start Free Assessment
                </span>
                <ArrowRight className="w-5 h-5 text-cyan-300 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Feature Showcase Card */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex justify-center">
            <div 
              className="relative w-full max-w-md glass-panel p-6 text-center shadow-xl gradient-border-card hover:scale-[1.01] transition-transform duration-500 overflow-hidden flex flex-col justify-between min-h-[300px]"
              onMouseEnter={() => setIsFeatureHovered(true)}
              onMouseLeave={() => setIsFeatureHovered(false)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-1)] animate-pulse" />
                  PLATFORM CAPABILITIES
                </span>
                <div className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/30 animate-pulse">
                  FEATURE SHOWCASE
                </div>
              </div>

              <div className="py-5 relative min-h-[170px] flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center space-y-3.5 w-full"
                  >
                    <div className="relative flex items-center justify-center w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)] opacity-30 blur-md animate-pulse" />
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)] opacity-35 animate-spin [animation-duration:9s]" />
                      <div className="relative w-14 h-14 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] shadow-xl flex items-center justify-center">
                        {React.createElement(SHOWCASE_FEATURES[activeFeature].icon, {
                          className: "w-7 h-7 text-[var(--accent-1)]"
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20">
                        {SHOWCASE_FEATURES[activeFeature].tag}
                      </span>
                      <h3 className="text-lg font-extrabold text-[var(--text)] tracking-tight">
                        {SHOWCASE_FEATURES[activeFeature].title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
                        {SHOWCASE_FEATURES[activeFeature].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pt-3 border-t border-[var(--border-glass)] flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                  0{activeFeature + 1} / 0{SHOWCASE_FEATURES.length}
                </span>

                <div className="flex items-center justify-center gap-1.5">
                  {SHOWCASE_FEATURES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveFeature(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeFeature
                          ? 'w-6 bg-[var(--accent-1)] shadow-[0_0_8px_var(--accent-1)]'
                          : 'w-1.5 bg-[var(--border-glass)] hover:bg-[var(--text-muted)]'
                      }`}
                      aria-label={`Go to feature ${idx + 1}`}
                    />
                  ))}
                </div>

                <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                  {isFeatureHovered ? 'PAUSED' : 'AUTO'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Assessment Pipeline */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: false, amount: 0.1 }}
        id="how-it-works" 
        className="py-6 px-4 max-w-5xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text)]">
            The Assessment Pipeline
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            Four simple steps from raw video to publication-grade executive reporting.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {[
            { step: '01', title: 'Upload Video', desc: 'Drop an MP4, MOV file or record live via webcam.' },
            { step: '02', title: 'Select Domain', desc: 'Pick from 8 specialized evaluation rubrics.' },
            { step: '03', title: 'Multimodal AI', desc: 'Sub-second analysis of audio, gaze, and posture.' },
            { step: '04', title: 'Actionable PDF', desc: 'Receive HUD scores, radar charts, and growth drills.' }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="glass-panel p-5 text-center space-y-2 relative hover:scale-[1.02] transition-transform duration-300 shadow-xl"
            >
              <span className="text-xl font-bold mono-nums text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)]">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-[var(--text)]">{item.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Categories Carousel */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: false, amount: 0.1 }}
        id="categories" 
        className="py-6 px-4 max-w-7xl mx-auto space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center mb-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Calibration Models</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text)]">
            Choose Your Assessment Category
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            Tailored AI evaluation models calibrated for professional, academic, and athletic performance.
          </p>
        </motion.div>

        <CategoryCarousel categories={CATEGORIES} onSelectCategory={onStartAssessment} />
      </motion.section>

      {/* Updated Subscription / Pricing Section */}
      <motion.section 
        variants={staggerContainer}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: false, amount: 0.1 }}
        id="pricing" 
        className="py-10 px-4 max-w-7xl mx-auto space-y-12"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flexible Subscription Plans</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text)]">
            Choose Your Plan
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade when you need more AI analysis and professional performance tools.
          </p>

          {/* Billing Cycle Toggle (Monthly vs Annual with Anchor Pricing) */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 p-1.5 rounded-full glass-panel border border-[var(--border-glass)] bg-[var(--bg-elevated)]/80 shadow-md">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[var(--accent-1)] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                Monthly Billing
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-400 text-black shadow-sm">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Track A — Individual Users */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="border-b border-[var(--border-glass)] pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[var(--accent-1)]/15 text-[var(--accent-1)] border border-[var(--accent-1)]/30">
                TRACK A
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[var(--text)]">
                TRACK A — FOR INDIVIDUALS
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5">
              Built for athletes, students and individuals who want personal improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {individualPlans.map((plan) => renderCard(plan))}
          </div>
        </motion.div>

        {/* Track B — Professional Users */}
        <motion.div variants={itemVariants} className="space-y-6 pt-4">
          <div className="border-b border-[var(--border-glass)] pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[var(--accent-2)]/15 text-[var(--accent-2)] border border-[var(--accent-2)]/30">
                TRACK B
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-[var(--text)]">
                TRACK B — FOR PROFESSIONALS
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5">
              Built for coaches, trainers, teams and academies managing multiple users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {professionalPlans.map((plan) => renderCard(plan))}
          </div>
        </motion.div>

        {/* Separate Referral Program Card */}
        <motion.div variants={itemVariants} className="pt-6">
          <div 
            onClick={() => {
              if (onNavigate) {
                onNavigate('referral');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="group relative glass-panel p-6 sm:p-8 rounded-3xl border-2 border-[var(--accent-1)]/60 bg-gradient-to-r from-[var(--bg-elevated-solid)] via-[var(--bg-elevated)] to-[var(--bg-elevated-solid)] hover:border-[var(--accent-1)] hover:shadow-[0_0_40px_rgba(110,123,255,0.25)] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Animated top border line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--accent-1)] via-purple-500 to-[var(--accent-2)] animate-pulse" />

            {/* Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-gradient-to-r from-[var(--accent-1)] via-purple-600 to-[var(--accent-3)] text-white shadow-md flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-white animate-bounce" />
                <span>REFER & EARN</span>
              </span>
            </div>

            <div className="space-y-6 max-w-4xl relative z-10">
              <div className="space-y-2 pt-1">
                <h3 className="text-2xl sm:text-3xl font-black text-[var(--text)] group-hover:text-[var(--accent-1)] transition-colors flex items-center gap-2">
                  <span>Refer & Earn</span>
                  <ArrowRight className="w-5 h-5 text-[var(--accent-1)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all" />
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
                  Invite your teammates, coaches, and friends to ClipTrixAI and earn AI credits or subscription rewards.
                </p>
              </div>

              {/* 3 Reward Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] group-hover:border-[var(--accent-1)]/30 transition-colors space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--accent-1)] block">
                    Athlete → Athlete
                  </span>
                  <p className="text-xs font-extrabold text-[var(--text)]">
                    Give 10 AI Credits, Get 10 AI Credits
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] group-hover:border-[var(--accent-1)]/30 transition-colors space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--accent-2)] block">
                    Coach → Coach
                  </span>
                  <p className="text-xs font-extrabold text-[var(--text)]">
                    Give 1 Month Elite, Get ₹1,000 Wallet Credit
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] group-hover:border-[var(--accent-1)]/30 transition-colors space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-purple-400 block">
                    Athlete → Coach
                  </span>
                  <p className="text-xs font-extrabold text-[var(--text)]">
                    Refer Your Coach, Get Pro Athlete FREE for 1 Year
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-1 flex items-center gap-3">
                <span className="px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] group-hover:opacity-95 shadow-md flex items-center gap-2">
                  <span>View Referral Program</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-medium hidden sm:inline">
                  Explore all 3 growth loops & rewards →
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Futuristic Coming Soon Payment Modal */}
      <AnimatePresence>
        {comingSoonPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setComingSoonPlan(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-950/95 border-2 border-cyan-500/60 shadow-[0_0_60px_rgba(56,189,248,0.35)] rounded-2xl max-w-md w-full p-6 space-y-6 text-white overflow-hidden my-auto"
            >
              {/* Holographic Top Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 animate-pulse" />

              {/* Corner crosshairs */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-cyan-400/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-cyan-400/40 pointer-events-none" />

              {/* Close button */}
              <button
                type="button"
                onClick={() => setComingSoonPlan(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Icon */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-400/50 flex items-center justify-center shadow-xl shadow-cyan-500/20 relative">
                  <CreditCard className="w-8 h-8 text-cyan-300 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    PAYMENT GATEWAY INTEGRATION
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white pt-1">
                    Payment Method Coming Soon!
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                    Automated payment processing (UPI, Razorpay, Credit/Debit Cards & NetBanking) is currently being connected.
                  </p>
                </div>
              </div>

              {/* Plan Summary Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Selected Tier:</span>
                  <span className="font-extrabold text-cyan-300">{comingSoonPlan.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Pricing:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {billingCycle === 'annual' && comingSoonPlan.annualPrice
                      ? `₹${comingSoonPlan.annualPrice}/mo (Billed Annually)`
                      : comingSoonPlan.priceLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 font-medium">Order Status:</span>
                  <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Interest Saved & Logged</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setComingSoonPlan(null);
                    onNavigateAuth();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Account Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setComingSoonPlan(null)}
                  className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
                >
                  Close & Explore Features
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
