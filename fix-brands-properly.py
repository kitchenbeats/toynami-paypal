#!/usr/bin/env python3
import re

BRAND_SLUG_TO_UUID = {
    'acid-rain-world': '7530230c-c28d-428e-8a5c-ccd476908c30',
    'acid-rain-world-b2five': '4151ef87-a643-4e59-a1fa-f6dc5b3ad24b',
    'emily-the-strange': '63e24c0a-dbe4-45a0-9b0d-ffc51b62f6d2',
    'futurama': '55edbf04-244d-49fc-abe6-114606068ef6',
    'millinillions': '77c6dd4c-182b-487a-8216-8c8477d5c4b6',
    'macross': 'd9acfb7b-e561-4f39-9ab0-0cdc29c5ce34',
    'miyo-s-mystic-musings': '94e17899-9b83-4b6f-a56a-d7fb61d4b74f',
    'mospeada': 'bf9e0455-dcbd-49e4-b887-58d0120eda79',
    'naruto': 'f3bd21c4-bb53-46a0-862f-7788d04395b6',
    'robotech': '49b61eec-34e7-4f8f-b0b6-9af5c37ad625',
    'sanrio': '14ad8bae-5090-41f8-aa33-cdcf63c3284c',
    'skelanimals': '4aa84b5d-ffa4-4a1d-a2c7-7658c8254621',
    'tulipop': 'ea2ad5e9-da36-4a74-9855-fffffdec94c1',
    'voltron': '4e2e0b59-4743-4937-b2fd-2e390151435a',
}

def fix_brands():
    print("Reading seed.sql...")
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    i = 0
    brands_fixed = 0
    duplicates_removed = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this is our generated brands section
        if '-- 🏢 Brands' in line and i > 2600:  # Our generated section
            # Skip our entire generated brands section
            new_lines.append(line)
            i += 1
            while i < len(lines) and 'INSERT INTO brands (id,' in lines[i]:
                duplicates_removed += 1
                i += 1  # Skip these lines
            continue
        
        # Fix original brand INSERT statements - add id column and value
        if 'INSERT INTO brands (' in line and 'id,' not in line:
            # Add id to the column list
            line = line.replace('INSERT INTO brands (', 'INSERT INTO brands (id, ')
            new_lines.append(line)
            
            # Check next line for the VALUES
            if i + 1 < len(lines):
                i += 1
                values_line = lines[i]
                
                # Extract slug and add UUID
                for slug, uuid in BRAND_SLUG_TO_UUID.items():
                    if f"('{slug}'," in values_line:
                        values_line = values_line.replace(f"('{slug}',", f"('{uuid}', '{slug}',")
                        brands_fixed += 1
                        break
                
                new_lines.append(values_line)
        else:
            new_lines.append(line)
        
        i += 1
    
    # Write the fixed content
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'w') as f:
        f.writelines(new_lines)
    
    print(f"✅ Fixed seed.sql")
    print(f"  - Fixed {brands_fixed} original brand INSERTs with UUIDs")
    print(f"  - Removed {duplicates_removed} duplicate brand entries")
    
    # Verify
    content = ''.join(new_lines)
    brand_with_id = content.count('INSERT INTO brands (id,')
    print(f"  - Total brands with IDs: {brand_with_id}")

if __name__ == '__main__':
    fix_brands()