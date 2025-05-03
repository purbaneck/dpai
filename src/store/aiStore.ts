import { create } from 'zustand';
import { Message, PreFillSuggestion } from '../types';

interface AiState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  preFillSuggestion: PreFillSuggestion | null;
  sendMessage: (message: Message) => Promise<void>;
  clearMessages: () => void;
  setPreFillSuggestion: (suggestion: PreFillSuggestion | null) => void;
}

export const useAiStore = create<AiState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  preFillSuggestion: null,

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
          dpiaId: message.dpiaId,
          section: message.section,
          history: get().messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      // Add AI response to messages
      set({ 
        messages: [...get().messages, { role: 'assistant', content: data.message }],
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
    } catch (error: any) {
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
}));
