import { createClient } from '@supabase/supabase-js';

// Use placeholder values for development if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTY1MDI0MDB9.placeholder';

// Log a warning if using placeholder values
if (import.meta.env.VITE_SUPABASE_URL === undefined || import.meta.env.VITE_SUPABASE_ANON_KEY === undefined) {
  console.warn('Using placeholder Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for proper functionality.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      dpias: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          status: 'draft' | 'submitted' | 'approved' | 'rejected';
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          status?: 'draft' | 'submitted' | 'approved' | 'rejected';
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          status?: 'draft' | 'submitted' | 'approved' | 'rejected';
          user_id?: string;
        };
      };
      dpia_sections: {
        Row: {
          id: string;
          dpia_id: string;
          section_name: string;
          content: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dpia_id: string;
          section_name: string;
          content: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dpia_id?: string;
          section_name?: string;
          content?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string;
          organization: string;
          role: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string;
          organization?: string;
          role?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string;
          organization?: string;
          role?: string;
        };
      };
    };
  };
};
