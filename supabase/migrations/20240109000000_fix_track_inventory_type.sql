-- ======================================
-- Fix track_inventory column type conflict
-- ======================================

-- First drop the column if it exists
ALTER TABLE products DROP COLUMN IF EXISTS track_inventory;

-- Re-add it as TEXT to match BigCommerce data model
-- BigCommerce uses: 'none', 'by product', 'by variant'
ALTER TABLE products 
ADD COLUMN track_inventory TEXT DEFAULT 'none' CHECK (track_inventory IN ('none', 'by product', 'by variant'));