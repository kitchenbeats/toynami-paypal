-- ======================================
-- 📧 Email Service Tables
-- For transactional emails via Mailchimp Transactional (Mandrill)
-- ======================================

-- Email provider settings
CREATE TABLE IF NOT EXISTS email_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL CHECK (provider IN ('mailchimp_transactional', 'sendgrid', 'ses', 'postmark')),
    
    -- API Configuration
    api_key TEXT, -- Encrypted in app
    from_email TEXT NOT NULL DEFAULT 'noreply@toynamishop.com',
    from_name TEXT NOT NULL DEFAULT 'Toynami',
    reply_to TEXT,
    
    -- Settings
    is_active BOOLEAN DEFAULT true,
    track_opens BOOLEAN DEFAULT true,
    track_clicks BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(provider, is_active) -- Only one active provider per type
);

-- Email templates
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    
    -- Template content
    html_content TEXT NOT NULL,
    text_content TEXT, -- Plain text version
    
    -- Variables used in template
    variables JSONB DEFAULT '{}', -- {"customer_name": "string", "order_id": "string"}
    
    -- Settings
    is_active BOOLEAN DEFAULT true,
    template_type TEXT CHECK (template_type IN ('transactional', 'marketing', 'system')),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Email send log
CREATE TABLE IF NOT EXISTS email_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Email details
    template TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT,
    
    -- Status
    status TEXT CHECK (status IN ('sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed', 'spam')),
    message_id TEXT, -- Provider's message ID
    
    -- Error tracking
    error_message TEXT,
    bounce_type TEXT,
    
    -- Provider info
    provider TEXT DEFAULT 'mailchimp_transactional',
    provider_response JSONB,
    
    -- Tracking
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    
    -- Metadata
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id)
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_email_log_recipient ON email_log(recipient);
CREATE INDEX IF NOT EXISTS idx_email_log_status ON email_log(status);
CREATE INDEX IF NOT EXISTS idx_email_log_sent_at ON email_log(sent_at DESC);

-- Email queue (for retry logic)
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Email data
    template TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT,
    data JSONB NOT NULL, -- Template variables
    
    -- Queue management
    status TEXT CHECK (status IN ('pending', 'processing', 'sent', 'failed')) DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    
    -- Scheduling
    send_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    
    -- Error tracking
    last_error TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes separately  
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_send_at ON email_queue(send_at);

-- ======================================
-- 🔒 RLS Policies
-- ======================================

ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Email settings: admin only
CREATE POLICY "Admin manage email settings" ON email_settings
FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Email templates: admin manage, public read active
CREATE POLICY "Public read active templates" ON email_templates
FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage templates" ON email_templates
FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Email log: admin view all, users view own
CREATE POLICY "Users view own email log" ON email_log
FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admin manage email log" ON email_log
FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Email queue: admin only
CREATE POLICY "Admin manage email queue" ON email_queue
FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- ======================================
-- 🔧 Helper Functions
-- ======================================

-- Function to queue an email
CREATE OR REPLACE FUNCTION queue_email(
    p_template TEXT,
    p_recipient TEXT,
    p_subject TEXT,
    p_data JSONB,
    p_send_at TIMESTAMPTZ DEFAULT NOW()
) RETURNS UUID AS $$
DECLARE
    v_queue_id UUID;
BEGIN
    INSERT INTO email_queue (template, recipient, subject, data, send_at)
    VALUES (p_template, p_recipient, p_subject, p_data, p_send_at)
    RETURNING id INTO v_queue_id;
    
    RETURN v_queue_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process email queue
CREATE OR REPLACE FUNCTION process_email_queue()
RETURNS TABLE (processed INTEGER, failed INTEGER) AS $$
DECLARE
    v_processed INTEGER := 0;
    v_failed INTEGER := 0;
    v_email RECORD;
BEGIN
    -- Get pending emails that are due
    FOR v_email IN
        SELECT * FROM email_queue
        WHERE status = 'pending'
        AND send_at <= NOW()
        AND attempts < max_attempts
        ORDER BY send_at
        LIMIT 100
    LOOP
        -- Update status to processing
        UPDATE email_queue
        SET status = 'processing', attempts = attempts + 1
        WHERE id = v_email.id;
        
        -- Here you would call your email service
        -- For now, we'll just mark as sent
        UPDATE email_queue
        SET status = 'sent', sent_at = NOW()
        WHERE id = v_email.id;
        
        v_processed := v_processed + 1;
    END LOOP;
    
    -- Mark failed emails that exceeded max attempts
    UPDATE email_queue
    SET status = 'failed'
    WHERE status IN ('pending', 'processing')
    AND attempts >= max_attempts;
    
    GET DIAGNOSTICS v_failed = ROW_COUNT;
    
    RETURN QUERY SELECT v_processed, v_failed;
END;
$$ LANGUAGE plpgsql;

-- ======================================
-- 📝 Default Templates
-- ======================================

INSERT INTO email_templates (name, subject, html_content, template_type, variables) VALUES
(
    'order_confirmation',
    'Order Confirmation #{{order_id}}',
    '<!-- Order confirmation HTML template -->',
    'transactional',
    '{"order_id": "string", "customer_name": "string", "items": "array", "total": "string"}'::jsonb
),
(
    'order_shipped',
    'Your Order Has Shipped!',
    '<!-- Shipping notification HTML template -->',
    'transactional',
    '{"order_id": "string", "tracking_number": "string", "carrier": "string"}'::jsonb
),
(
    'password_reset',
    'Reset Your Password',
    '<!-- Password reset HTML template -->',
    'system',
    '{"reset_url": "string", "expires_in": "string"}'::jsonb
),
(
    'welcome',
    'Welcome to Toynami!',
    '<!-- Welcome email HTML template -->',
    'marketing',
    '{"customer_name": "string", "discount_code": "string"}'::jsonb
),
(
    'abandoned_cart',
    'You left something in your cart',
    '<!-- Abandoned cart HTML template -->',
    'marketing',
    '{"items": "array", "cart_url": "string", "discount_code": "string"}'::jsonb
)
ON CONFLICT (name) DO NOTHING;

-- ======================================
-- 📊 Indexes
-- ======================================

CREATE INDEX IF NOT EXISTS idx_email_log_message_id ON email_log(message_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_process ON email_queue(status, send_at) WHERE status = 'pending';

-- Add comments
COMMENT ON TABLE email_settings IS 'Configuration for email service providers';
COMMENT ON TABLE email_templates IS 'Email templates for transactional and marketing emails';
COMMENT ON TABLE email_log IS 'Log of all sent emails with tracking data';
COMMENT ON TABLE email_queue IS 'Queue for emails to be sent with retry logic';