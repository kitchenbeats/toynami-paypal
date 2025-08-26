-- ======================================
-- 💳 PayPal Integration Fields
-- Adds fields for syncing with PayPal Catalog Products API
-- ======================================

-- Add PayPal sync fields to products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS paypal_product_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'error', 'local_only')),
ADD COLUMN IF NOT EXISTS sync_error TEXT,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS paypal_category TEXT;

-- Add PayPal plan fields for subscriptions
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_subscription BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS paypal_plan_id TEXT,
ADD COLUMN IF NOT EXISTS billing_cycles JSONB;

-- Add index for PayPal product lookups
CREATE INDEX IF NOT EXISTS products_paypal_id_idx ON products(paypal_product_id) WHERE paypal_product_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_sync_status_idx ON products(sync_status) WHERE sync_status != 'synced';

-- ======================================
-- 💰 PayPal Pricing Plans
-- For subscription and complex pricing
-- ======================================
CREATE TABLE IF NOT EXISTS paypal_pricing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    paypal_plan_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('ACTIVE', 'INACTIVE', 'CREATED')),
    billing_cycles JSONB,
    payment_preferences JSONB,
    taxes JSONB,
    quantity_supported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ======================================
-- 📦 PayPal Inventory Sync
-- Track inventory separately for PayPal
-- ======================================
CREATE TABLE IF NOT EXISTS paypal_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    paypal_sku TEXT UNIQUE,
    quantity_available INTEGER DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    last_synced_at TIMESTAMPTZ,
    sync_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(product_variant_id)
);

-- ======================================
-- 🔄 PayPal Webhooks Log
-- Track webhook events from PayPal
-- ======================================
CREATE TABLE IF NOT EXISTS paypal_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE,
    event_type TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    summary TEXT,
    payload JSONB,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS paypal_webhooks_event_idx ON paypal_webhooks(event_id);
CREATE INDEX IF NOT EXISTS paypal_webhooks_unprocessed_idx ON paypal_webhooks(processed) WHERE processed = FALSE;

-- ======================================
-- 💳 Update Orders for PayPal
-- ======================================
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS paypal_capture_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_invoice_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_payer_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_facilitator_access_token TEXT,
ADD COLUMN IF NOT EXISTS paypal_merchant_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_status TEXT,
ADD COLUMN IF NOT EXISTS paypal_debug_id TEXT;

CREATE INDEX IF NOT EXISTS orders_paypal_order_idx ON orders(paypal_order_id) WHERE paypal_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS orders_paypal_capture_idx ON orders(paypal_capture_id) WHERE paypal_capture_id IS NOT NULL;

-- ======================================
-- 🔄 Sync Status Table
-- Track overall sync status
-- ======================================
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_type TEXT NOT NULL CHECK (sync_type IN ('products', 'inventory', 'orders', 'customers')),
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    total_records INTEGER DEFAULT 0,
    synced_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    error_details JSONB,
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id)
);

-- ======================================
-- 🔧 Helper Functions for PayPal Sync
-- ======================================

-- Function to mark product for PayPal sync
CREATE OR REPLACE FUNCTION mark_product_for_sync()
RETURNS TRIGGER AS $$
BEGIN
    -- If product data changed, mark for sync
    IF (OLD.name IS DISTINCT FROM NEW.name OR
        OLD.description IS DISTINCT FROM NEW.description OR
        OLD.is_digital IS DISTINCT FROM NEW.is_digital) THEN
        NEW.sync_status = 'pending';
        NEW.sync_error = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-mark products for sync on update
CREATE TRIGGER product_paypal_sync_trigger
    BEFORE UPDATE ON products
    FOR EACH ROW
    WHEN (OLD.paypal_product_id IS NOT NULL)
    EXECUTE FUNCTION mark_product_for_sync();

-- Function to track inventory changes for PayPal sync
CREATE OR REPLACE FUNCTION track_inventory_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update PayPal inventory sync status when variant stock changes
    IF OLD.stock IS DISTINCT FROM NEW.stock THEN
        UPDATE paypal_inventory
        SET sync_status = 'pending'
        WHERE product_variant_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for inventory tracking
CREATE TRIGGER variant_inventory_sync_trigger
    AFTER UPDATE ON product_variants
    FOR EACH ROW
    WHEN (OLD.stock IS DISTINCT FROM NEW.stock)
    EXECUTE FUNCTION track_inventory_change();

-- ======================================
-- 🔒 Row Level Security
-- ======================================

-- PayPal webhooks - admin only
ALTER TABLE paypal_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view PayPal webhooks" ON paypal_webhooks
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Sync logs - admin only
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage sync logs" ON sync_logs
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- PayPal inventory - admin only write, public read
ALTER TABLE paypal_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view inventory" ON paypal_inventory
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage inventory" ON paypal_inventory
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- ======================================
-- 🔄 Update Triggers
-- ======================================
CREATE TRIGGER update_paypal_pricing_plans_updated_at BEFORE UPDATE ON paypal_pricing_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_paypal_inventory_updated_at BEFORE UPDATE ON paypal_inventory 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMIT;