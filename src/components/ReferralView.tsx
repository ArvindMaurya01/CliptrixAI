import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, Users, Sparkles, Copy, Share2, CheckCircle2, ShieldAlert, 
  FileText, Award, ArrowRight, Info, Coins, Building2, UserCheck, 
  Smartphone, Check, Lock, AlertTriangle, ArrowLeft, RefreshCw, Zap
} from 'lucide-react';
import { ReferralReward, ReferralStats, UserProfile, ViewState } from '../types';

interface ReferralViewProps {
  onBack?: () => void;
  onNavigate?: (view: ViewState) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
  user?: UserProfile | null;
}

export const ReferralView: React.FC<ReferralViewProps> = ({
  onBack,
  onNavigate,
  showToast,
  user
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'athlete' | 'coach' | 'athlete-coach'>('all');

  // Referral code generated dynamically or default demo
  const userCode = user?.name ? `${user.name.replaceAll(/\s+/g, '').toUpperCase().slice(0, 6)}10` : 'CLIPTRIX10';
  const referralLink = `https://cliptrixai.com/ref/${userCode}`;

  // Safe initial stats (0 demo values as strictly instructed)
  const stats: ReferralStats = {
    referralCode: userCode,
    successfulReferrals: 0,
    creditsEarned: 0,
    walletCredits: 0,
    pendingRewards: 0
  };

  const rewardsList: ReferralReward[] = [
    {
      type: 'athlete',
      title: 'Teammate Referral (Give 10, Get 10)',
      description: 'Invite fellow athletes, students, or friends to train with ClipTrixAI.',
      reward: '10 AI Credits for Both',
      qualification: 'Referred user completes phone OTP verification & 1st AI video analysis.'
    },
    {
      type: 'coach',
      title: 'Academy & Coach Referral',
      description: 'Refer another coach or trainer to upgrade their team assessment toolset.',
      reward: '₹1,000 Wallet Credit & 1 Mo Free',
      qualification: 'Referred coach completes 1st month paid subscription billing cycle.'
    },
    {
      type: 'athlete-to-coach',
      title: 'Invite Your Coach (Bottom-Up Growth)',
      description: 'Bring your coach or academy onboard and get 1 year of Pro Athlete free.',
      reward: 'Pro Athlete FREE for 1 Year',
      qualification: 'Coach signs up using your invite & purchases an eligible Coach plan.'
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    if (showToast) {
      showToast('Referral link copied to clipboard!', 'success');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ClipTrixAI - AI Video Assessment',
          text: 'Use my invite code to get bonus AI analysis credits on ClipTrixAI!',
          url: referralLink,
        });
      } catch (err) {
        // Fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-[var(--text)]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
        <button
          onClick={() => {
            if (onBack) onBack();
            else if (onNavigate) onNavigate('landing');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs font-semibold hover:border-[var(--accent-1)]/50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--accent-1)]" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-[var(--accent-1)]/15 text-[var(--accent-1)] border border-[var(--accent-1)]/30">
            OFFICIAL REFERRAL PROGRAM
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden glass-panel p-8 sm:p-12 rounded-3xl border border-[var(--border-glass)] gradient-border-card text-center space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-1)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-2)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[var(--accent-1)]/20 via-purple-500/20 to-[var(--accent-2)]/20 text-[var(--accent-1)] border border-[var(--accent-1)]/40 shadow-sm">
          <Gift className="w-4 h-4 text-[var(--accent-1)] animate-bounce" />
          <span>Refer & Earn with ClipTrixAI</span>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[var(--text)]">
            Grow your team, help others improve, & earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-1)] via-indigo-400 to-[var(--accent-2)]">valuable rewards</span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto">
            Invite teammates, fellow athletes, coaches, and academies to ClipTrixAI. Earn AI analysis credits, wallet cash credits, or full annual subscription access.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('referral-dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent-1)]/25 flex items-center justify-center gap-2 cursor-pointer border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Start Referring</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToSection('referral-terms')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-[var(--text)] glass-panel hover:bg-[var(--border-glass)] border border-[var(--border-glass)] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 text-[var(--text-muted)]" />
            <span>View Referral Terms</span>
          </button>
        </div>
      </section>

      {/* How Referral Rewards Work (5 Step Flow) */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--accent-1)]">
            <Zap className="w-3.5 h-3.5" />
            <span>5-STEP ACTIVATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
            How Referral Rewards Work
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            Simple, transparent qualification. Rewards are activated automatically once server verification completes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Share Your Link',
              desc: 'Generate & share your unique referral code with friends, teammates or coaches.',
              icon: Share2
            },
            {
              step: '02',
              title: 'Friend Signs Up',
              desc: 'The referred user creates a brand-new eligible ClipTrixAI account.',
              icon: Users
            },
            {
              step: '03',
              title: 'Verification',
              desc: 'New user completes required account and phone OTP verification.',
              icon: Smartphone
            },
            {
              step: '04',
              title: 'Qualifying Action',
              desc: 'Completes 1st AI video analysis or purchases an eligible Coach plan.',
              icon: CheckCircle2
            },
            {
              step: '05',
              title: 'Reward Activated',
              desc: 'Bonus AI Credits or Wallet/Subscription Rewards are credited to both accounts.',
              icon: Award
            }
          ].map((s, idx) => {
            const IconComp = s.icon;
            return (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)] flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[var(--accent-1)]/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-[var(--accent-1)] px-2 py-0.5 rounded bg-[var(--accent-1)]/10 border border-[var(--accent-1)]/20">
                    STEP {s.step}
                  </span>
                  <IconComp className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-1)] transition-colors" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[var(--text)]">{s.title}</h3>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THREE GROWTH LOOPS */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--accent-1)]">
            <Coins className="w-3.5 h-3.5" />
            <span>GROWTH PROGRAMS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
            Three Ways to Earn Rewards
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            Choose the referral track that matches your role — whether you are an athlete, student, or academy coach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* LOOP 1 — TEAMMATE REFERRAL */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[var(--accent-1)]/60 transition-all shadow-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  B2C — ATHLETE → ATHLETE
                </span>
                <Users className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[var(--text)]">
                  Give 10 AI Credits, Get 10 AI Credits
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  Share your unique referral link with a teammate or fellow athlete.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-2 text-xs">
                <p className="text-[11px] font-mono font-bold text-[var(--accent-1)] uppercase">How it works:</p>
                <ol className="space-y-1.5 text-[11px] text-[var(--text-muted)] list-decimal list-inside">
                  <li>Athlete A shares unique referral link.</li>
                  <li>Athlete B signs up for a Free account.</li>
                  <li>Athlete B verifies phone number via OTP.</li>
                  <li>Athlete B completes 1st AI video analysis.</li>
                  <li>Athlete B receives 10 bonus AI Credits.</li>
                  <li>Athlete A receives 10 bonus AI Credits.</li>
                </ol>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Perfect for athletes and students training together.</span>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('referral-dashboard')}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Start Referring</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* LOOP 2 — ACADEMY REFERRAL */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[var(--accent-2)]/60 transition-all shadow-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  B2B — COACH → COACH
                </span>
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[var(--text)]">
                  Give 1 Month Elite, Get ₹1,000 Wallet Credit
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  Refer another coach and help them get started with ClipTrixAI's professional tools.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-2 text-xs">
                <p className="text-[11px] font-mono font-bold text-[var(--accent-2)] uppercase">How it works:</p>
                <ol className="space-y-1.5 text-[11px] text-[var(--text-muted)] list-decimal list-inside">
                  <li>Coach A shares unique referral link.</li>
                  <li>Coach B signs up through referral link.</li>
                  <li>Coach B gets 1st month free or active promo discount.</li>
                  <li>Coach B remains a paying subscriber.</li>
                  <li>Coach A gets ₹1,000 in ClipTrixAI wallet credit.</li>
                </ol>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 font-medium flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Designed for coaches, trainers, teams, and academies.</span>
              </div>

              <p className="text-[10px] text-[var(--text-faint)] italic leading-tight">
                *Coach B may receive a free first month or applicable promotional discount, as displayed at the time of referral.
              </p>
            </div>

            <button
              onClick={() => scrollToSection('referral-dashboard')}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Refer a Coach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* LOOP 3 — BOTTOM-UP REFERRAL (VISUALLY PROMINENT) */}
          <div className="glass-panel p-6 rounded-3xl border-2 border-[var(--accent-1)]/80 bg-gradient-to-b from-[var(--bg-elevated-solid)] via-[var(--bg-elevated)] to-[var(--bg-elevated-solid)] flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-[0_0_35px_rgba(110,123,255,0.2)] md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 h-1.5 left-0 bg-gradient-to-r from-[var(--accent-1)] via-purple-500 to-[var(--accent-2)] animate-pulse" />

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md">
                  B2B GROWTH — ATHLETE → COACH
                </span>
                <Award className="w-5 h-5 text-indigo-400" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[var(--text)] leading-snug">
                  Refer Your Coach, Get Pro Athlete FREE for 1 Year
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  Your coach can unlock professional team tools while you get Pro Athlete access.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--accent-1)]/30 space-y-2 text-xs">
                <p className="text-[11px] font-mono font-bold text-[var(--accent-1)] uppercase">How it works:</p>
                <ol className="space-y-1.5 text-[11px] text-[var(--text-muted)] list-decimal list-inside">
                  <li>Athlete generates a Coach Invite link.</li>
                  <li>Athlete shares the link with their coach.</li>
                  <li>Coach signs up using the invite link.</li>
                  <li>Coach purchases an eligible Coach subscription.</li>
                  <li>Referring athlete gets Pro Athlete access for 12 months.</li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-r from-[var(--accent-1)]/20 to-purple-500/20 border border-[var(--accent-1)]/40 flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text)]">Reward Value:</span>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--accent-1)] text-white text-xs font-black uppercase font-mono shadow-sm">
                  Pro Athlete — 12 Months
                </span>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('referral-dashboard')}
              className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:opacity-95 transition-all shadow-lg shadow-[var(--accent-1)]/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Invite Your Coach</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* REFERRAL DASHBOARD / CTA AREA */}
      <section id="referral-dashboard" className="glass-panel p-6 sm:p-10 rounded-3xl border border-[var(--border-glass)] space-y-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-glass)] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent-1)]">
              <UserCheck className="w-3.5 h-3.5" />
              <span>YOUR REFERRAL HUB</span>
            </div>
            <h2 className="text-2xl font-black text-[var(--text)] mt-1">
              Your Referral Dashboard
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Copy your personalized link, track invites, and monitor activated rewards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/30 font-bold">
              CODE: {userCode}
            </span>
          </div>
        </div>

        {/* Share Link Control Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <label className="text-xs font-bold text-[var(--text)] uppercase tracking-wider block">
              Your Unique Referral Link
            </label>
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)]">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm font-mono font-semibold text-[var(--text)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-[var(--accent-1)] text-white hover:opacity-90'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-[var(--border-glass)] hover:bg-[var(--accent-1)]/20 text-[var(--text)] transition-colors cursor-pointer shrink-0"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-4 rounded-2xl bg-[var(--bg-elevated)]/60 border border-[var(--border-glass)] text-xs text-[var(--text-muted)] space-y-1.5">
            <p className="font-bold text-[var(--text)] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[var(--accent-1)]" />
              <span>Backend-Ready Validation:</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Referrals are tracked securely server-side upon phone verification and qualifying actions. Zero fake activations permitted.
            </p>
          </div>
        </div>

        {/* Statistics Cards (Safe Initial Demo Values) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] block">
              Successful Referrals
            </span>
            <span className="text-3xl font-black mono-nums text-[var(--text)] block">
              {stats.successfulReferrals}
            </span>
            <span className="text-[10px] text-[var(--text-faint)] block">Verified activations</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">
              AI Credits Earned
            </span>
            <span className="text-3xl font-black mono-nums text-[var(--text)] block">
              {stats.creditsEarned}
            </span>
            <span className="text-[10px] text-[var(--text-faint)] block">Bonus analysis credits</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block">
              Subscription Rewards
            </span>
            <span className="text-3xl font-black mono-nums text-[var(--text)] block">
              ₹{stats.walletCredits}
            </span>
            <span className="text-[10px] text-[var(--text-faint)] block">Wallet / plan time</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
              Pending Rewards
            </span>
            <span className="text-3xl font-black mono-nums text-[var(--text)] block">
              {stats.pendingRewards}
            </span>
            <span className="text-[10px] text-[var(--text-faint)] block">Awaiting qualification</span>
          </div>
        </div>
      </section>

      {/* FAIR USE & FRAUD PREVENTION */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--border-glass)] pb-4">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h2 className="text-xl font-extrabold text-[var(--text)]">
              Fair Use & Fraud Prevention
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              To maintain platform security and reward integrity, strict automated anti-fraud policies apply.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1.5">
            <p className="font-bold text-[var(--text)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Self-Referral Prohibition</span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Users cannot refer themselves by creating multiple accounts or using temporary email addresses.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1.5">
            <p className="font-bold text-[var(--text)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>No Fake Accounts</span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Creating fake or duplicate accounts to artificially accumulate referral credits is strictly prohibited.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1.5">
            <p className="font-bold text-[var(--text)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Referral Spam Restrictions</span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Referral codes must be shared with genuine personal/professional connections. Do not post on coupon sites, deal forums, spam messages, or paid search ads (e.g. Google Ads).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] space-y-1.5">
            <p className="font-bold text-[var(--text)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Reward Revocation & Enforcement</span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              ClipTrixAI reserves the right to withhold, cancel, or reverse rewards and suspend accounts in cases of confirmed fraud, self-referral, or terms violations.
            </p>
          </div>
        </div>
      </section>

      {/* REFERRAL TERMS & CONDITIONS */}
      <section id="referral-terms" className="glass-panel p-6 sm:p-10 rounded-3xl border border-[var(--border-glass)] space-y-8">
        <div className="border-b border-[var(--border-glass)] pb-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent-1)]">
            <FileText className="w-3.5 h-3.5" />
            <span>LEGAL & POLICY DIRECTIVES</span>
          </div>
          <h2 className="text-2xl font-black text-[var(--text)]">
            Referral Terms & Conditions
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Detailed governing rules for eligibility, reward issuance, vesting, and policy compliance.
          </p>
        </div>

        <div className="space-y-6 text-xs text-[var(--text-muted)] leading-relaxed">
          {/* Section 1: Eligibility */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-mono">
              1. Eligibility Requirements
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[11px]">
              <li><strong className="text-[var(--text)]">Active Users Only:</strong> The referring user ("Referrer") must hold an active, verified ClipTrixAI account in good standing.</li>
              <li><strong className="text-[var(--text)]">Genuinely New Users:</strong> A referral is valid only for a brand-new user who has not previously created or maintained an account on ClipTrixAI.</li>
              <li><strong className="text-[var(--text)]">Verification Checks:</strong> Eligibility may be evaluated using account details, phone/email verification, and standard security signals, subject to applicable laws.</li>
            </ul>
          </div>

          {/* Section 2: Earning Rewards */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-mono">
              2. Earning & Activating Rewards
            </h3>
            <p className="text-[11px]">
              For the "Give 10, Get 10" Athlete program, the referred user must create an eligible account, complete phone/email verification, and complete their first successful AI video analysis. Credits are issued server-side only after the qualifying action is verified.
            </p>
          </div>

          {/* Section 3: Coach / Financial Rewards */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-mono">
              3. Coach & Financial Rewards (Vesting Period)
            </h3>
            <p className="text-[11px]">
              For Coach-to-Coach referrals, the ₹1,000 wallet credit is subject to a qualification/vesting period. Credit is awarded only after the referred coach completes an eligible paid subscription purchase, finishes the required qualifying billing period, and has not requested a refund or chargeback.
            </p>
          </div>

          {/* Section 4: Athlete -> Coach Reward */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-mono">
              4. Athlete → Coach Reward
            </h3>
            <p className="text-[11px]">
              The referring athlete becomes eligible for 12 months of Pro Athlete access when their coach registers using their invite link and completes a qualifying Coach plan purchase.
            </p>
          </div>

          {/* Highlighted Policy Box: No Cash Payout */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-200 space-y-1">
            <p className="font-extrabold text-xs uppercase font-mono flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>IMPORTANT POLICY: NO CASH PAYOUT</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Referral rewards are provided as in-app AI credits, wallet credits, subscription discounts, or subscription time. Referral rewards are strictly non-transferable and are not redeemable for cash, bank transfers, or UPI payments.
            </p>
          </div>

          {/* Section 5: Changes & Modifications */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-mono">
              5. Program Modifications
            </h3>
            <p className="text-[11px]">
              ClipTrixAI may modify referral rewards, eligibility requirements, qualification criteria, or terminate the referral program when necessary. Current referral terms and reward conditions displayed in the app will apply to new referrals.
            </p>
          </div>

          {/* Section 6: OTP & Technical Security */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider font-mono">
              6. Security & Verification Signals
            </h3>
            <p className="text-[11px]">
              To protect the referral program from abuse, ClipTrixAI may require phone or email verification before referral rewards are activated. ClipTrixAI may use appropriate account, device, network, and behavioral signals, where legally permitted, to detect duplicate accounts, automated abuse, and fraudulent referral activity.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-[var(--border-glass)] text-center space-y-6 bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--bg-elevated-solid)] to-[var(--bg-elevated)]">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text)]">
            Ready to Grow Your Community?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Start sharing your unique link today and help athletes and coaches unlock AI-powered performance insights.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => scrollToSection('referral-dashboard')}
            className="px-8 py-4 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:scale-105 transition-all shadow-xl shadow-[var(--accent-1)]/30 cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Get Your Referral Link</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ReferralView;
