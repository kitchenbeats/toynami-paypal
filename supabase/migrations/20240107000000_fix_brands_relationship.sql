-- ======================================
-- Fix products-brands relationship
-- ======================================

-- Add brand_id column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id);

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS products_brand_id_idx ON products(brand_id);

-- Update existing products to link to brands based on brand name
UPDATE products 
SET brand_id = brands.id 
FROM brands 
WHERE products.brand = brands.name;

-- Optional: Drop the old brand TEXT column (commented out for safety)
-- ALTER TABLE products DROP COLUMN IF EXISTS brand;