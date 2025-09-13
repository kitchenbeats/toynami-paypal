#!/usr/bin/env python3
import re

# Brand ID mapping from BigCommerce to our database UUIDs
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

def read_product_brands():
    """Read product to brand mapping from CSV"""
    import csv
    product_brands = {}
    
    csv_file = '/Volumes/Projects2025/toynami-paypal/product_20250827_234649.csv'
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            product_id = row.get('ID', '').strip()
            brand_id = row.get('Brand ID', '').strip()
            if product_id and brand_id:
                product_brands[product_id] = brand_id
    
    return product_brands

def fix_seed_file():
    """Fix the seed file by properly handling brand_id"""
    
    # Read the backup (original seed without brand_id)
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql.old-before-brands', 'r') as f:
        content = f.read()
    
    # Add brand_id to the INSERT columns (after id)
    content = re.sub(
        r'(INSERT INTO products \(\s*id,)',
        r'\1 brand_id,',
        content
    )
    
    # Get product brand mappings
    product_brands = read_product_brands()
    
    # Process line by line for VALUES
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        # Check if this is a product ID line (e.g., "    700,")
        match = re.match(r'^    (\d+),$', line)
        if match:
            product_id = match.group(1)
            
            # Get brand UUID for this product
            brand_uuid = None
            if product_id in product_brands:
                bc_brand_id = product_brands[product_id]
                brand_uuid = BRAND_MAPPING.get(bc_brand_id)
            
            # Add line with brand_id
            if brand_uuid:
                new_lines.append(f"    {product_id},")
                new_lines.append(f"    '{brand_uuid}',")  # Add brand_id on next line
            else:
                new_lines.append(f"    {product_id},")
                new_lines.append(f"    NULL,")  # Add NULL for no brand
        else:
            new_lines.append(line)
    
    # Write the fixed file
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed_corrected.sql', 'w') as f:
        f.write('\n'.join(new_lines))
    
    print("Created seed_corrected.sql with proper brand_id values")
    
    # Count products with brands
    with_brand = sum(1 for line in new_lines if "'7530230c-" in line or "'bf9e0455-" in line or "'55edbf04-" in line)
    print(f"Products with brand UUIDs: ~{with_brand}")

if __name__ == '__main__':
    fix_seed_file()