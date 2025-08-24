-- Recreate coupons system (tables might not have been created properly)

-- Drop existing objects if they exist
DROP VIEW IF EXISTS coupon_analytics CASCADE;
DROP TABLE IF EXISTS coupon_usage CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP FUNCTION IF EXISTS validate_coupon_usage CASCADE;
DROP FUNCTION IF EXISTS record_coupon_usage CASCADE;

-- ======================================
-- 🎫 Coupons Table
-- ======================================
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    
    -- Discount configuration
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    
    -- Usage limits
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    usage_limit_per_customer INTEGER,
    
    -- Date constraints
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Minimum requirements
    minimum_order_amount_cents INTEGER,
    
    -- Product/category restrictions
    applicable_product_ids INTEGER[] DEFAULT '{}',
    applicable_category_ids INTEGER[] DEFAULT '{}',
    
    -- Customer restrictions
    customer_group_ids INTEGER[] DEFAULT '{}',
    first_time_customers_only BOOLEAN DEFAULT FALSE,
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- PayPal integration
    paypal_discount_item_name TEXT DEFAULT 'Discount',
    
    -- Validation constraints
    CONSTRAINT valid_date_range CHECK (starts_at IS NULL OR expires_at IS NULL OR starts_at < expires_at),
    CONSTRAINT valid_usage_limits CHECK (usage_limit IS NULL OR usage_limit > 0),
    CONSTRAINT valid_per_customer_limit CHECK (usage_limit_per_customer IS NULL OR usage_limit_per_customer > 0)
);

-- ======================================
-- 🎯 Coupon Usage Tracking
-- ======================================
CREATE TABLE coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Usage details
    discount_amount_cents INTEGER NOT NULL,
    order_total_cents INTEGER NOT NULL,
    paypal_order_id TEXT,
    
    -- Tracking
    used_at TIMESTAMPTZ DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    
    -- Ensure one usage per order
    UNIQUE(order_id)
);

-- ======================================
-- 🔍 Indexes for Performance
-- ======================================
CREATE INDEX coupons_code_idx ON coupons(code) WHERE is_active = TRUE;
CREATE INDEX coupons_active_idx ON coupons(is_active, starts_at, expires_at);
CREATE INDEX coupons_products_idx ON coupons USING GIN(applicable_product_ids) WHERE array_length(applicable_product_ids, 1) > 0;
CREATE INDEX coupons_categories_idx ON coupons USING GIN(applicable_category_ids) WHERE array_length(applicable_category_ids, 1) > 0;

CREATE INDEX coupon_usage_coupon_idx ON coupon_usage(coupon_id);
CREATE INDEX coupon_usage_user_idx ON coupon_usage(user_id);
CREATE INDEX coupon_usage_paypal_order_idx ON coupon_usage(paypal_order_id) WHERE paypal_order_id IS NOT NULL;

-- ======================================
-- 📊 Coupon Analytics View
-- ======================================
CREATE VIEW coupon_analytics AS
SELECT 
    c.id,
    c.code,
    c.name,
    c.description,
    c.discount_type,
    c.discount_value,
    c.usage_limit,
    c.usage_count,
    c.is_active,
    c.starts_at,
    c.expires_at,
    c.created_at,
    c.updated_at,
    
    -- Usage statistics
    COUNT(cu.id) as actual_usage_count,
    COALESCE(SUM(cu.discount_amount_cents), 0) as total_discount_given_cents,
    COALESCE(AVG(cu.discount_amount_cents), 0) as avg_discount_per_use_cents,
    COALESCE(SUM(cu.order_total_cents), 0) as total_order_value_cents,
    
    -- Conversion rates
    CASE 
        WHEN c.usage_limit IS NOT NULL THEN 
            ROUND((COUNT(cu.id)::DECIMAL / c.usage_limit * 100), 2)
        ELSE NULL 
    END as usage_rate_percentage,
    
    -- Date stats
    MIN(cu.used_at) as first_used_at,
    MAX(cu.used_at) as last_used_at,
    COUNT(DISTINCT cu.user_id) as unique_users_count
    
FROM coupons c
LEFT JOIN coupon_usage cu ON c.id = cu.coupon_id
GROUP BY c.id;

-- ======================================
-- 🔒 Row Level Security
-- ======================================

-- Coupons - Public read for active coupons, admin write
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons" ON coupons
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Only admins can manage coupons" ON coupons
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Coupon usage - Users can view their own usage, admins see all
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coupon usage" ON coupon_usage
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Only admins can view all coupon usage" ON coupon_usage
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Only system can insert coupon usage" ON coupon_usage
    FOR INSERT WITH CHECK (TRUE);

-- ======================================
-- 🔄 Update Triggers
-- ======================================
CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON coupons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at();

-- Add coupon fields to orders table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'coupon_id') THEN
        ALTER TABLE orders ADD COLUMN coupon_id UUID REFERENCES coupons(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'coupon_code') THEN
        ALTER TABLE orders ADD COLUMN coupon_code TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'discount_amount_cents') THEN
        ALTER TABLE orders ADD COLUMN discount_amount_cents INTEGER DEFAULT 0;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS orders_coupon_idx ON orders(coupon_id) WHERE coupon_id IS NOT NULL;