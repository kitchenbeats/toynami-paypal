-- ======================================
-- 👥 Customer Groups Schema
-- Allows fine-grained control over product/category visibility and purchasability
-- ======================================

-- ======================================
-- 👥 Customer Groups Table
-- ======================================
CREATE TABLE IF NOT EXISTS customer_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE, -- Group for new users
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0, -- Higher priority groups take precedence
    -- Permissions
    can_see_prices BOOLEAN DEFAULT TRUE,
    can_purchase BOOLEAN DEFAULT TRUE,
    discount_percentage NUMERIC(5,2) DEFAULT 0, -- Group-wide discount
    tax_exempt BOOLEAN DEFAULT FALSE,
    -- Requirements
    requires_approval BOOLEAN DEFAULT FALSE, -- Admin must approve membership
    auto_assign_rules JSONB, -- Rules for automatic assignment (e.g., email domain)
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure only one default group
CREATE UNIQUE INDEX customer_groups_default_idx ON customer_groups (is_default) WHERE is_default = TRUE;

-- ======================================
-- 👤 User Customer Groups (Many-to-Many)
-- ======================================
CREATE TABLE IF NOT EXISTS user_customer_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES customer_groups(id) ON DELETE CASCADE,
    approved_at TIMESTAMPTZ, -- NULL if pending approval
    approved_by UUID REFERENCES users(id),
    expires_at TIMESTAMPTZ, -- For temporary group memberships
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, group_id)
);

CREATE INDEX user_customer_groups_user_idx ON user_customer_groups(user_id);
CREATE INDEX user_customer_groups_group_idx ON user_customer_groups(group_id);

-- ======================================
-- 📦 Product Customer Group Visibility
-- ======================================
CREATE TABLE IF NOT EXISTS product_customer_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES customer_groups(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT TRUE,
    can_purchase BOOLEAN DEFAULT TRUE,
    override_price_cents INTEGER, -- Group-specific pricing
    override_min_quantity INTEGER,
    override_max_quantity INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_id, group_id)
);

CREATE INDEX product_customer_groups_product_idx ON product_customer_groups(product_id);
CREATE INDEX product_customer_groups_group_idx ON product_customer_groups(group_id);

-- ======================================
-- 📂 Category Customer Group Visibility
-- ======================================
CREATE TABLE IF NOT EXISTS category_customer_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES customer_groups(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT TRUE,
    can_purchase BOOLEAN DEFAULT TRUE,
    inherit_to_products BOOLEAN DEFAULT TRUE, -- Apply to all products in category
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(category_id, group_id)
);

CREATE INDEX category_customer_groups_category_idx ON category_customer_groups(category_id);
CREATE INDEX category_customer_groups_group_idx ON category_customer_groups(group_id);

-- ======================================
-- 🏷️ Brand Customer Group Visibility
-- ======================================
CREATE TABLE IF NOT EXISTS brand_customer_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES customer_groups(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT TRUE,
    can_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(brand_id, group_id)
);

CREATE INDEX brand_customer_groups_brand_idx ON brand_customer_groups(brand_id);
CREATE INDEX brand_customer_groups_group_idx ON brand_customer_groups(group_id);

-- ======================================
-- 🎯 Update Products/Categories Tables
-- ======================================

-- Add customer group restriction fields to products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS visibility_type TEXT DEFAULT 'public' CHECK (visibility_type IN ('public', 'groups', 'private')),
ADD COLUMN IF NOT EXISTS purchasability_type TEXT DEFAULT 'public' CHECK (purchasability_type IN ('public', 'groups', 'private'));

-- Add customer group restriction fields to categories  
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS visibility_type TEXT DEFAULT 'public' CHECK (visibility_type IN ('public', 'groups', 'private')),
ADD COLUMN IF NOT EXISTS purchasability_type TEXT DEFAULT 'public' CHECK (purchasability_type IN ('public', 'groups', 'private'));

-- ======================================
-- 🔧 Helper Functions
-- ======================================

-- Function to check if a user belongs to a customer group
CREATE OR REPLACE FUNCTION user_in_customer_group(user_id UUID, group_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_customer_groups ucg
        WHERE ucg.user_id = $1 
        AND ucg.group_id = $2
        AND ucg.approved_at IS NOT NULL
        AND (ucg.expires_at IS NULL OR ucg.expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all customer groups for a user
CREATE OR REPLACE FUNCTION get_user_customer_groups(user_id UUID)
RETURNS TABLE(group_id UUID, group_name TEXT, priority INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT cg.id, cg.name, cg.priority
    FROM customer_groups cg
    JOIN user_customer_groups ucg ON cg.id = ucg.group_id
    WHERE ucg.user_id = $1
    AND ucg.approved_at IS NOT NULL
    AND (ucg.expires_at IS NULL OR ucg.expires_at > NOW())
    AND cg.is_active = TRUE
    ORDER BY cg.priority DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user can view a product
CREATE OR REPLACE FUNCTION user_can_view_product(user_id UUID, product_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    product_visibility TEXT;
    has_group_access BOOLEAN;
BEGIN
    -- Get product visibility type
    SELECT visibility_type INTO product_visibility
    FROM products WHERE id = product_id;
    
    -- Public products are always visible
    IF product_visibility = 'public' OR product_visibility IS NULL THEN
        RETURN TRUE;
    END IF;
    
    -- Private products need specific group access
    IF product_visibility = 'private' THEN
        RETURN FALSE;
    END IF;
    
    -- Check group-based visibility
    SELECT EXISTS (
        SELECT 1 
        FROM product_customer_groups pcg
        JOIN user_customer_groups ucg ON pcg.group_id = ucg.group_id
        WHERE pcg.product_id = product_id
        AND ucg.user_id = user_id
        AND ucg.approved_at IS NOT NULL
        AND (ucg.expires_at IS NULL OR ucg.expires_at > NOW())
        AND pcg.can_view = TRUE
    ) INTO has_group_access;
    
    RETURN has_group_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================
-- 🔒 Row Level Security Policies
-- ======================================

-- Customer Groups - admins only
ALTER TABLE customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage customer groups" ON customer_groups
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- User Customer Groups - users can see their own, admins can see all
ALTER TABLE user_customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own groups" ON user_customer_groups
    FOR SELECT USING (
        user_id = auth.uid() 
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "Admins can manage user groups" ON user_customer_groups
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Product Customer Groups - visibility based on membership
ALTER TABLE product_customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View product group settings" ON product_customer_groups
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
        OR EXISTS (
            SELECT 1 FROM user_customer_groups ucg
            WHERE ucg.group_id = product_customer_groups.group_id
            AND ucg.user_id = auth.uid()
            AND ucg.approved_at IS NOT NULL
        )
    );

CREATE POLICY "Admins can manage product groups" ON product_customer_groups
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Category Customer Groups
ALTER TABLE category_customer_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View category group settings" ON category_customer_groups
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
        OR EXISTS (
            SELECT 1 FROM user_customer_groups ucg
            WHERE ucg.group_id = category_customer_groups.group_id
            AND ucg.user_id = auth.uid()
            AND ucg.approved_at IS NOT NULL
        )
    );

CREATE POLICY "Admins can manage category groups" ON category_customer_groups
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ======================================
-- 🌱 Default Customer Groups
-- ======================================
INSERT INTO customer_groups (slug, name, description, is_default, priority) VALUES
    ('guest', 'Guest', 'Non-registered visitors', TRUE, 0),
    ('registered', 'Registered', 'All registered users', FALSE, 1),
    ('vip', 'VIP', 'VIP customers with exclusive access', FALSE, 10),
    ('wholesale', 'Wholesale', 'Wholesale buyers with special pricing', FALSE, 5),
    ('staff', 'Staff', 'Internal staff members', FALSE, 20)
ON CONFLICT (slug) DO NOTHING;

-- ======================================
-- 🔄 Update Triggers
-- ======================================
CREATE TRIGGER update_customer_groups_updated_at BEFORE UPDATE ON customer_groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMIT;