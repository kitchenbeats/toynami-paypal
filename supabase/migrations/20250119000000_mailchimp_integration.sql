-- ======================================
-- 📧 Mailchimp Integration
-- ======================================
-- Store configuration and sync status for Mailchimp

-- Settings table for Mailchimp configuration
CREATE TABLE IF NOT EXISTS mailchimp_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key TEXT, -- Encrypted in app
    server_prefix TEXT, -- e.g., us14, us21
    list_id TEXT, -- Default audience/list ID
    store_id TEXT, -- E-commerce store ID in Mailchimp
    
    -- Sync settings
    sync_customers BOOLEAN DEFAULT true,
    sync_orders BOOLEAN DEFAULT true,
    sync_products BOOLEAN DEFAULT true,
    sync_carts BOOLEAN DEFAULT true,
    
    -- Tag mappings (JSON)
    tag_mappings JSONB DEFAULT '{}', -- {"customer_group_id": "mailchimp_tag"}
    
    -- E-commerce settings
    store_name TEXT,
    store_domain TEXT,
    store_currency_code TEXT DEFAULT 'USD',
    
    -- Status
    is_active BOOLEAN DEFAULT false,
    last_sync_at TIMESTAMPTZ,
    last_sync_status TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Customer sync status tracking
CREATE TABLE IF NOT EXISTS mailchimp_sync_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mailchimp_id TEXT, -- ID in Mailchimp
    email_hash TEXT, -- MD5 hash of email for Mailchimp API
    
    -- Sync status
    sync_status TEXT CHECK (sync_status IN ('synced', 'pending', 'failed', 'unsubscribed')),
    last_synced_at TIMESTAMPTZ,
    sync_error TEXT,
    
    -- Mailchimp data
    tags TEXT[], -- Tags applied in Mailchimp
    merge_fields JSONB, -- Custom fields
    
    -- Subscription status
    email_status TEXT, -- subscribed, unsubscribed, cleaned, pending
    vip_status BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

CREATE INDEX idx_mailchimp_sync_user ON mailchimp_sync_status(user_id);
CREATE INDEX idx_mailchimp_sync_status ON mailchimp_sync_status(sync_status);

-- Log table for tracking sync events (for debugging)
CREATE TABLE IF NOT EXISTS mailchimp_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- customer_added, order_synced, etc.
    entity_type TEXT, -- customer, order, product, cart
    entity_id TEXT,
    
    -- Request/Response
    request_data JSONB,
    response_data JSONB,
    
    -- Status
    success BOOLEAN,
    error_message TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mailchimp_log_created ON mailchimp_sync_log(created_at DESC);
CREATE INDEX idx_mailchimp_log_type ON mailchimp_sync_log(event_type);

-- ======================================
-- Row Level Security
-- ======================================

ALTER TABLE mailchimp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mailchimp_sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE mailchimp_sync_log ENABLE ROW LEVEL SECURITY;

-- Only admins can manage Mailchimp settings
CREATE POLICY "Admins can manage Mailchimp settings"
    ON mailchimp_settings
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Users can view their own sync status
CREATE POLICY "Users can view own sync status"
    ON mailchimp_sync_status
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admins can manage all sync statuses
CREATE POLICY "Admins can manage sync status"
    ON mailchimp_sync_status
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Only admins can view sync logs
CREATE POLICY "Admins can view sync logs"
    ON mailchimp_sync_log
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
-- Functions for event triggers
-- ======================================

-- Function to notify app when user is created/updated
CREATE OR REPLACE FUNCTION notify_user_change()
RETURNS trigger AS $$
BEGIN
    -- We'll handle this in the app via Supabase client
    -- This is just a placeholder for potential webhook usage
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Could add triggers if needed, but we'll use app-level events instead
-- CREATE TRIGGER user_created_trigger
-- AFTER INSERT ON users
-- FOR EACH ROW
-- EXECUTE FUNCTION notify_user_change();