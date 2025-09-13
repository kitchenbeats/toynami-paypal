#!/usr/bin/env python3
import re
import csv

# Brand mappings
BRAND_MAPPING = {
    '38': '7530230c-c28d-428e-8a5c-ccd476908c30',  # Acid Rain World
    '39': 'bf9e0455-dcbd-49e4-b887-58d0120eda79',  # Mospeada  
    '40': '55edbf04-244d-49fc-abe6-114606068ef6',  # Futurama
    '47': 'd9acfb7b-e561-4f39-9ab0-0cdc29c5ce34',  # Macross
    '49': 'f3bd21c4-bb53-46a0-862f-7788d04395b6',  # Naruto
    '50': '14ad8bae-5090-41f8-aa33-cdcf63c3284c',  # Sanrio
    '54': '63e24c0a-dbe4-45a0-9b0d-ffc51b62f6d2',  # Emily the Strange
    '55': '77c6dd4c-182b-487a-8216-8c8477d5c4b6',  # MILLINILLIONS
    '57': '4aa84b5d-ffa4-4a1d-a2c7-7658c8254621',  # Skelanimals
    '58': '94e17899-9b83-4b6f-a56a-d7fb61d4b74f',  # Miyo's Mystic Musings
    '60': '4e2e0b59-4743-4937-b2fd-2e390151435a',  # Voltron
    '61': '49b61eec-34e7-4f8f-b0b6-9af5c37ad625',  # Robotech
    '62': 'ea2ad5e9-da36-4a74-9855-fffffdec94c1',  # Tulipop
    '64': '4151ef87-a643-4e59-a1fa-f6dc5b3ad24b',  # Acid Rain World B2FIVE
}

BRAND_SLUGS = {
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

def get_product_brands():
    """Read CSV to get product brand mappings"""
    product_brands = {}
    with open('/Volumes/Projects2025/toynami-paypal/product_20250827_234649.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            pid = row.get('ID', '').strip()
            bid = row.get('Brand ID', '').strip()
            if pid and bid:
                product_brands[pid] = BRAND_MAPPING.get(bid)
    return product_brands

def main():
    # Start fresh from the original
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql.old-before-brands', 'r') as f:
        lines = f.readlines()
    
    product_brands = get_product_brands()
    new_lines = []
    
    for i, line in enumerate(lines):
        # Fix product INSERT statements - add brand_id column
        if 'INSERT INTO products (' in line and 'brand_id' not in line:
            line = line.replace('id, slug,', 'id, brand_id, slug,')
            new_lines.append(line)
        
        # Fix product VALUES - add brand_id value on separate line
        elif re.match(r'^\s+(\d+),$', line):
            match = re.match(r'^(\s+)(\d+),$', line)
            if match:
                indent = match.group(1)
                product_id = match.group(2)
                
                # Keep product ID on its own line
                new_lines.append(line)
                
                # Add brand_id on next line with same indentation
                brand_uuid = product_brands.get(product_id)
                if brand_uuid:
                    new_lines.append(f"{indent}'{brand_uuid}',\n")
                else:
                    new_lines.append(f"{indent}NULL,\n")
        
        # Fix brand INSERT statements - add id column
        elif 'INSERT INTO brands (' in line and 'id,' not in line:
            line = line.replace('slug, name,', 'id, slug, name,')
            new_lines.append(line)
        
        # Fix brand VALUES - add UUID
        elif any(f"('{slug}'," in line for slug in BRAND_SLUGS.keys()):
            for slug, uuid in BRAND_SLUGS.items():
                if f"('{slug}'," in line:
                    line = line.replace(f"('{slug}',", f"('{uuid}', '{slug}',")
                    break
            new_lines.append(line)
        
        else:
            new_lines.append(line)
    
    # Write the result
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'w') as f:
        f.writelines(new_lines)
    
    print("Fixed seed.sql with proper structure")
    
    # Count updates
    brand_count = sum(1 for line in new_lines if re.search(r"'\w{8}-\w{4}-\w{4}-\w{4}-\w{12}',\n", line))
    print(f"Products with brand UUIDs: ~{brand_count}")

if __name__ == '__main__':
    main()