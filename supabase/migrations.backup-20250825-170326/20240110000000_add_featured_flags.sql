-- ======================================
-- Add is_featured flags to brands and categories for consistent UI control
-- ======================================

-- Add is_featured to categories (products already has it)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- brands table already has 'featured' and 'display_order' columns
-- No need to add duplicate columns

-- Add sort_order to categories if not exists
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create indexes for featured items and sort order
CREATE INDEX IF NOT EXISTS categories_featured_sort_idx 
  ON categories(is_featured DESC, sort_order, display_order);

CREATE INDEX IF NOT EXISTS brands_featured_sort_idx 
  ON brands(featured DESC, display_order);

-- Update the existing products index to include sort_order
DROP INDEX IF EXISTS products_is_featured_idx;
CREATE INDEX IF NOT EXISTS products_featured_sort_idx 
  ON products(is_featured DESC, sort_order) 
  WHERE deleted_at IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN products.is_featured IS 'Flag to mark featured products for homepage/special displays';
COMMENT ON COLUMN products.sort_order IS 'Manual sort order for display (lower numbers appear first)';
COMMENT ON COLUMN categories.is_featured IS 'Flag to mark featured categories for homepage/special displays';
COMMENT ON COLUMN categories.sort_order IS 'Manual sort order for display (lower numbers appear first)';
COMMENT ON COLUMN brands.featured IS 'Flag to mark featured brands for homepage/special displays';
COMMENT ON COLUMN brands.display_order IS 'Manual sort order for display (lower numbers appear first)';

-- Helper function to get featured items with proper sorting
CREATE OR REPLACE FUNCTION get_featured_products(limit_count INTEGER DEFAULT 8)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    sort_order INTEGER,
    is_featured BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.sort_order,
        p.is_featured
    FROM products p
    WHERE 
        p.is_featured = TRUE 
        AND p.deleted_at IS NULL
        AND p.is_visible = TRUE
        AND p.status = 'active'
    ORDER BY 
        p.sort_order ASC,
        p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Similar for categories
CREATE OR REPLACE FUNCTION get_featured_categories(limit_count INTEGER DEFAULT 6)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    sort_order INTEGER,
    is_featured BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.slug,
        c.sort_order,
        c.is_featured
    FROM categories c
    WHERE 
        c.is_featured = TRUE 
        AND c.is_active = TRUE
    ORDER BY 
        c.sort_order ASC,
        c.display_order ASC,
        c.name ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Similar for brands
CREATE OR REPLACE FUNCTION get_featured_brands(limit_count INTEGER DEFAULT 8)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    display_order INTEGER,
    featured BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        b.slug,
        b.display_order,
        b.featured
    FROM brands b
    WHERE 
        b.featured = TRUE 
        AND b.is_active = TRUE
    ORDER BY 
        b.display_order ASC,
        b.name ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;