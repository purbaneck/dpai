import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, PreFillSuggestion } from '../types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AiState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  preFillSuggestion: PreFillSuggestion | null;
  currentDpiaId: string | null;
  currentSection: string | null;
  sendMessage: (message: Message) => Promise<void>;
  clearMessages: () => void;
  setPreFillSuggestion: (suggestion: PreFillSuggestion | null) => void;
  setCurrentContext: (dpiaId: string | null, section: string | null) => void;
  loadChatHistory: (dpiaId: string) => Promise<void>;
  saveChatHistory: () => Promise<void>;
}

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,
      preFillSuggestion: null,
      currentDpiaId: null,
      currentSection: null,

      sendMessage: async (message: Message) => {
        try {
          set({ 
            isLoading: true, 
            error: null,
            messages: [...get().messages, message]
          });

          // Make API call to our backend proxy
          const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: message.content,
              dpiaId: message.dpiaId || get().currentDpiaId,
              section: message.section || get().currentSection,
              history: get().messages.filter(msg => msg.role !== 'system'),
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Failed to get response from AI');
          }

          const data = await response.json();
          
          // Add AI response to messages
          const updatedMessages = [...get().messages, { role: 'assistant', content: data.message }];
          set({ 
            messages: updatedMessages,
            isLoading: false 
          });

          // Check if there's a suggestion for pre-filling
          if (data.suggestion) {
            set({ 
              preFillSuggestion: {
                fieldId: data.suggestion.fieldId,
                content: data.suggestion.content
              }
            });
          }

          // Save chat history to Supabase if we have a DPIA ID
          if (get().currentDpiaId) {
            await get().saveChatHistory();
          }
        } catch (error: any) {
          console.error('Error sending message:', error);
          set({ 
            error: error.message, 
            isLoading: false 
          });
        }
      },

      clearMessages: () => {
        set({ 
          messages: [],
          preFillSuggestion: null
        });
      },

      setPreFillSuggestion: (suggestion: PreFillSuggestion | null) => {
        set({ preFillSuggestion: suggestion });
      },

      setCurrentContext: (dpiaId: string | null, section: string | null) => {
        set({ 
          currentDpiaId: dpiaId, 
          currentSection: section 
        });

        // If we have a new DPIA ID, load its chat history
        if (dpiaId && dpiaId !== get().currentDpiaId) {
          get().loadChatHistory(dpiaId);
        }
      },

      loadChatHistory: async (dpiaId: string) => {
        try {
          const { data: session, error } = await supabase
            .from('chat_sessions')
            .select('messages')
            .eq('dpia_id', dpiaId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error loading chat history:', error);
            return;
          }

          if (session && session.messages) {
            set({ messages: session.messages });
          } else {
            // No existing chat history, start fresh
            set({ messages: [] });
          }
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      },

      saveChatHistory: async () => {
        const { currentDpiaId, messages } = get();
        
        if (!currentDpiaId || messages.length === 0) return;

        try {
          const { data: existingSession, error: fetchError } = await supabase
            .from('chat_sessions')
            .select('id')
            .eq('dpia_id', currentDpiaId)
            .limit(1)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking for existing chat session:', fetchError);
            return;
          }

          if (existingSession) {
            // Update existing session
            const { error: updateError } = await supabase
              .from('chat_sessions')
              .update({ 
                messages,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingSession.id);

            if (updateError) {
              console.error('Error updating chat session:', updateError);
            }
          } else {
            // Create new session
            const { error: insertError } = await supabase
              .from('chat_sessions')
              .insert({
                dpia_id: currentDpiaId,
                messages,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (insertError) {
              console.error('Error creating chat session:', insertError);
            }
          }
        } catch (error) {
          console.error('Error saving chat history:', error);
        }
      }
    }),
    {
      name: 'ai-chat-storage',
      partialize: (state) => ({ 
        messages: state.messages.slice(-50), // Only persist the last 50 messages
        currentDpiaId: state.currentDpiaId,
        currentSection: state.currentSection
      }),
    }
  )
);
