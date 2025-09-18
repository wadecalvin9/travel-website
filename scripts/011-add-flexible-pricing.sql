-- Add flexible pricing columns to packages table
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS price_text TEXT,
ADD COLUMN IF NOT EXISTS pricing_type VARCHAR(20) DEFAULT 'fixed';

-- Update existing packages to have pricing_type = 'fixed'
UPDATE packages 
SET pricing_type = 'fixed' 
WHERE pricing_type IS NULL;

-- Add optional activities column
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS optional_activities JSONB DEFAULT '[]'::jsonb;
