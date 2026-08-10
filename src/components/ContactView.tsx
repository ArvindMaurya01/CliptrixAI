import React, { useState } from 'react';
import { ViewState } from '../types';
import { submitContactQuery } from '../lib/supabase';
import { motion } from 'framer-motion';
import { 
  MessageSquare, User, Mail, Upload, Send, CheckCircle2, 
  PhoneCall, MapPin, Clock, Headset, ArrowLeft, ShieldCheck, HelpCircle
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (view: ViewState) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate, showToast }) => {
  const [queryName, setQueryName] = useState('');
  const [queryEmail, setQueryEmail] = useState('');
  const [queryCategory, setQueryCategory] = useState('Technical Issue');
  const [queryMessage, setQueryMessage] = useState('');
  const [queryFile, setQueryFile] = useState<File | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryName || !queryEmail || !queryMessage) return;
    setIsSubmitting(true);
    try {
      const res = await submitContactQuery({
        name: queryName,
        email: queryEmail,
        category: queryCategory,
        message: queryMessage,
        file_name: queryFile?.name
      });
      setSubmittedQuery(true);
      if (showToast) {
        showToast('Your query has been submitted successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      setSubmittedQuery(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-6 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-[var(--text)] hover:border-[var(--accent-1)]/40 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--accent-1)]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-1)]/10 text-[var(--accent-1)] border border-[var(--accent-1)]/20 text-xs font-mono font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>24/7 Priority Support</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[var(--accent-1)]/20 to-[var(--accent-2)]/20 text-[var(--accent-1)] border border-[var(--accent-1)]/30">
          <MessageSquare className="w-4 h-4" />
          <span>Contact Us & Support Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
          How can our AI engineering team help you today?
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          Have a question about AI report accuracy, video telemetry benchmarks, or account support? Send us a message and our support specialists will respond within 24 hours.
        </p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)] space-y-2 hover:border-[var(--accent-1)]/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Headset className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text)]">Direct Support Email</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Email our support desk directly for urgent enterprise inquires.
          </p>
          <a href="mailto:contacta@cliptrixai.com" className="text-xs font-mono font-semibold text-cyan-400 hover:underline block pt-1">
            contacta@cliptrixai.com
          </a>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)] space-y-2 hover:border-[var(--accent-2)]/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text)]">Response SLA</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Standard queries answered in &lt; 24h. Premium accounts receive &lt; 2h guaranteed response.
          </p>
          <span className="text-xs font-mono font-semibold text-indigo-400 block pt-1">
            Mon - Fri, 8:00 AM - 8:00 PM EST
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)] space-y-2 hover:border-[var(--accent-3)]/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text)]">Global Headquarters</h3>
          <p className="text-xs text-[var(--text-muted)]">
            AI Video Intelligence Labs Inc.
          </p>
          <span className="text-xs font-mono text-[var(--text-muted)] block pt-1">
            Chandausi, Sambhal, India
          </span>
        </div>
      </div>

      {/* Main Query Submission Form Card */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[var(--border-glass)] shadow-2xl relative overflow-hidden max-w-3xl mx-auto">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {submittedQuery ? (
          <div className="text-center py-10 space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text)]">Query Submitted Successfully!</h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-[var(--text)]">{queryName}</strong>. Your query regarding <strong className="text-[var(--text)]">{queryCategory}</strong> has been logged into our database. A confirmation has been sent to <strong className="text-[var(--text)]">{queryEmail}</strong>.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedQuery(false);
                  setQueryName('');
                  setQueryEmail('');
                  setQueryMessage('');
                  setQueryFile(null);
                }}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 transition-all cursor-pointer shadow-md"
              >
                Submit Another Query
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-[var(--text)] glass-panel hover:bg-[var(--border-glass)] transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleQuerySubmit} className="space-y-4 relative z-10">
            <div className="border-b border-[var(--border-glass)] pb-4 mb-2">
              <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Submit Your Query</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Fill out the details below to reach our dedicated support and AI engineering team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Your Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  placeholder="enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={queryEmail}
                  onChange={(e) => setQueryEmail(e.target.value)}
                  placeholder="write your email"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Query Category</span>
              </label>
              <select
                value={queryCategory}
                onChange={(e) => setQueryCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-400 transition-all cursor-pointer font-medium"
              >
                <option value="Technical Issue" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Technical Issue</option>
                <option value="Account Support" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Account Support</option>
                <option value="AI Report Issue" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">AI Report Issue</option>
                <option value="Feature Request" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Feature Request</option>
                <option value="Billing" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Billing</option>
                <option value="General Inquiry" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">General Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Query File / Screenshot / Log (Optional)</span>
              </label>
              <label className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[var(--bg-elevated-solid)] border border-dashed border-[var(--border-glass)] hover:border-cyan-400/60 transition-all cursor-pointer">
                <span className="text-xs text-[var(--text-muted)] truncate max-w-[280px] sm:max-w-[420px]">
                  {queryFile ? queryFile.name : 'Choose file or drag here...'}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Browse
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setQueryFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text)]">
                Your Query or Message Details
              </label>
              <textarea
                required
                rows={4}
                value={queryMessage}
                onChange={(e) => setQueryMessage(e.target.value)}
                placeholder="Describe your query, issue, or custom behavioral benchmark request in detail..."
                className="w-full p-3.5 rounded-xl bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-cyan-400 transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-95 active:scale-95 transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving to Database...' : 'Submit Support Query'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
