/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from 'react';
import { ViewState, AssessmentReport, UserProfile, AssessmentCategoryKey } from './types';
import { INITIAL_REPORTS } from './data/mockData';
import {
  fetchUserReportsSupabase,
  saveUserReportSupabase,
  fetchUserStreakSupabase,
  upsertUserStreakSupabase,
  insertUserVideoSupabase,
  insertUserAiAnalysisSupabase,
  insertUserAssessmentSupabase,
  upsertUserProfileSupabase
} from './lib/supabase';
import { AuroraBackground } from './components/AuroraBackground';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';

import { LandingView } from './components/LandingView';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { NewAssessmentView } from './components/NewAssessmentView';
import { ReportView } from './components/ReportView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { PrivacyView } from './components/PrivacyView';
import { TermsView } from './components/TermsView';
import { SecurityView } from './components/SecurityView';
import { ContactView } from './components/ContactView';
import { ReferralView } from './components/ReferralView';
import { SharedStreakView } from './components/streak/SharedStreakView';
import { CommunityView } from './components/community/CommunityView';
import { CommunityDetailView } from './components/community/CommunityDetailView';
import { INITIAL_COMMUNITIES, INITIAL_POSTS, INITIAL_CHALLENGES, INITIAL_MEMBERSHIPS } from './data/communityData';
import { StreakData, Community, CommunityPost, CommunityChallenge, CommunityMembership } from './types';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[350px] w-full">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs text-[var(--text-muted)] font-medium">Loading view...</p>
    </div>
  </div>
);

// Helper to determine strictly isolated user ID
export function getUserIdForProfile(email?: string): string {
  if (!email) return 'guest';
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail.includes('arvind')) return 'U001';
  if (cleanEmail.includes('rahul')) return 'U002';
  return cleanEmail;
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reports, setReports] = useState<AssessmentReport[]>(INITIAL_REPORTS);
  const [currentReport, setCurrentReport] = useState<AssessmentReport | null>(INITIAL_REPORTS[0]);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<AssessmentCategoryKey | undefined>(undefined);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalAnalysisDays: 0,
    weeklyActiveDays: 0,
    lastActiveDate: null,
    milestones: [3, 7, 14, 30, 60, 100]
  });

  // Community state
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [communityChallenges] = useState<CommunityChallenge[]>(INITIAL_CHALLENGES);
  const [communityMemberships] = useState<CommunityMembership[]>(INITIAL_MEMBERSHIPS);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('comm-1');

  // Load User Data with Database Isolation
  useEffect(() => {
    if (!user) {
      setReports(INITIAL_REPORTS);
      if (INITIAL_REPORTS[0]) setCurrentReport(INITIAL_REPORTS[0]);
      return;
    }

    const userId = getUserIdForProfile(user.email);

    async function loadIsolatedUserData() {
      // Sync user profile to DB
      upsertUserProfileSupabase({
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        theme: user.theme
      });

      // 1. Load User's Reports with strict user_id filtering
      const userDbReports = await fetchUserReportsSupabase(userId);
      if (userDbReports && userDbReports.length > 0) {
        const mappedReports: AssessmentReport[] = userDbReports.map((r: any) => ({
          id: r.id,
          title: r.title || 'Untitled Assessment',
          categoryKey: r.category_key || 'interview',
          categoryName: r.category_name || 'Interview',
          date: r.date || (r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
          duration: r.duration || '00:05',
          overallScore: Number(r.overall_score) || 0,
          scoreBand: r.score_band || 'good',
          summary: r.summary || '',
          attributes: Array.isArray(r.attributes) ? r.attributes : [],
          timelineEvents: Array.isArray(r.timeline_events) ? r.timeline_events : [],
          strengths: Array.isArray(r.strengths) ? r.strengths : [],
          improvements: Array.isArray(r.weaknesses) ? r.weaknesses : Array.isArray(r.improvements) ? r.improvements : [],
          actionPlan: Array.isArray(r.recommendations) ? r.recommendations : Array.isArray(r.action_plan) ? r.action_plan : [],
          aiInsight: r.ai_insight || '',
          videoFileName: r.video_file_name || 'video_sample.mp4'
        }));
        setReports(mappedReports);
        setCurrentReport(mappedReports[0]);
      } else {
        // Check user-isolated local cache
        const cacheKey = `cliptrix_reports_${userId}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setReports(parsed);
            if (parsed[0]) setCurrentReport(parsed[0]);
          } catch {
            setReports([]);
            setCurrentReport(null);
          }
        } else if (userId === 'U001') {
          // Default initial reports for Arvind (U001)
          setReports(INITIAL_REPORTS);
          if (INITIAL_REPORTS[0]) setCurrentReport(INITIAL_REPORTS[0]);
        } else if (userId === 'U002') {
          // Rahul's specific isolated initial reports
          const rahulReport: AssessmentReport = {
            id: 'rep-rahul-001',
            title: 'Rahul Athlete Sprint & Bio-Analysis',
            categoryKey: 'athlete',
            categoryName: 'Athlete',
            date: new Date().toISOString().split('T')[0],
            duration: '00:15',
            overallScore: 84,
            scoreBand: 'good',
            summary: 'Good stride power and explosive takeoff. Knee drive requires 5% angle tuning.',
            attributes: [
              { name: 'Stride Power', score: 88, status: 'optimal', observedValue: 'High explosive force', expertAnalysis: 'Solid ground contact time.' },
              { name: 'Cadence Rate', score: 80, status: 'good', observedValue: '175 spm', expertAnalysis: 'Steady acceleration phase.' }
            ],
            timelineEvents: [
              { timestamp: '00:02', title: 'Explosive Start', description: 'Fast force generation', type: 'positive' }
            ],
            strengths: ['Ground contact reactivity', 'Core stability'],
            improvements: ['Increase hamstring mobility', 'Relax upper shoulders'],
            actionPlan: ['High knee drills 3x weekly', 'Ankle stiffness hops'],
            aiInsight: 'Strong athletic foundation with high velocity ceiling.',
            videoFileName: 'rahul_sprint.mp4'
          };
          setReports([rahulReport]);
          setCurrentReport(rahulReport);
        } else {
          // New registered user: clean empty state
          setReports([]);
          setCurrentReport(null);
        }
      }

      // 2. Load User's Streak with strict user_id isolation
      const dbStreak = await fetchUserStreakSupabase(userId);
      if (dbStreak) {
        setStreakData({
          currentStreak: dbStreak.current_streak || 1,
          longestStreak: dbStreak.longest_streak || 1,
          totalAnalysisDays: dbStreak.total_analysis_days || 1,
          weeklyActiveDays: Math.min(7, dbStreak.current_streak || 1),
          lastActiveDate: dbStreak.last_active_date,
          milestones: [3, 7, 14, 30, 60, 100]
        });
      } else {
        const streakKey = `cliptrix_streak_${userId}`;
        const cachedStreak = localStorage.getItem(streakKey);
        if (cachedStreak) {
          try {
            setStreakData(JSON.parse(cachedStreak));
          } catch {
            setStreakData({ currentStreak: 0, longestStreak: 0, totalAnalysisDays: 0, weeklyActiveDays: 0, lastActiveDate: null, milestones: [3, 7, 14, 30, 60, 100] });
          }
        } else if (userId === 'U001') {
          setStreakData({ currentStreak: 7, longestStreak: 12, totalAnalysisDays: 18, weeklyActiveDays: 5, lastActiveDate: new Date().toISOString().split('T')[0], milestones: [3, 7, 14, 30, 60, 100] });
        } else if (userId === 'U002') {
          setStreakData({ currentStreak: 3, longestStreak: 5, totalAnalysisDays: 6, weeklyActiveDays: 3, lastActiveDate: new Date().toISOString().split('T')[0], milestones: [3, 7, 14, 30, 60, 100] });
        } else {
          setStreakData({ currentStreak: 0, longestStreak: 0, totalAnalysisDays: 0, weeklyActiveDays: 0, lastActiveDate: null, milestones: [3, 7, 14, 30, 60, 100] });
        }
      }
    }

    loadIsolatedUserData();
  }, [user]);

  // Save state to user-scoped local cache whenever reports change
  useEffect(() => {
    if (user) {
      const userId = getUserIdForProfile(user.email);
      localStorage.setItem(`cliptrix_reports_${userId}`, JSON.stringify(reports));
    }
  }, [reports, user]);

  // Save streak to user-scoped local cache whenever streakData changes
  useEffect(() => {
    if (user) {
      const userId = getUserIdForProfile(user.email);
      localStorage.setItem(`cliptrix_streak_${userId}`, JSON.stringify(streakData));
    }
  }, [streakData, user]);

  // Community handlers
  const handleSelectCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setCurrentView('community-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const isCurrentlyJoined = c.isJoined;
          const newJoined = !isCurrentlyJoined;
          const newCount = newJoined ? c.memberCount + 1 : Math.max(0, c.memberCount - 1);
          showToast(newJoined ? `Joined ${c.name}!` : `Left ${c.name}`, newJoined ? 'success' : 'info');
          return {
            ...c,
            isJoined: newJoined,
            joinStatus: newJoined ? 'active' : 'none',
            memberCount: newCount
          };
        }
        return c;
      })
    );
  };

  const handleCreateCommunity = (newComm: Partial<Community>) => {
    const userId = getUserIdForProfile(user?.email);
    const id = `comm-${Date.now()}`;
    const fullCommunity: Community = {
      id,
      name: newComm.name || 'New Community',
      description: newComm.description || '',
      category: newComm.category || 'athlete',
      sport: newComm.sport,
      type: newComm.type || 'public',
      imageUrl: newComm.imageUrl,
      ownerId: userId,
      ownerName: user?.name || 'Community Leader',
      memberCount: 1,
      postCount: 0,
      rules: newComm.rules,
      createdAt: new Date().toISOString().split('T')[0],
      isJoined: true,
      joinStatus: 'active',
      role: 'owner',
      isFeatured: false
    };

    setCommunities((prev) => [fullCommunity, ...prev]);
    setSelectedCommunityId(id);
    setCurrentView('community-detail');
  };

  const handleCreatePost = (newPostData: Partial<CommunityPost>) => {
    const userId = getUserIdForProfile(user?.email);
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      communityId: newPostData.communityId || selectedCommunityId,
      communityName: newPostData.communityName || 'Community',
      authorId: userId,
      authorName: user?.name || 'ClipTrixAI Member',
      authorRole: user?.role || 'Athlete',
      isVerified: true,
      communityRole: 'member',
      type: newPostData.type || 'discussion',
      content: newPostData.content || '',
      mediaUrl: newPostData.mediaUrl,
      likeCount: 0,
      commentCount: 0,
      createdAt: 'Just now',
      comments: []
    };

    setCommunityPosts((prev) => [newPost, ...prev]);
    setCommunities((prev) =>
      prev.map((c) => (c.id === newPost.communityId ? { ...c, postCount: c.postCount + 1 } : c))
    );
  };

  const handleReactPost = (postId: string, reactionType: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasReacted = p.hasReacted;
          return {
            ...p,
            hasReacted: !hasReacted,
            reactionType: !hasReacted ? reactionType : undefined,
            likeCount: !hasReacted ? p.likeCount + 1 : Math.max(0, p.likeCount - 1)
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    const userId = getUserIdForProfile(user?.email);
    const newComment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: userId,
      authorName: user?.name || 'ClipTrixAI Member',
      authorAvatar: user?.avatarUrl,
      content,
      likeCount: 0,
      createdAt: 'Just now'
    };

    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const updatedComments = [...(p.comments || []), newComment];
          return {
            ...p,
            comments: updatedComments,
            commentCount: updatedComments.length
          };
        }
        return p;
      })
    );
  };

  // Theme effect on HTML root
  useEffect(() => {
    if (user?.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [user?.theme]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  const handleSuccessfulAuth = (name: string, email: string) => {
    const isAdmin = email.toLowerCase() === 'admin@cliptrix.ai' || email.toLowerCase().includes('admin');
    const newUserObj: UserProfile = {
      name,
      email,
      role: isAdmin ? 'System Administrator' : 'Enterprise Member',
      roleType: isAdmin ? 'admin' : 'user',
      avatarUrl: '',
      theme: 'dark',
      notifications: {
        emailAlerts: true,
        reportReady: true,
        weeklyDigest: false
      }
    };
    setUser(newUserObj);
    if (isAdmin) {
      setCurrentView('admin');
      showToast('Welcome to ClipTrix Admin Panel', 'success');
    } else {
      setCurrentView('dashboard');
      showToast(`Welcome back, ${name}! Logged in securely.`, 'success');
    }
  };

  useEffect(() => {
    if (user) {
      if (user.roleType === 'admin' && currentView !== 'admin') {
        setCurrentView('admin');
      } else if (user.roleType === 'user' && currentView === 'admin') {
        showToast('403 Access Denied: Admins only.', 'error');
        setCurrentView('dashboard');
      }
    } else {
      if (['dashboard', 'new-assessment', 'report', 'settings', 'admin'].includes(currentView)) {
        setCurrentView('landing');
      }
    }
  }, [currentView, user]);

  const handleSignOut = () => {
    setUser(null);
    setCurrentView('landing');
    showToast('Signed out successfully.', 'info');
  };

  const handleToggleTheme = () => {
    if (!user) {
      const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isCurrentlyLight) {
        document.documentElement.removeAttribute('data-theme');
        showToast('Switched to Aurora Dark theme', 'info');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        showToast('Switched to Aurora Light theme', 'info');
      }
    } else {
      const nextTheme = user.theme === 'dark' ? 'light' : 'dark';
      setUser({ ...user, theme: nextTheme });
      showToast(`Switched to ${nextTheme === 'light' ? 'Aurora Light' : 'Aurora Dark'} theme`, 'info');
    }
  };

  const handleStartAssessment = (categoryKey?: string) => {
    if (!user) {
      setCurrentView('auth');
      return;
    }
    setSelectedCategoryKey(categoryKey as AssessmentCategoryKey);
    setCurrentView('new-assessment');
  };

  const handleAssessmentComplete = async (newReport: AssessmentReport) => {
    const userId = getUserIdForProfile(user?.email);

    setReports((prev) => [newReport, ...prev]);
    setCurrentReport(newReport);
    setCurrentView('report');

    // Update streak data on successful qualifying analysis
    const todayStr = new Date().toISOString().split('T')[0];
    let updatedStreakData: StreakData = streakData;

    setStreakData((prev) => {
      const isSameDay = prev.lastActiveDate === todayStr;
      if (isSameDay) {
        return prev;
      }
      const newStreak = prev.currentStreak + 1;
      const newLongest = Math.max(prev.longestStreak, newStreak);
      const newWeekly = Math.min(7, prev.weeklyActiveDays + 1);
      const newTotal = prev.totalAnalysisDays + 1;

      updatedStreakData = {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongest,
        weeklyActiveDays: newWeekly,
        totalAnalysisDays: newTotal,
        lastActiveDate: todayStr
      };
      return updatedStreakData;
    });

    showToast('Assessment telemetry successfully computed! 🔥 Streak updated.', 'success');

    // Asynchronously save to Supabase database with strict user isolation
    const videoId = `vid-${Date.now()}`;
    const analysisId = `ana-${Date.now()}`;

    // 1. Create Video Record
    await insertUserVideoSupabase({
      id: videoId,
      user_id: userId,
      file_name: newReport.videoFileName || 'uploaded_video.mp4',
      category: newReport.categoryKey,
      duration: newReport.duration,
      status: 'processed'
    });

    // 2. Create AI Analysis Record
    await insertUserAiAnalysisSupabase({
      id: analysisId,
      user_id: userId,
      video_id: videoId,
      model_version: 'gemini-2.5-flash',
      score: newReport.overallScore,
      key_metrics: { attributes: newReport.attributes },
      report: newReport.summary,
      processing_status: 'completed'
    });

    // 3. Create Assessment Record
    await insertUserAssessmentSupabase({
      user_id: userId,
      category: newReport.categoryKey,
      score: newReport.overallScore,
      result: { summary: newReport.summary, band: newReport.scoreBand }
    });

    // 4. Create Report Record
    const reportSaveResult = await saveUserReportSupabase({
      id: newReport.id,
      user_id: userId,
      analysis_id: analysisId,
      title: newReport.title,
      category_key: newReport.categoryKey,
      category_name: newReport.categoryName,
      overall_score: newReport.overallScore,
      score_band: newReport.scoreBand,
      summary: newReport.summary,
      attributes: newReport.attributes,
      timeline_events: newReport.timelineEvents,
      strengths: newReport.strengths,
      weaknesses: newReport.improvements,
      recommendations: newReport.actionPlan,
      category: newReport.categoryKey,
      ai_insight: newReport.aiInsight,
      video_file_name: newReport.videoFileName
    });

    // 5. Update Streak Record
    await upsertUserStreakSupabase({
      user_id: userId,
      current_streak: updatedStreakData.currentStreak || 1,
      longest_streak: updatedStreakData.longestStreak || 1,
      total_analysis_days: updatedStreakData.totalAnalysisDays || 1,
      last_active_date: todayStr
    });

    if (reportSaveResult.success) {
      showToast('Assessment saved to Supabase cloud database!', 'success');
    } else if (reportSaveResult.error) {
      console.warn('Supabase save notice:', reportSaveResult.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative text-[var(--text)]">
      <AuroraBackground />

      <Header
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        user={user}
        onToggleTheme={handleToggleTheme}
        onSignOut={handleSignOut}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {user && user.roleType !== 'admin' && currentView !== 'landing' && currentView !== 'auth' && (
          <Sidebar
            currentView={currentView}
            onNavigate={(v) => setCurrentView(v)}
          />
        )}

        <main className="flex-1 min-w-0">
          <Suspense fallback={<LoadingFallback />}>
            {currentView === 'landing' && (
              <LandingView
                onStartAssessment={handleStartAssessment}
                onNavigateAuth={() => setCurrentView('auth')}
                onNavigate={(v) => setCurrentView(v)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'auth' && (
              <AuthView
                onSuccessfulAuth={handleSuccessfulAuth}
                onBackToHome={() => setCurrentView('landing')}
              />
            )}

            {currentView === 'dashboard' && (
              <DashboardView
                reports={reports}
                onStartNew={() => handleStartAssessment()}
                onSelectReport={(rep) => {
                  setCurrentReport(rep);
                  setCurrentView('report');
                }}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                streakData={streakData}
                onNavigate={(v) => setCurrentView(v)}
                showToast={showToast}
                user={user}
              />
            )}

            {currentView === 'new-assessment' && (
              <NewAssessmentView
                initialCategory={selectedCategoryKey}
                onComplete={handleAssessmentComplete}
                onCancel={() => setCurrentView(user ? 'dashboard' : 'landing')}
                onShowToast={showToast}
              />
            )}

            {currentView === 'report' && currentReport && (
              <ReportView
                report={currentReport}
                onBack={() => setCurrentView(user ? 'dashboard' : 'landing')}
                onShowToast={showToast}
                streakData={streakData}
                user={user}
                onNavigate={(v) => setCurrentView(v)}
              />
            )}

            {currentView === 'settings' && user && (
              <SettingsView
                user={user}
                onUpdateUser={(updated) => setUser({ ...user, ...updated })}
                onShowToast={showToast}
              />
            )}

            {currentView === 'admin' && (
              <AdminView />
            )}

            {currentView === 'privacy' && (
              <PrivacyView onBack={() => setCurrentView('landing')} />
            )}

            {currentView === 'terms' && (
              <TermsView onBack={() => setCurrentView('landing')} />
            )}

            {currentView === 'security' && (
              <SecurityView onBack={() => setCurrentView('landing')} />
            )}

            {currentView === 'contact' && (
              <ContactView onNavigate={(v) => setCurrentView(v)} showToast={showToast} />
            )}

            {currentView === 'referral' && (
              <ReferralView 
                onBack={() => setCurrentView(user ? 'dashboard' : 'landing')} 
                onNavigate={(v) => setCurrentView(v)} 
                showToast={showToast} 
                user={user} 
              />
            )}

            {currentView === 'shared-streak' && (
              <SharedStreakView
                streak={streakData.currentStreak || 7}
                userName={user?.name || 'ClipTrixAI User'}
                onNavigate={(v) => setCurrentView(v)}
                onBack={() => setCurrentView(user ? 'dashboard' : 'landing')}
              />
            )}

            {currentView === 'community' && (
              <CommunityView
                communities={communities}
                posts={communityPosts}
                challenges={communityChallenges}
                user={user}
                streakData={streakData}
                onSelectCommunity={handleSelectCommunity}
                onToggleJoinCommunity={handleToggleJoinCommunity}
                onCreateCommunity={handleCreateCommunity}
                onNavigate={(v) => setCurrentView(v)}
                showToast={showToast}
              />
            )}

            {currentView === 'community-detail' && (
              <CommunityDetailView
                community={communities.find((c) => c.id === selectedCommunityId) || communities[0]}
                onBack={() => setCurrentView('community')}
                user={user}
                posts={communityPosts}
                challenges={communityChallenges}
                memberships={communityMemberships}
                onToggleJoinCommunity={handleToggleJoinCommunity}
                onCreatePost={handleCreatePost}
                onReactPost={handleReactPost}
                onAddComment={handleAddComment}
                onNavigate={(v) => setCurrentView(v)}
                showToast={showToast}
              />
            )}
          </Suspense>
        </main>
      </div>

      <Footer onNavigate={(v) => setCurrentView(v as ViewState)} />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
