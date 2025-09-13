#!/usr/bin/env python3
import re

def extract_section(content, start_marker, end_marker=None):
    """Extract a section from content between markers"""
    start_idx = content.find(start_marker)
    if start_idx == -1:
        return ""
    
    if end_marker:
        end_idx = content.find(end_marker, start_idx + len(start_marker))
        if end_idx == -1:
            return content[start_idx:]
        return content[start_idx:end_idx]
    else:
        return content[start_idx:]

def main():
    # Read the original seed
    print("Reading original seed...")
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql.old-before-brands', 'r') as f:
        original = f.read()
    
    # Read the generated seed
    print("Reading generated seed with products from CSV...")
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed_generated.sql', 'r') as f:
        generated = f.read()
    
    # Extract parts we need
    print("Extracting sections...")
    
    # 1. Get the header and initial setup from original
    header_end = "-- ======================================\n-- 📸 Media Library"
    header = extract_section(original, "", header_end)
    
    # 2. Get media library and media usage from original
    media_start = "-- ======================================\n-- 📸 Media Library"
    media_end = "-- ======================================\n-- 🏢 Brands"
    media_section = extract_section(original, media_start, media_end)
    
    # 3. Get brands from generated (with UUIDs)
    brands_start = "-- ======================================\n-- 🏢 Brands"
    brands_end = "-- ======================================\n-- 🛍️ Products"
    brands_section = extract_section(generated, brands_start, brands_end)
    
    # 4. Get products from generated
    products_start = "-- ======================================\n-- 🛍️ Products"
    products_end = "-- ======================================\n-- 📁 Categories"
    products_section = extract_section(generated, products_start, products_end)
    
    # 5. Get everything after products from original (categories, etc)
    after_products_start = "-- ======================================\n-- 📁 Categories"
    after_products = extract_section(original, after_products_start)
    
    # Combine all parts
    print("Combining sections...")
    final_seed = f"""{header}
{media_section}
{brands_section}
{products_section}
{after_products}"""
    
    # Write final seed
    output_file = '/Volumes/Projects2025/toynami-paypal/supabase/seed.sql'
    print(f"Writing final seed to {output_file}...")
    with open(output_file, 'w') as f:
        f.write(final_seed)
    
    # Count some stats
    product_count = final_seed.count('INSERT INTO products (')
    brand_count = final_seed.count('INSERT INTO brands (')
    media_count = final_seed.count('INSERT INTO media_library')
    
    print(f"\n✅ Final seed.sql created:")
    print(f"  - {brand_count} brand INSERTs with explicit UUIDs")
    print(f"  - {product_count} product INSERTs with brand_ids")
    print(f"  - {media_count} media library INSERT")
    print(f"  - Preserved all media_usage mappings")
    print(f"  - Preserved categories, settings, etc.")

if __name__ == '__main__':
    main()