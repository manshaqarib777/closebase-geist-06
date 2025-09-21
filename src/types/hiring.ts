// Enums for job and application statuses
export type JobStatus = 'draft' | 'pending' | 'published' | 'closed';
export type ApplicationStage = 'applied' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected';
export type InterviewStatus = 'proposed' | 'confirmed' | 'declined';

// Job types
export interface Job {
  id: string;
  company_id: string;
  title: string;
  role_needed: string;
  seniority?: string;
  industries: string[];
  leads_type?: string;
  sales_cycle_band?: string;
  avg_product_cost_band?: string;
  leads_available: boolean;
  avg_commission_percent?: number;
  avg_commission_eur?: number;
  one_time_payment_eur?: number;
  weekly_hours_needed?: number;
  employment_type?: string;
  location_city?: string;
  location_country?: string;
  location_mode?: string;
  language: string;
  tools?: string[];
  screening_questions?: ScreeningQuestion[];
  description_md?: string;
  requirements_md?: string;
  responsibilities_md?: string;
  benefits_md?: string;
  kpis_md?: string;
  product_desc_md?: string;
  status: JobStatus;
  quality_score_int: number;
  published_at?: string;
  expires_at?: string;
  boost_until?: string;
  created_at: string;
  updated_at: string;
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'radio';
  options?: string[];
  required: boolean;
}

// Application types
export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStage;
  fit_score: number;
  answers?: Record<string, string>;
  cv_path?: string;
  source: string;
  message?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  job?: Job;
  user?: {
    id: string;
    email: string;
    profiles?: {
      first_name?: string;
      last_name?: string;
      display_name?: string;
      avatar_url?: string;
    };
  };
}

// Messaging types
export interface Thread {
  id: string;
  topic_type: string;
  topic_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  body?: string;
  attachments?: MessageAttachment[];
  created_at: string;
  
  // Relations
  sender?: {
    id: string;
    email: string;
    profiles?: {
      first_name?: string;
      last_name?: string;
      display_name?: string;
      avatar_url?: string;
    };
  };
}

export interface MessageAttachment {
  name: string;
  path: string;
  size: number;
  mime: string;
}

// Interview types
export interface Interview {
  id: string;
  application_id: string;
  status: InterviewStatus;
  slots: string[]; // ISO datetime strings
  confirmed_at?: string;
  slot_chosen_at?: string;
  created_at: string;
  updated_at: string;
}

// Saved jobs
export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  
  // Relations
  job?: Job;
}

// Fit scoring
export interface FitScoreResult {
  score: number;
  reasons: string[];
  breakdown: {
    role: number;
    leadType: number;
    salesCycle: number;
    dealSize: number;
    location: number;
    tools: number;
  };
}

// Quality scoring for jobs
export interface QualityScoreResult {
  score: number;
  breakdown: {
    title: number;
    role: number;
    industries: number;
    leadType: number;
    commission: number;
    employment: number;
    description: number;
  };
  feedback: string[];
}