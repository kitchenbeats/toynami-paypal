-- ======================================
-- Drop unused brand TEXT column from products
-- ======================================

-- Drop the old brand TEXT column - using brand_id foreign key instead
ALTER TABLE products DROP COLUMN IF EXISTS brand;