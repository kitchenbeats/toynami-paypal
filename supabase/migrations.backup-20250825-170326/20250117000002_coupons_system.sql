-- ======================================
-- 🎫 Coupons System Integration
-- Complete coupon management with PayPal integration
-- ======================================

-- ======================================
-- 🎫 Coupons Table
-- ======================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    
    -- Discount configuration
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    
    -- Usage limits
    usage_limit INTEGER, -- NULL = unlimited
    usage_count INTEGER DEFAULT 0,
    usage_limit_per_customer INTEGER, -- NULL = unlimited per customer
    
    -- Date constraints
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Minimum requirements
    minimum_order_amount_cents INTEGER, -- Minimum order amount in cents
    
    -- Product/category restrictions
    applicable_product_ids INTEGER[] DEFAULT '{}', -- Array of product IDs
    applicable_category_ids INTEGER[] DEFAULT '{}', -- Array of category IDs
    
    -- Customer restrictions
    customer_group_ids INTEGER[] DEFAULT '{}', -- Array of customer group IDs
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
CREATE TABLE IF NOT EXISTS coupon_usage (
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
CREATE INDEX IF NOT EXISTS coupons_code_idx ON coupons(code) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS coupons_active_idx ON coupons(is_active, starts_at, expires_at);
CREATE INDEX IF NOT EXISTS coupons_products_idx ON coupons USING GIN(applicable_product_ids) WHERE array_length(applicable_product_ids, 1) > 0;
CREATE INDEX IF NOT EXISTS coupons_categories_idx ON coupons USING GIN(applicable_category_ids) WHERE array_length(applicable_category_ids, 1) > 0;

CREATE INDEX IF NOT EXISTS coupon_usage_coupon_idx ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS coupon_usage_user_idx ON coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS coupon_usage_paypal_order_idx ON coupon_usage(paypal_order_id) WHERE paypal_order_id IS NOT NULL;

-- ======================================
-- 📊 Coupon Analytics View
-- ======================================
CREATE OR REPLACE VIEW coupon_analytics AS
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
GROUP BY c.id, c.code, c.name, c.description, c.discount_type, c.discount_value, 
         c.usage_limit, c.usage_count, c.is_active, c.starts_at, c.expires_at, 
         c.created_at, c.updated_at;

-- ======================================
-- 🔄 Functions for Coupon Management
-- ======================================

-- Function to validate coupon usage
CREATE OR REPLACE FUNCTION validate_coupon_usage(
    p_coupon_code TEXT,
    p_user_id UUID DEFAULT NULL,
    p_order_total_cents INTEGER DEFAULT 0,
    p_product_ids INTEGER[] DEFAULT '{}',
    p_category_ids INTEGER[] DEFAULT '{}'
)
RETURNS TABLE(
    is_valid BOOLEAN,
    coupon_id UUID,
    discount_amount_cents INTEGER,
    error_message TEXT
) AS $$
DECLARE
    v_coupon coupons%ROWTYPE;
    v_user_usage_count INTEGER;
    v_calculated_discount_cents INTEGER;
BEGIN
    -- Get coupon details
    SELECT * INTO v_coupon 
    FROM coupons 
    WHERE code = p_coupon_code 
    AND is_active = TRUE;
    
    -- Check if coupon exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 0, 'Coupon code not found or inactive';
        RETURN;
    END IF;
    
    -- Check date validity
    IF v_coupon.starts_at IS NOT NULL AND v_coupon.starts_at > now() THEN
        RETURN QUERY SELECT FALSE, v_coupon.id, 0, 'Coupon is not yet active';
        RETURN;
    END IF;
    
    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
        RETURN QUERY SELECT FALSE, v_coupon.id, 0, 'Coupon has expired';
        RETURN;
    END IF;
    
    -- Check usage limits
    IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
        RETURN QUERY SELECT FALSE, v_coupon.id, 0, 'Coupon usage limit reached';
        RETURN;
    END IF;
    
    -- Check per-customer usage limit
    IF p_user_id IS NOT NULL AND v_coupon.usage_limit_per_customer IS NOT NULL THEN
        SELECT COUNT(*) INTO v_user_usage_count
        FROM coupon_usage
        WHERE coupon_id = v_coupon.id AND user_id = p_user_id;
        
        IF v_user_usage_count >= v_coupon.usage_limit_per_customer THEN
            RETURN QUERY SELECT FALSE, v_coupon.id, 0, 'User has reached usage limit for this coupon';
            RETURN;
        END IF;
    END IF;
    
    -- Check minimum order amount
    IF v_coupon.minimum_order_amount_cents IS NOT NULL AND p_order_total_cents < v_coupon.minimum_order_amount_cents THEN
        RETURN QUERY SELECT FALSE, v_coupon.id, 0, 
            'Order total does not meet minimum amount of $' || (v_coupon.minimum_order_amount_cents / 100.0);
        RETURN;
    END IF;
    
    -- Check product restrictions (if any)
    IF array_length(v_coupon.applicable_product_ids, 1) > 0 THEN
        IF NOT (v_coupon.applicable_product_ids && p_product_ids) THEN
            RETURN QUERY SELECT FALSE, v_coupon.id, 0, 'Coupon not applicable to products in cart';
            RETURN;
        END IF;
    END IF;
    
    -- Check category restrictions (if any)
    IF array_length(v_coupon.applicable_category_ids, 1) > 0 THEN
        IF NOT (v_coupon.applicable_category_ids && p_category_ids) THEN
            RETURN QUERY SELECT FALSE, v_coupon.id, 0, 'Coupon not applicable to product categories in cart';
            RETURN;
        END IF;
    END IF;
    
    -- Calculate discount amount
    IF v_coupon.discount_type = 'percentage' THEN
        v_calculated_discount_cents := ROUND(p_order_total_cents * (v_coupon.discount_value / 100.0));
    ELSE -- fixed_amount
        v_calculated_discount_cents := ROUND(v_coupon.discount_value * 100);
    END IF;
    
    -- Ensure discount doesn't exceed order total
    IF v_calculated_discount_cents > p_order_total_cents THEN
        v_calculated_discount_cents := p_order_total_cents;
    END IF;
    
    -- Return valid result
    RETURN QUERY SELECT TRUE, v_coupon.id, v_calculated_discount_cents, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to record coupon usage
CREATE OR REPLACE FUNCTION record_coupon_usage(
    p_coupon_id UUID,
    p_user_id UUID,
    p_order_id UUID,
    p_discount_amount_cents INTEGER,
    p_order_total_cents INTEGER,
    p_paypal_order_id TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_usage_id UUID;
BEGIN
    -- Insert usage record
    INSERT INTO coupon_usage (
        coupon_id, user_id, order_id, discount_amount_cents, 
        order_total_cents, paypal_order_id, ip_address, user_agent
    )
    VALUES (
        p_coupon_id, p_user_id, p_order_id, p_discount_amount_cents,
        p_order_total_cents, p_paypal_order_id, p_ip_address, p_user_agent
    )
    RETURNING id INTO v_usage_id;
    
    -- Update coupon usage count
    UPDATE coupons 
    SET usage_count = usage_count + 1,
        updated_at = now()
    WHERE id = p_coupon_id;
    
    RETURN v_usage_id;
END;
$$ LANGUAGE plpgsql;

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
    FOR INSERT WITH CHECK (TRUE); -- Will be controlled by API validation

-- ======================================
-- 🔄 Update Triggers
-- ======================================
CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON coupons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at();

-- Add coupon fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id),
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS discount_amount_cents INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS orders_coupon_idx ON orders(coupon_id) WHERE coupon_id IS NOT NULL;

COMMIT;