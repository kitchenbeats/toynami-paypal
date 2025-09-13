#!/usr/bin/env python3
import csv

# Get brand mappings
BRAND_MAP = {
    '38': "'7530230c-c28d-428e-8a5c-ccd476908c30'",  # Acid Rain
    '39': "'bf9e0455-dcbd-49e4-b887-58d0120eda79'",   # Mospeada
    '40': "'55edbf04-244d-49fc-abe6-114606068ef6'",   # Futurama
    '47': "'d9acfb7b-e561-4f39-9ab0-0cdc29c5ce34'",   # Macross
    '49': "'f3bd21c4-bb53-46a0-862f-7788d04395b6'",   # Naruto
    '50': "'14ad8bae-5090-41f8-aa33-cdcf63c3284c'",   # Sanrio
    '54': "'63e24c0a-dbe4-45a0-9b0d-ffc51b62f6d2'",   # Emily
    '55': "'77c6dd4c-182b-487a-8216-8c8477d5c4b6'",   # MILLINILLIONS
    '57': "'4aa84b5d-ffa4-4a1d-a2c7-7658c8254621'",   # Skelanimals
    '58': "'94e17899-9b83-4b6f-a56a-d7fb61d4b74f'",   # Miyo
    '60': "'4e2e0b59-4743-4937-b2fd-2e390151435a'",   # Voltron
    '61': "'49b61eec-34e7-4f8f-b0b6-9af5c37ad625'",   # Robotech
    '62': "'ea2ad5e9-da36-4a74-9855-fffffdec94c1'",   # Tulipop
    '64': "'4151ef87-a643-4e59-a1fa-f6dc5b3ad24b'",   # B2Five
}

# Read CSV
products = {}
with open('/Volumes/Projects2025/toynami-paypal/product_20250827_234649.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        pid = row.get('ID', '').strip()
        bid = row.get('Brand ID', '').strip() 
        if pid and bid:
            products[pid] = BRAND_MAP.get(bid, 'NULL')

# Process seed
with open('/Volumes/Projects2025/toynami-paypal/supabase/seed_clean.sql') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    # For product ID lines like "    700,"
    if line.strip() and line.strip()[0].isdigit() and ',' in line:
        # Extract the product ID
        pid = line.strip().rstrip(',')
        if pid in products:
            # Add brand after ID
            line = line.rstrip('\n').rstrip(',') + f", {products[pid]},\n"
        else:
            # No brand found
            line = line.rstrip('\n').rstrip(',') + ", NULL,\n"
    
    new_lines.append(line)

# Also fix brands
result = []
for line in new_lines:
    if 'INSERT INTO brands (slug' in line:
        line = line.replace('(slug,', '(id, slug,')
    elif "('acid-rain-world'," in line and 'b2five' not in line:
        line = line.replace("('acid-rain-world',", "('7530230c-c28d-428e-8a5c-ccd476908c30', 'acid-rain-world',")
    elif "('acid-rain-world-b2five'," in line:
        line = line.replace("('acid-rain-world-b2five',", "('4151ef87-a643-4e59-a1fa-f6dc5b3ad24b', 'acid-rain-world-b2five',")
    elif "('emily-the-strange'," in line:
        line = line.replace("('emily-the-strange',", "('63e24c0a-dbe4-45a0-9b0d-ffc51b62f6d2', 'emily-the-strange',")
    elif "('futurama'," in line:
        line = line.replace("('futurama',", "('55edbf04-244d-49fc-abe6-114606068ef6', 'futurama',")
    elif "('millinillions'," in line:
        line = line.replace("('millinillions',", "('77c6dd4c-182b-487a-8216-8c8477d5c4b6', 'millinillions',")
    elif "('macross'," in line:
        line = line.replace("('macross',", "('d9acfb7b-e561-4f39-9ab0-0cdc29c5ce34', 'macross',")
    elif "('miyo-s-mystic-musings'," in line:
        line = line.replace("('miyo-s-mystic-musings',", "('94e17899-9b83-4b6f-a56a-d7fb61d4b74f', 'miyo-s-mystic-musings',")
    elif "('mospeada'," in line:
        line = line.replace("('mospeada',", "('bf9e0455-dcbd-49e4-b887-58d0120eda79', 'mospeada',")
    elif "('naruto'," in line:
        line = line.replace("('naruto',", "('f3bd21c4-bb53-46a0-862f-7788d04395b6', 'naruto',")
    elif "('robotech'," in line:
        line = line.replace("('robotech',", "('49b61eec-34e7-4f8f-b0b6-9af5c37ad625', 'robotech',")
    elif "('sanrio'," in line:
        line = line.replace("('sanrio',", "('14ad8bae-5090-41f8-aa33-cdcf63c3284c', 'sanrio',")
    elif "('skelanimals'," in line:
        line = line.replace("('skelanimals',", "('4aa84b5d-ffa4-4a1d-a2c7-7658c8254621', 'skelanimals',")
    elif "('tulipop'," in line:
        line = line.replace("('tulipop',", "('ea2ad5e9-da36-4a74-9855-fffffdec94c1', 'tulipop',")
    elif "('voltron'," in line:
        line = line.replace("('voltron',", "('4e2e0b59-4743-4937-b2fd-2e390151435a', 'voltron',")
    
    result.append(line)

with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'w') as f:
    f.writelines(result)

print("Fixed seed.sql with inline brand_ids")