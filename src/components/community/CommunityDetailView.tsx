import React, { useState } from 'react';
import { 
  Users, MessageSquare, Shield, Globe, Lock, ArrowLeft, Share2, Plus, Heart, 
  Flame, Award, MessageCircle, MoreVertical, Flag, Check, Trash2, Pin, 
  Send, Sparkles, Filter, Search, UserCheck, UserX, ExternalLink, HelpCircle, Lightbulb, Trophy
} from 'lucide-react';
import { 
  Community, CommunityPost, CommunityComment, CommunityChallenge, 
  CommunityMembership, UserProfile, CommunityPostType 
} from '../../types';
import { ReportContentModal } from './ReportContentModal';

interface CommunityDetailViewProps {
  community: Community;
  onBack: () => void;
  user: UserProfile | null;
  posts: CommunityPost[];
  challenges: CommunityChallenge[];
  memberships: CommunityMembership[];
  onToggleJoinCommunity: (communityId: string) => void;
  onCreatePost: (post: Partial<CommunityPost>) => void;
  onReactPost: (postId: string, reactionType: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onNavigate: (view: any) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const CommunityDetailView: React.FC<CommunityDetailViewProps> = ({
  community,
  onBack,
  user,
  posts: allPosts,
  challenges: allChallenges,
  memberships: allMemberships,
  onToggleJoinCommunity,
  onCreatePost,
  onReactPost,
  onAddComment,
  onNavigate,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'challenges' | 'about' | 'resources' | 'moderation'>('posts');
  const [postType, setPostType] = useState<CommunityPostType>('discussion');
  const [postContent, setPostContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<'all' | 'owner' | 'moderator' | 'member'>('all');
  const [reportingItem, setReportingItem] = useState<{ isOpen: boolean; type: 'post' | 'comment' | 'community' }>({ isOpen: false, type: 'post' });
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Filter posts for this community
  const communityPosts = allPosts.filter((p) => p.communityId === community.id);
  const communityMembers = allMemberships.filter((m) => m.communityId === community.id && m.status === 'active');
  const pendingRequests = allMemberships.filter((m) => m.communityId === community.id && m.status === 'pending');
  const communityChallenges = allChallenges.filter((c) => !c.communityId || c.communityId === community.id);

  const isOwner = community.role === 'owner' || user?.roleType === 'admin';
  const isModerator = community.role === 'moderator' || isOwner;
  const isMember = community.isJoined && community.joinStatus === 'active';

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      showToast('Please enter post content', 'error');
      return;
    }
    if (!isMember) {
      showToast('You must join this community to create posts', 'info');
      return;
    }

    onCreatePost({
      communityId: community.id,
      communityName: community.name,
      authorId: user?.email || 'user-anon',
      authorName: user?.name || 'ClipTrixAI Member',
      authorRole: user?.role || 'Athlete',
      isVerified: true,
      communityRole: community.role || 'member',
      type: postType,
      content: postContent.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
      likeCount: 0,
      commentCount: 0,
      createdAt: 'Just now',
      comments: []
    });

    setPostContent('');
    setMediaUrl('');
    setShowMediaInput(false);
    showToast('Post published to community!', 'success');
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    showToast('Comment added!', 'success');
  };

  const handleShareCommunity = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Community link copied to clipboard! 🔗', 'success');
    } else {
      showToast(`Sharing ${community.name}`, 'info');
    }
  };

  return (
    <div className="space-y-6 view-enter pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] border border-[var(--border-glass)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Communities</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareCommunity}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] border border-[var(--border-glass)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[var(--accent-1)]" />
            <span>Share</span>
          </button>

          {isModerator && (
            <button
              onClick={() => setActiveTab('moderation')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Moderation</span>
              {pendingRequests.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Community Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--border-glass)] shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-neutral-950 p-6 sm:p-8 space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-1)]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-2)] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl shrink-0 border border-white/20">
              {community.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--accent-1)]/20 text-[var(--accent-2)] border border-[var(--accent-1)]/30">
                  {community.category}
                </span>
                {community.sport && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/15 text-slate-100 border border-white/20">
                    {community.sport}
                  </span>
                )}
                {community.type === 'public' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Public
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Private
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                {community.name}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-300 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--accent-2)]" />
                  <span className="font-bold text-white">{community.memberCount}</span> Members
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">{community.postCount}</span> Posts
                </div>
              </div>
            </div>
          </div>

          {/* Join CTA Button */}
          <div className="shrink-0 space-y-2">
            {isMember ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Joined ✓</span>
                </button>
              </div>
            ) : community.joinStatus === 'pending' ? (
              <div className="px-5 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40">
                Request Pending ⏳
              </div>
            ) : (
              <button
                onClick={() => onToggleJoinCommunity(community.id)}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:opacity-95 shadow-lg shadow-[var(--accent-1)]/20 transition-all flex items-center gap-2 cursor-pointer border border-white/10"
              >
                <Plus className="w-4 h-4" />
                <span>{community.type === 'private' ? 'Request to Join' : 'Join Community'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-3xl leading-relaxed pt-2 border-t border-white/10 relative z-10">
          {community.description}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border-glass)] pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-[var(--accent-1)]/20 text-[var(--accent-1)] border border-[var(--accent-1)]/40 shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-glass)]'
          }`}
        >
          Posts & Feed
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[var(--accent-1)]/20 text-[var(--accent-1)] border border-[var(--accent-1)]/40 shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-glass)]'
          }`}
        >
          Members ({communityMembers.length})
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'challenges'
              ? 'bg-[var(--accent-1)]/20 text-[var(--accent-1)] border border-[var(--accent-1)]/40 shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-glass)]'
          }`}
        >
          Challenges 🔥
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'about'
              ? 'bg-[var(--accent-1)]/20 text-[var(--accent-1)] border border-[var(--accent-1)]/40 shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-glass)]'
          }`}
        >
          About & Rules
        </button>
        {community.category === 'coach' && (
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-[var(--accent-1)]/20 text-[var(--accent-1)] border border-[var(--accent-1)]/40 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-glass)]'
            }`}
          >
            Teams & Resources 📋
          </button>
        )}
      </div>

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border-glass)] max-w-sm w-full space-y-4">
            <h4 className="text-base font-extrabold text-[var(--text)]">Leave Community?</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Are you sure you want to leave {community.name}? You can rejoin anytime.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-muted)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onToggleJoinCommunity(community.id);
                  setShowLeaveConfirm(false);
                  showToast(`Left ${community.name}`, 'info');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 cursor-pointer"
              >
                Confirm Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENTS */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {/* Create Post Composer */}
          <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-[var(--border-glass)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-2)] flex items-center justify-center text-white font-bold text-sm">
                {user ? user.name.charAt(0) : 'U'}
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text)]">{user ? user.name : 'ClipTrixAI User'}</p>
                <p className="text-[10px] text-[var(--text-muted)]">Post to {community.name}</p>
              </div>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-3">
              {/* Type Selectors */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: 'discussion', label: 'Discussion 💬', icon: MessageSquare },
                  { key: 'question', label: 'Question ❓', icon: HelpCircle },
                  { key: 'tip', label: 'Tip 💡', icon: Lightbulb },
                  { key: 'achievement', label: 'Achievement 🔥', icon: Trophy }
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setPostType(t.key as CommunityPostType)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      postType === t.key
                        ? 'bg-[var(--accent-1)] text-white shadow-sm'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder={
                  postType === 'question'
                    ? 'Ask a question about technique, drills, or performance analysis...'
                    : postType === 'tip'
                    ? 'Share a training tip or clip recording advice...'
                    : postType === 'achievement'
                    ? 'Share your streak milestone or personal best score...'
                    : "What's on your mind? Share performance insights..."
                }
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-all resize-none placeholder:text-[var(--text-faint)]"
              />

              {showMediaInput && (
                <div className="space-y-1">
                  <input
                    type="url"
                    placeholder="Paste image or video link (optional)..."
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)]"
                  />
                  <p className="text-[10px] text-[var(--text-faint)] font-mono">
                    Note: Private AI assessment videos are never published automatically.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowMediaInput(!showMediaInput)}
                  className="text-xs text-[var(--accent-1)] font-bold hover:underline cursor-pointer"
                >
                  {showMediaInput ? 'Remove Link' : '+ Add Media URL'}
                </button>

                <button
                  type="submit"
                  disabled={!isMember}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                    isMember
                      ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-90'
                      : 'bg-neutral-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isMember ? 'Post' : 'Join to Post'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          {communityPosts.length === 0 ? (
            <div className="p-8 rounded-3xl glass-panel border border-[var(--border-glass)] text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-[var(--text-faint)] mx-auto" />
              <h4 className="text-base font-bold text-[var(--text)]">No posts yet</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                Be the first person to start the conversation in {community.name}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="p-5 sm:p-6 rounded-3xl glass-panel border border-[var(--border-glass)] space-y-4 shadow-lg">
                  {/* Author Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-3)] flex items-center justify-center text-white font-bold text-xs">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[var(--text)]">{post.authorName}</span>
                          {post.isVerified && (
                            <span className="w-3.5 h-3.5 rounded-full bg-[var(--accent-1)] text-white text-[9px] flex items-center justify-center font-bold" title="Verified Member">
                              ✓
                            </span>
                          )}
                          {post.communityRole === 'owner' && (
                            <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                              OWNER
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {post.authorRole || 'Member'} • {post.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        post.type === 'achievement'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : post.type === 'question'
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                          : post.type === 'tip'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-[var(--accent-1)]/15 text-[var(--accent-1)] border border-[var(--accent-1)]/30'
                      }`}>
                        {post.type}
                      </span>

                      <button
                        onClick={() => setReportingItem({ isOpen: true, type: 'post' })}
                        className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Report post"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {post.mediaUrl && (
                    <div className="rounded-2xl overflow-hidden border border-[var(--border-glass)] bg-black/40 p-2">
                      <img src={post.mediaUrl} alt="Post media" className="max-h-80 w-full object-cover rounded-xl" />
                    </div>
                  )}

                  {/* Actions & Reactions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-glass)] text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onReactPost(post.id, '❤️')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          post.hasReacted
                            ? 'bg-red-500/15 border-red-500/40 text-red-400 font-bold'
                            : 'bg-[var(--bg-elevated)] border-[var(--border-glass)] text-[var(--text-muted)] hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.hasReacted ? 'fill-current' : ''}`} />
                        <span>{post.likeCount}</span>
                      </button>

                      <button
                        onClick={() => onReactPost(post.id, '🔥')}
                        className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-[var(--text-muted)] hover:text-amber-400 transition-all cursor-pointer text-xs"
                      >
                        🔥
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.commentCount} Comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Comments Thread */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[var(--border-glass)]/60">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="p-3 rounded-2xl bg-[var(--bg-elevated)]/60 border border-[var(--border-glass)] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[var(--text)]">{comment.authorName}</span>
                            <span className="text-[10px] text-[var(--text-faint)] font-mono">{comment.createdAt}</span>
                          </div>
                          <p className="text-[var(--text-muted)]">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a constructive comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommentSubmit(post.id);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)]"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--accent-1)] hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--text-faint)] font-mono">Filter:</span>
              {(['all', 'owner', 'moderator', 'member'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setMemberRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    memberRoleFilter === r
                      ? 'bg-[var(--accent-1)] text-white'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {communityMembers
              .filter((m) => {
                if (memberRoleFilter !== 'all' && m.role !== memberRoleFilter) return false;
                if (memberSearch && !m.userName.toLowerCase().includes(memberSearch.toLowerCase())) return false;
                return true;
              })
              .map((m) => (
                <div key={m.id} className="p-4 rounded-2xl glass-panel border border-[var(--border-glass)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-1)] to-[var(--accent-2)] flex items-center justify-center text-white font-bold text-xs">
                    {m.userName.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[var(--text)]">{m.userName}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold capitalize ${
                        m.role === 'owner'
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : m.role === 'moderator'
                          ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {m.role}
                      </span>
                      <span className="text-[9px] text-[var(--text-faint)]">Joined {m.joinedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CHALLENGES TAB */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-[var(--border-glass)] bg-gradient-to-br from-indigo-950 via-slate-900 to-black space-y-2">
            <h3 className="text-lg font-black text-white">Community Performance Challenges</h3>
            <p className="text-xs text-slate-100 font-medium">
              Participate in group streak goals, cadence tests, and technique drills to earn badges and AI credits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityChallenges.map((chal) => (
              <div key={chal.id} className="p-5 rounded-3xl glass-panel border border-[var(--border-glass)] space-y-4 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-[var(--text)]">{chal.title}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{chal.description}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    {chal.participantsCount} Joined
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[var(--border-glass)]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] font-medium">Your Progress</span>
                    <span className="font-bold text-[var(--accent-1)] font-mono">{chal.userProgress}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] transition-all"
                      style={{ width: `${Math.min(100, (chal.daysCompleted / chal.daysTotal) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono font-semibold">{chal.reward}</span>
                  <button
                    onClick={() => onNavigate('new-assessment')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                  >
                    Start Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABOUT TAB */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-3xl glass-panel border border-[var(--border-glass)] space-y-4">
            <h3 className="text-base font-extrabold text-[var(--text)]">Community Rules</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
              {community.rules || 'Be respectful, keep discussions focused on performance improvement, and respect peer privacy.'}
            </p>

            <div className="pt-4 border-t border-[var(--border-glass)] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] font-mono">
                Privacy Policy Notice
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                ClipTrixAI does NOT automatically publish private assessment videos or biomechanical metrics to public feeds. Users must explicitly choose what to post.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-[var(--border-glass)] space-y-4 font-mono text-xs">
            <h4 className="font-bold text-[var(--text)] uppercase tracking-wider">Community Info</h4>
            <div className="space-y-2 text-[var(--text-muted)]">
              <div>Created: <span className="text-[var(--text)]">{community.createdAt}</span></div>
              <div>Category: <span className="text-[var(--text)] capitalize">{community.category}</span></div>
              <div>Access: <span className="text-[var(--text)] capitalize">{community.type}</span></div>
              <div>Owner: <span className="text-[var(--text)]">{community.ownerName || 'Verified Coach'}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* MODERATION PANEL */}
      {activeTab === 'moderation' && isModerator && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 bg-amber-500/10 space-y-2">
            <h3 className="text-base font-extrabold text-amber-300">Community Moderation Console</h3>
            <p className="text-xs text-amber-200/80">
              Review reported content, manage member permissions, and approve pending join requests.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-[var(--border-glass)] space-y-4">
            <h4 className="text-sm font-bold text-[var(--text)]">Pending Join Requests ({pendingRequests.length})</h4>
            {pendingRequests.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">No pending requests right now.</p>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text)]">{req.userName}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Approved ${req.userName}`, 'success')}
                        className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => showToast(`Rejected ${req.userName}`, 'info')}
                        className="p-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-bold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportContentModal
        isOpen={reportingItem.isOpen}
        onClose={() => setReportingItem({ ...reportingItem, isOpen: false })}
        itemType={reportingItem.type}
        showToast={showToast}
      />
    </div>
  );
};
