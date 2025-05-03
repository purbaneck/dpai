import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { DPIA, DPIASection } from '../types';

interface DPIAState {
  dpias: DPIA[];
  currentDpia: DPIA | null;
  loading: boolean;
  error: string | null;
  fetchDpias: () => Promise<void>;
  fetchDpiaById: (id: string) => Promise<void>;
  createDpia: (title: string, userId: string) => Promise<string | null>;
  updateDpia: (id: string, data: Partial<DPIA>) => Promise<void>;
  deleteDpia: (id: string) => Promise<void>;
  saveDpiaSection: (dpiaId: string, sectionName: string, content: Record<string, any>) => Promise<void>;
}

export const useDpiaStore = create<DPIAState>((set, get) => ({
  dpias: [],
  currentDpia: null,
  loading: false,
  error: null,

  fetchDpias: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('dpias')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      set({ dpias: data as DPIA[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchDpiaById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      // Fetch DPIA
      const { data: dpiaData, error: dpiaError } = await supabase
        .from('dpias')
        .select('*')
        .eq('id', id)
        .single();

      if (dpiaError) throw dpiaError;

      // Fetch DPIA sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('dpia_sections')
        .select('*')
        .eq('dpia_id', id);

      if (sectionsError) throw sectionsError;

      const dpia = {
        ...dpiaData,
        sections: sectionsData
      } as DPIA;

      set({ currentDpia: dpia, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createDpia: async (title: string, userId: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('dpias')
        .insert({
          title,
          user_id: userId,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      
      const dpias = [...get().dpias, data as DPIA];
      set({ dpias, loading: false });
      
      return data.id;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateDpia: async (id: string, data: Partial<DPIA>) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('dpias')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      const dpias = get().dpias.map(dpia => 
        dpia.id === id ? { ...dpia, ...data, updated_at: new Date().toISOString() } : dpia
      );
      
      const currentDpia = get().currentDpia && get().currentDpia.id === id 
        ? { ...get().currentDpia, ...data, updated_at: new Date().toISOString() } 
        : get().currentDpia;
      
      set({ dpias, currentDpia, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteDpia: async (id: string) => {
    try {
      set({ loading: true, error: null });
      
      // Delete sections first (foreign key constraint)
      const { error: sectionsError } = await supabase
        .from('dpia_sections')
        .delete()
        .eq('dpia_id', id);

      if (sectionsError) throw sectionsError;

      // Delete DPIA
      const { error } = await supabase
        .from('dpias')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      const dpias = get().dpias.filter(dpia => dpia.id !== id);
      const currentDpia = get().currentDpia && get().currentDpia.id === id ? null : get().currentDpia;
      
      set({ dpias, currentDpia, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  saveDpiaSection: async (dpiaId: string, sectionName: string, content: Record<string, any>) => {
    try {
      set({ loading: true, error: null });
      
      // Check if section already exists
      const { data: existingSection, error: checkError } = await supabase
        .from('dpia_sections')
        .select('*')
        .eq('dpia_id', dpiaId)
        .eq('section_name', sectionName)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      
      if (existingSection) {
        // Update existing section
        const { data, error } = await supabase
          .from('dpia_sections')
          .update({
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSection.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Create new section
        const { data, error } = await supabase
          .from('dpia_sections')
          .insert({
            dpia_id: dpiaId,
            section_name: sectionName,
            content,
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      // Update current DPIA if it's the one we're editing
      if (get().currentDpia && get().currentDpia.id === dpiaId) {
        const currentSections = get().currentDpia.sections || [];
        const updatedSections = existingSection
          ? currentSections.map(s => s.id === result.id ? result : s)
          : [...currentSections, result];
          
        set({ 
          currentDpia: { 
            ...get().currentDpia, 
            sections: updatedSections,
            updated_at: new Date().toISOString()
          },
          loading: false 
        });
      } else {
        set({ loading: false });
      }
      
      // Update DPIA's updated_at timestamp
      await supabase
        .from('dpias')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', dpiaId);
        
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
