-- ==========================================
-- SUPABASE DATABASE INITIALIZATION SCRIPT
-- ClipTrix AI - Real-time Multimodal Video Telemetry App
-- Copy and paste this script directly into Supabase SQL Editor and click "Run".
-- ==========================================

-- 1. Create 'contact_queries' table
CREATE TABLE IF NOT EXISTS public.contact_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'orders' table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name TEXT NOT NULL,
  price TEXT NOT NULL,
  user_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'assessment_reports' table
CREATE TABLE IF NOT EXISTS public.assessment_reports (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category_key TEXT NOT NULL,
  category_name TEXT NOT NULL,
  date TEXT,
  duration TEXT,
  overall_score INTEGER NOT NULL,
  score_band TEXT,
  summary TEXT,
  attributes JSONB,
  timeline_events JSONB,
  strengths JSONB,
  improvements JSONB,
  action_plan JSONB,
  ai_insight TEXT,
  video_file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables public insertion and read access for demo/applet usage
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow anonymous insert into contact_queries" ON public.contact_queries;
DROP POLICY IF EXISTS "Allow anonymous select from contact_queries" ON public.contact_queries;

DROP POLICY IF EXISTS "Allow anonymous insert into orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous select from orders" ON public.orders;

DROP POLICY IF EXISTS "Allow anonymous insert into assessment_reports" ON public.assessment_reports;
DROP POLICY IF EXISTS "Allow anonymous select from assessment_reports" ON public.assessment_reports;

-- Create public access policies
CREATE POLICY "Allow anonymous insert into contact_queries"
  ON public.contact_queries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select from contact_queries"
  ON public.contact_queries FOR SELECT
  USING (true);

CREATE POLICY "Allow anonymous insert into orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select from orders"
  ON public.orders FOR SELECT
  USING (true);

CREATE POLICY "Allow anonymous insert into assessment_reports"
  ON public.assessment_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select from assessment_reports"
  ON public.assessment_reports FOR SELECT
  USING (true);

-- ==========================================
-- SAMPLE SEED DATA
-- ==========================================

INSERT INTO public.contact_queries (name, email, category, message, file_name)
VALUES 
  ('Aarav Sharma', 'aarav.sharma@example.com', 'interview', 'Inquiring about Enterprise cohort licenses for engineering graduates.', 'cohort_inquiry.pdf'),
  ('Priya Patel', 'priya.patel@example.com', 'presentation', 'Need custom rubric for Series A pitch evaluation.', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO public.orders (plan_name, price, user_email, status)
VALUES 
  ('Professional Pro', '₹99', 'user@example.com', 'completed'),
  ('Enterprise', '₹249', 'admin@corporate.com', 'completed')
ON CONFLICT DO NOTHING;

-- Complete!
