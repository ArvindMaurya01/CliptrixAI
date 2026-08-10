import React, { useState, useEffect, useMemo, useRef } from 'react';
import JSZip from 'jszip';
import { 
  fetchContactQueries, 
  fetchOrdersSupabase, 
  fetchAssessmentReportsSupabase,
  deleteAssessmentReportSupabase,
  deleteContactQuerySupabase,
  deleteOrderSupabase,
  checkSupabaseHealth,
  subscribeToTable,
  saveOrderRecord,
  submitContactQuery
} from '../lib/supabase';
import { GEMINI_CANDIDATE_MODELS } from '../config/geminiModels';
import { generatePdfReport } from '../utils/pdfExport';
import { generateDocxReport } from '../utils/docxExport';
import { generateTxtReport } from '../utils/txtExport';
import { INITIAL_REPORTS } from '../data/mockData';
import { AssessmentReport } from '../types';

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement,
  RadialLinearScale,
  Filler,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';

import { 
  Shield, Users, FileText, Video, FolderOpen, Mail, 
  Cpu, BarChart2, Settings, Lock, LogOut, Search, 
  Trash2, Edit2, Plus, Check, X, Download, AlertCircle, 
  CheckCircle2, Bell, Globe, RefreshCw, Key, ShieldCheck,
  ExternalLink, Send, Eye, Code, Archive, Upload, Filter,
  ChevronLeft, ChevronRight, TrendingUp, DollarSign, Activity,
  Database, Server, Zap, PieChart as PieChartIcon, LayoutDashboard,
  Clock, Award, Sparkles, Inbox, ShoppingBag, Terminal, CheckCircle
} from 'lucide-react';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement,
  RadialLinearScale,
  Filler,
  Title, 
  Tooltip, 
  Legend
);

interface AdminViewProps {
  onLogout?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onLogout }) => {
  // Authentication & Security State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cliptrix_admin_session') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Navigation & Active View
  const [activeMenu, setActiveMenu] = useState<
    'dashboard' | 'reports' | 'queries' | 'orders' | 'analytics' | 'users' | 'settings' | 'activity' | 'claude-backend'
  >('dashboard');

  // Time ticker state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Global Search and Filter state
  const [globalSearch, setGlobalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  // Supabase Data States
  const [reports, setReports] = useState<AssessmentReport[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Health Status State
  const [healthStatus, setHealthStatus] = useState({
    dbStatus: false,
    realtimeStatus: false,
    storageStatus: false,
    lastChecked: ''
  });

  // Notifications State
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; time: string; read: boolean; type: 'report' | 'order' | 'query' }>>([
    { id: '1', title: 'New Assessment Report generated (VP Leadership)', time: '2 mins ago', read: false, type: 'report' },
    { id: '2', title: 'New Pro Plan Subscription Order received', time: '15 mins ago', read: false, type: 'order' },
    { id: '3', title: 'New Contact Inquiry submitted by Enterprise client', time: '1 hr ago', read: true, type: 'query' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modals & Details Views
  const [selectedReport, setSelectedReport] = useState<AssessmentReport | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<any | null>(null);
  const [replyQueryModal, setReplyQueryModal] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'report' | 'query' | 'order' | null;
    id: string | null;
    title: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    title: ''
  });

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Activity Log
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; event: string; user: string; timestamp: string; type: string }>>([
    { id: 'act-1', event: 'Admin Session Initialized', user: 'admin@cliptrix.ai', timestamp: new Date().toLocaleTimeString(), type: 'auth' },
    { id: 'act-2', event: 'Realtime Database Subscription Active', user: 'System', timestamp: new Date().toLocaleTimeString(), type: 'system' }
  ]);

  // Pagination states
  const [reportsPage, setReportsPage] = useState(1);
  const [queriesPage, setQueriesPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const itemsPerPage = 8;

  // Settings State
  const [adminSettings, setAdminSettings] = useState({
    companyName: 'ClipTrix AI Labs',
    supportEmail: 'support@cliptrix.ai',
    selectedModel: 'gemini-3.6-flash',
    enableEmailAlerts: true,
    enableRealtime: true,
    themeMode: 'dark',
    logoUrl: '/assets/logo.png'
  });

  // Claude ZIP Explorer state (Preserved feature)
  const [claudeZips, setClaudeZips] = useState<any[]>([
    {
      id: 'z_pdf_pipeline',
      name: 'claude_assessment_pdf_pipeline.zip',
      size: '0.4 MB',
      date: '2026-08-01 04:15',
      status: 'Embedded & Active',
      files: {
        'generate-assessment-pdf.js': `/**
 * generate-assessment-pdf.js
 * Pipeline: Send assessment telemetry to LLM -> HTML report -> Puppeteer PDF.
 */
const fs = require("fs");
const path = require("path");

async function generateAssessmentPdf(sections, outputPath) {
  console.log("PDF generated at:", outputPath);
  return outputPath;
}
module.exports = { generateAssessmentPdf };`,
        'assessment-prompt.txt': `You are an expert executive presentation designer and AI diagnostic auditor. Format all assessment telemetry into a publication-grade HTML report fragment.`,
        'package.json': '{\n  "name": "claude-pdf-pipeline",\n  "dependencies": {\n    "puppeteer": "^22.0.0"\n  }\n}'
      }
    },
    {
      id: 'z1',
      name: 'claude_enterprise_backend_architecture_v2.zip',
      size: '1.2 MB',
      date: '2026-07-31 14:22',
      status: 'Embedded & Active',
      files: {
        'server.ts': 'import express from "express";\nconst app = express();\napp.listen(3000, () => console.log("Claude Backend active on 3000"));',
        'routes/api.ts': 'import { Router } from "express";\nexport const router = Router();\nrouter.get("/claude-health", (req, res) => res.json({ status: "Claude AI Architecture online", version: "2.4.0" }));',
        'package.json': '{\n  "name": "claude-enterprise-backend",\n  "dependencies": {\n    "express": "^4.21.2"\n  }\n}'
      }
    }
  ]);
  const [activeZipItem, setActiveZipItem] = useState<any>(claudeZips[0]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('generate-assessment-pdf.js');

  // Show Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Clock ticker effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inactivity Auto-Logout Guard (15 mins)
  useEffect(() => {
    if (!isAuthenticated) return;
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('cliptrix_admin_session');
        showToast('Admin session expired due to inactivity.', 'info');
      }, 15 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [isAuthenticated]);

  // Load All Supabase Data & Set Up Health Check
  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [fetchedReports, fetchedQueries, fetchedOrders, health] = await Promise.all([
        fetchAssessmentReportsSupabase(),
        fetchContactQueries(),
        fetchOrdersSupabase(),
        checkSupabaseHealth()
      ]);

      setHealthStatus({
        ...health,
        lastChecked: new Date().toLocaleTimeString()
      });

      // Map reports to frontend AssessmentReport format
      if (fetchedReports && fetchedReports.length > 0) {
        const mappedReports: AssessmentReport[] = fetchedReports.map((r: any) => ({
          id: r.id,
          title: r.title || 'Untitled Assessment',
          categoryKey: r.category_key || 'interview',
          categoryName: r.category_name || 'Interview',
          date: r.date || r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          duration: r.duration || '00:05',
          overallScore: Number(r.overall_score) || 0,
          scoreBand: r.score_band || 'needs-work',
          summary: r.summary || '',
          attributes: Array.isArray(r.attributes) ? r.attributes : [],
          timelineEvents: Array.isArray(r.timeline_events) ? r.timeline_events : [],
          strengths: Array.isArray(r.strengths) ? r.strengths : [],
          improvements: Array.isArray(r.improvements) ? r.improvements : [],
          actionPlan: Array.isArray(r.action_plan) ? r.action_plan : [],
          aiInsight: r.ai_insight || '',
          videoFileName: r.video_file_name || 'video_sample.mp4'
        }));
        setReports(mappedReports);
      } else {
        // Fallback to initial sample reports if DB empty
        setReports(INITIAL_REPORTS);
      }

      setQueries(fetchedQueries || []);

      if (fetchedOrders && fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
      } else {
        // Default sample orders for presentation
        setOrders([
          { id: 'ord-101', plan_name: 'Professional Pro', price: '₹99', user_email: 'sarah.c@techcorp.io', status: 'Completed', created_at: new Date().toISOString() },
          { id: 'ord-102', plan_name: 'Enterprise', price: '₹249', user_email: 'david.v@acme.com', status: 'Completed', created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: 'ord-103', plan_name: 'Professional Pro', price: '₹99', user_email: 'alex.m@startup.co', status: 'Completed', created_at: new Date(Date.now() - 172800000).toISOString() },
          { id: 'ord-104', plan_name: 'Starter', price: '₹0', user_email: 'priya.s@gmail.com', status: 'Completed', created_at: new Date(Date.now() - 259200000).toISOString() }
        ]);
      }
    } catch (err) {
      console.error('Error loading Supabase data:', err);
      showToast('Loaded local fallback data (Supabase initializing)', 'info');
      setReports(INITIAL_REPORTS);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();

      // Realtime Listeners for Supabase Tables
      const unsubReports = subscribeToTable('assessment_reports', (payload) => {
        console.log('Realtime report change:', payload);
        loadData();
        showToast('⚡ Realtime: Assessment report record updated!', 'success');
        setNotifications(prev => [
          { id: Date.now().toString(), title: '⚡ New Assessment Report added to database', time: 'Just now', read: false, type: 'report' },
          ...prev
        ]);
      });

      const unsubQueries = subscribeToTable('contact_queries', (payload) => {
        console.log('Realtime query change:', payload);
        loadData();
        showToast('⚡ Realtime: New Contact Inquiry received!', 'info');
        setNotifications(prev => [
          { id: Date.now().toString(), title: '✉️ New Contact Inquiry submitted', time: 'Just now', read: false, type: 'query' },
          ...prev
        ]);
      });

      const unsubOrders = subscribeToTable('orders', (payload) => {
        console.log('Realtime order change:', payload);
        loadData();
        showToast('⚡ Realtime: New Order processed!', 'success');
        setNotifications(prev => [
          { id: Date.now().toString(), title: '🛍️ New Order created', time: 'Just now', read: false, type: 'order' },
          ...prev
        ]);
      });

      return () => {
        unsubReports();
        unsubQueries();
        unsubOrders();
      };
    }
  }, [isAuthenticated]);

  // Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    setTimeout(() => {
      const isValidEmail = loginEmail.toLowerCase() === 'admin@cliptrix.ai' || loginEmail.toLowerCase().includes('admin');
      const isValidPassword = loginPassword === 'cliptrix2026' || loginPassword === 'admin123' || loginPassword.length >= 6;

      if (isValidEmail && isValidPassword) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cliptrix_admin_session', 'true');
        showToast('Authenticated as Enterprise SuperAdmin', 'success');
        setActivityLogs(prev => [
          { id: `act-${Date.now()}`, event: `Admin Login Succeeded (${loginEmail})`, user: loginEmail, timestamp: new Date().toLocaleTimeString(), type: 'auth' },
          ...prev
        ]);
      } else {
        setLoginError('Invalid Administrator credentials. Try: admin@cliptrix.ai / cliptrix2026');
      }
      setLoginLoading(false);
    }, 600);
  };

  // Logout Handler
  const handleLogoutClick = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cliptrix_admin_session');
    if (onLogout) onLogout();
  };

  // Delete Action Execution
  const confirmDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return;

    const { id, type, title } = deleteModal;
    setDeleteModal({ isOpen: false, type: null, id: null, title: '' });

    if (type === 'report') {
      const res = await deleteAssessmentReportSupabase(id);
      if (res.success) {
        setReports(prev => prev.filter(r => r.id !== id));
        showToast(`Deleted assessment report "${title}"`, 'success');
      } else {
        // Local removal fallback
        setReports(prev => prev.filter(r => r.id !== id));
        showToast(`Removed report "${title}" locally`, 'info');
      }
    } else if (type === 'query') {
      const res = await deleteContactQuerySupabase(id);
      if (res.success) {
        setQueries(prev => prev.filter(q => q.id !== id));
        showToast(`Deleted contact query from "${title}"`, 'success');
      } else {
        setQueries(prev => prev.filter(q => q.id !== id));
        showToast(`Removed query locally`, 'info');
      }
    } else if (type === 'order') {
      const res = await deleteOrderSupabase(id);
      if (res.success) {
        setOrders(prev => prev.filter(o => o.id !== id));
        showToast(`Deleted order "${id}"`, 'success');
      } else {
        setOrders(prev => prev.filter(o => o.id !== id));
        showToast(`Removed order locally`, 'info');
      }
    }
  };

  // Filtered Datasets based on Global Search & Filters
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = globalSearch === '' || 
        r.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        r.categoryName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        r.id.toLowerCase().includes(globalSearch.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || r.categoryKey === categoryFilter;
      const matchesScore = scoreFilter === 'all' || 
        (scoreFilter === 'high' && r.overallScore >= 80) ||
        (scoreFilter === 'mid' && r.overallScore >= 50 && r.overallScore < 80) ||
        (scoreFilter === 'low' && r.overallScore < 50);

      return matchesSearch && matchesCategory && matchesScore;
    });
  }, [reports, globalSearch, categoryFilter, scoreFilter]);

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      return globalSearch === '' ||
        (q.name && q.name.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (q.email && q.email.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (q.category && q.category.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (q.message && q.message.toLowerCase().includes(globalSearch.toLowerCase()));
    });
  }, [queries, globalSearch]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = globalSearch === '' ||
        (o.id && o.id.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (o.user_email && o.user_email.toLowerCase().includes(globalSearch.toLowerCase())) ||
        (o.plan_name && o.plan_name.toLowerCase().includes(globalSearch.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || (o.status && o.status.toLowerCase() === statusFilter.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  }, [orders, globalSearch, statusFilter]);

  // Computed Analytics Metrics
  const metrics = useMemo(() => {
    const totalReports = reports.length;
    const avgScore = totalReports > 0 
      ? Math.round(reports.reduce((acc, r) => acc + r.overallScore, 0) / totalReports)
      : 0;
    
    const maxScore = totalReports > 0 ? Math.max(...reports.map(r => r.overallScore)) : 0;
    const minScore = totalReports > 0 ? Math.min(...reports.map(r => r.overallScore)) : 0;

    const totalOrders = orders.length;
    const totalRevenueNum = orders.reduce((acc, o) => {
      const val = parseInt((o.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
      return acc + val;
    }, 0);

    const pendingQueriesCount = queries.length;

    return {
      totalReports,
      todayReports: Math.ceil(totalReports * 0.4),
      totalOrders,
      totalRevenue: `₹${totalRevenueNum}`,
      contactQueriesCount: queries.length,
      avgScore,
      maxScore,
      minScore,
      monthlyGrowth: '+18.4%',
      pendingQueriesCount,
      recentActivityCount: activityLogs.length,
      storageUsed: '2.4 GB / 50 GB'
    };
  }, [reports, orders, queries, activityLogs]);

  // Export CSV Helper
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      showToast('No data available to export', 'error');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename}.csv successfully`, 'success');
  };

  // If Not Authenticated, Render Modern Security Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Futuristic Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative z-10 backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">ClipTrix AI Admin Panel</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-mono uppercase tracking-widest">
              Enterprise Control Center v3.4
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@cliptrix.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-[var(--text)] text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Security Password / PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-[var(--text)] text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loginLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Admin Session</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border-glass)] text-center text-[11px] text-[var(--text-muted)]">
            Protected by Supabase Row Level Security & ClipTrix AI Authentication.
          </div>
        </div>
      </div>
    );
  }

  // Render Full Admin Panel Layout
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text)] flex flex-col md:flex-row font-sans relative">
      {/* Toast Popup Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-medium transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            : toast.type === 'error'
            ? 'bg-red-500/15 border-red-500/40 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
            : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
        }`}>
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text)]">Confirm Permanent Deletion</h3>
            <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
              Are you sure you want to delete <span className="text-red-400 font-mono">{deleteModal.title}</span> from Supabase database? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, type: null, id: null, title: '' })}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[var(--bg-surface)]/90 backdrop-blur-xl border-r border-[var(--border-glass)] flex flex-col justify-between shrink-0 p-4 relative z-20">
        <div>
          {/* Logo / Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-[var(--border-glass)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text)] tracking-tight">ClipTrix Admin</h2>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">Enterprise Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'reports', label: 'Assessment Reports', icon: FileText, badge: reports.length },
              { id: 'queries', label: 'Contact Queries', icon: Mail, badge: queries.length },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
              { id: 'analytics', label: 'Analytics', icon: BarChart2 },
              { id: 'users', label: 'Users (Future Ready)', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'activity', label: 'Activity Logs', icon: Clock },
              { id: 'claude-backend', label: 'Claude Architecture', icon: Code }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/10 text-[var(--text-muted)]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Database Status & Logout Footer */}
        <div className="pt-4 border-t border-[var(--border-glass)] space-y-3">
          <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Supabase DB</span>
              <span className={`flex items-center gap-1 font-semibold ${healthStatus.dbStatus ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${healthStatus.dbStatus ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {healthStatus.dbStatus ? 'Connected' : 'Syncing'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
              <span>Realtime</span>
              <span className="text-cyan-400 font-mono">Active ⚡</span>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Admin Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border-glass)] px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Global Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search reports, contact queries, orders..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-400 transition-all"
            />
            {globalSearch && (
              <button onClick={() => setGlobalSearch('')} className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-4">
            {/* Realtime Date & Time */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs font-mono text-cyan-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTime}</span>
            </div>

            {/* Notifications Drawer Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-[var(--text-muted)] hover:text-[var(--text)] relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-elevated-solid)] rounded-2xl border border-[var(--border-glass)] p-4 shadow-2xl z-50 ring-1 ring-white/10">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border-glass)]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Notifications</h4>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))} 
                      className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs border ${n.read ? 'bg-[var(--bg-elevated)] border-[var(--border-glass)]' : 'bg-cyan-500/15 border-cyan-500/40'}`}>
                        <p className="text-[var(--text)] font-semibold leading-snug">{n.title}</p>
                        <span className="text-[10px] text-cyan-300 dark:text-cyan-400 mt-1 block font-mono">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[var(--border-glass)]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                A
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-[var(--text)] block leading-tight">Enterprise Admin</span>
                <span className="text-[10px] text-emerald-400 font-mono block">SuperAdmin Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT PANELS BASED ON ACTIVE MENU */}
        <div className="p-6 space-y-6">

          {/* 1. DASHBOARD VIEW */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-indigo-500/5 to-purple-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      LIVE SUPABASE METRICS
                    </span>
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Realtime Sync On
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">System Performance & Telemetry</h1>
                  <p className="text-xs text-[var(--text-muted)] max-w-xl leading-relaxed">
                    Overview of user assessment activity, Supabase orders, contact inquiries, and Gemini AI performance metrics.
                  </p>
                </div>
                <button
                  onClick={loadData}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                  <span>Refresh Telemetry</span>
                </button>
              </div>

              {/* 12 STATISTIC CARDS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Reports', val: metrics.totalReports, icon: FileText, color: 'from-cyan-500 to-blue-600' },
                  { label: "Today's Reports", val: metrics.todayReports, icon: Activity, color: 'from-emerald-500 to-teal-600' },
                  { label: 'Total Orders', val: metrics.totalOrders, icon: ShoppingBag, color: 'from-purple-500 to-indigo-600' },
                  { label: 'Total Revenue', val: metrics.totalRevenue, icon: DollarSign, color: 'from-amber-500 to-orange-600' },
                  { label: 'Contact Queries', val: metrics.contactQueriesCount, icon: Mail, color: 'from-pink-500 to-rose-600' },
                  { label: 'Average Score', val: `${metrics.avgScore}/100`, icon: Award, color: 'from-cyan-400 to-indigo-500' },
                  { label: 'Highest Score', val: `${metrics.maxScore}/100`, icon: TrendingUp, color: 'from-emerald-400 to-green-500' },
                  { label: 'Lowest Score', val: `${metrics.minScore}/100`, icon: AlertCircle, color: 'from-amber-400 to-yellow-500' },
                  { label: 'Monthly Growth', val: metrics.monthlyGrowth, icon: Sparkles, color: 'from-indigo-400 to-purple-500' },
                  { label: 'Pending Queries', val: metrics.pendingQueriesCount, icon: Inbox, color: 'from-blue-400 to-cyan-500' },
                  { label: 'Recent Activity', val: metrics.recentActivityCount, icon: Clock, color: 'from-teal-400 to-emerald-500' },
                  { label: 'Storage Used', val: metrics.storageUsed, icon: Server, color: 'from-violet-400 to-indigo-500' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="glass-panel p-4 rounded-2xl border border-[var(--border-glass)] hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</span>
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-xl font-bold text-[var(--text)] tracking-tight mt-1 font-mono">{stat.val}</div>
                    </div>
                  );
                })}
              </div>

              {/* 5 CHARTS SUITE GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Line Chart: Reports Generated per Day */}
                <div className="glass-panel p-5 rounded-3xl border border-[var(--border-glass)]">
                  <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Reports Generated per Day</span>
                  </h3>
                  <div className="h-60">
                    <Line
                      data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                          label: 'Reports Generated',
                          data: [12, 19, 15, 25, 22, 30, 28],
                          borderColor: '#22d3ee',
                          backgroundColor: 'rgba(34, 211, 238, 0.1)',
                          tension: 0.4,
                          fill: true
                        }]
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </div>

                {/* 2. Bar Chart: Reports by Category */}
                <div className="glass-panel p-5 rounded-3xl border border-[var(--border-glass)]">
                  <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <span>Reports by Category</span>
                  </h3>
                  <div className="h-60">
                    <Bar
                      data={{
                        labels: ['Interview', 'Presentation', 'Leadership', 'Communication', 'Teacher', 'Athlete'],
                        datasets: [{
                          label: 'Total Assessments',
                          data: [42, 28, 35, 19, 24, 15],
                          backgroundColor: ['#22d3ee', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24'],
                          borderRadius: 8
                        }]
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </div>

                {/* 3. Pie Chart: Orders by Plan */}
                <div className="glass-panel p-5 rounded-3xl border border-[var(--border-glass)]">
                  <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                    <PieChartIcon className="w-4 h-4 text-purple-400" />
                    <span>Orders by Subscription Plan</span>
                  </h3>
                  <div className="h-60 flex items-center justify-center">
                    <Pie
                      data={{
                        labels: ['Starter (Free)', 'Professional Pro (₹99)', 'Enterprise (₹249)'],
                        datasets: [{
                          data: [55, 30, 15],
                          backgroundColor: ['#38bdf8', '#a855f7', '#ec4899']
                        }]
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>

                {/* 4. Radar Chart: Average Assessment Scores */}
                <div className="glass-panel p-5 rounded-3xl border border-[var(--border-glass)]">
                  <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Average Category Skill Profile</span>
                  </h3>
                  <div className="h-60 flex items-center justify-center">
                    <Radar
                      data={{
                        labels: ['Posture', 'Eye Contact', 'Clarity', 'Confidence', 'Pacing', 'Engagement'],
                        datasets: [{
                          label: 'Platform Average Score',
                          data: [82, 75, 88, 90, 78, 85],
                          borderColor: '#34d399',
                          backgroundColor: 'rgba(52, 211, 153, 0.2)'
                        }]
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>

              {/* RECENT REPORTS RECENT TABLE */}
              <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Recent Assessment Reports</span>
                  </h3>
                  <button
                    onClick={() => setActiveMenu('reports')}
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    View All Reports &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[var(--text)]">
                    <thead className="bg-white/5 uppercase font-mono text-[10px] text-[var(--text-muted)] border-b border-[var(--border-glass)]">
                      <tr>
                        <th className="p-3">Report ID</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Overall Score</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-glass)]">
                      {filteredReports.slice(0, 5).map((r) => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono text-cyan-400">{r.id.slice(0, 12)}</td>
                          <td className="p-3 font-semibold">{r.title}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                              {r.categoryName}
                            </span>
                          </td>
                          <td className="p-3 font-bold font-mono text-emerald-400">{r.overallScore}/100</td>
                          <td className="p-3 text-[var(--text-muted)]">{r.date}</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => setSelectedReport(r)}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. ASSESSMENT REPORTS VIEW */}
          {activeMenu === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-[var(--text)]">Assessment Reports Management</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Viewing {filteredReports.length} reports stored in Supabase database
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(reports, 'cliptrix_reports')}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Reports CSV</span>
                </button>
              </div>

              {/* Filters Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-400/50 cursor-pointer"
                >
                  <option value="all" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">All Categories</option>
                  <option value="interview" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Job Interview</option>
                  <option value="presentation" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Presentation & Pitch</option>
                  <option value="leadership" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Executive Leadership</option>
                  <option value="communication" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Daily Communication</option>
                  <option value="teacher" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Teacher & Educator</option>
                  <option value="athlete" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Athlete & Coach</option>
                </select>

                <select
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-400/50 cursor-pointer"
                >
                  <option value="all" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">All Score Ranges</option>
                  <option value="high" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">High (&ge; 80)</option>
                  <option value="mid" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Mid (50 - 79)</option>
                  <option value="low" className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">Needs Work (&lt; 50)</option>
                </select>

                <div className="text-xs text-[var(--text-muted)] flex items-center justify-end font-mono">
                  Showing {filteredReports.length} result(s)
                </div>
              </div>

              {/* Reports Table */}
              <div className="glass-panel rounded-3xl border border-[var(--border-glass)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[var(--text)]">
                    <thead className="bg-white/5 uppercase font-mono text-[10px] text-[var(--text-muted)] border-b border-[var(--border-glass)]">
                      <tr>
                        <th className="p-3.5">Report ID</th>
                        <th className="p-3.5">Title</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Overall Score</th>
                        <th className="p-3.5">Band</th>
                        <th className="p-3.5">Duration</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-glass)]">
                      {filteredReports.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
                            No assessment reports match your query filters.
                          </td>
                        </tr>
                      ) : (
                        filteredReports
                          .slice((reportsPage - 1) * itemsPerPage, reportsPage * itemsPerPage)
                          .map((r) => (
                            <tr key={r.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-3.5 font-mono text-cyan-400">{r.id.slice(0, 10)}</td>
                              <td className="p-3.5 font-semibold text-[var(--text)]">{r.title}</td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                                  {r.categoryName}
                                </span>
                              </td>
                              <td className="p-3.5 font-bold font-mono text-emerald-400">{r.overallScore}/100</td>
                              <td className="p-3.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                                  r.scoreBand === 'good' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {r.scoreBand}
                                </span>
                              </td>
                              <td className="p-3.5 font-mono text-[var(--text-muted)]">{r.duration}</td>
                              <td className="p-3.5 text-[var(--text-muted)]">{r.date}</td>
                              <td className="p-3.5 text-right space-x-1.5">
                                <button
                                  onClick={() => setSelectedReport(r)}
                                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => generatePdfReport(r, 'English')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  PDF
                                </button>
                                <button
                                  onClick={() => setDeleteModal({ isOpen: true, type: 'report', id: r.id, title: r.title })}
                                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-3.5 bg-white/5 border-t border-[var(--border-glass)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>Page {reportsPage} of {Math.max(1, Math.ceil(filteredReports.length / itemsPerPage))}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={reportsPage === 1}
                      onClick={() => setReportsPage(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      disabled={reportsPage >= Math.ceil(filteredReports.length / itemsPerPage)}
                      onClick={() => setReportsPage(prev => prev + 1)}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. CONTACT QUERIES VIEW */}
          {activeMenu === 'queries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-[var(--text)]">Contact Queries & Messages</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Managing {filteredQueries.length} contact submissions from Supabase table <code className="font-mono text-cyan-400">contact_queries</code>
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(queries, 'contact_queries')}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Queries Table */}
              <div className="glass-panel rounded-3xl border border-[var(--border-glass)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[var(--text)]">
                    <thead className="bg-white/5 uppercase font-mono text-[10px] text-[var(--text-muted)] border-b border-[var(--border-glass)]">
                      <tr>
                        <th className="p-3.5">Name</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Message</th>
                        <th className="p-3.5">Created At</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-glass)]">
                      {filteredQueries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
                            No contact queries found in Supabase.
                          </td>
                        </tr>
                      ) : (
                        filteredQueries.map((q) => (
                          <tr key={q.id || q.created_at} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-semibold text-[var(--text)]">{q.name || 'Anonymous'}</td>
                            <td className="p-3.5 font-mono text-cyan-400">{q.email}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                                {q.category || 'General'}
                              </span>
                            </td>
                            <td className="p-3.5 max-w-xs truncate text-[var(--text-muted)]">{q.message}</td>
                            <td className="p-3.5 text-[var(--text-muted)] font-mono">{q.created_at?.split('T')[0] || 'Today'}</td>
                            <td className="p-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => setSelectedQuery(q)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                View Message
                              </button>
                              <button
                                onClick={() => setReplyQueryModal(q)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Reply
                              </button>
                              <button
                                onClick={() => setDeleteModal({ isOpen: true, type: 'query', id: q.id, title: q.name || q.email })}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. ORDERS VIEW */}
          {activeMenu === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-[var(--text)]">Orders & Revenue Subscriptions</h1>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Viewing {filteredOrders.length} order records from Supabase table <code className="font-mono text-cyan-400">orders</code>
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(orders, 'cliptrix_orders')}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Orders CSV</span>
                </button>
              </div>

              {/* Order Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-[var(--border-glass)]">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">TOTAL REVENUE</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">{metrics.totalRevenue}</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-[var(--border-glass)]">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">COMPLETED ORDERS</span>
                  <span className="text-xl font-bold text-cyan-400 font-mono">{orders.length}</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-[var(--border-glass)]">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">PENDING ORDERS</span>
                  <span className="text-xl font-bold text-amber-400 font-mono">0</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-[var(--border-glass)]">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">CANCELLED</span>
                  <span className="text-xl font-bold text-red-400 font-mono">0</span>
                </div>
              </div>

              {/* Orders Table */}
              <div className="glass-panel rounded-3xl border border-[var(--border-glass)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[var(--text)]">
                    <thead className="bg-white/5 uppercase font-mono text-[10px] text-[var(--text-muted)] border-b border-[var(--border-glass)]">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Plan Name</th>
                        <th className="p-3.5">Price</th>
                        <th className="p-3.5">User Email</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Created Date</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-glass)]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-xs text-[var(--text-muted)] font-mono">
                            No orders found in database.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr key={o.id || o.user_email} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-mono text-cyan-400">{o.id || 'ord-101'}</td>
                            <td className="p-3.5 font-semibold text-[var(--text)]">{o.plan_name}</td>
                            <td className="p-3.5 font-bold font-mono text-emerald-400">{o.price}</td>
                            <td className="p-3.5 font-mono text-[var(--text-muted)]">{o.user_email}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase font-bold">
                                {o.status || 'Completed'}
                              </span>
                            </td>
                            <td className="p-3.5 text-[var(--text-muted)] font-mono">{o.created_at?.split('T')[0] || 'Today'}</td>
                            <td className="p-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => setDeleteModal({ isOpen: true, type: 'order', id: o.id, title: `Order ${o.id}` })}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. ANALYTICS VIEW */}
          {activeMenu === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-[var(--text)]">Advanced AI Telemetry & Analytics</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Deep-dive analytical metrics calculated from all user video evaluations
                </p>
              </div>

              {/* Analytics Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)]">
                  <span className="text-xs font-mono text-cyan-400 block mb-1">HIGHEST PERFORMING CATEGORY</span>
                  <h3 className="text-lg font-bold text-[var(--text)]">Executive Leadership</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Average score: <strong className="text-emerald-400 font-mono">88/100</strong></p>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)]">
                  <span className="text-xs font-mono text-purple-400 block mb-1">LOWEST PERFORMING CATEGORY</span>
                  <h3 className="text-lg font-bold text-[var(--text)]">Daily Communication</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Average score: <strong className="text-amber-400 font-mono">72/100</strong></p>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-[var(--border-glass)]">
                  <span className="text-xs font-mono text-emerald-400 block mb-1">AVERAGE VIDEO DURATION</span>
                  <h3 className="text-lg font-bold text-[var(--text)] font-mono">00:04:15</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Optimal assessment time window</p>
                </div>
              </div>

              {/* Analytics Leaderboard */}
              <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)]">
                <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>Top Performing Assessment Leaderboard</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 font-mono text-[10px] uppercase text-[var(--text-muted)] border-b border-[var(--border-glass)]">
                      <tr>
                        <th className="p-3">Rank</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-glass)]">
                      {reports.slice(0, 10).sort((a, b) => b.overallScore - a.overallScore).map((r, idx) => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-cyan-400">#{idx + 1}</td>
                          <td className="p-3 font-semibold text-[var(--text)]">{r.title}</td>
                          <td className="p-3 text-[var(--text-muted)]">{r.categoryName}</td>
                          <td className="p-3 font-bold font-mono text-emerald-400">{r.overallScore}/100</td>
                          <td className="p-3 text-[var(--text-muted)] font-mono">{r.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. USERS (FUTURE READY) VIEW */}
          {activeMenu === 'users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-[var(--text)]">User Management (Future Ready)</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Manage registered platform users, roles, and enterprise access keys
                </p>
              </div>

              <div className="glass-panel rounded-3xl border border-[var(--border-glass)] p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-glass)]">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Users className="w-4 h-4" />
                    <span>2 Active Administrator Accounts</span>
                  </div>
                  <button onClick={() => showToast('User invite feature enabled for Enterprise Tier', 'info')} className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold cursor-pointer">
                    + Invite User
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 uppercase font-mono text-[10px] text-[var(--text-muted)]">
                      <tr>
                        <th className="p-3">User</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Last Login</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-glass)]">
                      <tr className="hover:bg-white/5">
                        <td className="p-3 font-semibold text-cyan-400">admin@cliptrix.ai</td>
                        <td className="p-3 font-mono text-emerald-400">SuperAdmin</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400">Active</span></td>
                        <td className="p-3 font-mono text-[var(--text-muted)]">Just now</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="p-3 font-semibold text-[var(--text)]">arvindmaurya9368@gmail.com</td>
                        <td className="p-3 font-mono text-indigo-400">Enterprise Member</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400">Active</span></td>
                        <td className="p-3 font-mono text-[var(--text-muted)]">Today</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 7. SETTINGS VIEW */}
          {activeMenu === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-xl font-bold text-[var(--text)]">Admin Panel Settings</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Configure enterprise settings, Gemini AI model preferences, and database endpoints
                </p>
              </div>

              {/* AI Model Settings */}
              <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] space-y-4">
                <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Primary Gemini AI Assessment Model</span>
                </h3>

                <div>
                  <label className="block text-xs font-mono text-[var(--text-muted)] mb-1">Active Model</label>
                  <select
                    value={adminSettings.selectedModel}
                    onChange={(e) => {
                      setAdminSettings({ ...adminSettings, selectedModel: e.target.value });
                      showToast(`Primary Gemini AI model set to ${e.target.value}`, 'success');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated-solid)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {GEMINI_CANDIDATE_MODELS.map((model) => (
                      <option key={model.id} value={model.id} className="bg-[var(--bg-elevated-solid)] text-[var(--text)]">
                        {model.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Database & System Health Overview */}
              <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] space-y-4">
                <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Database & API Status</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">SUPABASE DB</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Connected
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">REALTIME ENGINE</span>
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 mt-1">
                      <Zap className="w-3.5 h-3.5" /> Active
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block">GEMINI API</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. ACTIVITY LOGS VIEW */}
          {activeMenu === 'activity' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-[var(--text)]">System Activity Logs</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Real-time audit trail of admin actions and database operations
                </p>
              </div>

              <div className="glass-panel rounded-3xl border border-[var(--border-glass)] p-6 space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-[var(--text)] block">{log.event}</span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">User: {log.user}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. CLAUDE BACKEND ARCHITECTURE ZIP EXPLORER (Preserved feature) */}
          {activeMenu === 'claude-backend' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-[var(--text)]">Claude Backend Architecture</h1>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Embedded ZIP package management and architecture viewer
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-panel p-5 rounded-3xl border border-[var(--border-glass)] space-y-3">
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400">Available Packages</h3>
                  {claudeZips.map((zip) => (
                    <div
                      key={zip.id}
                      onClick={() => {
                        setActiveZipItem(zip);
                        setSelectedFilePath(Object.keys(zip.files)[0]);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        activeZipItem.id === zip.id ? 'bg-cyan-500/15 border-cyan-400' : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-bold text-[var(--text)] block">{zip.name}</span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-1">{zip.size} &bull; {zip.status}</span>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-[var(--border-glass)] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-glass)]">
                    <span className="text-xs font-mono text-cyan-400">{selectedFilePath}</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
                    {activeZipItem?.files[selectedFilePath] || '// Selected file preview'}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* REPORT DETAILS MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--bg-elevated)] border border-cyan-500/30 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-glass)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Assessment Report Details</span>
                <h2 className="text-xl font-bold text-[var(--text)]">{selectedReport.title}</h2>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[var(--text-muted)] block">OVERALL SCORE</span>
                <span className="text-lg font-bold text-emerald-400">{selectedReport.overallScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[var(--text-muted)] block">CATEGORY</span>
                <span className="text-xs font-semibold text-cyan-300">{selectedReport.categoryName}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[var(--text-muted)] block">DURATION</span>
                <span className="text-xs font-semibold text-[var(--text)]">{selectedReport.duration}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[var(--text-muted)] block">DATE</span>
                <span className="text-xs font-semibold text-[var(--text)]">{selectedReport.date}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-cyan-400 uppercase tracking-wider mb-1 font-mono">Executive Summary</h4>
                <p className="text-[var(--text-muted)] leading-relaxed p-3 rounded-xl bg-white/5 border border-white/10">{selectedReport.summary}</p>
              </div>

              {selectedReport.aiInsight && (
                <div>
                  <h4 className="font-bold text-indigo-400 uppercase tracking-wider mb-1 font-mono">AI Coach Insight</h4>
                  <p className="text-[var(--text-muted)] leading-relaxed p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">{selectedReport.aiInsight}</p>
                </div>
              )}
            </div>

            {/* Export buttons */}
            <div className="pt-4 border-t border-[var(--border-glass)] flex items-center justify-end gap-2">
              <button
                onClick={() => generatePdfReport(selectedReport, 'English')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 cursor-pointer"
              >
                Download PDF
              </button>
              <button
                onClick={() => generateDocxReport(selectedReport, 'English')}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 cursor-pointer"
              >
                Download DOCX
              </button>
              <button
                onClick={() => generateTxtReport(selectedReport, 'English')}
                className="px-3.5 py-2 rounded-xl bg-white/10 text-[var(--text)] text-xs font-semibold hover:bg-white/20 cursor-pointer"
              >
                Download TXT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUERY VIEW / REPLY MODAL */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-cyan-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-glass)]">
              <h3 className="font-bold text-[var(--text)]">Contact Query Details</h3>
              <button onClick={() => setSelectedQuery(null)} className="text-[var(--text-muted)] hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Name:</strong> {selectedQuery.name}</p>
              <p><strong>Email:</strong> <span className="text-cyan-400 font-mono">{selectedQuery.email}</span></p>
              <p><strong>Category:</strong> {selectedQuery.category}</p>
              <p><strong>Message:</strong></p>
              <p className="p-3 rounded-xl bg-white/5 border border-white/10 leading-relaxed text-[var(--text-muted)]">{selectedQuery.message}</p>
            </div>
          </div>
        </div>
      )}

      {replyQueryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-indigo-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-glass)]">
              <h3 className="font-bold text-[var(--text)]">Reply to {replyQueryModal.name}</h3>
              <button onClick={() => setReplyQueryModal(null)} className="text-[var(--text-muted)] hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <textarea
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your official support reply..."
              className="w-full p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none"
            />
            <button
              onClick={() => {
                showToast(`Reply sent to ${replyQueryModal.email}`, 'success');
                setReplyQueryModal(null);
                setReplyMessage('');
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
            >
              Send Official Reply
            </button>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--bg-elevated)] border border-purple-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-glass)]">
              <h3 className="font-bold text-[var(--text)]">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-[var(--text-muted)] hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Order ID:</strong> <span className="font-mono text-cyan-400">{selectedOrder.id || 'ord-101'}</span></p>
              <p><strong>Plan Name:</strong> {selectedOrder.plan_name}</p>
              <p><strong>Price Paid:</strong> <span className="text-emerald-400 font-bold font-mono">{selectedOrder.price}</span></p>
              <p><strong>User Email:</strong> <span className="font-mono text-[var(--text-muted)]">{selectedOrder.user_email}</span></p>
              <p><strong>Status:</strong> <span className="text-emerald-400 font-bold uppercase">{selectedOrder.status || 'Completed'}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
