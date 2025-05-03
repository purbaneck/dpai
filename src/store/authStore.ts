import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      set({ session: data.session, loading: false });
      await get().getUser();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  signUp: async (email: string, password: string, userData: Partial<User>) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: userData.full_name,
            organization: userData.organization,
            role: userData.role,
          });

        if (profileError) throw profileError;
      }

      set({ session: data.session, loading: false });
      await get().getUser();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getUser: async () => {
    try {
      set({ loading: true, error: null });
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        set({ user: null, session: null, loading: false });
        return;
      }

      set({ session: sessionData.session });
      
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();

      if (userError) throw userError;
      
      set({ 
        user: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          organization: userData.organization,
          role: userData.role
        }, 
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
