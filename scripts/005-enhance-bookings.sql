-- Add new columns to bookings table for enhanced functionality
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS accommodation_type VARCHAR(50) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS dietary_requirements TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact JSONB,
ADD COLUMN IF NOT EXISTS insurance BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'card';

-- Update existing bookings to have deposit and balance amounts
UPDATE bookings 
SET 
  deposit_amount = ROUND(total_amount * 0.3, 2),
  balance_amount = ROUND(total_amount * 0.7, 2)
WHERE deposit_amount = 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
