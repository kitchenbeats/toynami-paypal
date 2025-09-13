#!/usr/bin/env python3
import csv
import re
import html

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

def escape_for_postgres(html_text):
    """Use PostgreSQL dollar quoting for complex HTML"""
    if not html_text or html_text == '':
        return 'NULL'
    
    # Decode HTML entities
    text = html.unescape(html_text)
    
    # Use dollar quoting to avoid escaping issues
    delimiter = '$$DESC$$'
    counter = 1
    while delimiter in text:
        delimiter = f'$$DESC{counter}$$'
        counter += 1
    
    return f"{delimiter}{text}{delimiter}"

def clean_text(text):
    """Clean plain text for SQL"""
    if text is None or text == '':
        return 'NULL'
    text = str(text).replace("'", "''")
    return f"'{text}'"

def clean_number(val):
    if val is None or val == '':
        return 'NULL'
    try:
        if '.' in str(val):
            return str(float(val))
        return str(int(val))
    except:
        return 'NULL'

def parse_price(price_str):
    if not price_str or price_str == '':
        return 'NULL'
    try:
        price_str = str(price_str).replace('$', '').replace(',', '')
        return str(int(float(price_str) * 100))
    except:
        return 'NULL'

def create_slug(name):
    if not name:
        return ''
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

def main():
    # Read the clean backup
    print("Reading clean backup...")
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed_clean.sql', 'r') as f:
        lines = f.readlines()
    
    # Process line by line
    new_lines = []
    brands_fixed = 0
    
    for i, line in enumerate(lines):
        # Fix brand INSERTs - add id column and value
        if 'INSERT INTO brands (' in line and 'id,' not in line:
            # Add id to column list
            line = line.replace('INSERT INTO brands (', 'INSERT INTO brands (id, ')
            new_lines.append(line)
            
            # Fix the VALUES line
            if i + 1 < len(lines):
                values_line = lines[i+1]
                # Add UUID for each brand
                for slug, uuid in BRAND_SLUGS.items():
                    if f"('{slug}'," in values_line:
                        values_line = values_line.replace(f"('{slug}',", f"('{uuid}', '{slug}',")
                        brands_fixed += 1
                        break
                lines[i+1] = values_line  # Update for next iteration
        else:
            new_lines.append(line)
    
    print(f"Fixed {brands_fixed} brand INSERTs with UUIDs")
    
    # Now replace products section with CSV data
    print("Generating products from CSV...")
    
    # Find where products section starts
    products_start = -1
    products_end = -1
    for i, line in enumerate(new_lines):
        if '-- 🛍️ Products' in line:
            products_start = i
        elif '-- 📁 Categories' in line and products_start > 0:
            products_end = i
            break
    
    products = []  # Initialize products list outside the if block
    if products_start > 0 and products_end > 0:
        # Generate new products from CSV
        with open('/Volumes/Projects2025/toynami-paypal/product_20250827_234649.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                product_id = row.get('ID', '').strip()
                if not product_id:
                    continue
                
                # Get brand
                brand_id = row.get('Brand ID', '').strip()
                brand_uuid = BRAND_MAPPING.get(brand_id) if brand_id else None
                
                # Build INSERT
                name = row.get('Name', '')
                slug = create_slug(name)
                desc = escape_for_postgres(row.get('Description', ''))
                
                insert = f"""INSERT INTO products (
    id, brand_id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
    condition, upc, is_visible, allow_purchases, status, track_inventory, stock_level,
    sort_order, meta_title, meta_description, meta_keywords, product_url, created_at,
    preorder_release_date, preorder_message, retail_price_cents, sale_price_cents,
    cost_price_cents, calculated_price_cents, fixed_shipping_price_cents, low_stock_level,
    bin_picking_number, product_availability, min_purchase_quantity, max_purchase_quantity,
    free_shipping, brand_plus_name, warranty, show_product_condition, manufacturer_part_number,
    global_trade_item_number, tax_class, tax_provider_tax_code, search_keywords,
    redirect_old_url, option_set, option_set_align, stop_processing_rules,
    product_custom_fields, event_date_required, event_date_name, event_date_is_limited,
    event_date_start_date, event_date_end_date, myob_asset_acct, myob_income_acct,
    myob_expense_acct, date_added, date_modified
) VALUES (
    {product_id},
    {"'" + brand_uuid + "'" if brand_uuid else 'NULL'},
    {clean_text(slug)},
    {clean_text(name)},
    {desc},
    {clean_text(row.get('SKU', ''))},
    {parse_price(row.get('Price', ''))},
    {clean_number(row.get('Weight', ''))},
    {clean_number(row.get('Width', ''))},
    {clean_number(row.get('Height', ''))},
    {clean_number(row.get('Depth', ''))},
    'new',
    {clean_text(row.get('UPC/EAN', ''))},
    {'true' if row.get('Is Visible', 'true') != 'false' else 'false'},
    true,
    'active',
    {clean_text(row.get('Inventory Tracking', ''))},
    {clean_number(row.get('Current Stock', ''))},
    0,
    {clean_text(row.get('Page Title', ''))},
    {clean_text(row.get('Meta Description', ''))},
    {clean_text(row.get('Meta Keywords', ''))},
    {clean_text(row.get('Product URL', ''))},
    NOW(),
    NULL,
    NULL,
    {parse_price(row.get('Retail Price', ''))},
    {parse_price(row.get('Sale Price', ''))},
    {parse_price(row.get('Cost Price', ''))},
    {parse_price(row.get('Price', ''))},
    {parse_price(row.get('Fixed Shipping Cost', ''))},
    {clean_number(row.get('Low Stock', ''))},
    {clean_text(row.get('Bin Picking Number', ''))},
    NULL,
    1,
    NULL,
    {'true' if row.get('Free Shipping', 'false') == 'true' else 'false'},
    NULL,
    {clean_text(row.get('Warranty', ''))},
    false,
    {clean_text(row.get('Manufacturer Part Number', ''))},
    {clean_text(row.get('Global Trade Number', ''))},
    {clean_text(row.get('Tax Class', 'Default Tax Class'))},
    NULL,
    {clean_text(row.get('Search Keywords', ''))},
    false,
    NULL,
    'Right',
    false,
    NULL,
    false,
    NULL,
    false,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-01-01',
    '2025-01-01'
);"""
                products.append(insert)
        
        print(f"Generated {len(products)} product INSERTs")
        
        # Replace products section
        new_lines[products_start+1:products_end] = ['\n'.join(products) + '\n\n']
    
    # Write the final result
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'w') as f:
        f.writelines(new_lines)
    
    print("✅ Done! seed.sql is ready with:")
    print(f"  - {brands_fixed} brands with explicit UUIDs")
    print(f"  - {len(products)} products from CSV with proper brand_ids")
    print("  - HTML descriptions using dollar quoting")

if __name__ == '__main__':
    main()