-- Add user roles and company management
DO $$ 
BEGIN
  -- Add role column to profiles if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'sales' CHECK (role IN ('sales', 'company'));
  END IF;
  
  -- Add company_id column to profiles if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='company_id') THEN
    ALTER TABLE public.profiles ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create companies table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT,
  vat_id TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'trialing', 'past_due', 'canceled')),
  subscription_product_id TEXT,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;

-- Company policies
CREATE POLICY "Users can view companies they belong to" 
ON public.companies 
FOR SELECT 
USING (
  owner_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.company_users cu 
    WHERE cu.company_id = companies.id 
    AND cu.user_id = auth.uid() 
    AND cu.accepted_at IS NOT NULL
  )
);

CREATE POLICY "Company owners can update their company" 
ON public.companies 
FOR UPDATE 
USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

-- Company users policies
CREATE POLICY "Users can view company_users for their companies" 
ON public.company_users 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = company_users.company_id 
    AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "Company owners can manage company_users" 
ON public.company_users 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.companies c 
    WHERE c.id = company_users.company_id 
    AND c.owner_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer_id ON public.companies(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_company_users_company_id ON public.company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_user_id ON public.company_users(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);