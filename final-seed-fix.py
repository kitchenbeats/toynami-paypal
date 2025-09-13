#!/usr/bin/env python3
import re
import csv

# Brand ID mapping
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

def get_product_brands():
    """Read product brands from CSV"""
    product_brands = {}
    with open('/Volumes/Projects2025/toynami-paypal/product_20250827_234649.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            pid = row.get('ID', '').strip()
            bid = row.get('Brand ID', '').strip()
            if pid and bid:
                product_brands[pid] = bid
    return product_brands

def fix_seed():
    # Start with the old seed that doesn't have brand_id issues
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql.old-before-brands', 'r') as f:
        content = f.read()
    
    # Add brand_id to column list (after id)
    content = re.sub(
        r'(INSERT INTO products \(\s*id,)',
        r'\1 brand_id,',
        content
    )
    
    product_brands = get_product_brands()
    
    # Split into lines for processing
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        # Check for product ID line pattern: "    700,"
        match = re.match(r'^    (\d+),$', line)
        if match:
            product_id = match.group(1)
            
            # Get brand for this product
            brand_uuid = None
            if product_id in product_brands:
                bc_brand = product_brands[product_id]
                brand_uuid = BRAND_MAPPING.get(bc_brand)
            
            # Combine ID and brand_id on same line
            if brand_uuid:
                new_lines.append(f"    {product_id}, '{brand_uuid}',")
            else:
                new_lines.append(f"    {product_id}, NULL,")
        else:
            new_lines.append(line)
    
    # Now fix brands to have IDs
    final_lines = []
    i = 0
    while i < len(new_lines):
        line = new_lines[i]
        
        # Fix brand INSERTs
        if 'INSERT INTO brands (' in line and 'id,' not in line:
            line = line.replace('INSERT INTO brands (', 'INSERT INTO brands (id, ')
            final_lines.append(line)
            
            # Check next line for VALUES
            if i + 1 < len(new_lines):
                i += 1
                values_line = new_lines[i]
                
                # Map slugs to UUIDs
                if "'acid-rain-world'," in values_line and 'b2five' not in values_line:
                    values_line = values_line.replace("('acid-rain-world',", f"('7530230c-c28d-428e-8a5c-ccd476908c30', 'acid-rain-world',")
                elif "'acid-rain-world-b2five'," in values_line:
                    values_line = values_line.replace("('acid-rain-world-b2five',", f"('4151ef87-a643-4e59-a1fa-f6dc5b3ad24b', 'acid-rain-world-b2five',")
                elif "'emily-the-strange'," in values_line:
                    values_line = values_line.replace("('emily-the-strange',", f"('63e24c0a-dbe4-45a0-9b0d-ffc51b62f6d2', 'emily-the-strange',")
                elif "'futurama'," in values_line:
                    values_line = values_line.replace("('futurama',", f"('55edbf04-244d-49fc-abe6-114606068ef6', 'futurama',")
                elif "'millinillions'," in values_line:
                    values_line = values_line.replace("('millinillions',", f"('77c6dd4c-182b-487a-8216-8c8477d5c4b6', 'millinillions',")
                elif "'macross'," in values_line:
                    values_line = values_line.replace("('macross',", f"('d9acfb7b-e561-4f39-9ab0-0cdc29c5ce34', 'macross',")
                elif "'miyo-s-mystic-musings'," in values_line:
                    values_line = values_line.replace("('miyo-s-mystic-musings',", f"('94e17899-9b83-4b6f-a56a-d7fb61d4b74f', 'miyo-s-mystic-musings',")
                elif "'mospeada'," in values_line:
                    values_line = values_line.replace("('mospeada',", f"('bf9e0455-dcbd-49e4-b887-58d0120eda79', 'mospeada',")
                elif "'naruto'," in values_line:
                    values_line = values_line.replace("('naruto',", f"('f3bd21c4-bb53-46a0-862f-7788d04395b6', 'naruto',")
                elif "'robotech'," in values_line:
                    values_line = values_line.replace("('robotech',", f"('49b61eec-34e7-4f8f-b0b6-9af5c37ad625', 'robotech',")
                elif "'sanrio'," in values_line:
                    values_line = values_line.replace("('sanrio',", f"('14ad8bae-5090-41f8-aa33-cdcf63c3284c', 'sanrio',")
                elif "'skelanimals'," in values_line:
                    values_line = values_line.replace("('skelanimals',", f"('4aa84b5d-ffa4-4a1d-a2c7-7658c8254621', 'skelanimals',")
                elif "'tulipop'," in values_line:
                    values_line = values_line.replace("('tulipop',", f"('ea2ad5e9-da36-4a74-9855-fffffdec94c1', 'tulipop',")
                elif "'voltron'," in values_line:
                    values_line = values_line.replace("('voltron',", f"('4e2e0b59-4743-4937-b2fd-2e390151435a', 'voltron',")
                
                final_lines.append(values_line)
        else:
            final_lines.append(line)
        
        i += 1
    
    # Write the final seed
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'w') as f:
        f.write('\n'.join(final_lines))
    
    print("Fixed seed.sql with proper brand_ids inline")
    
    # Count products with brands
    brand_count = sum(1 for line in final_lines if re.search(r"\d+, '[a-f0-9\-]{36}',", line))
    print(f"Products with brand UUIDs: {brand_count}")

if __name__ == '__main__':
    fix_seed()