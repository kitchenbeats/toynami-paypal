-- ======================================
-- 🎯 Promotions System
-- ======================================
-- Automatic discounts that apply without codes
-- Complements the coupon system for more sophisticated offers

-- Drop existing tables if they exist
DROP TABLE IF EXISTS promotion_usage CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;

-- Create main promotions table
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    
    -- Promotion type determines the rule engine
    type TEXT NOT NULL CHECK (type IN (
        'percentage_off',      -- Simple % off entire order or specific items
        'fixed_amount_off',    -- Simple $ off entire order
        'bogo',               -- Buy X Get Y (free or discounted)
        'bundle',             -- Discount when buying specific combinations
        'tiered',             -- Spend X get Y discount
        'free_shipping'       -- Free shipping with conditions
    )),
    
    -- Rules configuration (JSON for flexibility)
    rules JSONB NOT NULL DEFAULT '{}',
    /* Rules examples:
       BOGO: {"buy_quantity": 2, "get_quantity": 1, "get_discount": 100, "product_ids": [1,2,3]}
       Tiered: {"tiers": [{"min_amount": 5000, "discount": 10}, {"min_amount": 10000, "discount": 20}]}
       Bundle: {"required_products": [[1,2], [3,4]], "discount": 15}
    */
    
    -- Discount configuration
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_item')),
    discount_value DECIMAL(10,2),
    max_discount_amount_cents INTEGER, -- Cap for percentage discounts
    
    -- Application settings
    auto_apply BOOLEAN DEFAULT true,  -- Applies automatically vs needs activation
    priority INTEGER DEFAULT 0,        -- Higher priority applies first
    stackable BOOLEAN DEFAULT false,   -- Can combine with other promotions
    stackable_with_coupons BOOLEAN DEFAULT true, -- Can combine with coupon codes
    
    -- Restrictions
    minimum_order_amount_cents INTEGER,
    maximum_uses_total INTEGER,        -- Total usage limit across all customers
    maximum_uses_per_customer INTEGER, -- Per customer limit
    
    -- Product/Category targeting
    applicable_product_ids INTEGER[] DEFAULT '{}',
    excluded_product_ids INTEGER[] DEFAULT '{}',
    applicable_category_ids UUID[] DEFAULT '{}',
    excluded_category_ids UUID[] DEFAULT '{}',
    applicable_brand_ids UUID[] DEFAULT '{}',
    
    -- Customer targeting
    customer_group_ids UUID[] DEFAULT '{}',
    new_customers_only BOOLEAN DEFAULT false,
    existing_customers_only BOOLEAN DEFAULT false,
    
    -- Date and time restrictions
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Schedule (for recurring promotions like Happy Hour)
    schedule JSONB, -- {"days": [1,5], "hours": [14,15,16]}
    
    -- Display settings
    show_on_product_page BOOLEAN DEFAULT true,
    show_in_cart BOOLEAN DEFAULT true,
    badge_text TEXT, -- "SALE", "LIMITED TIME", etc.
    badge_color TEXT, -- "red", "green", etc.
    
    -- Status and tracking
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    total_discount_given_cents BIGINT DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_promotions_active ON promotions(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_promotions_dates ON promotions(starts_at, expires_at) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_promotions_type ON promotions(type) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_promotions_priority ON promotions(priority DESC) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_promotions_products ON promotions USING GIN(applicable_product_ids);
CREATE INDEX idx_promotions_categories ON promotions USING GIN(applicable_category_ids);
CREATE INDEX idx_promotions_groups ON promotions USING GIN(customer_group_ids);

-- Track promotion usage
CREATE TABLE promotion_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Usage details
    discount_amount_cents INTEGER NOT NULL,
    affected_items JSONB, -- Which items got the discount
    
    -- Metadata
    used_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate usage
    UNIQUE(promotion_id, order_id)
);

CREATE INDEX idx_promotion_usage_promotion ON promotion_usage(promotion_id);
CREATE INDEX idx_promotion_usage_user ON promotion_usage(user_id);
CREATE INDEX idx_promotion_usage_order ON promotion_usage(order_id);

-- ======================================
-- Helper Functions
-- ======================================

-- Function to check if promotion is currently valid
CREATE OR REPLACE FUNCTION is_promotion_valid(promo_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    promo RECORD;
    current_time TIMESTAMPTZ := NOW();
BEGIN
    SELECT * INTO promo FROM promotions 
    WHERE id = promo_id 
        AND is_active = true 
        AND deleted_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check date range
    IF promo.starts_at IS NOT NULL AND current_time < promo.starts_at THEN
        RETURN false;
    END IF;
    
    IF promo.expires_at IS NOT NULL AND current_time > promo.expires_at THEN
        RETURN false;
    END IF;
    
    -- Check usage limits
    IF promo.maximum_uses_total IS NOT NULL AND promo.usage_count >= promo.maximum_uses_total THEN
        RETURN false;
    END IF;
    
    -- Check schedule if exists
    IF promo.schedule IS NOT NULL THEN
        -- TODO: Implement schedule checking logic
        -- For now, return true if schedule exists
        RETURN true;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate promotion discount
CREATE OR REPLACE FUNCTION calculate_promotion_discount(
    promo_id UUID,
    order_subtotal_cents INTEGER,
    items JSONB
)
RETURNS INTEGER AS $$
DECLARE
    promo RECORD;
    discount_cents INTEGER := 0;
BEGIN
    SELECT * INTO promo FROM promotions WHERE id = promo_id;
    
    IF NOT FOUND OR NOT is_promotion_valid(promo_id) THEN
        RETURN 0;
    END IF;
    
    -- Check minimum order amount
    IF promo.minimum_order_amount_cents IS NOT NULL 
       AND order_subtotal_cents < promo.minimum_order_amount_cents THEN
        RETURN 0;
    END IF;
    
    -- Calculate based on promotion type
    CASE promo.type
        WHEN 'percentage_off' THEN
            discount_cents := (order_subtotal_cents * promo.discount_value / 100)::INTEGER;
            -- Apply max discount cap if set
            IF promo.max_discount_amount_cents IS NOT NULL THEN
                discount_cents := LEAST(discount_cents, promo.max_discount_amount_cents);
            END IF;
            
        WHEN 'fixed_amount_off' THEN
            discount_cents := (promo.discount_value * 100)::INTEGER;
            -- Can't discount more than order total
            discount_cents := LEAST(discount_cents, order_subtotal_cents);
            
        WHEN 'tiered' THEN
            -- Parse tiers from rules JSON and apply appropriate discount
            -- This would need more complex logic based on the tiers
            -- For now, simplified implementation
            IF promo.rules->>'tiers' IS NOT NULL THEN
                -- TODO: Implement tiered discount calculation
                discount_cents := 0;
            END IF;
            
        WHEN 'bogo' THEN
            -- Calculate BOGO discount based on items
            -- This needs item-level calculation
            -- TODO: Implement BOGO calculation
            discount_cents := 0;
            
        WHEN 'bundle' THEN
            -- Check if required products are in cart
            -- TODO: Implement bundle calculation
            discount_cents := 0;
            
        WHEN 'free_shipping' THEN
            -- This would be handled separately in shipping calculation
            discount_cents := 0;
            
        ELSE
            discount_cents := 0;
    END CASE;
    
    RETURN discount_cents;
END;
$$ LANGUAGE plpgsql;

-- ======================================
-- Row Level Security
-- ======================================

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_usage ENABLE ROW LEVEL SECURITY;

-- Admin users can manage promotions
CREATE POLICY "Admin users can manage promotions"
    ON promotions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Public can view active promotions
CREATE POLICY "Public can view active promotions"
    ON promotions
    FOR SELECT
    TO authenticated
    USING (
        is_active = true 
        AND deleted_at IS NULL
        AND is_promotion_valid(id)
    );

-- Users can view their own promotion usage
CREATE POLICY "Users can view own promotion usage"
    ON promotion_usage
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admin can view all promotion usage
CREATE POLICY "Admin can view all promotion usage"
    ON promotion_usage
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- ======================================
-- Sample Promotions (commented out)
-- ======================================

/*
-- 10% off entire store
INSERT INTO promotions (name, type, discount_type, discount_value, description)
VALUES ('Store-wide Sale', 'percentage_off', 'percentage', 10, '10% off everything!');

-- Buy 2 Get 1 Free on specific products
INSERT INTO promotions (name, type, rules, description)
VALUES (
    'Buy 2 Get 1 Free', 
    'bogo',
    '{"buy_quantity": 2, "get_quantity": 1, "get_discount": 100}'::jsonb,
    'Buy any 2 items and get the 3rd free!'
);

-- Tiered discount based on spending
INSERT INTO promotions (name, type, rules, description)
VALUES (
    'Spend More Save More',
    'tiered',
    '{"tiers": [
        {"min_amount": 5000, "discount": 5},
        {"min_amount": 10000, "discount": 10},
        {"min_amount": 20000, "discount": 15}
    ]}'::jsonb,
    'Save up to 15% based on order total'
);

-- Free shipping over $50
INSERT INTO promotions (name, type, minimum_order_amount_cents, description)
VALUES ('Free Shipping', 'free_shipping', 5000, 'Free shipping on orders over $50');
*/