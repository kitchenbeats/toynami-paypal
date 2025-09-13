#!/usr/bin/env python3
import re

def fix_seed():
    print("Reading seed.sql...")
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'r') as f:
        content = f.read()
    
    # Find the start of the original brands section
    # It starts after media usage and before our generated brands
    media_end = content.find('-- ======================================\n-- 🏢 Brands')
    if media_end == -1:
        print("Could not find brands section marker")
        return
    
    # Find where our generated brands start (with the comment)
    generated_brands_start = content.find('-- ======================================\n-- 🏢 Brands', media_end + 1)
    
    if generated_brands_start != -1:
        # We have duplicate brands sections
        # Remove everything between media end and our generated brands
        before_media_end = content[:media_end]
        after_generated_brands = content[generated_brands_start:]
        
        # Combine without the duplicate brands
        content = before_media_end + after_generated_brands
        print("Removed duplicate brand entries")
    else:
        print("No duplicate brands found")
    
    # Write the fixed content
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'w') as f:
        f.write(content)
    
    print("✅ Fixed seed.sql - removed duplicate brand entries")
    
    # Count what we have
    brand_with_id = content.count('INSERT INTO brands (id,')
    brand_without_id = len(re.findall(r'INSERT INTO brands \((?!id)', content))
    products = content.count('INSERT INTO products')
    
    print(f"  - Brands with explicit IDs: {brand_with_id}")
    print(f"  - Brands without IDs (should be 0): {brand_without_id}")
    print(f"  - Product INSERTs: {products}")

if __name__ == '__main__':
    fix_seed()