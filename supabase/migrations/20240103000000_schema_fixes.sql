-- ======================================
-- 🔧 Schema Fixes and Missing Fields
-- Adds missing critical fields for complete e-commerce functionality
-- ======================================

-- ======================================
-- 📦 Products Table Enhancements
-- ======================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS upc TEXT,
ADD COLUMN IF NOT EXISTS ean TEXT,
ADD COLUMN IF NOT EXISTS isbn TEXT,
ADD COLUMN IF NOT EXISTS mpn TEXT, -- Manufacturer Part Number
ADD COLUMN IF NOT EXISTS gtin TEXT, -- Global Trade Item Number
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS tax_class TEXT,
ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN DEFAULT TRUE,
-- track_inventory moved to 20240109000000_fix_track_inventory_type.sql as TEXT type
ADD COLUMN IF NOT EXISTS allow_backorders BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS min_purchase_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_purchase_quantity INTEGER,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_average NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS download_limit INTEGER,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS release_date DATE,
ADD COLUMN IF NOT EXISTS preorder_release_date DATE,
ADD COLUMN IF NOT EXISTS preorder_message TEXT,
ADD COLUMN IF NOT EXISTS availability_message TEXT,
ADD COLUMN IF NOT EXISTS cross_sells UUID[], -- Array of product IDs
ADD COLUMN IF NOT EXISTS upsells UUID[], -- Array of product IDs
ADD COLUMN IF NOT EXISTS related_products UUID[]; -- Array of product IDs

-- ======================================
-- 📦 Product Variants Enhancements
-- ======================================
ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS barcode TEXT,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS width NUMERIC,
ADD COLUMN IF NOT EXISTS height NUMERIC,
ADD COLUMN IF NOT EXISTS depth NUMERIC,
ADD COLUMN IF NOT EXISTS cost_cents INTEGER, -- Cost of goods for profit calculation
ADD COLUMN IF NOT EXISTS min_stock_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_stock_level INTEGER,
ADD COLUMN IF NOT EXISTS reserved_stock INTEGER DEFAULT 0, -- Stock reserved for pending orders
ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ======================================
-- 📷 Product Images Enhancements
-- ======================================
ALTER TABLE product_images
ADD COLUMN IF NOT EXISTS image_url TEXT, -- For external images
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS large_url TEXT,
ADD COLUMN IF NOT EXISTS zoom_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ======================================
-- 📂 Categories Enhancements
-- ======================================
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS icon_url TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_in_menu BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ======================================
-- 👤 Users/Customers Enhancements
-- ======================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_spent_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tier_id UUID REFERENCES loyalty_tiers(id),
ADD COLUMN IF NOT EXISTS tier_progress_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS accepts_marketing BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS vip_status BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Generate unique referral codes for existing users
UPDATE users SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)) WHERE referral_code IS NULL;

-- ======================================
-- 📦 Orders Enhancements
-- ======================================
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES addresses(id),
ADD COLUMN IF NOT EXISTS billing_address_id UUID REFERENCES addresses(id),
ADD COLUMN IF NOT EXISTS shipping_method TEXT,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS carrier TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT,
ADD COLUMN IF NOT EXISTS transaction_id TEXT,
ADD COLUMN IF NOT EXISTS refund_amount_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_reason TEXT,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS customer_notes TEXT,
ADD COLUMN IF NOT EXISTS gift_message TEXT,
ADD COLUMN IF NOT EXISTS source TEXT, -- web, mobile, admin, api
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS discount_code TEXT,
ADD COLUMN IF NOT EXISTS loyalty_points_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS loyalty_points_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Generate order numbers for existing orders
UPDATE orders SET order_number = 'ORD-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0') WHERE order_number IS NULL;

-- ======================================
-- 🛒 Cart Enhancements
-- ======================================
ALTER TABLE carts
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
ADD COLUMN IF NOT EXISTS abandoned_email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recovered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS discount_code TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE cart_items
ADD COLUMN IF NOT EXISTS price_cents INTEGER, -- Price at time of adding to cart
ADD COLUMN IF NOT EXISTS discount_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ======================================
-- 💳 Payment Records (New Table)
-- ======================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
    gateway TEXT, -- paypal, stripe, etc
    gateway_transaction_id TEXT,
    gateway_response JSONB,
    refunded_amount_cents INTEGER DEFAULT 0,
    captured_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_order_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);

-- ======================================
-- 📊 Product Reviews (New Table)
-- ======================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    pros TEXT,
    cons TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    moderator_notes TEXT,
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_product_idx ON product_reviews(product_id, status);
CREATE INDEX IF NOT EXISTS reviews_user_idx ON product_reviews(user_id);

-- ======================================
-- 🏷️ Product Options (New Tables)
-- ======================================
CREATE TABLE IF NOT EXISTS product_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Size, Color, etc
    type TEXT CHECK (type IN ('dropdown', 'radio', 'checkbox', 'text', 'textarea', 'file')),
    position INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_option_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    option_id UUID REFERENCES product_options(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    price_adjustment_cents INTEGER DEFAULT 0,
    weight_adjustment NUMERIC DEFAULT 0,
    sku_suffix TEXT,
    position INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    stock INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ======================================
-- 📱 Customer Sessions (New Table)
-- ======================================
CREATE TABLE IF NOT EXISTS customer_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_idx ON customer_sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_token_idx ON customer_sessions(session_token);

-- Email templates removed - handled by Mailchimp and PayPal

-- ======================================
-- 📊 Analytics Events (New Table)
-- ======================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id TEXT,
    event_type TEXT NOT NULL, -- page_view, product_view, add_to_cart, checkout, purchase
    event_data JSONB,
    page_url TEXT,
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_user_idx ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_type_idx ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_created_idx ON analytics_events(created_at);

-- ======================================
-- 🎁 Gift Cards (New Table)
-- ======================================
CREATE TABLE IF NOT EXISTS gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    balance_cents INTEGER NOT NULL,
    initial_value_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    sender_email TEXT,
    sender_name TEXT,
    recipient_email TEXT,
    recipient_name TEXT,
    message TEXT,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gift_cards_code_idx ON gift_cards(code);

-- ======================================
-- 🔄 Update Triggers
-- ======================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for new timestamp columns
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- Email templates trigger removed
CREATE TRIGGER update_gift_cards_updated_at BEFORE UPDATE ON gift_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ======================================
-- 🔒 Row Level Security for New Tables
-- ======================================

-- Payments - only viewable by order owner or admin
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (
        order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Product Reviews - public read, authenticated write
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON product_reviews
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can create reviews" ON product_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON product_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Analytics Events - write only, no read for privacy
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create analytics events" ON analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view analytics" ON analytics_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Gift Cards
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gift cards sent to them" ON gift_cards
    FOR SELECT USING (
        recipient_email IN (SELECT email FROM users WHERE id = auth.uid())
        OR sender_email IN (SELECT email FROM users WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );