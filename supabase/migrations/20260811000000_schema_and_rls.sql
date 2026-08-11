-- ====================================================================
-- CLIPTRIXAI SUPABASE SCHEMA & POLICIES MIGRATION SCRIPT
-- ====================================================================
-- Copy and paste this ENTIRE block into Supabase SQL Editor and click 'Run'.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS / PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_image TEXT,
  role TEXT DEFAULT 'Athlete',
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  file_path TEXT,
  file_name TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'processed',
  category TEXT,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_videos_updated_at ON public.videos;
CREATE TRIGGER set_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. AI ANALYSIS TABLE
CREATE TABLE IF NOT EXISTS public.ai_analysis (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  video_id TEXT,
  model_version TEXT DEFAULT 'gemini-2.5-flash',
  score NUMERIC,
  key_metrics JSONB DEFAULT '{}'::jsonb,
  report TEXT,
  processing_status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_ai_analysis_updated_at ON public.ai_analysis;
CREATE TRIGGER set_ai_analysis_updated_at
  BEFORE UPDATE ON public.ai_analysis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  score NUMERIC,
  result JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_assessments_updated_at ON public.assessments;
CREATE TRIGGER set_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  analysis_id TEXT,
  title TEXT NOT NULL,
  category_key TEXT NOT NULL,
  category_name TEXT NOT NULL,
  overall_score NUMERIC NOT NULL,
  score_band TEXT,
  summary TEXT,
  attributes JSONB DEFAULT '[]'::jsonb,
  timeline_events JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  report_data JSONB DEFAULT '{}'::jsonb,
  ai_insight TEXT,
  video_file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_reports_updated_at ON public.reports;
CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'Free',
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  billing_cycle TEXT DEFAULT 'monthly',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  analysis_id TEXT,
  assessment_id TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STREAKS TABLE
CREATE TABLE IF NOT EXISTS public.streaks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE NOT NULL,
  current_streak INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  total_analysis_days INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_streaks_updated_at ON public.streaks;
CREATE TRIGGER set_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT,
  referral_code TEXT NOT NULL,
  referral_type TEXT DEFAULT 'athlete',
  status TEXT DEFAULT 'pending',
  reward_type TEXT DEFAULT 'credits',
  reward_amount NUMERIC DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 10. COMMUNITY TABLES
CREATE TABLE IF NOT EXISTS public.communities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT DEFAULT 'public',
  image_url TEXT,
  owner_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_communities_updated_at ON public.communities;
CREATE TRIGGER set_communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.community_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  community_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'active',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_community_user UNIQUE (community_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  community_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion',
  content TEXT NOT NULL,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_community_posts_updated_at ON public.community_posts;
CREATE TRIGGER set_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.community_comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CONTACT QUERIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_queries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT,
  message TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  plan_name TEXT NOT NULL,
  price TEXT NOT NULL,
  user_email TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_user_id ON public.ai_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_comm_user ON public.community_members(community_id, user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_comm_id ON public.community_posts(community_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- CLEANUP OLD POLICIES
DROP POLICY IF EXISTS "Allow all users read write users" ON public.users;
DROP POLICY IF EXISTS "Allow all users read write videos" ON public.videos;
DROP POLICY IF EXISTS "Allow all users read write ai_analysis" ON public.ai_analysis;
DROP POLICY IF EXISTS "Allow all users read write assessments" ON public.assessments;
DROP POLICY IF EXISTS "Allow all users read write reports" ON public.reports;
DROP POLICY IF EXISTS "Allow all users read write subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow all users read write feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow all users read write streaks" ON public.streaks;
DROP POLICY IF EXISTS "Allow all users read write referrals" ON public.referrals;
DROP POLICY IF EXISTS "Allow all users read write communities" ON public.communities;
DROP POLICY IF EXISTS "Allow all users read write community_members" ON public.community_members;
DROP POLICY IF EXISTS "Allow all users read write community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Allow all users read write community_comments" ON public.community_comments;
DROP POLICY IF EXISTS "Allow all users read write contact_queries" ON public.contact_queries;
DROP POLICY IF EXISTS "Allow all users read write orders" ON public.orders;

-- PERMISSIVE RLS POLICIES FOR FULL APP FUNCTIONALITY
CREATE POLICY "Allow all users read write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write videos" ON public.videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write ai_analysis" ON public.ai_analysis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write assessments" ON public.assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write reports" ON public.reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write streaks" ON public.streaks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write referrals" ON public.referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write communities" ON public.communities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write community_members" ON public.community_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write community_posts" ON public.community_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write community_comments" ON public.community_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write contact_queries" ON public.contact_queries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all users read write orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
