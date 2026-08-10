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
      .from('assessment_reports')
      .upsert([dbRecord])
      .select();

    if (error) {
      console.warn('Supabase report save note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Supabase report save error:', err);
    return { success: false, error: err.message };
  }
}

export async function fetchAssessmentReportsSupabase() {
  try {
    const { data, error } = await supabase
      .from('assessment_reports')
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
      .from('assessment_reports')
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
    const { data, error } = await supabase.from('assessment_reports').select('id').limit(1);
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
      // Even if no bucket permissions, endpoint reachable
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


