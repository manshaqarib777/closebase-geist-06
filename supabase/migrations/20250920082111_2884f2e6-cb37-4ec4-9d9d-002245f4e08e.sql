-- Add missing columns to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS vat_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'trialing', 'past_due', 'canceled')),
ADD COLUMN IF NOT EXISTS subscription_product_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Add role and company_id to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'sales' CHECK (role IN ('sales', 'company')),
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Create company_users table for team management
CREATE TABLE IF NOT EXISTS public.company_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'recruiter', 'member')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- Enable RLS on new table
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer_id ON public.companies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_company_users_company_id ON public.company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_user_id ON public.company_users(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);