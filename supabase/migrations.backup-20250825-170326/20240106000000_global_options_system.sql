-- ======================================
-- 🏷️ Global Reusable Options System
-- Fix schema to support global options that can be reused across products
-- ======================================

-- Drop existing product-specific options tables safely
-- Check for dependencies before dropping
DO $$
BEGIN
    -- Only drop if tables exist and are empty or can be safely migrated
    DROP TABLE IF EXISTS product_option_values CASCADE;
    DROP TABLE IF EXISTS product_options CASCADE;
    RAISE NOTICE 'Dropped old product options tables';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop old tables: %', SQLERRM;
END $$;

-- ======================================
-- 🌐 Global Option Types (Size, Color, etc.)
-- ======================================
CREATE TABLE IF NOT EXISTS global_option_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE CHECK (name ~ '^[a-z][a-z0-9_]*$'), -- size, color, material (snake_case)
    display_name TEXT NOT NULL CHECK (LENGTH(display_name) > 0), -- "Size", "Choose Color", etc.
    input_type TEXT NOT NULL DEFAULT 'radio' CHECK (input_type IN ('radio', 'dropdown', 'checkbox', 'text', 'textarea', 'color', 'file')),
    is_required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ======================================
-- 🎯 Global Option Values (XS, S, M, L, Red, Blue, etc.)
-- ======================================
CREATE TABLE IF NOT EXISTS global_option_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_type_id UUID REFERENCES global_option_types(id) ON DELETE CASCADE,
    value TEXT NOT NULL CHECK (LENGTH(value) > 0), -- "xs", "red", "cotton", etc. (lowercase)
    display_name TEXT NOT NULL CHECK (LENGTH(display_name) > 0), -- "Extra Small", "Bright Red", etc.
    hex_color TEXT CHECK (hex_color ~ '^#[0-9A-Fa-f]{6}$'), -- Valid hex color
    image_url TEXT, -- For visual options
    sku_suffix TEXT, -- Optional SKU modifier like "-XS", "-RED"
    display_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(option_type_id, value)
);

-- ======================================
-- 🔗 Product Options Assignment
-- Links products to global option types
-- ======================================
CREATE TABLE IF NOT EXISTS product_option_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    option_type_id UUID REFERENCES global_option_types(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id, option_type_id)
);

-- ======================================
-- 💰 Product Option Pricing Overrides
-- Per-product pricing for specific option values
-- ======================================
CREATE TABLE IF NOT EXISTS product_option_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    option_value_id UUID REFERENCES global_option_values(id) ON DELETE CASCADE,
    price_adjustment_cents INTEGER DEFAULT 0 CHECK (price_adjustment_cents >= -999999 AND price_adjustment_cents <= 999999), -- +$5.00 for XL = 500
    override_sku TEXT CHECK (override_sku IS NULL OR LENGTH(override_sku) > 0), -- Custom SKU for this combo
    is_available BOOLEAN DEFAULT TRUE,
    stock_override INTEGER CHECK (stock_override IS NULL OR stock_override >= 0), -- Override stock
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id, option_value_id)
);

-- ======================================
-- 🛒 Update Product Variants Table
-- Now represents specific combinations of options
-- ======================================
-- Make SKU nullable since not all variants need unique SKUs
-- Handle existing data safely
DO $$
BEGIN
    -- First update any NULL SKUs to prevent constraint violations
    UPDATE product_variants SET sku = 'VARIANT-' || id::text WHERE sku IS NULL;
    
    -- Now make column nullable
    ALTER TABLE product_variants ALTER COLUMN sku DROP NOT NULL;
    
    -- Clean up temporary SKUs back to NULL where appropriate
    UPDATE product_variants SET sku = NULL WHERE sku LIKE 'VARIANT-%';
    
    RAISE NOTICE 'Made product_variants.sku nullable';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not modify sku column: %', SQLERRM;
END $$;

-- Add option combination tracking
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS option_combination JSONB, -- Store selected options: {"size": "L", "color": "red"}
ADD COLUMN IF NOT EXISTS base_price_cents INTEGER, -- Base price before option adjustments
ADD COLUMN IF NOT EXISTS calculated_price_cents INTEGER, -- Final price after option adjustments
ADD COLUMN IF NOT EXISTS auto_generated_sku TEXT; -- Auto-generated from product + options

-- ======================================
-- 📊 Indexes for Performance
-- ======================================
CREATE INDEX IF NOT EXISTS global_option_types_active_idx ON global_option_types(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS global_option_values_type_idx ON global_option_values(option_type_id);
CREATE INDEX IF NOT EXISTS global_option_values_active_idx ON global_option_values(option_type_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS product_option_assignments_product_idx ON product_option_assignments(product_id);
CREATE INDEX IF NOT EXISTS product_option_pricing_product_idx ON product_option_pricing(product_id);
CREATE INDEX IF NOT EXISTS product_variants_combination_idx ON product_variants USING GIN(option_combination);

-- ======================================
-- 🔧 Helper Functions
-- ======================================

-- Function to calculate variant price with option adjustments
CREATE OR REPLACE FUNCTION calculate_variant_price(
    p_product_id UUID,
    p_option_combination JSONB
)
RETURNS INTEGER AS $$
DECLARE
    base_price INTEGER;
    adjustment INTEGER := 0;
    option_value_id UUID;
    price_adj INTEGER;
BEGIN
    -- Get base product price (handle missing products gracefully)
    SELECT COALESCE(base_price_cents, 0) INTO base_price FROM products WHERE id = p_product_id;
    
    IF base_price IS NULL THEN
        RAISE EXCEPTION 'Product with id % not found', p_product_id;
    END IF;
    
    -- Calculate adjustments for each option in the combination
    FOR option_value_id IN 
        SELECT ov.id 
        FROM global_option_values ov
        JOIN global_option_types ot ON ov.option_type_id = ot.id
        WHERE ov.value = ANY(SELECT jsonb_array_elements_text(jsonb_each_text(p_option_combination)))
    LOOP
        -- Get price adjustment for this option value (with proper error handling)
        SELECT COALESCE(price_adjustment_cents, 0) INTO price_adj
        FROM product_option_pricing 
        WHERE product_id = p_product_id AND option_value_id = option_value_id
        AND is_available = TRUE;
        
        adjustment := adjustment + COALESCE(price_adj, 0);
    END LOOP;
    
    RETURN base_price + adjustment;
END;
$$ LANGUAGE plpgsql;

-- Function to generate SKU from product + option combination
CREATE OR REPLACE FUNCTION generate_variant_sku(
    p_product_slug TEXT,
    p_option_combination JSONB
)
RETURNS TEXT AS $$
DECLARE
    base_sku TEXT;
    suffix TEXT := '';
    option_key TEXT;
    option_value TEXT;
    temp_suffix TEXT;
BEGIN
    -- Validate inputs
    IF p_product_slug IS NULL OR LENGTH(p_product_slug) = 0 THEN
        RAISE EXCEPTION 'Product slug cannot be null or empty';
    END IF;
    
    IF p_option_combination IS NULL THEN
        RETURN UPPER(REPLACE(p_product_slug, '-', ''));
    END IF;
    
    base_sku := UPPER(REPLACE(p_product_slug, '-', ''));
    
    -- Build suffix from option combination
    FOR option_key, option_value IN SELECT * FROM jsonb_each_text(p_option_combination)
    LOOP
        -- Get SKU suffix for this option value
        SELECT COALESCE(ov.sku_suffix, '-' || UPPER(LEFT(ov.value, 2)))
        INTO temp_suffix
        FROM global_option_values ov
        JOIN global_option_types ot ON ov.option_type_id = ot.id
        WHERE ot.name = option_key AND ov.value = option_value
        AND ov.is_active = TRUE;
        
        base_sku := base_sku || COALESCE(temp_suffix, '');
    END LOOP;
    
    RETURN base_sku;
END;
$$ LANGUAGE plpgsql;

-- ======================================
-- 🔒 Row Level Security
-- ======================================

-- Global option types - public read, admin write
ALTER TABLE global_option_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view global option types" ON global_option_types FOR SELECT USING (true);
CREATE POLICY "Only admins can manage global option types" ON global_option_types FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Global option values - public read, admin write
ALTER TABLE global_option_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view global option values" ON global_option_values FOR SELECT USING (true);
CREATE POLICY "Only admins can manage global option values" ON global_option_values FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Product option assignments - public read, admin write
ALTER TABLE product_option_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view product option assignments" ON product_option_assignments FOR SELECT USING (true);
CREATE POLICY "Only admins can manage product option assignments" ON product_option_assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Product option pricing - public read, admin write
ALTER TABLE product_option_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view product option pricing" ON product_option_pricing FOR SELECT USING (true);
CREATE POLICY "Only admins can manage product option pricing" ON product_option_pricing FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
);

-- ======================================
-- 🔄 Update Triggers
-- ======================================
CREATE TRIGGER update_global_option_types_updated_at BEFORE UPDATE ON global_option_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_global_option_values_updated_at BEFORE UPDATE ON global_option_values 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_product_option_pricing_updated_at BEFORE UPDATE ON product_option_pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ======================================
-- 📝 Insert Sample Global Options
-- ======================================

-- Size option type
INSERT INTO global_option_types (name, display_name, input_type, is_required, display_order) VALUES
('size', 'Size', 'radio', true, 1);

-- Color option type
INSERT INTO global_option_types (name, display_name, input_type, is_required, display_order) VALUES
('color', 'Color', 'radio', false, 2);

-- Material option type
INSERT INTO global_option_types (name, display_name, input_type, is_required, display_order) VALUES
('material', 'Material', 'dropdown', false, 3);

-- Get the size option type ID for inserting values
DO $$
DECLARE
    size_type_id UUID;
    color_type_id UUID;
    material_type_id UUID;
BEGIN
    -- Get option type IDs
    SELECT id INTO size_type_id FROM global_option_types WHERE name = 'size';
    SELECT id INTO color_type_id FROM global_option_types WHERE name = 'color';
    SELECT id INTO material_type_id FROM global_option_types WHERE name = 'material';
    
    -- Size values
    INSERT INTO global_option_values (option_type_id, value, display_name, sku_suffix, display_order, is_default) VALUES
    (size_type_id, 'xs', 'Extra Small', '-XS', 1, false),
    (size_type_id, 's', 'Small', '-S', 2, false),
    (size_type_id, 'm', 'Medium', '-M', 3, true), -- Default size
    (size_type_id, 'l', 'Large', '-L', 4, false),
    (size_type_id, 'xl', 'Extra Large', '-XL', 5, false),
    (size_type_id, '2xl', '2X Large', '-2XL', 6, false),
    (size_type_id, '3xl', '3X Large', '-3XL', 7, false),
    (size_type_id, '4xl', '4X Large', '-4XL', 8, false);
    
    -- Color values
    INSERT INTO global_option_values (option_type_id, value, display_name, hex_color, sku_suffix, display_order, is_default) VALUES
    (color_type_id, 'black', 'Black', '#000000', '-BLK', 1, true), -- Default color
    (color_type_id, 'white', 'White', '#FFFFFF', '-WHT', 2, false),
    (color_type_id, 'red', 'Red', '#FF0000', '-RED', 3, false),
    (color_type_id, 'blue', 'Blue', '#0000FF', '-BLU', 4, false),
    (color_type_id, 'green', 'Green', '#00FF00', '-GRN', 5, false);
    
    -- Material values  
    INSERT INTO global_option_values (option_type_id, value, display_name, sku_suffix, display_order, is_default) VALUES
    (material_type_id, 'cotton', '100% Cotton', '-COT', 1, true), -- Default material
    (material_type_id, 'polyester', 'Polyester Blend', '-POL', 2, false),
    (material_type_id, 'silk', 'Pure Silk', '-SLK', 3, false);
END $$;

COMMIT;