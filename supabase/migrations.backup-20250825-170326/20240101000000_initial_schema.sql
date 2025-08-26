-- ======================================
-- 📦 Supabase E‑commerce Schema Migration (Production‑Ready, Single File)
-- Includes: core commerce, RLS, soft‑delete, loyalty tiers, raffle system, policies, helper fn
-- ======================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================================
-- 👤 Users (linked to Supabase auth)
-- ======================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ======================================
-- 🛍️ Catalog
-- ======================================
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    warranty TEXT,
    condition TEXT CHECK (condition IN ('new', 'used', 'refurbished')),
    allow_purchases BOOLEAN DEFAULT TRUE,
    is_visible BOOLEAN DEFAULT TRUE,
    status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'draft',
    fixed_shipping_price_cents INTEGER,
    free_shipping BOOLEAN DEFAULT FALSE,
    weight NUMERIC,
    width NUMERIC,
    height NUMERIC,
    depth NUMERIC,
    custom_fields JSONB,
    -- Loyalty gating (NULL/0 = no gate)
    min_tier_order INT,
    -- Soft delete
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    compare_at_price_cents INTEGER,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    option_values JSONB,
    deleted_at TIMESTAMPTZ
);

-- REMOVED: product_images table - now using unified media_library
-- CREATE TABLE IF NOT EXISTS product_images (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
--     image_filename TEXT NOT NULL,
--     alt_text TEXT,
--     position INTEGER,
--     is_primary BOOLEAN DEFAULT FALSE,
--     deleted_at TIMESTAMPTZ
-- );

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    show_in_menu BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS product_categories (
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Partial uniques to support soft delete
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique_active
  ON products (slug) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_sku_unique_active
  ON product_variants (sku) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique_active
  ON categories (slug) WHERE deleted_at IS NULL;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS products_active_idx
  ON products (is_visible, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS product_variants_active_idx
  ON product_variants (product_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS categories_active_idx
  ON categories (parent_id) WHERE deleted_at IS NULL;

-- ======================================
-- 🧺 Cart & Orders
-- ======================================
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id),
    quantity INTEGER CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled', 'refunded')) DEFAULT 'pending',
    paypal_order_id TEXT,
    total_cents INTEGER,
    subtotal_cents INTEGER,
    shipping_cents INTEGER,
    discount_cents INTEGER,
    tax_cents INTEGER,
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_status_idx ON orders(user_id, status);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    product_name TEXT,
    variant_sku TEXT,
    price_cents INTEGER,
    quantity INTEGER
);

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type TEXT CHECK (type IN ('shipping', 'billing')),
    full_name TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    phone TEXT,
    is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID REFERENCES product_variants(id),
    change_type TEXT CHECK (change_type IN ('order', 'restock', 'manual_adjustment')),
    quantity_change INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ======================================
-- 💸 Discounts
-- ======================================
CREATE TABLE IF NOT EXISTS discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('percentage', 'fixed')),
    amount_cents INTEGER,
    min_purchase_cents INTEGER DEFAULT 0,  -- Minimum purchase amount required
    active BOOLEAN DEFAULT TRUE,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS discounts_code_unique_active
  ON discounts (code) WHERE deleted_at IS NULL;

-- ======================================
-- 💖 Wishlists
-- ======================================
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name TEXT DEFAULT 'Default',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    added_at TIMESTAMPTZ DEFAULT now()
);

-- ======================================
-- 🏆 Loyalty (ordinal tiers + gating)
-- ======================================
CREATE TABLE IF NOT EXISTS loyalty_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    min_spend_cents BIGINT NOT NULL,
    max_spend_cents BIGINT,
    percentage_back DECIMAL(5,4) DEFAULT 0, -- e.g., 0.03 = 3% back
    order_no INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS loyalty_tiers_orderno_unique_active
  ON loyalty_tiers(order_no) WHERE deleted_at IS NULL;

-- Helper: return a user's current tier order (0 if none)
CREATE OR REPLACE FUNCTION fn_user_tier_order(p_user_id UUID)
RETURNS INT LANGUAGE sql STABLE AS $$
  WITH lifetime AS (
    SELECT COALESCE(SUM(total_cents),0)::BIGINT AS spend
    FROM orders
    WHERE user_id = p_user_id AND status = 'paid'
  )
  SELECT COALESCE((
    SELECT order_no
    FROM loyalty_tiers lt, lifetime l
    WHERE lt.is_active
      AND lt.deleted_at IS NULL
      AND l.spend >= lt.min_spend_cents
      AND (lt.max_spend_cents IS NULL OR l.spend < lt.max_spend_cents)
    ORDER BY lt.order_no DESC
    LIMIT 1
  ), 0);
$$;

-- ======================================
-- 🎟️ Raffles (entry + live draw + stream)
-- ======================================
CREATE TABLE IF NOT EXISTS raffles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    winners_count INT DEFAULT 1,
    status TEXT CHECK (status IN ('draft','open','closed','drawing','complete')) DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS raffle_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raffle_id UUID NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (raffle_id, email)
);

CREATE TABLE IF NOT EXISTS raffle_winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raffle_id UUID NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
    entry_id UUID NOT NULL REFERENCES raffle_entries(id) ON DELETE CASCADE,
    rank INT NOT NULL,
    announced_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS raffle_winners_raffle_rank_idx ON raffle_winners(raffle_id, rank);

-- ======================================
-- 📡 Webhook capture
-- ======================================
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT,
    payload JSONB,
    received_at TIMESTAMPTZ DEFAULT now(),
    processed BOOLEAN DEFAULT FALSE,
    error TEXT
);

-- ======================================
-- 🔐 Row Level Security (RLS) & Policies
-- ======================================
-- Enable RLS
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_images   ENABLE ROW LEVEL SECURITY; -- REMOVED: using media_library
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_tiers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_entries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_winners   ENABLE ROW LEVEL SECURITY;

-- Helper: admin check
CREATE OR REPLACE VIEW v_is_admin AS
SELECT u.id AS user_id, u.is_admin FROM users u;

-- Users: self access
CREATE POLICY "Users can manage self" ON users
FOR ALL USING (auth.uid() = id);

-- Products: public read only active, non-deleted
CREATE POLICY "Public read products" ON products
FOR SELECT USING (deleted_at IS NULL AND is_visible = TRUE AND status = 'active');
-- Admin manage products
CREATE POLICY "Admin manage products" ON products
FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);

-- Variants: public read where parent is readable and variant active
CREATE POLICY "Public read variants" ON product_variants
FOR SELECT USING (
  deleted_at IS NULL AND is_active = TRUE AND
  EXISTS (
    SELECT 1 FROM products p
    WHERE p.id = product_variants.product_id
      AND p.deleted_at IS NULL AND p.is_visible = TRUE AND p.status = 'active'
  )
);
CREATE POLICY "Admin manage variants" ON product_variants
FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);

-- Images: public read for visible products
-- REMOVED: product_images policies - now using media_library
-- CREATE POLICY "Public read images" ON product_images
-- FOR SELECT USING (
--   deleted_at IS NULL AND
--   EXISTS (
--     SELECT 1 FROM products p
--     WHERE p.id = product_images.product_id
--       AND p.deleted_at IS NULL AND p.is_visible = TRUE AND p.status = 'active'
--   )
-- );
-- CREATE POLICY "Admin manage images" ON product_images
-- FOR ALL USING (
--   EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
-- );

-- Categories & pivots: public read
CREATE POLICY "Public read categories" ON categories
FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Admin manage categories" ON categories
FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);
CREATE POLICY "Public read product_categories" ON product_categories
FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage product_categories" ON product_categories
FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);

-- Carts: owner or guest session
CREATE POLICY "Users can access their cart" ON carts
FOR ALL USING (
  (user_id IS NOT NULL AND user_id = auth.uid()) OR
  (session_id IS NOT NULL AND session_id = current_setting('request.jwt.claim.session_id', true))
);
-- Cart items via cart ownership
CREATE POLICY "Users can modify their cart items" ON cart_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM carts c
    WHERE c.id = cart_id AND (
      c.user_id = auth.uid() OR c.session_id = current_setting('request.jwt.claim.session_id', true)
    )
  )
);

-- Orders & items: owner access
CREATE POLICY "Users can access their orders" ON orders
FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create orders" ON orders
FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can view their order items" ON order_items
FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- Addresses: owner
CREATE POLICY "Users can manage their addresses" ON addresses
FOR ALL USING (user_id = auth.uid());

-- Discounts: public read active codes, admin manage
CREATE POLICY "Public read active discounts" ON discounts
FOR SELECT USING (deleted_at IS NULL AND active = TRUE);
CREATE POLICY "Admin manage discounts" ON discounts
FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);

-- Wishlists & items: owner
CREATE POLICY "Users can manage their wishlists" ON wishlists
FOR ALL USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY "Users can manage wishlist items" ON wishlist_items
FOR ALL USING (
  EXISTS (SELECT 1 FROM wishlists w WHERE w.id = wishlist_id AND w.user_id = auth.uid() AND w.deleted_at IS NULL)
);

-- Loyalty tiers: public read active (for badges), admin manage
CREATE POLICY "Public read active tiers" ON loyalty_tiers
FOR SELECT USING (deleted_at IS NULL AND is_active = TRUE);
CREATE POLICY "Admin manage tiers" ON loyalty_tiers
FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);

-- Raffles
CREATE POLICY "Public read raffles" ON raffles
FOR SELECT USING (deleted_at IS NULL AND status IN ('open','drawing','complete'));
CREATE POLICY "Admin manage raffles" ON raffles
FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);

CREATE POLICY "Public enter raffle" ON raffle_entries
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM raffles r
    WHERE r.id = raffle_entries.raffle_id AND r.status = 'open' AND r.deleted_at IS NULL
  )
);
CREATE POLICY "Admin see entries" ON raffle_entries
FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);

CREATE POLICY "Public read winners" ON raffle_winners
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM raffles r WHERE r.id = raffle_winners.raffle_id AND r.status IN ('drawing','complete') AND r.deleted_at IS NULL
  )
);
CREATE POLICY "Admin write winners" ON raffle_winners
FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin)
);

-- Block hard DELETEs on soft-deleted entities for non-service roles
REVOKE DELETE ON products, product_variants, categories, discounts, wishlists, loyalty_tiers, raffles FROM PUBLIC;

-- ======================================
-- ✅ Initial setup complete
-- ======================================