-- Add account_type column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'standard';

-- Update existing users to have standard account type
UPDATE users SET account_type = 'standard' WHERE account_type IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);

-- Add comment for documentation
COMMENT ON COLUMN users.account_type IS 'Account type: standard, premium, vip';
