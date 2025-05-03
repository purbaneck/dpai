export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Dpia {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  created_by: string;
  organization_id?: string;
}

export interface DpiaSection {
  id: string;
  dpia_id: string;
  section_name: string;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  dpiaId?: string;
  section?: string;
}

export interface PreFillSuggestion {
  fieldId?: string;
  content: string;
}

export interface ChatSession {
  id: string;
  dpiaId: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}
