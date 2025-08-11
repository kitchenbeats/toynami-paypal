-- ======================================
-- ⚙️ Settings Table (for site configuration)
-- ======================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    type TEXT DEFAULT 'text', -- 'text', 'json', 'boolean', 'number', 'url'
    category TEXT DEFAULT 'general', -- 'general', 'social', 'seo', 'email', 'payment'
    label TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT false, -- Whether this setting can be accessed publicly
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================
-- 🔒 Row Level Security
-- ======================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public settings are viewable by everyone
CREATE POLICY "Public settings are viewable by everyone" ON settings
    FOR SELECT USING (is_public = true);

-- All settings are viewable by authenticated users
CREATE POLICY "Settings are viewable by authenticated users" ON settings
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can modify settings
CREATE POLICY "Settings are editable by admins" ON settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- ======================================
-- 📊 Indexes
-- ======================================
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);
CREATE INDEX idx_settings_sort_order ON settings(sort_order);

-- ======================================
-- 🔄 Update trigger
-- ======================================
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================================
-- 🌱 Initial Settings Data
-- ======================================

-- Social Media Settings
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('social_facebook', '', 'url', 'social', 'Facebook URL', 'Full URL to your Facebook page', 1, true),
    ('social_twitter', '', 'url', 'social', 'Twitter/X URL', 'Full URL to your Twitter/X profile', 2, true),
    ('social_instagram', '', 'url', 'social', 'Instagram URL', 'Full URL to your Instagram profile', 3, true),
    ('social_linkedin', '', 'url', 'social', 'LinkedIn URL', 'Full URL to your LinkedIn page', 4, true),
    ('social_youtube', '', 'url', 'social', 'YouTube URL', 'Full URL to your YouTube channel', 5, true),
    ('social_tiktok', '', 'url', 'social', 'TikTok URL', 'Full URL to your TikTok profile', 6, true);

-- General Site Settings
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('site_name', 'Toynami Store', 'text', 'general', 'Site Name', 'The name of your website', 1, true),
    ('site_tagline', 'Premium Collectibles & Toys', 'text', 'general', 'Site Tagline', 'A short tagline for your site', 2, true),
    ('contact_email', 'support@toynami.com', 'text', 'general', 'Contact Email', 'Main contact email address', 3, true),
    ('contact_phone', '1-800-TOYNAMI', 'text', 'general', 'Contact Phone', 'Main contact phone number', 4, true),
    ('contact_address', '', 'text', 'general', 'Contact Address', 'Physical store or office address', 5, true);

-- SEO Settings
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('seo_title_suffix', ' | Toynami Store', 'text', 'seo', 'Title Suffix', 'Added to the end of all page titles', 1, false),
    ('seo_default_description', 'Shop premium collectibles, action figures, and exclusive toys at Toynami Store', 'text', 'seo', 'Default Meta Description', 'Default description for pages without custom descriptions', 2, false),
    ('seo_keywords', 'collectibles, toys, action figures, anime, manga', 'text', 'seo', 'Default Keywords', 'Default keywords for SEO', 3, false);

-- Email/Newsletter Settings
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('newsletter_enabled', 'true', 'boolean', 'email', 'Newsletter Enabled', 'Enable newsletter signup', 1, false),
    ('newsletter_provider', 'mailchimp', 'text', 'email', 'Newsletter Provider', 'Email service provider (mailchimp, sendgrid, etc)', 2, false),
    ('newsletter_api_key', '', 'text', 'email', 'Newsletter API Key', 'API key for newsletter service', 3, false),
    ('newsletter_list_id', '', 'text', 'email', 'Newsletter List ID', 'List/Audience ID for newsletter', 4, false);

-- Footer Settings
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('footer_copyright', '© 2025 Toynami Inc. All rights reserved.', 'text', 'general', 'Footer Copyright', 'Copyright text in footer', 10, true),
    ('footer_newsletter_title', 'Sign Up For Our Mailing List', 'text', 'general', 'Newsletter Title', 'Newsletter section title in footer', 11, true),
    ('footer_newsletter_text', 'Stay up to date with the latest news and product releases.', 'text', 'general', 'Newsletter Description', 'Newsletter section description', 12, true);