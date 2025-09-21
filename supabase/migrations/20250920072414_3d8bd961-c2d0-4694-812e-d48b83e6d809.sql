-- Create enums for job and application statuses
CREATE TYPE job_status AS ENUM ('draft', 'pending', 'published', 'closed');
CREATE TYPE application_stage AS ENUM ('applied', 'shortlist', 'interview', 'offer', 'hired', 'rejected');
CREATE TYPE interview_status AS ENUM ('proposed', 'confirmed', 'declined');

-- Update jobs table with new fields
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS role_needed TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS seniority TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS sales_cycle_band TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS avg_product_cost_band TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS leads_available BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS avg_commission_percent DECIMAL(5,2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS avg_commission_eur INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS one_time_payment_eur INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS weekly_hours_needed INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS boost_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS quality_score_int INTEGER DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS screening_questions JSONB;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS requirements_md TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS responsibilities_md TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS benefits_md TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS kpis_md TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS product_desc_md TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS leads_type TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS tools JSONB;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'de';

-- Update applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS fit_score INTEGER DEFAULT 0;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS answers JSONB;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS cv_path TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'closebase';

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create threads table for messaging
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_type TEXT NOT NULL,
  topic_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  body TEXT,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status interview_status DEFAULT 'proposed',
  slots JSONB NOT NULL,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  slot_chosen_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_jobs
CREATE POLICY "Users can manage their own saved jobs" ON saved_jobs
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for threads
CREATE POLICY "Users can view threads for their applications" ON threads
  FOR SELECT USING (
    topic_type = 'application' AND (
      EXISTS (SELECT 1 FROM applications WHERE id = threads.topic_id AND user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM applications a JOIN jobs j ON a.job_id = j.id JOIN company_users cu ON j.company_id = cu.company_id 
              WHERE a.id = threads.topic_id AND cu.user_id = auth.uid() AND cu.accepted_at IS NOT NULL)
    )
  );

CREATE POLICY "System can create threads" ON threads
  FOR INSERT WITH CHECK (true);

-- RLS policies for messages
CREATE POLICY "Users can view messages in their threads" ON messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM threads WHERE id = messages.thread_id AND (
      (topic_type = 'application' AND (
        EXISTS (SELECT 1 FROM applications WHERE id = threads.topic_id AND user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM applications a JOIN jobs j ON a.job_id = j.id JOIN company_users cu ON j.company_id = cu.company_id 
                WHERE a.id = threads.topic_id AND cu.user_id = auth.uid() AND cu.accepted_at IS NOT NULL)
      ))
    ))
  );

CREATE POLICY "Users can send messages in their threads" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM threads WHERE id = messages.thread_id AND (
      (topic_type = 'application' AND (
        EXISTS (SELECT 1 FROM applications WHERE id = threads.topic_id AND user_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM applications a JOIN jobs j ON a.job_id = j.id JOIN company_users cu ON j.company_id = cu.company_id 
                WHERE a.id = threads.topic_id AND cu.user_id = auth.uid() AND cu.accepted_at IS NOT NULL)
      ))
    ))
  );

-- RLS policies for interviews
CREATE POLICY "Users can view interviews for their applications" ON interviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM applications WHERE id = interviews.application_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM applications a JOIN jobs j ON a.job_id = j.id JOIN company_users cu ON j.company_id = cu.company_id 
            WHERE a.id = interviews.application_id AND cu.user_id = auth.uid() AND cu.accepted_at IS NOT NULL)
  );

CREATE POLICY "Company users can manage interviews for their jobs" ON interviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM applications a JOIN jobs j ON a.job_id = j.id JOIN company_users cu ON j.company_id = cu.company_id 
            WHERE a.id = interviews.application_id AND cu.user_id = auth.uid() AND cu.accepted_at IS NOT NULL)
  );

CREATE POLICY "Candidates can update interview choices" ON interviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM applications WHERE id = interviews.application_id AND user_id = auth.uid())
  );

-- Update triggers for updated_at
CREATE TRIGGER update_threads_updated_at
  BEFORE UPDATE ON threads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();