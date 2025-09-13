#!/usr/bin/env python3
import csv
import re
import sys

# Brand ID mapping from BigCommerce to our database UUIDs
BRAND_MAPPING = {
    '38': '7530230c-c28d-428e-8a5c-ccd476908c30',  # Acid Rain World
    '39': 'bf9e0455-dcbd-49e4-b887-58d0120eda79',  # Mospeada
    '40': '55edbf04-244d-49fc-abe6-114606068ef6',  # Futurama
    '42': None,  # Shogun Warriors - no brand in DB yet
    '47': 'd9acfb7b-e561-4f39-9ab0-0cdc29c5ce34',  # Macross
    '49': 'f3bd21c4-bb53-46a0-862f-7788d04395b6',  # Naruto
    '50': '14ad8bae-5090-41f8-aa33-cdcf63c3284c',  # Sanrio
    '54': '63e24c0a-dbe4-45a0-9b0d-ffc51b62f6d2',  # Emily the Strange
    '55': '77c6dd4c-182b-487a-8216-8c8477d5c4b6',  # MILLINILLIONS
    '57': '4aa84b5d-ffa4-4a1d-a2c7-7658c8254621',  # Skelanimals
    '58': '94e17899-9b83-4b6f-a56a-d7fb61d4b74f',  # Miyo's Mystic Musings (Little Embers)
    '60': '4e2e0b59-4743-4937-b2fd-2e390151435a',  # Voltron
    '61': '49b61eec-34e7-4f8f-b0b6-9af5c37ad625',  # Robotech
    '62': 'ea2ad5e9-da36-4a74-9855-fffffdec94c1',  # Tulipop
    '64': '4151ef87-a643-4e59-a1fa-f6dc5b3ad24b',  # Acid Rain World B2FIVE
    '65': None,  # Mega Man - no brand in DB yet
}

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

def read_csv_products(csv_file):
    """Read products from BigCommerce CSV and extract ID to Brand ID mapping"""
    product_brands = {}
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            product_id = row.get('ID', '').strip()
            brand_id = row.get('Brand ID', '').strip()
            
            if product_id and brand_id:
                product_brands[product_id] = brand_id
    
    return product_brands

def fix_brand_inserts(content):
    """Fix brand INSERT statements to include explicit UUID ids"""
    
    print("Fixing brand INSERT statements...")
    updated_count = 0
    
    # Process line by line to handle all brand INSERT patterns
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this is a brand INSERT statement
        if 'INSERT INTO brands' in line and 'id' not in line:
            # Add id to the columns list
            line = line.replace('INSERT INTO brands (', 'INSERT INTO brands (id, ')
            new_lines.append(line)
            
            # Check the next line for the VALUES
            if i + 1 < len(lines):
                i += 1
                next_line = lines[i]
                
                # Extract the slug from the VALUES line
                slug_match = re.search(r"^\s*\('([^']+)'", next_line)
                if slug_match:
                    slug = slug_match.group(1)
                    if slug in BRAND_SLUG_TO_UUID:
                        uuid = BRAND_SLUG_TO_UUID[slug]
                        # Add the UUID at the beginning of the VALUES
                        next_line = re.sub(r"^\s*\('", f"    ('{uuid}', '", next_line)
                        updated_count += 1
                
                new_lines.append(next_line)
        else:
            new_lines.append(line)
        
        i += 1
    
    print(f"Updated {updated_count} brand INSERT statements with explicit UUIDs")
    return '\n'.join(new_lines)

def update_seed_sql(seed_file, product_brands):
    """Update seed.sql file to include brand_id column and values"""
    
    with open(seed_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # First, fix the brand INSERT statements to include explicit IDs
    content = fix_brand_inserts(content)
    
    # Next, add brand_id to the INSERT INTO products column list
    # Check if brand_id is already in the column list
    if 'brand_id' not in content:
        # Add brand_id after the id column in the INSERT statement
        content = re.sub(
            r'(INSERT INTO products \(\s*id,)',
            r'\1 brand_id,',
            content
        )
        print("Added brand_id to INSERT column list")
    
    # Now we need to add the brand_id values to each product VALUES
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    products_updated = 0
    products_without_brand = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this line contains a product ID (matches pattern like "    700,")
        match = re.match(r'^    (\d+),$', line)
        if match:
            product_id = match.group(1)
            
            # Check if we have a brand mapping for this product
            brand_uuid = None
            if product_id in product_brands:
                bigcommerce_brand_id = product_brands[product_id]
                brand_uuid = BRAND_MAPPING.get(bigcommerce_brand_id)
                
                if brand_uuid:
                    products_updated += 1
                else:
                    products_without_brand += 1
                    if bigcommerce_brand_id not in ['', '0']:  # Only warn for non-empty brand IDs
                        print(f"Warning: Product {product_id} has BigCommerce brand {bigcommerce_brand_id} with no UUID mapping")
            else:
                products_without_brand += 1
                # Don't warn for products not in CSV as there might be manual additions
            
            # Add the line with brand_id
            if brand_uuid:
                new_lines.append(f"    {product_id}, '{brand_uuid}',")
            else:
                new_lines.append(f"    {product_id}, NULL,")
        else:
            new_lines.append(line)
        
        i += 1
    
    # Write the updated content
    output_file = seed_file.replace('.sql', '_fixed.sql')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    
    print(f"\nSummary:")
    print(f"- Products updated with brand_id: {products_updated}")
    print(f"- Products without brand mapping: {products_without_brand}")
    print(f"- Output written to: {output_file}")
    
    return output_file

def verify_products_count(csv_file, seed_file):
    """Verify that all products from CSV are in seed.sql"""
    
    # Count products in CSV
    csv_products = set()
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            product_id = row.get('ID', '').strip()
            if product_id:
                csv_products.add(product_id)
    
    # Count products in seed.sql
    seed_products = set()
    with open(seed_file, 'r', encoding='utf-8') as f:
        content = f.read()
        # Find all product IDs in VALUES statements
        pattern = r'\(\s*(\d+),\s*(?:\'[a-f0-9\-]+\',\s*)?\'[^\']+\','
        matches = re.findall(pattern, content)
        seed_products = set(matches)
    
    print(f"\nProduct Count Verification:")
    print(f"- Products in CSV: {len(csv_products)}")
    print(f"- Products in seed.sql: {len(seed_products)}")
    
    missing_in_seed = csv_products - seed_products
    if missing_in_seed:
        print(f"- Products in CSV but not in seed: {len(missing_in_seed)}")
        print(f"  Missing IDs: {sorted(list(missing_in_seed)[:10])}...")
    
    extra_in_seed = seed_products - csv_products  
    if extra_in_seed:
        print(f"- Products in seed but not in CSV: {len(extra_in_seed)}")
        print(f"  Extra IDs: {sorted(list(extra_in_seed)[:10])}...")
    
    if not missing_in_seed and not extra_in_seed:
        print("✓ All products match between CSV and seed.sql")

def main():
    csv_file = '/Volumes/Projects2025/toynami-paypal/product_20250827_234649.csv'
    seed_file = '/Volumes/Projects2025/toynami-paypal/supabase/seed.sql'
    
    print("Reading products from CSV...")
    product_brands = read_csv_products(csv_file)
    print(f"Found {len(product_brands)} products with brand IDs")
    
    print("\nUpdating seed.sql with brand_id mappings...")
    output_file = update_seed_sql(seed_file, product_brands)
    
    print("\nVerifying product counts...")
    verify_products_count(csv_file, output_file)
    
    print(f"\n✅ Done! Updated seed file: {output_file}")
    print("\nTo use the updated seed:")
    print(f"  mv {output_file} {seed_file}")

if __name__ == '__main__':
    main()