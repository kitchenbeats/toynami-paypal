-- ======================================
-- Add missing essential e-commerce columns to products table
-- ======================================

-- Pricing columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS base_price_cents INTEGER,
ADD COLUMN IF NOT EXISTS compare_price_cents INTEGER,
ADD COLUMN IF NOT EXISTS cost_price_cents INTEGER;

-- Inventory columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS track_inventory TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS stock_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_stock_level INTEGER DEFAULT 0;

-- SEO & metadata columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS search_keywords TEXT;

-- Product details
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS upc TEXT,
ADD COLUMN IF NOT EXISTS manufacturer_part_number TEXT,
ADD COLUMN IF NOT EXISTS product_url TEXT,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Purchase rules
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS min_purchase_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_purchase_quantity INTEGER DEFAULT 0;

-- Featured flag
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT FALSE;

-- Ratings (for future use)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS products_sku_idx ON products(sku) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products(is_featured) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS products_sort_order_idx ON products(sort_order);
CREATE INDEX IF NOT EXISTS products_stock_level_idx ON products(stock_level) WHERE deleted_at IS NULL;

-- Add text search indexes for keywords (for comma-separated text values)
CREATE INDEX IF NOT EXISTS products_search_keywords_idx ON products USING gin(to_tsvector('english', COALESCE(search_keywords, '')));
CREATE INDEX IF NOT EXISTS products_meta_keywords_idx ON products USING gin(to_tsvector('english', COALESCE(meta_keywords, '')));