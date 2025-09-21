-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_file_id UUID,
  industry TEXT[] DEFAULT '{}',
  website_url TEXT,
  linkedin_url TEXT,
  location_city TEXT,
  location_country TEXT,
  headcount_band TEXT CHECK (headcount_band IN ('1_10', '11_50', '51_200', '201_500', '501_1000', '1000_plus')),
  revenue_band TEXT CHECK (revenue_band IN ('0_100k', '100k_1m', '1m_5m', '5m_10m', '10m_plus')),
  description TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  moderation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_users table (many-to-many relationship)
CREATE TABLE public.company_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'recruiter', 'viewer')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  role_needed TEXT NOT NULL CHECK (role_needed IN ('setter', 'closer', 'consultant', 'full_cycle')),
  industries TEXT[] DEFAULT '{}',
  description_md TEXT,
  product_desc_md TEXT,
  leads_type TEXT CHECK (leads_type IN ('warm', 'cold', 'both')),
  leads_available BOOLEAN DEFAULT false,
  sales_cycle_band TEXT CHECK (sales_cycle_band IN ('d_1_7', 'w_1_4', 'm_1_2', 'm_2_6', 'm_6_12')),
  avg_product_cost_band TEXT CHECK (avg_product_cost_band IN ('500_5000', '5001_10000', '10001_25000', '25001_50000', 'gt_50001')),
  avg_commission_percent DECIMAL(5,2),
  avg_commission_eur INTEGER,
  one_time_payment_eur INTEGER,
  employment_type TEXT CHECK (employment_type IN ('freelance', 'employee')),
  weekly_hours_needed INTEGER CHECK (weekly_hours_needed >= 1 AND weekly_hours_needed <= 60),
  location_mode TEXT CHECK (location_mode IN ('remote', 'hybrid', 'onsite')),
  location_city TEXT,
  location_country TEXT,
  requirements_md TEXT,
  responsibilities_md TEXT,
  benefits_md TEXT,
  kpis_md TEXT,
  quality_score_int INTEGER DEFAULT 0 CHECK (quality_score_int >= 0 AND quality_score_int <= 100),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'published', 'paused', 'closed')),
  boost_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'shortlisted', 'interview', 'hired', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_views table
CREATE TABLE public.job_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_saved_searches table
CREATE TABLE public.job_saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  query_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_saved_searches ENABLE ROW LEVEL SECURITY;

-- Create policies for companies
CREATE POLICY "Users can view companies they belong to" 
ON public.companies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users 
    WHERE company_users.company_id = companies.id 
    AND company_users.user_id = auth.uid()
    AND company_users.accepted_at IS NOT NULL
  )
);

CREATE POLICY "Users can update companies they own" 
ON public.companies 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users 
    WHERE company_users.company_id = companies.id 
    AND company_users.user_id = auth.uid()
    AND company_users.role = 'owner'
    AND company_users.accepted_at IS NOT NULL
  )
);

-- Create policies for company_users
CREATE POLICY "Users can view company users for their companies" 
ON public.company_users 
FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.company_users cu 
    WHERE cu.company_id = company_users.company_id 
    AND cu.user_id = auth.uid()
    AND cu.accepted_at IS NOT NULL
  )
);

CREATE POLICY "Company owners can manage users" 
ON public.company_users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users cu 
    WHERE cu.company_id = company_users.company_id 
    AND cu.user_id = auth.uid()
    AND cu.role = 'owner'
    AND cu.accepted_at IS NOT NULL
  )
);

-- Create policies for jobs
CREATE POLICY "Public can view published jobs" 
ON public.jobs 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Company users can view their company jobs" 
ON public.jobs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users 
    WHERE company_users.company_id = jobs.company_id 
    AND company_users.user_id = auth.uid()
    AND company_users.accepted_at IS NOT NULL
  )
);

CREATE POLICY "Company users can manage their company jobs" 
ON public.jobs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users 
    WHERE company_users.company_id = jobs.company_id 
    AND company_users.user_id = auth.uid()
    AND company_users.role IN ('owner', 'recruiter')
    AND company_users.accepted_at IS NOT NULL
  )
);

-- Create policies for applications
CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Company users can view applications for their jobs" 
ON public.applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.company_users cu ON cu.company_id = j.company_id
    WHERE j.id = applications.job_id 
    AND cu.user_id = auth.uid()
    AND cu.accepted_at IS NOT NULL
  )
);

CREATE POLICY "Company users can update applications for their jobs" 
ON public.applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.company_users cu ON cu.company_id = j.company_id
    WHERE j.id = applications.job_id 
    AND cu.user_id = auth.uid()
    AND cu.role IN ('owner', 'recruiter')
    AND cu.accepted_at IS NOT NULL
  )
);

-- Create policies for job_views
CREATE POLICY "Anyone can create job views" 
ON public.job_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Company users can view job views for their jobs" 
ON public.job_views 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.company_users cu ON cu.company_id = j.company_id
    WHERE j.id = job_views.job_id 
    AND cu.user_id = auth.uid()
    AND cu.accepted_at IS NOT NULL
  )
);

-- Create policies for job_saved_searches
CREATE POLICY "Company users can manage their company saved searches" 
ON public.job_saved_searches 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.company_users 
    WHERE company_users.company_id = job_saved_searches.company_id 
    AND company_users.user_id = auth.uid()
    AND company_users.accepted_at IS NOT NULL
  )
);

-- Create indexes for performance
CREATE INDEX idx_companies_verified_at ON public.companies(verified_at);
CREATE INDEX idx_jobs_company_status_boost ON public.jobs(company_id, status, boost_until);
CREATE INDEX idx_applications_job_status ON public.applications(job_id, status);
CREATE INDEX idx_company_users_company_user ON public.company_users(company_id, user_id);
CREATE INDEX idx_job_views_job_created ON public.job_views(job_id, created_at);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();