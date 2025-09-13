#!/usr/bin/env python3
import re

# Brand slug to UUID mapping (from the database export)
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

def fix_brand_inserts():
    """Add explicit UUIDs to brand INSERT statements"""
    
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if this is a brand INSERT
        if 'INSERT INTO brands (' in line and 'id' not in line:
            # Add id to column list
            line = line.replace('INSERT INTO brands (', 'INSERT INTO brands (id, ')
            new_lines.append(line)
            
            # Process the VALUES line
            if i + 1 < len(lines):
                i += 1
                values_line = lines[i]
                
                # Extract slug from VALUES
                slug_match = re.search(r"^\s*\('([^']+)'", values_line)
                if slug_match:
                    slug = slug_match.group(1)
                    if slug in BRAND_SLUG_TO_UUID:
                        uuid = BRAND_SLUG_TO_UUID[slug]
                        # Add UUID to VALUES
                        values_line = re.sub(r"^\s*\('", f"    ('{uuid}', '", values_line)
                
                new_lines.append(values_line)
        else:
            new_lines.append(line)
        
        i += 1
    
    # Write the fixed file
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed_final.sql', 'w') as f:
        f.writelines(new_lines)
    
    print("Created seed_final.sql with brand IDs")
    
    # Verify
    brand_count = sum(1 for line in new_lines if "INSERT INTO brands (id," in line)
    print(f"Fixed {brand_count} brand INSERT statements")

if __name__ == '__main__':
    fix_brand_inserts()