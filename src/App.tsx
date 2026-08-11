/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from 'react';
import { ViewState, AssessmentReport, UserProfile, AssessmentCategoryKey } from './types';
import { INITIAL_REPORTS } from './data/mockData';
import { saveAssessmentReportSupabase, fetchAssessmentReportsSupabase } from './lib/supabase';
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
  const [communityChallenges, setCommunityChallenges] = useState<CommunityChallenge[]>(INITIAL_CHALLENGES);
  const [communityMemberships, setCommunityMemberships] = useState<CommunityMembership[]>(INITIAL_MEMBERSHIPS);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('comm-1');

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
    const id = `comm-${Date.now()}`;
    const fullCommunity: Community = {
      id,
      name: newComm.name || 'New Community',
      description: newComm.description || '',
      category: newComm.category || 'athlete',
      sport: newComm.sport,
      type: newComm.type || 'public',
      imageUrl: newComm.imageUrl,
      ownerId: user?.email || 'user-owner',
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
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      communityId: newPostData.communityId || selectedCommunityId,
      communityName: newPostData.communityName || 'Community',
      authorId: user?.email || 'user-author',
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
          const newLikeCount = hasReacted ? Math.max(0, p.likeCount - 1) : p.likeCount + 1;
          return {
            ...p,
            hasReacted: !hasReacted,
            likeCount: newLikeCount,
            reactionType: hasReacted ? undefined : reactionType
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      postId,
      authorId: user?.email || 'user-commenter',
      authorName: user?.name || 'ClipTrixAI Member',
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

  // Load initial reports from Supabase if available
  useEffect(() => {
    async function loadSupabaseReports() {
      const fetched = await fetchAssessmentReportsSupabase();
      if (fetched && fetched.length > 0) {
        const mappedReports: AssessmentReport[] = fetched.map((r: any) => ({
          id: r.id,
          title: r.title || 'Untitled Assessment',
          categoryKey: r.category_key || 'interview',
          categoryName: r.category_name || 'Interview',
          date: r.date || (r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
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
        
        // Merge with initial mock reports avoiding duplicate IDs
        setReports((prev) => {
          const existingIds = new Set(mappedReports.map(m => m.id));
          const unmappedInitial = prev.filter(p => !existingIds.has(p.id));
          return [...mappedReports, ...unmappedInitial];
        });
        if (mappedReports[0]) {
          setCurrentReport(mappedReports[0]);
        }
      }
    }
    loadSupabaseReports();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  const handleSuccessfulAuth = (name: string, email: string) => {
    const isAdmin = email.toLowerCase() === 'admin@cliptrix.ai' || email.toLowerCase().includes('admin');
    setUser({
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
    });
    if (isAdmin) {
      setCurrentView('admin');
      showToast('Welcome to ClipTrix Admin Panel', 'success');
    } else {
      setCurrentView('dashboard');
      showToast(`Welcome back, ${name}!`, 'success');
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
      // If not logged in, simulate light/dark toggle via temporary user state or root attribute
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
    setReports((prev) => [newReport, ...prev]);
    setCurrentReport(newReport);
    setCurrentView('report');

    // Update streak data on successful qualifying analysis
    const todayStr = new Date().toISOString().split('T')[0];
    setStreakData((prev) => {
      const isSameDay = prev.lastActiveDate === todayStr;
      if (isSameDay) {
        // Multiple analyses on same day count as 1 active day (rule 16)
        return prev;
      }
      const newStreak = prev.currentStreak + 1;
      const newLongest = Math.max(prev.longestStreak, newStreak);
      const newWeekly = Math.min(7, prev.weeklyActiveDays + 1);
      const newTotal = prev.totalAnalysisDays + 1;

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongest,
        weeklyActiveDays: newWeekly,
        totalAnalysisDays: newTotal,
        lastActiveDate: todayStr
      };
    });

    showToast('Assessment telemetry successfully computed! 🔥 Streak updated.', 'success');

    // Asynchronously save to Supabase database
    const result = await saveAssessmentReportSupabase(newReport);
    if (result.success) {
      showToast('Assessment saved to Supabase cloud database!', 'success');
    } else if (result.error) {
      console.warn('Supabase save notice:', result.error);
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

