-- ======================================
-- 📄 Pages Table (CMS pages like About, Contact, etc.)
-- ======================================
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    is_active BOOLEAN DEFAULT true,
    show_in_footer BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================
-- 🗂️ Menus Table (Different menu locations)
-- ======================================
CREATE TABLE IF NOT EXISTS menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL, -- 'header', 'footer', 'mobile', 'sidebar'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(location)
);

-- ======================================
-- 🔗 Menu Items Table (Individual menu links)
-- ======================================
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT,
    type TEXT NOT NULL, -- 'page', 'category', 'brand', 'custom', 'product'
    target_id UUID, -- ID of the page, category, or brand
    target_slug TEXT, -- Slug for building URLs
    css_class TEXT,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    opens_new_tab BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================
-- 🔒 Row Level Security
-- ======================================

-- Pages RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pages are viewable by everyone" ON pages
    FOR SELECT USING (is_active = true);

CREATE POLICY "Pages are editable by admins" ON pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Menus RLS
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menus are viewable by everyone" ON menus
    FOR SELECT USING (is_active = true);

CREATE POLICY "Menus are editable by admins" ON menus
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Menu Items RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu items are viewable by everyone" ON menu_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Menu items are editable by admins" ON menu_items
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
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_active ON pages(is_active);
CREATE INDEX idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX idx_menu_items_parent_id ON menu_items(parent_id);
CREATE INDEX idx_menu_items_sort_order ON menu_items(sort_order);

-- ======================================
-- 🔄 Update triggers
-- ======================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();