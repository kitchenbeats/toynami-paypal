-- Add delivery tracking field to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Add comment
COMMENT ON COLUMN orders.delivered_at IS 'When order was delivered to customer';