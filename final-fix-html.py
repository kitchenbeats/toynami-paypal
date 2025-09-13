#!/usr/bin/env python3
import csv
import re
import html
from datetime import datetime

# Brand ID mappings
BRAND_MAPPING = {
    '38': '7530230c-c28d-428e-8a5c-ccd476908c30',  # Acid Rain World
    '39': 'bf9e0455-dcbd-49e4-b887-58d0120eda79',  # Mospeada
    '40': '55edbf04-244d-49fc-abe6-114606068ef6',  # Futurama
    '42': None,  # Shogun Warriors
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
    '65': None,  # Mega Man
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

def clean_html_for_postgres(html_text):
    """Clean HTML for safe PostgreSQL insertion"""
    if not html_text or html_text == '':
        return 'NULL'
    
    # Decode HTML entities
    text = html.unescape(html_text)
    
    # Remove all id attributes which cause issues
    text = re.sub(r'\s+id="[^"]*"', '', text)
    text = re.sub(r"\s+id='[^']*'", '', text)
    
    # Remove problematic type attributes
    text = re.sub(r'\s+type="[^"]*"', '', text)
    text = re.sub(r"\s+type='[^']*'", '', text)
    
    # Convert all double quotes in attributes to single quotes
    # This handles attributes like style="..." 
    def replace_attr_quotes(match):
        attr_content = match.group(1)
        # Replace double quotes with single quotes inside attributes
        return f"='{attr_content}'"
    
    text = re.sub(r'="([^"]*)"', replace_attr_quotes, text)
    
    # Now escape single quotes for PostgreSQL (double them)
    text = text.replace("'", "''")
    
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    # Remove any null bytes
    text = text.replace('\x00', '')
    
    return f"'{text}'"

def clean_text(text):
    """Clean plain text for SQL insertion"""
    if text is None or text == '':
        return 'NULL'
    # Escape single quotes by doubling them
    text = str(text).replace("'", "''")
    return f"'{text}'"

def clean_number(val):
    """Clean numeric value"""
    if val is None or val == '':
        return 'NULL'
    try:
        # Handle numeric values
        if '.' in str(val):
            return str(float(val))
        return str(int(val))
    except:
        return 'NULL'

def clean_boolean(val):
    """Convert to boolean"""
    if val in ['true', 'True', '1', True, 1]:
        return 'true'
    return 'false'

def parse_price(price_str):
    """Parse price to cents"""
    if not price_str or price_str == '':
        return 'NULL'
    try:
        # Remove $ and commas
        price_str = str(price_str).replace('$', '').replace(',', '')
        price = float(price_str)
        return str(int(price * 100))
    except:
        return 'NULL'

def create_slug(name):
    """Create URL slug from name"""
    if not name:
        return ''
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

def read_csv_products(csv_file):
    """Read and clean products from BigCommerce CSV"""
    products = []
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            product_id = row.get('ID', '').strip()
            if not product_id:
                continue
            
            # Get brand UUID
            brand_id = row.get('Brand ID', '').strip()
            brand_uuid = BRAND_MAPPING.get(brand_id) if brand_id else None
            
            # Generate slug from name
            name = row.get('Name', '')
            slug = create_slug(name)
            
            # Clean description thoroughly
            desc = row.get('Description', '')
            cleaned_desc = clean_html_for_postgres(desc)
            
            # Parse product data with proper escaping
            product = {
                'id': product_id,
                'brand_id': f"'{brand_uuid}'" if brand_uuid else 'NULL',
                'slug': clean_text(slug),
                'name': clean_text(name),
                'description': cleaned_desc,
                'sku': clean_text(row.get('SKU', '')),
                'base_price_cents': parse_price(row.get('Price', '')),
                'weight': clean_number(row.get('Weight', '')),
                'width': clean_number(row.get('Width', '')),  
                'height': clean_number(row.get('Height', '')),
                'depth': clean_number(row.get('Depth', '')),
                'condition': "'new'",
                'upc': clean_text(row.get('UPC/EAN', '')),
                'is_visible': clean_boolean(row.get('Is Visible', 'true')),
                'allow_purchases': 'true',
                'status': "'active'",
                'track_inventory': clean_text(row.get('Inventory Tracking', '')),
                'stock_level': clean_number(row.get('Current Stock', '')),
                'sort_order': '0',
                'meta_title': clean_text(row.get('Page Title', '')),
                'meta_description': clean_text(row.get('Meta Description', '')),
                'meta_keywords': clean_text(row.get('Meta Keywords', '')),
                'product_url': clean_text(row.get('Product URL', '')),
                'created_at': 'NOW()',
                'preorder_release_date': 'NULL',
                'preorder_message': 'NULL',
                'retail_price_cents': parse_price(row.get('Retail Price', '')),
                'sale_price_cents': parse_price(row.get('Sale Price', '')),
                'cost_price_cents': parse_price(row.get('Cost Price', '')),
                'calculated_price_cents': parse_price(row.get('Price', '')),
                'fixed_shipping_price_cents': parse_price(row.get('Fixed Shipping Cost', '')),
                'low_stock_level': clean_number(row.get('Low Stock', '')),
                'bin_picking_number': clean_text(row.get('Bin Picking Number', '')),
                'product_availability': 'NULL',
                'min_purchase_quantity': '1',
                'max_purchase_quantity': 'NULL',
                'free_shipping': clean_boolean(row.get('Free Shipping', 'false')),
                'brand_plus_name': 'NULL',
                'warranty': clean_text(row.get('Warranty', '')),
                'show_product_condition': 'false',
                'manufacturer_part_number': clean_text(row.get('Manufacturer Part Number', '')),
                'global_trade_item_number': clean_text(row.get('Global Trade Number', '')),
                'tax_class': clean_text(row.get('Tax Class', 'Default Tax Class')),
                'tax_provider_tax_code': 'NULL',
                'search_keywords': clean_text(row.get('Search Keywords', '')),
                'redirect_old_url': 'false',
                'option_set': 'NULL',
                'option_set_align': "'Right'",
                'stop_processing_rules': 'false',
                'product_custom_fields': 'NULL',
                'event_date_required': 'false',
                'event_date_name': 'NULL',
                'event_date_is_limited': 'false',
                'event_date_start_date': 'NULL',
                'event_date_end_date': 'NULL',
                'myob_asset_acct': 'NULL',
                'myob_income_acct': 'NULL',
                'myob_expense_acct': 'NULL',
                'date_added': "'2025-01-01'",
                'date_modified': "'2025-01-01'"
            }
            
            products.append(product)
    
    return products

def generate_product_inserts(products):
    """Generate INSERT statements for products"""
    columns = [
        'id', 'brand_id', 'slug', 'name', 'description', 'sku', 'base_price_cents',
        'weight', 'width', 'height', 'depth', 'condition', 'upc', 'is_visible',
        'allow_purchases', 'status', 'track_inventory', 'stock_level', 'sort_order',
        'meta_title', 'meta_description', 'meta_keywords', 'product_url', 'created_at',
        'preorder_release_date', 'preorder_message', 'retail_price_cents', 'sale_price_cents',
        'cost_price_cents', 'calculated_price_cents', 'fixed_shipping_price_cents',
        'low_stock_level', 'bin_picking_number', 'product_availability',
        'min_purchase_quantity', 'max_purchase_quantity', 'free_shipping', 'brand_plus_name',
        'warranty', 'show_product_condition', 'manufacturer_part_number',
        'global_trade_item_number', 'tax_class', 'tax_provider_tax_code', 'search_keywords',
        'redirect_old_url', 'option_set', 'option_set_align', 'stop_processing_rules',
        'product_custom_fields', 'event_date_required', 'event_date_name',
        'event_date_is_limited', 'event_date_start_date', 'event_date_end_date',
        'myob_asset_acct', 'myob_income_acct', 'myob_expense_acct', 'date_added', 'date_modified'
    ]
    
    inserts = []
    for product in products:
        values = []
        for col in columns:
            values.append(f"    {product.get(col, 'NULL')}")
        
        insert = f"""INSERT INTO products (
    {', '.join(columns)}
) VALUES (
{',\n'.join(values)}
);"""
        inserts.append(insert)
    
    return '\n'.join(inserts)

def generate_brand_inserts():
    """Generate brand INSERT statements with explicit UUIDs"""
    inserts = []
    
    for slug, uuid in BRAND_SLUGS.items():
        name = slug.replace('-', ' ').title()
        if slug == 'millinillions':
            name = 'MILLINILLIONS'
        elif slug == 'miyo-s-mystic-musings':
            name = "Miyo's Mystic Musings"
        elif slug == 'acid-rain-world-b2five':
            name = 'Acid Rain World B2FIVE'
        
        insert = f"INSERT INTO brands (id, slug, name, is_active) VALUES ('{uuid}', '{slug}', '{name}', true);"
        inserts.append(insert)
    
    return '\n'.join(inserts)

def main():
    # Read products from CSV
    print("Reading and cleaning products from CSV...")
    products = read_csv_products('/Volumes/Projects2025/toynami-paypal/product_20250827_234649.csv')
    print(f"Processed {len(products)} products")
    
    # Generate brand INSERTs
    print("Generating brand INSERTs...")
    brand_sql = generate_brand_inserts()
    
    # Generate product INSERTs
    print("Generating product INSERTs...")
    product_sql = generate_product_inserts(products)
    
    # Read the existing seed for structure
    print("Reading existing seed structure...")
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql.old-before-brands', 'r') as f:
        existing_seed = f.read()
    
    # Extract parts
    before_products = existing_seed.split('-- ======================================\n-- 🛍️ Products')[0]
    after_products_match = re.search(r'(-- ======================================\n-- 📁 Categories.*)', existing_seed, re.DOTALL)
    after_products = after_products_match.group(1) if after_products_match else ''
    
    # Combine everything
    final_seed = f"""{before_products}-- ======================================
-- 🏢 Brands
-- ======================================
{brand_sql}

-- ======================================
-- 🛍️ Products  
-- ======================================
{product_sql}

{after_products}"""
    
    # Write final seed
    with open('/Volumes/Projects2025/toynami-paypal/supabase/seed.sql', 'w') as f:
        f.write(final_seed)
    
    print("\n✅ Generated seed.sql with properly cleaned HTML")
    print(f"  - {len(BRAND_SLUGS)} brands with UUIDs")
    print(f"  - {len(products)} products with sanitized descriptions")
    print("  - Removed problematic id and type attributes from HTML")
    print("  - Converted double quotes to single quotes in HTML attributes")

if __name__ == '__main__':
    main()