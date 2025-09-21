-- Add average deal size field to user profiles
ALTER TABLE public.profiles 
ADD COLUMN avg_deal_eur BIGINT DEFAULT NULL;

-- Add constraint for reasonable deal sizes (0 to 100 million euros in cents)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_avg_deal_eur_check 
CHECK (avg_deal_eur IS NULL OR (avg_deal_eur >= 0 AND avg_deal_eur <= 10000000000));

-- Comment on the column for clarity
COMMENT ON COLUMN public.profiles.avg_deal_eur IS 'Average deal size in Euro cents (e.g., 500000 = 5000 EUR)';