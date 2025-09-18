-- Add currency column to packages table
ALTER TABLE packages ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD';

-- Update existing packages to have USD currency
UPDATE packages SET currency = 'USD' WHERE currency IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_packages_currency ON packages(currency);
