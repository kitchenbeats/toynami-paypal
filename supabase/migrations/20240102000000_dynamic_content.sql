-- ======================================
-- 📝 Dynamic Content Management Schema
-- Adds: Blog/Announcements, Banner Management, Site Settings
-- ======================================

-- ======================================
-- 📰 Blog/Announcements
-- ======================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,  -- Main hero/banner image for the blog post
    thumbnail_url TEXT,   -- Smaller preview image for lists/cards (optional, can default to featured_image)
    author_id UUID REFERENCES users(id),
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    featured BOOLEAN DEFAULT FALSE,
    meta_title TEXT,
    meta_description TEXT,
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fetching recent posts
CREATE INDEX IF NOT EXISTS blog_posts_published_idx 
    ON blog_posts (published_at DESC) 
    WHERE status = 'published';

-- Index for featured posts
CREATE INDEX IF NOT EXISTS blog_posts_featured_idx 
    ON blog_posts (featured, published_at DESC) 
    WHERE status = 'published' AND featured = TRUE;

-- ======================================
-- 🖼️ Banner Management System
-- ======================================
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL CHECK (position IN ('upper', 'middle', 'lower', 'hero')),
    slot_number INTEGER NOT NULL CHECK (slot_number BETWEEN 1 AND 6),
    -- Content
    image_url TEXT,
    image_alt TEXT,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    button_text TEXT,
    button_url TEXT,
    -- Styling
    text_alignment TEXT CHECK (text_alignment IN ('left', 'center', 'right')),
    background_color TEXT,
    text_color TEXT,
    button_color TEXT,
    button_text_color TEXT,
    overlay_opacity NUMERIC CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
    -- Layout
    column_span INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    -- Targeting
    target_categories UUID[],
    target_brands TEXT[],
    min_tier_order INTEGER,
    -- Tracking
    click_count INTEGER DEFAULT 0,
    impression_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    -- Unique constraint for position + slot
    CONSTRAINT unique_banner_position_slot UNIQUE (position, slot_number)
);

-- Index for active banners
CREATE INDEX IF NOT EXISTS banners_active_idx 
    ON banners (position, display_order) 
    WHERE is_active = TRUE;

-- ======================================
-- ⚙️ Site Settings/Configuration
-- ======================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Common settings categories
INSERT INTO site_settings (key, value, category, description, is_public) VALUES
    ('banner_config', '{"upper_columns": 2, "middle_columns": 3, "lower_columns": 1}', 'layout', 'Banner column configuration', true),
    ('homepage_sections', '{"show_featured": true, "show_brands": true, "show_announcements": true}', 'homepage', 'Homepage section visibility', true),
    ('social_links', '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}', 'social', 'Social media links', true),
    ('maintenance_mode', '{"enabled": false, "message": ""}', 'system', 'Maintenance mode settings', false),
    ('featured_brands', '["Robotech", "Voltron", "Naruto", "Macross"]', 'brands', 'Featured brand list', true)
ON CONFLICT (key) DO NOTHING;

-- ======================================
-- 🏷️ Brands Table (for dynamic brand management)
-- ======================================
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    search_keywords TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for featured brands
CREATE INDEX IF NOT EXISTS brands_featured_idx 
    ON brands (display_order) 
    WHERE is_active = TRUE AND featured = TRUE;

-- ======================================
-- 🎯 Featured Products - Using products.is_featured instead
-- ======================================
-- No separate table needed - we use:
-- - products.is_featured (boolean) to mark featured products
-- - products.sort_order (integer) to control display order
-- This is simpler and avoids redundancy

-- ======================================
-- 🔒 Row Level Security Policies
-- ======================================

-- Blog posts - public read for published, admin write
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts are viewable by everyone" 
    ON blog_posts FOR SELECT 
    USING (status = 'published' AND published_at <= now());

CREATE POLICY "Admins can manage all blog posts" 
    ON blog_posts FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = TRUE
        )
    );

-- Banners - public read for active, admin write
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active banners are viewable by everyone" 
    ON banners FOR SELECT 
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage all banners" 
    ON banners FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = TRUE
        )
    );

-- Site settings - public read for public settings, admin write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings are viewable by everyone" 
    ON site_settings FOR SELECT 
    USING (is_public = TRUE);

CREATE POLICY "Admins can manage all settings" 
    ON site_settings FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = TRUE
        )
    );

-- Brands - public read for active, admin write
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active brands are viewable by everyone" 
    ON brands FOR SELECT 
    USING (is_active = TRUE);

CREATE POLICY "Admins can manage all brands" 
    ON brands FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_admin = TRUE
        )
    );

-- Featured products RLS removed - using products.is_featured instead

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

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();