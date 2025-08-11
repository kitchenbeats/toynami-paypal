-- ======================================
-- Add ALL CSV columns to products table
-- ======================================

ALTER TABLE products
-- Pricing columns
ADD COLUMN IF NOT EXISTS retail_price_cents INTEGER,
ADD COLUMN IF NOT EXISTS sale_price_cents INTEGER, 
ADD COLUMN IF NOT EXISTS cost_price_cents INTEGER,
ADD COLUMN IF NOT EXISTS calculated_price_cents INTEGER,

-- Inventory columns  
ADD COLUMN IF NOT EXISTS low_stock_level INTEGER,
ADD COLUMN IF NOT EXISTS bin_picking_number TEXT,
ADD COLUMN IF NOT EXISTS product_availability TEXT,

-- Shipping columns
ADD COLUMN IF NOT EXISTS fixed_shipping_price_cents INTEGER,

-- Product details
ADD COLUMN IF NOT EXISTS brand_plus_name TEXT,
ADD COLUMN IF NOT EXISTS show_product_condition BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tax_provider_tax_code TEXT,
ADD COLUMN IF NOT EXISTS search_keywords TEXT,

-- URL handling
ADD COLUMN IF NOT EXISTS redirect_old_url BOOLEAN DEFAULT FALSE,

-- Product options
ADD COLUMN IF NOT EXISTS option_set TEXT,
ADD COLUMN IF NOT EXISTS option_set_align TEXT,
ADD COLUMN IF NOT EXISTS stop_processing_rules BOOLEAN DEFAULT FALSE,

-- Custom fields and files
ADD COLUMN IF NOT EXISTS product_custom_fields JSONB,
ADD COLUMN IF NOT EXISTS product_files JSONB,
ADD COLUMN IF NOT EXISTS shipping_groups TEXT[],
ADD COLUMN IF NOT EXISTS origin_locations TEXT[],
ADD COLUMN IF NOT EXISTS dimensional_rules JSONB,

-- Event dates (for preorders/events)
ADD COLUMN IF NOT EXISTS event_date_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS event_date_name TEXT,
ADD COLUMN IF NOT EXISTS event_date_is_limited BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS event_date_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS event_date_end_date TIMESTAMPTZ,

-- Accounting integration
ADD COLUMN IF NOT EXISTS myob_asset_acct TEXT,
ADD COLUMN IF NOT EXISTS myob_income_acct TEXT,
ADD COLUMN IF NOT EXISTS myob_expense_acct TEXT,

-- Dates from CSV
ADD COLUMN IF NOT EXISTS date_added TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS date_modified TIMESTAMPTZ,

-- Additional identifiers
ADD COLUMN IF NOT EXISTS manufacturer_part_number TEXT,
ADD COLUMN IF NOT EXISTS global_trade_item_number TEXT;

-- Add indexes for commonly searched fields
CREATE INDEX IF NOT EXISTS products_retail_price_idx ON products(retail_price_cents);
CREATE INDEX IF NOT EXISTS products_sale_price_idx ON products(sale_price_cents);
CREATE INDEX IF NOT EXISTS products_low_stock_idx ON products(low_stock_level);
-- CREATE INDEX IF NOT EXISTS products_search_keywords_idx ON products USING gin(to_tsvector('english', COALESCE(search_keywords, '')));
CREATE INDEX IF NOT EXISTS products_date_added_idx ON products(date_added);
CREATE INDEX IF NOT EXISTS products_date_modified_idx ON products(date_modified);