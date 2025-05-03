export type User = {
  id: string;
  email: string;
  full_name?: string;
  organization?: string;
  role?: string;
};

export type DPIA = {
  id: string;
  title: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_id: string;
  sections?: DPIASection[];
};

export type DPIASection = {
  id: string;
  dpia_id: string;
  section_name: string;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type FormStep = {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
};

export type FormField = {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  helpText?: string;
};

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  dpiaId?: string;
  section?: string;
};

export type PreFillSuggestion = {
  fieldId?: string;
  content: string;
};

export type AiResponse = {
  message: string;
  suggestion?: {
    fieldId?: string;
    content: string;
  };
};
