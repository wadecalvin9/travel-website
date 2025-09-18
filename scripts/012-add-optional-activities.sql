-- Add optional_activities column to packages table
ALTER TABLE packages 
ADD COLUMN optional_activities JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN packages.optional_activities IS 'JSON array of optional activities with title, description, price, and duration';

-- Create index for better performance when querying optional activities
CREATE INDEX idx_packages_optional_activities ON packages USING GIN (optional_activities);
