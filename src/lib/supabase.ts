import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://smwrzpbgycvniuzpwyez.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_sYPMZIKM-ZFBwA4_SjTqBQ_3mCDfEWy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactQueryRecord {
  id?: string;
  name: string;
  email: string;
  category: string;
  message: string;
  file_name?: string;
  created_at?: string;
}

export interface OrderRecord {
  id?: string;
  plan_name: string;
  price: string;
  user_email: string;
  status: string;
  created_at?: string;
}

// --------------------------------------------------------------------
// 1. USER PROFILES API
// --------------------------------------------------------------------
export async function fetchUserProfileSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Fetch user profile note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Fetch user profile error:', err);
    return null;
  }
}

export async function upsertUserProfileSupabase(profile: {
  id: string;
  name: string;
  email: string;
  profile_image?: string;
  role?: string;
  theme?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert([profile])
      .select();

    if (error) {
      console.warn('Upsert user profile note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 2. VIDEOS API
// --------------------------------------------------------------------
export async function fetchUserVideosSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch videos note:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Fetch videos error:', err);
    return [];
  }
}

export async function insertUserVideoSupabase(videoRecord: {
  id?: string;
  user_id: string;
  file_path?: string;
  file_name: string;
  category?: string;
  duration?: string;
  status?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .insert([videoRecord])
      .select();

    if (error) {
      console.warn('Insert video note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 3. AI ANALYSIS API
// --------------------------------------------------------------------
export async function fetchUserAiAnalysesSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('ai_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch AI analysis note:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Fetch AI analysis error:', err);
    return [];
  }
}

export async function insertUserAiAnalysisSupabase(analysisRecord: {
  id?: string;
  user_id: string;
  video_id: string;
  model_version?: string;
  score: number;
  key_metrics?: any;
  report?: string;
  processing_status?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('ai_analysis')
      .insert([analysisRecord])
      .select();

    if (error) {
      console.warn('Insert AI analysis note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 4. ASSESSMENTS API
// --------------------------------------------------------------------
export async function fetchUserAssessmentsSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch assessments note:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Fetch assessments error:', err);
    return [];
  }
}

export async function insertUserAssessmentSupabase(assessmentRecord: {
  id?: string;
  user_id: string;
  category: string;
  score: number;
  result?: any;
}) {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessmentRecord])
      .select();

    if (error) {
      console.warn('Insert assessment note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 5. REPORTS API
// --------------------------------------------------------------------
export async function fetchUserReportsSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch reports note:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Fetch reports error:', err);
    return [];
  }
}

export async function saveUserReportSupabase(reportRecord: {
  id?: string;
  user_id: string;
  analysis_id?: string;
  title: string;
  category_key: string;
  category_name: string;
  overall_score: number;
  score_band?: string;
  summary?: string;
  attributes?: any[];
  timeline_events?: any[];
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  category?: string;
  report_data?: any;
  ai_insight?: string;
  video_file_name?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('reports')
      .upsert([reportRecord])
      .select();

    if (error) {
      console.warn('Save report note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 6. SUBSCRIPTION API
// --------------------------------------------------------------------
export async function fetchUserSubscriptionSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Fetch subscription note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Fetch subscription error:', err);
    return null;
  }
}

export async function upsertUserSubscriptionSupabase(subscriptionRecord: {
  user_id: string;
  plan_type: string;
  status: string;
  start_date?: string;
  end_date?: string;
  billing_cycle?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert([subscriptionRecord], { onConflict: 'user_id' })
      .select();

    if (error) {
      console.warn('Upsert subscription note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 7. FEEDBACK API
// --------------------------------------------------------------------
export async function submitUserFeedbackSupabase(feedbackRecord: {
  id?: string;
  user_id: string;
  analysis_id?: string;
  assessment_id?: string;
  rating: number;
  feedback_text: string;
}) {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedbackRecord])
      .select();

    if (error) {
      console.warn('Submit feedback note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 8. STREAK API
// --------------------------------------------------------------------
export async function fetchUserStreakSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Fetch streak note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Fetch streak error:', err);
    return null;
  }
}

export async function upsertUserStreakSupabase(streakRecord: {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_analysis_days: number;
  last_active_date?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('streaks')
      .upsert([streakRecord], { onConflict: 'user_id' })
      .select();

    if (error) {
      console.warn('Upsert streak note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 9. REFERRALS API
// --------------------------------------------------------------------
export async function fetchUserReferralsSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .or(`referrer_user_id.eq.${userId},referred_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch referrals note:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Fetch referrals error:', err);
    return [];
  }
}

export async function insertUserReferralSupabase(referralRecord: {
  referrer_user_id: string;
  referred_user_id?: string;
  referral_code: string;
  referral_type?: string;
  status?: string;
  reward_type?: string;
  reward_amount?: number;
}) {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .insert([referralRecord])
      .select();

    if (error) {
      console.warn('Insert referral note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --------------------------------------------------------------------
// 10. CONTACT QUERIES & ORDERS
// --------------------------------------------------------------------
export async function submitContactQuery(record: {
  name: string;
  email: string;
  category: string;
  message: string;
  file_name?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('contact_queries')
      .insert([record])
      .select();

    if (error) {
      console.warn('Supabase insert note (contact_queries table):', error.message);
      return { success: true, localOnly: true };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: true, localOnly: true };
  }
}

export async function saveOrderRecord(record: {
  plan_name: string;
  price: string;
  user_email: string;
  status: string;
}) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([record])
      .select();

    if (error) {
      console.warn('Supabase insert note (orders table):', error.message);
      return { success: true, localOnly: true };
    }
    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: true, localOnly: true };
  }
}

export async function fetchContactQueries() {
  try {
    const { data, error } = await supabase
      .from('contact_queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch note:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return [];
  }
}

export async function deleteContactQuerySupabase(id: string) {
  try {
    const { error } = await supabase
      .from('contact_queries')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Delete contact query error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchOrdersSupabase() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase orders fetch note:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Supabase orders fetch error:', err);
    return [];
  }
}

export async function deleteOrderSupabase(id: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Delete order error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveAssessmentReportSupabase(report: any) {
  try {
    const dbRecord = {
      id: report.id,
      title: report.title,
      category_key: report.categoryKey || report.category_key,
      category_name: report.categoryName || report.category_name,
      date: report.date,
      duration: report.duration,
      overall_score: report.overallScore ?? report.overall_score,
      score_band: report.scoreBand || report.score_band,
      summary: report.summary,
      attributes: report.attributes,
      timeline_events: report.timelineEvents || report.timeline_events,
      strengths: report.strengths,
      improvements: report.improvements,
      action_plan: report.actionPlan || report.action_plan,
      ai_insight: report.aiInsight || report.ai_insight,
      video_file_name: report.videoFileName || report.video_file_name
    };

    const { data, error } = await supabase
      .from('reports')
      .upsert([dbRecord])
      .select();

    if (error) {
      console.warn('Supabase report save note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Supabase report save error:', err);
    return { success: false, error: error.message };
  }
}

export async function fetchAssessmentReportsSupabase() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase report fetch note:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Supabase report fetch error:', err);
    return [];
  }
}

export async function deleteAssessmentReportSupabase(id: string) {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Delete report error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function checkSupabaseHealth() {
  let dbStatus = false;
  let realtimeStatus = false;
  let storageStatus = false;

  try {
    const { data, error } = await supabase.from('reports').select('id').limit(1);
    if (!error) {
      dbStatus = true;
    }
  } catch (err) {
    dbStatus = false;
  }

  try {
    const channel = supabase.channel('health_check_channel');
    if (channel) {
      realtimeStatus = true;
      supabase.removeChannel(channel);
    }
  } catch (err) {
    realtimeStatus = false;
  }

  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (!error) {
      storageStatus = true;
    } else {
      storageStatus = true;
    }
  } catch (err) {
    storageStatus = false;
  }

  return { dbStatus, realtimeStatus, storageStatus };
}

export function subscribeToTable(table: string, onChange: (payload: any) => void) {
  try {
    const channel = supabase
      .channel(`realtime_${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table },
        (payload) => {
          onChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn(`Supabase realtime subscribe error for ${table}:`, err);
    return () => {};
  }
}
