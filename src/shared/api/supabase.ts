import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error 
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Типы для базы данных
export interface TestResultInsert {
  consent: boolean;
  age?: number;
  gender?: string;
  position?: string;
  other_position?: string;
  experience_years?: number;
  work_format?: string;
  work_hours?: string;
  overtime?: string;
  
  tension_score: number;
  resistance_score: number;
  exhaustion_score: number;
  overall_score: number;
  burnout_level: string;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  symptoms: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  phases: any;
  
  session_duration?: number;
  user_agent?: string;
}

export interface TestResult extends TestResultInsert {
  id: string;
  created_at: string;
}

export interface AggregatedStats {
  date: string;
  total_tests: number;
  avg_overall_score: number;
  avg_tension_score: number;
  avg_resistance_score: number;
  avg_exhaustion_score: number;
  low_level_count: number;
  medium_level_count: number;
  high_level_count: number;
  critical_level_count: number;
}

export interface DemographicData {
  consent: boolean;
  age?: number;
  gender?: string;
  position?: string;
  otherPosition?: string;
  experience_years?: number;
  work_format?: string;
  work_hours?: string;
  overtime?: string;
}