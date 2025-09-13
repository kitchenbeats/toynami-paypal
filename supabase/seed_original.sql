-- ======================================
-- 🌱 Seed Data from CSV
-- Generated: 2025-08-10 01:50:39
-- ======================================

-- Clear existing data
TRUNCATE TABLE product_categories CASCADE;
TRUNCATE TABLE product_images CASCADE;
TRUNCATE TABLE product_variants CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE brands CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE settings CASCADE;

-- ======================================
-- 📂 Categories
-- ======================================
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('brands', 'Brands', 1, true, true);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('on-sale', 'On Sale', 2, true, true);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('convention-exclusives', 'Convention Exclusives', 3, true, true);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('new-products', 'New Products', 4, true, true);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('the-archive', 'The Archive', 5, true, true);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('announcements', 'Announcements', 6, true, true);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('pre-orders', 'Pre Orders', 7, true, true);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('products', 'Products', 8, true, false);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('hidden', 'Hidden', 9, false, false);
INSERT INTO categories (slug, name, display_order, is_active, show_in_menu) VALUES 
    ('vip', 'VIP', 10, true, false);

-- ======================================
-- 🏷️ Brands
-- ======================================
INSERT INTO brands (slug, name, is_active, featured, logo_url, banner_url, banner_url_2) VALUES 
    ('acid-rain-world', 'Acid Rain World', true, true, 'brand_images/logos/acid-rain-logo.png', 'brand_images/banners/acid-rain-world-home-banner.jpg', 'brand_images/banners/acid-rain-world-banner.jpg');
INSERT INTO brands (slug, name, is_active, featured, logo_url, banner_url, banner_url_2) VALUES 
    ('acid-rain-world-b2five', 'Acid Rain World B2FIVE', true, true, 'brand_images/logos/acid-rain-logo.png', 'brand_images/banners/acid-rain-world-home-banner.jpg', 'brand_images/banners/acid-rain-world-banner.jpg');
INSERT INTO brands (slug, name, is_active, featured, logo_url, banner_url, banner_url_2) VALUES 
    ('emily-the-strange', 'Emily the Strange', true, true, 'brand_images/logos/emily-the-strange-logo.png', 'brand_images/banners/emily-the-strange-home-banner.jpg', 'brand_images/banners/emily-the-strange-banner.jpg');
INSERT INTO brands (slug, name, is_active) VALUES 
    ('futurama', 'Futurama', true);
INSERT INTO brands (slug, name, is_active) VALUES 
    ('millinillions', 'MILLINILLIONS', true);
INSERT INTO brands (slug, name, is_active, logo_url) VALUES 
    ('macross', 'Macross', true, 'brand_images/logos/macross-logo.png');
INSERT INTO brands (slug, name, is_active, featured, banner_url, banner_url_2) VALUES 
    ('miyo-s-mystic-musings', 'Miyo''s Mystic Musings', true, true, 'brand_images/banners/miyos-mystic-musings-home-banner.jpg', 'brand_images/banners/miyos-mystic-musings-banner.jpg');
INSERT INTO brands (slug, name, is_active) VALUES 
    ('mospeada', 'Mospeada', true);
INSERT INTO brands (slug, name, is_active, featured, logo_url, banner_url, banner_url_2) VALUES 
    ('naruto', 'Naruto', true, true, 'brand_images/logos/naruto-shippuden-logo.png', 'brand_images/banners/naruto-home-banner.jpg', 'brand_images/banners/naruto-banner.jpg');
INSERT INTO brands (slug, name, is_active, featured, logo_url, banner_url, banner_url_2) VALUES 
    ('robotech', 'Robotech', true, true, 'brand_images/logos/robotech-logo.webp', 'brand_images/banners/robotech-home-banner.jpg', 'brand_images/banners/robotech-banner.jpg');
INSERT INTO brands (slug, name, is_active) VALUES 
    ('sanrio', 'Sanrio', true);
INSERT INTO brands (slug, name, is_active) VALUES 
    ('skelanimals', 'Skelanimals', true);
INSERT INTO brands (slug, name, is_active) VALUES 
    ('tulipop', 'Tulipop', true);
INSERT INTO brands (slug, name, is_active, featured, logo_url, banner_url, banner_url_2) VALUES 
    ('voltron', 'Voltron', true, true, 'brand_images/logos/voltron-logo.png', 'brand_images/banners/voltron-home-banner.jpg', 'brand_images/banners/voltron-banner.jpg');

-- ======================================
-- 🛍️ Products
-- ======================================
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    700,
    'futurama-hypnotoad-plush',
    'Futurama Hypnotoad Plush',
    'Glorify the Hypnotoad by bringing him home in super cute plush form. A deluxe plush measuring 10-inches tall, this huggable softie was modeled after the character in the animated TV show Futurama, created by Matt Groening. No one knows this guy''s origins, but it''s speculated that he''s an alien, mutant, or product of genetic engineering.',
    '1775',
    2999,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00770-6',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Futurama Hypnotoad Plush Toy',
    'Futuram Hypnotoad Plush Toy',
    'futurama, hypnotoad, plush, toy, frog, cute, toad, doll, toynami',
    '/futurama-hypnotoad-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Futurama Hypnotoad Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'futurama, hypnotoad, plush, toy, frog, cute, toad, doll, toynami',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    701,
    'comikaze-2013-exclusive-canmans-risk-oleum',
    'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM',
    'Legendary graffiti artist RISK has created "RISK-OLEUM", his version of the vinyl Canman, created as an exclusive for Stan Lee''s Comikaze 2013, and limited to 200! The Canmans are a series of vinyl figures focused on graffiti artists and the art of collecting spray paint cans.In a career spanning 30 years, RISK has impacted the evolution of graffiti as an art form in Los Angeles and worldwide. RISK gained major notoriety for his unique style and pushed the limits of graffiti further than any writer in L.A. had before: He was one of the first writers in Southern California to paint freight trains, and he pioneered writing on "heavens," or freeway overpasses. At the peak of his career he took graffiti from the streets and into the gallery with the launch of the Third Rail series of art shows, and later parlayed the name into the first authentic line of graffiti-inspired clothing.Limited to 200 worldwideBoxed Comikaze 2013 ExclusiveMoveable arms and detachable top pops off to reveal hollow storage inside7" tall',
    'CC-2013-CanMan',
    5000,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Comikaze 2013 Exclusive RISK-OLEUM Canman',
    'Comikaze 2013 Exclusive RISK-OLEUM Canman',
    'canman, canmans, graffiti, collectible, exclusive, spray paint, rustoleum, third rail, risk, risky, riskrock, artist, kelly graval, comikaze, sdcc, comicon, toynami, stash, can',
    '/comikaze-2013-exclusive-canmans-risk-oleum/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM',
    NULL,
    false,
    'CC-2013-CanMan',
    NULL,
    'Default Tax Class',
    NULL,
    'risk, canman, canmans, risk-oleum, graffiti, toy, collectible, exclusive, spray paint',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    702,
    'skelanimals-dc-robin-pen-10-deluxe-plush',
    'Skelanimals DC Robin Pen 10" Deluxe Plush',
    'Here is the comic-book crossover you never thought you''d see: the all-new Skelanimals DC Heroes! For the first time, your favorite Skelanimals pals are here in their secret identities as the World''s Greatest Super Heroes, with Pen the Penguin starring as Robin! 10" Deluxe Plush',
    '2238',
    2799,
    1.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00793-5',
    false,
    true,
    'active',
    'by product',
    12,
    0,
    'Skelanimals DC Robin Pen 10" Plush',
    'Skelanimals DC Robin Pen 10" Deluxe Plush by Toynami',
    'toynami, skelanimals,robin, batman, deluxe, plush, toy, doll, cute, cool, dc, comics, superhero, penguin',
    '/skelanimals-dc-robin-pen-10-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2799,
    0,
    3,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals DC Robin Pen 10" Deluxe Plush',
    NULL,
    false,
    '2238',
    '8-16355-00793-5',
    'Default Tax Class',
    NULL,
    'toynami, skelanimals,robin, batman, deluxe, plush, toy, doll, cute, cool, dc, comics, superhero, penguin',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    703,
    'skelanimals-deluxe-backpack-diego-bat',
    'Skelanimals Deluxe Backpack Diego (Bat)',
    'Skelanimals Deluxe Backpack Diego (Bat) Pack your favorite Skelanimals pals around with you wherever you go, with these adorable backpacks! You''ll never be alone with your favorite Skelanimals pal clinging to your shoulders! The Skelanimals Deluxe Backpack is constructed of sturdy materials, and super-soft plush fabric with a zipper closure. Measures approximately 12-inches tall.',
    '1928',
    3499,
    1.0,
    12.0,
    9.0,
    6.0,
    'new',
    '8-16355-00339-5',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals Deluxe Backpack Diego (Bat)',
    'Skelanimals Deluxe Backpack Diego (Bat)',
    'skelanimals, plush, backpack, bag, purse, tote, toy, toynami, hot topic, goth, gothic, girl, cute, diego, bat',
    '/skelanimals-deluxe-backpack-diego-bat/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Deluxe Backpack Diego (Bat)',
    NULL,
    false,
    '1928',
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, plush, backpack, bag, purse, tote, toy, toynami, hot topic, goth, gothic, girl, cute, diego, bat',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    704,
    'b2five-k6-jungle-stronghold-st2k',
    'B2Five K6 Jungle Stronghold ST2K',
    'WAVE 1K6 Jungle Stronghold ST2K set The K6 Jungle Stronghold ST2k set comes inclusive with a Stronghold vehicle developed to transform into two different modes: tank and armor mode. Also included is a 2.5 inch military pilot that is highly poseable with 21 points of articulation. Additional accessories include a heavy hand gun. Features: K6 Jungle Stronghold ST2K 2.5" Pilot Soldier Heavy Hand Gun',
    'BW1_03',
    7498,
    3.0,
    12.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-k6-jungle-stronghold-st2k/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    7498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'B2Five K6 Jungle Stronghold ST2K',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    705,
    'acid-rain-sol-commander-re-run-2017',
    'Acid Rain Sol Commander [Re-run] 2017',
    'Acid Rain Sol Commander [Re-run] 2017 First released in 2014, Acid Rain Sol Commander is back! For a limited time you can now get your hands on this amazing figure which now comes with new box packaging! A rifle gun is also included. Sols are armed with a long barrelled automatic rifles to ensuring they can keep enemy attacks at bay from distance. This gives the lightly armored pilots time to mobilize their vehicles while ensuring that the threat of close quarter explosive devices are kept to a minimum. It is likely that Sol Commanders are adept at piloting but would also receive additional training in battlefield tactics, schematics of their vehicles, repair/engineering skills and communication abilities. Features: 1 Sol Commander 1 Rifle',
    'AR-1700S',
    2200,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-sol-commander-re-run-2017/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Sol Commander [Re-run] 2017',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    706,
    'acid-rain-stronghold-marine',
    'Acid Rain Stronghold (Marine)',
    'Acid Rain Stronghold (Marine) The Stronghold is a 1:18 scale fully-painted military action vehicle with highly-detailed weathering effect, can switch between "Tank mode" and "Armor mode". The cockpit with hatch features light-up monitors inside. (LR44 batteries not included) A whopping 20 points of articulation in Armor mode, and a removable cannonball, including Bonus tank treads replacement pack. The mighty Stronghold is built to accommodate any 3.75" figures. Stronghold (Marine) 3.75" pilot figure is NOT included',
    'AR-1400S',
    15999,
    4.0,
    12.0,
    12.0,
    10.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-stronghold-marine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    15999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Stronghold (Marine)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    707,
    'naruto-shippuden-poseable-action-figure-itachi',
    'Naruto Shippuden Poseable Action Figure - Itachi',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... We are proud to announce the first series in the Naruto Poseable action figures! You can choose from three of your favorite characters: Naruto, Kakashi and Itachi. Each figure is fully articulated and features accessories and display stands! 4" tall Itachi Figure Multiple points of articulation Comes with extra accessories and stand',
    '11610',
    2499,
    1.0,
    9.0,
    7.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-poseable-action-figure-itachi/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Poseable Action Figure - Itachi',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    708,
    'robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-roy-fokker-volume-3',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - ROY FOKKER VOLUME 3',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - ROY FOKKER VOLUME 3"Micronian" was the phrase used by Zentraedi to describe humans. It referred to the humans'' micronized size. The phrase could presumably be used any other race smaller than the Zentraedi as there is a legend saying that they should not harm a "Micronian" planet.Each set is fully equipped with 2 pilots; one cockpit pilot and one standing pilot. This Veritech stands approximately 6 inches tall, is fully articulated and can be converted into three different modes: Fighter, Battloid or Gerwalk. The Veritech Micronian Pilot Collection will each be packed in their limited-edition boxes which, when collected in its entirety, will showcase an image of all your favorite Robotech pilots!',
    '',
    3499,
    1.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-roy-fokker-volume-3/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - ROY FOKKER VOLUME 3',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    709,
    'robotech-new-generation-super-deformed-blind-box-figurines',
    'Robotech New Generation Super Deformed Blind Box Figurines',
    'Robotech New Generation Super Deformed Blind Box Figurines The wait is finally over! Your favorite Cyclones and Alpha fighters get an adorable chibi makeover in this New Generation Super Deformed Blind Box Assortment.The Robotech Super Deformed Blind Box tray includes: Alpha Fighter VFA-6H (BLUE) Alpha Fighter VFA-6HI (GREEN) Alpha Fighter VFA-6HZ (RED) Scott Bernard Cyclone VR-052F (RED) Rand Cyclone VR-052T (BLUE) Note: These figurines come blind boxed. You will be receiving a random figure. No exchanges or returns.',
    '10060',
    1400,
    0.4,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-new-generation-super-deformed-blind-box-figurines/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1400,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech New Generation Super Deformed Blind Box Figurines',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/05/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    710,
    'deluxe-6-pvc-statue-renji',
    'Deluxe 6" PVC Statue: Renji',
    'BLEACH, created by Tite Kubo, made its debut as manga in the pages of SHONEN JUMP, made the leap to television in Japan in 2004, and can currently be seen on CARTOON NETWORK''s Adult Swim. BLEACH tells the story of Ichigo, a high-school student with the ability to see ghosts, and his adventures with the Soul Reaper Rukia, as they search for ghosts and cleanse their evil spirits. Renji is the Squad 6 lieutenant. Both Renji and Rukia grew up in the Rukon District where they became steadfast friends. His Zanpaku-to''s name is Zabimaru. Deluxe 6" PVC Statue: Renji 6" tall Comes with extra accessories and stand',
    '',
    2499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/deluxe-6-pvc-statue-renji/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Deluxe 6" PVC Statue: Renji',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    711,
    'tulipop-vinyl-keychain-gloomy',
    'Tulipop Vinyl Keychain - Gloomy',
    'Toynami is proud to announce, TULIPOP, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by a mother of two, Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Vinyl Keychain - Gloomy',
    '10840',
    499,
    0.4,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-vinyl-keychain-gloomy/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Vinyl Keychain - Gloomy',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    712,
    'macross-saga-retro-transformable-1-100-vf-1j-milia-valkyrie',
    'Macross Saga: Retro Transformable 1/100 VF-1J Milia Valkyrie',
    'MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION - MILIA VALKYRIE The Macross Saga A gigantic spaceship crash lands on Earth, foreshadowing the arrival of an alien armada bent on war and destruction. The world unites to unlock the secrets of its miraculous alien technology knows as Robotech to defend the world against impending invasion. The challenges they would face would be greater than anyone could have imagined... Macross is a Japanese science fiction anime series that takes place ten years after an alien space ship the size of a city crashed onto South Atalia Island. The space ship was found and reconstructed by humans who turned it into the SDF-1 Macross. It''s up to Earth Defense Pilots to defend and save our world! Toynami is proud to offer five new editions from the MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION with the VF-1J 1/100 Milia Valkyrie. Features: Transformable to three modes: Battroid, Gerwalk & Fighter Highly poseable with over 30 points of articulation Stands over 5" tall in Battroid Mode & 6" long in Fighter Mode Interchangeable hands, missiles & accessories included Each comes with pilot Includes adjustable display stand for maximum versatility & poseability Classic 1980''s retro packaging Don''t miss out on the ultimate in MACROSS SAGA collectibles!',
    '10940',
    5999,
    1.0,
    9.0,
    6.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    22,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-saga-retro-transformable-1-100-vf-1j-milia-valkyrie/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    2,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Saga: Retro Transformable 1/100 VF-1J Milia Valkyrie',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    713,
    'robotech-vf-1s-skull-leader-shirt',
    'Robotech VF-1S Skull Leader Shirt',
    'Officially Licensed Style: Tri-Blend Jersey Unisex T-Shirt Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% RayonCollar: Crew NeckFit Type: ClassicSize Range: S-3XL',
    '',
    3500,
    2.0,
    15.0,
    11.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-vf-1s-skull-leader-shirt/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech VF-1S Skull Leader Shirt',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/27/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    714,
    'toys-alliance-millinillions-mi-k07c-monster-child',
    'Toy''s Alliance MILLINILLIONS MI-K07C Monster Child',
    '1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    4,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k07c-monster-child/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Toy''s Alliance MILLINILLIONS MI-K07C Monster Child',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    715,
    'futurama-kif-kroker-plush',
    'Futurama Kif Kroker Plush',
    'If you''ve ever needed a scapegoat at work, you can''t find a better one than this Futurama Kif Kroker Series 2 Plush! Measuring 10-inches tall, this soft fellow was modeled after the character from the animated TV show Futurama, created by Matt Groening. Add a little Futurama fun to your work desk with the Futurama Kif Kroker Series 2 Plush! Ages 8 and up. Need a scapegoat? Lieutenant Kif Kroker from Matt Groening''s Futurama TV show! Deluxe 10-inch plush. This Futurama plush makes a great desk or couch decoration!',
    '1776',
    2999,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00771-3',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Futurama Kif Kroker Plush',
    'Futurama Kif Kroker Plush Toy',
    'futurama, kif, kroker, plush, toy, cute, hug, cuddly, toynami, stuffed, alien',
    '/futurama-kif-kroker-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Futurama Kif Kroker Plush',
    NULL,
    false,
    NULL,
    '8-16355-00771-3',
    'Default Tax Class',
    NULL,
    'futurama, kif, kroker, plush, toy, cute, hug, cuddly, toynami, stuffed, alien',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    716,
    'skelanimals-deluxe-backpack-marcy-monkey',
    'Skelanimals Deluxe Backpack Marcy (Monkey)',
    'Skelanimals Deluxe Backpack Marcy (Monkey) Pack your favorite Skelanimals pals around with you wherever you go, with these adorable backpacks! You''ll never be alone with your favorite Skelanimals pal clinging to your shoulders! The Skelanimals Deluxe Backpack is constructed of sturdy materials, and super-soft plush fabric with a zipper closure. Measures approximately 12-inches tall.',
    '1984',
    3499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    '8-16355-00393-7',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Skelanimals Deluxe Backpack Marcy (Monkey)',
    'Skelanimals Deluxe Backpack Marcy (Monkey)',
    'skelanimals, plush, backpack, bag, purse, tote, toy, toynami, hot topic, goth, gothic, girl, cute, monkey, marcy',
    '/skelanimals-deluxe-backpack-marcy-monkey/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Deluxe Backpack Marcy (Monkey)',
    NULL,
    false,
    '1984',
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, plush, backpack, bag, purse, tote, toy, toynami, hot topic, goth, gothic, girl, cute, monkey, marcy',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    717,
    'naruto-six-paths-sage-mode-1-1-bust',
    'Naruto Six Paths Sage Mode 1:1 Bust',
    'Toynami is pleased to announce the expansion of its popular NARUTO SHIPPUDEN product line, with Life-Size 1:1 Scale Busts! Naruto also ended up receiving the Six Paths Senjutsu from the Sage of Six Paths and when combined with his Sage Mode, it gave rise to one of his strongest forms called the Six Paths Sage Mode. In this form, Naruto became strong enough to fight the likes of Madara Uchiha and even Kaguya Otsutsuki. Furthermore, Six Paths Senjutsu allowed him to create the Truth-Seeking Balls and made him incredibly versatile in combat. His sensory powers were heightened to the next level and his strength rose to a level great enough to overpower even the strongest of enemies. Naruto''s first taste of the Six Paths Sage Mode came after he fell at the hands of Madara Uchiha in the Fourth Great Ninja War. Having Kurama ripped from his body, Naruto was on the brink of death and while the likes of Gaara and Minato were attempting to save him, Naruto met the spirit of Hagoromo Otsutsuki. Being the reincarnation of Asura Otsutsuki, Naruto was offered half the power of the Sage, while Sasuke was given the other half. Upon returning to consciousness, Naruto had gained the incredible ability of the Six Paths Sage Mode. To put it simply, the Six Paths Sage Mode is a power that Hagoromo Otsutsuki gifted to him for having a strong will and the guts to never give up. This power is quite similar to Sage Mode in that it makes use of natural energy, or Senjutsu chakra, however, the scale at which it allows him to perform techniques is much bigger. Limited to 300 units!!',
    '12600',
    129999,
    41.0,
    32.0,
    28.0,
    14.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-six-paths-sage-mode-1-1-bust/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    129999,
    129999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Six Paths Sage Mode 1:1 Bust',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    718,
    'unkl-dc-heroes-villains-blind-box-collection-full-tray-of-12',
    'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12',
    'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12 The creative minds at UNKL have put a brand new spin on iconic characters from the DC Universe with the UNKL Presents: DC Heroes & Villains Blind Box Collection! These unique 3" vinyl figures on UNKL''s signature UNIPO body, will feature: Batman Superman The Flash Harley Quinn The Joker Mr. Freeze (the chase!) A full set of characters is guaranteed in each Tray of 12 Blind Boxes. Figures not sold separately. A must have for DC fans and urban vinyl collectors alike!',
    '1734',
    13999,
    3.0,
    10.0,
    5.0,
    11.0,
    'new',
    '8-16355-00800-0',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'UNKL DC Heroes & Villains Blind Box Collection - Full Tray',
    'UNKL DC Heroes & Villains Blind Box Collection - Full Tray',
    'unkl, dc, comics, superhero, villain, vinyl, urban, unipo, blind, box, figures, cool, collectible',
    '/unkl-dc-heroes-villains-blind-box-collection-full-tray-of-12/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    13999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12',
    NULL,
    false,
    NULL,
    '8-16355-00800-0',
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    719,
    'tulipop-vinyl-keychain-miss-maddy',
    'Tulipop Vinyl Keychain - Miss Maddy',
    'Toynami is proud to announce, TULIPOP, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by a mother of two, Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Vinyl Keychain - Miss Maddy',
    '10850',
    499,
    0.4,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-vinyl-keychain-miss-maddy/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Vinyl Keychain - Miss Maddy',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    720,
    'futurama-morbo-plush',
    'Futurama Morbo Plush',
    'Add a little Futurama fun to your desk with the Futurama Morbo Series 2 Plush! At 10-inches tall, this Morbo the Annihilator Plush was modeled after the character from the animated TV show Futurama, created by Matt Groening. A co-host anchoring "Entertainment and Earth Invasion Tonite" with puny human Linda, Morbo never lets an opportunity to let humans know how inferior they are pass him by, so you can imagine what a great desk buddy he makes! Ages 8 and up. Morbo the Annihilator, eager to serve you. Deluxe 10-inch plush from Matt Groening''s Futurama TV show. This Futurama plush makes great desk or couch decoration!',
    '1777',
    2999,
    2.0,
    10.0,
    10.0,
    10.0,
    'new',
    '8-16355-00772-0',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Futurama Morbo Plush',
    'Futurama Morbo Plush Toy',
    'Futurama, morbo, plush, toy, cute, cuddly, stuffed, alien, toynami, matt groening',
    '/futurama-morbo-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Futurama Morbo Plush',
    NULL,
    false,
    NULL,
    '8-16355-00772-0',
    'Default Tax Class',
    NULL,
    'Futurama, morbo, plush, toy, cute, cuddly, stuffed, alien, toynami, matt groening',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    721,
    'little-embers-blind-box-figurine',
    'Little Embers Blind Box Figurine',
    '"The little critters and creatures from Miyo''s Mystic Musings are born from my dreams, meditations and visions from other worlds. My wish is to share my world and my insights with you. Hopefully they will brighten this reality we live in today, with a little quirkiness and fun while still putting a smile on your face." - Miyo Nakamura LITTLE EMBERS When sitting in front of a friendly fire, maybe with a cup of cocoa wrapped in a cozy blanket on a winter''s night or perhaps roasting marshmallows with friends around a summer campfire... There is a moment when the flames die down leaving the logs glowing red. Then, you hear it, a slight crackle as a spent log falls apart and embers fly up into the air. That is the moment when Little Baby Embers are born!You may not see them as they play in the hearth amongst the ashes, covered in soot. But remember they are there before you go poking about in the ashes! If you are lucky, you might see a puff of a dragon''s kiss!The Little Embers Blind Box Figurines are approximately 2.5" tall and feature: Soot Sparks Cinder Ash Flames PURCHASED INDIVIDUALLY: The figurines come blind boxed so you will be receiving a random figure. No exchanges or returns.',
    '14500',
    1200,
    0.4,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-embers-blind-box-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Embers Blind Box Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    722,
    'robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-max-sterling-volume4',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MAX STERLING VOLUME4',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MAX STERLING VOLUME 4"Micronian" was the phrase used by Zentraedi to describe humans. It referred to the humans'' micronized size. The phrase could presumably be used any other race smaller than the Zentraedi as there is a legend saying that they should not harm a "Micronian" planet.Each set is fully equipped with 2 pilots; one cockpit pilot and one standing pilot. This Veritech stands approximately 6 inches tall, is fully articulated and can be converted into three different modes: Fighter, Battloid or Gerwalk. The Veritech Micronian Pilot Collection will each be packed in their limited-edition boxes which, when collected in its entirety, will showcase an image of all your favorite Robotech pilots!',
    '',
    3499,
    1.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-max-sterling-volume4/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MAX STERLING VOLUME4',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    723,
    'acid-rain-sand-infantry',
    'Acid Rain Sand Infantry',
    'Acid Rain Sand Infantry (revised version of Agurts Infantry) Very similar to the Agurts Infantry figure which was released in 2014, the new and improved Sand Infantry comes equip with heavy handgun, sub machine gun and a mini gun. Just as Agurts Infantry, Sand infantry represents the general issue foot soldier in the regions of Agurts and Zamaii. They are heavily involved in the invasion from both Omangans and Soil Ghosts and are responsible for keeping any marauding forces at bay. Although some divisions are well armed, the troops have limited armor, their true strength comes in the form of their large numbers placing trust in decisions made by their superiors. Features: Sand Infantry Heavy Hand Gun Submachine Gun Mini Gun',
    'AR-1710S',
    2399,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-sand-infantry/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2399,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Sand Infantry',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    724,
    'robotech-vf-1j-rick-hunter-shirt',
    'Robotech VF-1J Rick Hunter Shirt',
    'Officially Licensed Style: Tri-Blend Jersey Unisex T-Shirt Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% RayonCollar: Crew NeckFit Type: ClassicSize Range: S-3XL',
    '',
    3500,
    2.0,
    15.0,
    11.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-vf-1j-rick-hunter-shirt/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech VF-1J Rick Hunter Shirt',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    725,
    'comic-con-2016-exclusive-robotech-vf-1d-vt-102',
    'Comic Con 2016 Exclusive: Robotech VF-1D (VT-102)',
    'The Comic Con Exclusive Robotech VF-1D Trainer which features an exclusive paint deco is fully transformable to three modes (Fighter, Guardian and Battloid). Get your orders in now or while supplies last! You won''t want to miss out! The Robotech VF-1D Trainer is limited to 500 units.',
    'CC2016-Robotech VF 1D',
    6995,
    3.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/comic-con-2016-exclusive-robotech-vf-1d-vt-102/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6995,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Comic Con 2016 Exclusive: Robotech VF-1D (VT-102)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    726,
    'b2five-88th-sand-deluxe',
    'B2Five 88th Sand Deluxe',
    'WAVE 188th Sand Deluxe set The 88th Sand Deluxe set comes fully equipped with all your favorites! The Stronghold ST1s vehicle which was developed to transform into tank and armor mode. The Speeder MK1s vehicle which was developed to transform into a speeder and walker mode. Two 2.5 inch military pilots are also included, these figures are highly poseable with 21 points of articulation. Additional accessories include a rifle and heavy hand gun. Features: (x2) 2.5" Pilot Soldier Stronghold ST1s vehicle Speeder MK1s vehicle Heavy Hand Gun Riffle',
    'BW1_04',
    10399,
    3.0,
    14.0,
    10.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-88th-sand-deluxe/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    10399,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'B2Five 88th Sand Deluxe',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    727,
    'futurama-hypnotoad-coin-bank',
    'Futurama Hypnotoad Coin Bank',
    'All glory to the Hypnotoad! The 31st-century star of Everybody Loves Hypnotoad, the Hypnotoad will keep your money safe by hypnotizing those who would steal your loose change with this Hypnotoad Bank! This hollow 6" vinyl figure features a coin slot and opening at it''s base for stashing all of that loose change. Packaged in collectible window box, this is a perfect item for any fan of Futurama.',
    '1781',
    2999,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00808-6',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Futurama Hypnotoad Vinyl Coin Bank',
    'Futurama Hypnotoad Vinyl Coin Bank',
    'futurama, hypnotoad, coin, bank, money, change, piggy, toynami, frog, toad, glory, hail',
    '/futurama-hypnotoad-coin-bank/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Futurama Hypnotoad Coin Bank',
    NULL,
    false,
    NULL,
    '8-16355-00808-6',
    'Default Tax Class',
    NULL,
    'futurama, hypnotoad, coin, bank, money, change, piggy, toynami, frog, toad, glory, hail',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    728,
    'naruto-shippuden-poseable-action-figure-pain',
    'Naruto Shippuden Poseable Action Figure - Pain',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... We are proud to announce the second series in the Naruto Poseable action figures! You can choose from three of your favorite characters: Pain, Gaara and Sasuke. Each figure is fully articulated and features accessories and display stands! 4" tall Pain Figure Over 20 points of articulation Multiple interchangeable hands Display stand included',
    '11720',
    2499,
    1.0,
    9.0,
    7.0,
    5.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-poseable-action-figure-pain/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    1748,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Poseable Action Figure - Pain',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    729,
    'toys-alliance-millinillions-mi-k08-lightning',
    'Toy''s Alliance MILLINILLIONS MI-K08 Lightning',
    '1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    7,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k08-lightning/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Toy''s Alliance MILLINILLIONS MI-K08 Lightning',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    730,
    'naruto-shippuden-poseable-action-figures-set-of-3',
    'Naruto Shippuden Poseable Action Figures (Set of 3)',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... We are proud to announce the first series in the Naruto Poseable action figures! With your favorite characters: Naruto, Kakashi and Itachi. Each figure is fully articulated and features accessories and display stands! 4" tall Naruto Figure 4" tall Kakashi Figure 4" tall Itachi Figure Multiple points of articulation Comes with extra accessories and stand',
    '11600',
    5499,
    2.0,
    10.0,
    10.0,
    10.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-poseable-action-figures-set-of-3/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Poseable Action Figures (Set of 3)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    731,
    'acid-rain-stronghold-sand',
    'Acid Rain Stronghold (Sand)',
    'Acid Rain Stronghold (Sand) The Stronghold is a 1:18 fully-painted military action vehicle with highly-detailed weathering effect, can switch between "Tank mode" and "Armor mode". The cockpit with hatch features light-up monitors inside. (LR44 batteries not included) A whopping 20 points of articulation in Armor mode, and a removable cannonball, including Bonus tank treads replacement pack. The mighty Stronghold is built to accommodate any 3.75" figures. Stronghold (Sand) 3.75" pilot figure is NOT included',
    'AR-1410S',
    15999,
    4.0,
    12.0,
    12.0,
    10.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-stronghold-sand/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    15999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Stronghold (Sand)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    732,
    'comic-con-2016-exclusive-gold-sonic-x-hello-kitty-clip-on-plush',
    'Comic Con 2016 Exclusive: Gold Sonic x Hello Kitty Clip On Plush',
    'Toynami and Sanrio are at it again, mashing up their legendary HELLO KITTY license with another mammoth property! This time, the world of SONIC THE HEDGEHOG will mash-up with HELLO KITTY and her friends. Gold Sonic/ Hello Kitty Clip on plush was debuted at this year''s NYCC!! Get your now while supplies last! Limited to 1,000 Worldwide! 5" Clip On Plush',
    'CC2016-Sonic x HK',
    1500,
    0.9,
    7.0,
    5.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/comic-con-2016-exclusive-gold-sonic-x-hello-kitty-clip-on-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1500,
    0,
    3,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2016 Exclusive: Gold Sonic x Hello Kitty Clip On Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    733,
    'macross-saga-retro-transformable-1-100-vf-1a-valkyrie',
    'Macross Saga: Retro Transformable 1/100 VF-1A Valkyrie',
    'MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION - VF-1A VALKYRIE The Macross Saga A gigantic spaceship crash lands on Earth, foreshadowing the arrival of an alien armada bent on war and destruction. The world unites to unlock the secrets of its miraculous alien technology knows as Robotech to defend the world against impending invasion. The challenges they would face would be greater than anyone could have imagined... Macross is a Japanese science fiction anime series that takes place ten years after an alien space ship the size of a city crashed onto South Atalia Island. The space ship was found and reconstructed by humans who turned it into the SDF-1 Macross. It''s up to Earth Defense Pilots to defend and save our world! Toynami is proud to offer five new editions from the MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION with the VF-1A 1/100 Valkyrie. Features: Transformable to three modes: Battroid, Gerwalk & Fighter Highly poseable with over 30 points of articulation Stands over 5" tall in Battroid Mode & 6" long in Fighter Mode Interchangeable hands, missiles & accessories included Each comes with pilot Includes adjustable display stand for maximum versatility & poseability Classic 1980''s retro packaging Don''t miss out on the ultimate in MACROSS SAGA collectibles!',
    '10950',
    5999,
    1.0,
    9.0,
    6.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    20,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-saga-retro-transformable-1-100-vf-1a-valkyrie/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    2,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Saga: Retro Transformable 1/100 VF-1A Valkyrie',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    734,
    'comikaze-2013-exclusive-hello-kitty-blanka-plush',
    'COMIKAZE 2013 Exclusive: Hello Kitty Blanka Plush',
    'Toynami celebrates an epic genre and culture combination with STREET FIGHTER X SANRIO(R). With a shock of bright orange hair and gamma ray green skin, this Hello Kitty plush embodies all that is Blanka of Street Fighter, right down to her capoeira skills! Only 1000 were made for Stan Lee''s Comikaze Expo 2013. Available in very limited quantity. Limited to 1000 worldwide Comikaze 2013 Exclusive 12" Plush',
    'CK2013-Blanka',
    4999,
    2.0,
    9.0,
    13.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Comikaze 2013 Exclusive Sanrio x Streetfighter Hello Kitty Blanka Plush',
    'Comikaze 2013 Exclusive Sanrio x Streetfighter Hello Kitty Blanka Plush',
    'hello kitty, blanka, plush, cute, toy, doll, streetfighter, sanrio, sdcc, comicon, exclusive, green, toynami',
    '/comikaze-2013-exclusive-hello-kitty-blanka-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'COMIKAZE 2013 Exclusive: Hello Kitty Blanka Plush',
    NULL,
    false,
    'CK2013-Blanka',
    NULL,
    'Default Tax Class',
    NULL,
    'hello kitty, blanka plush, cute, toy, doll, streetfighter, sanrio, sdcc, comicon, exclusive',
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    735,
    'tulipop-vinyl-keychain-fred',
    'Tulipop Vinyl Keychain - Fred',
    'Toynami is proud to announce, TULIPOP, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by a mother of two, Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Vinyl Keychain - Fred',
    '10870',
    499,
    0.4,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-vinyl-keychain-fred/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Vinyl Keychain - Fred',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    736,
    'little-nessies-limited-edition-iridescent-figurines-set-convention-exclusive',
    'Little Nessies Limited Edition Iridescent Figurines Set-Convention Exclusive!',
    'Little Nessies Limited Edition Iridescent Figurines Set - Convention Exclusive! Right after a rainfall, when the air smells crisp and the sun starts peeking through the clouds, look down at a freshly created puddle. If you see a rainbow reflected within the rippling waters, close your eyes and make a wish. You might be surprised at what you get a glimpse of! Rainbow dappled puddles are where shy but mischievous Nessies emerge to play, splashing each other with their tiny flippers, and bathing in the sparkling light. "The little critters and creatures from Miyo''s Mystic Musings are born from my dreams, meditations and visions from other worlds. My wish is to share my world and my insights with you. Hopefully they will brighten this reality we live in today, with a little quirkiness and fun while still putting a smile on your face." - Miyo Nakamura Officially licensed by Miyo. This exclusive limited edition iridescent set comes packed 5 styles in one box: Waves, Misty, Splash, Flow and exclusive Frost nessie! Each one is approximately 2.5" tall. Artist: Miyo, sculptor and creator of Miyo''s Mystic Musings. Only 500 sets produced! Limit 2 per customer PLEASE NOTE ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'D-CON2019',
    4999,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-nessies-limited-edition-iridescent-figurines-set-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Nessies Limited Edition Iridescent Figurines Set-Convention Exclusive!',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    737,
    'little-embers-plush',
    'Little Embers Plush',
    'Introducing Miyo''s Mystic Musing''s Little Embers now as PLUSH! The Little Embers Deluxe Plush are approximately 7" tall and feature plastic eyes, bendable wire wings, poseable limbs and magnetic paws. When sitting in front of a friendly fire, maybe with a cup of cocoa wrapped in a cozy blanket on a winter''s night or perhaps roasting marshmallows with friends around a summer campfire... There is a moment when the flames die down leaving the logs glowing red. Then, you hear it, a slight crackle as a spent log falls apart and embers fly up into the air. That is the moment when Little Baby Embers are born! You may not see them as they play in the hearth amongst the ashes, covered in soot. But remember they are there before you go poking about in the ashes! If you are lucky, you might see a puff of a dragon''s kiss!',
    '',
    1998,
    0.5,
    2.0,
    7.0,
    2.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-embers-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    1798,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Embers Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    738,
    'skelanimals-dc-heroes-harley-quinn-plush',
    'Skelanimals / DC Heroes Harley Quinn Plush',
    'Skelanimals / DC Heroes Girls of Gotham City Plush These adorable 10-inch plushes transplant everyone''s favorite Skelanimals into the dark, gritty world of BATMAN''s Gotham City! Choose your favorite or collect them all! Skelanimals Marcy as DC Hero Harley Quinn 10" Tall Plush',
    '2239',
    2499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/skelanimals-dc-heroes-harley-quinn-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals / DC Heroes Harley Quinn Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    739,
    'acid-rain-reborn-trooper',
    'Acid Rain Reborn Trooper',
    'Acid Rain Reborn Trooper Reborn Trooper of the Omanga Military is highly poseable with 30 points of articulation. This 3.75" military action figure is fully-painted with highly-detailed weathering effects. Features: 3.75" Reborn Trooper OM28R Pulse Rifle Storage Case',
    'AR-1680S',
    2799,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-reborn-trooper/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2799,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Reborn Trooper',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    740,
    'robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-miriya-sterling-volume-5',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MIRIYA STERLING VOLUME 5',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MIRIYA STERLING VOLUME 5"Micronian" was the phrase used by Zentraedi to describe humans. It referred to the humans'' micronized size. The phrase could presumably be used any other race smaller than the Zentraedi as there is a legend saying that they should not harm a "Micronian" planet.Each set is fully equipped with 2 pilots; one cockpit pilot and one standing pilot. This Veritech stands approximately 6 inches tall, is fully articulated and can be converted into three different modes: Fighter, Battloid or Gerwalk. The Veritech Micronian Pilot Collection will each be packed in their limited-edition boxes which, when collected in its entirety, will showcase an image of all your favorite Robotech pilots!',
    '',
    3499,
    1.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-miriya-sterling-volume-5/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MIRIYA STERLING VOLUME 5',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    741,
    'futurama-nibbler-knit-hat',
    'Futurama Nibbler Knit Hat',
    'Put Nibbler on your head! This Futurama Nibbler Knit Hat is beanie shaped like Nibbler''s head, and it will also keep you warm. What more could you want? It''s one of the best Futurama products ever! Ages 4 and up.',
    '1790',
    1499,
    1.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00776-8',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Futurama Nibbler Knit Hat',
    'Futurama Nibbler Knit Hat',
    'futurama, nibbler, knit, hat, beanie, cute, costume, cosplay, toynami, matt groening',
    '/futurama-nibbler-knit-hat/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Futurama Nibbler Knit Hat',
    NULL,
    false,
    NULL,
    '8-16355-00776-8',
    'Default Tax Class',
    NULL,
    'futurama, nibbler, knit, hat, beanie, cute, costume, cosplay, toynami, matt groening',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    742,
    'b2five-robotech-mospeada-transformable-cyclone-rand',
    'B2Five Robotech Mospeada Transformable Cyclone - Rand',
    'B2Five, the same manufacturer who brought Acid Rain and Votoms to the 1/28 scale collectible world, introduces the Veritech Cyclone from the Robotech New Generation Saga. Each model can be fully transformable from Cyclone to Robot mode. Having over 21 points of articulation, this Mecha is a must-have for all Robotech fans! 2.5" RAND FIGUREVR-052T BATTLER CYCLONESTANDARD JOINT FOR INTERCHANGEABLE PARTSFULL ARTICULATION AND POSEABLE21 JOINTS ACTION FIGURE IS INCLUDED Includes: Base stand x1, EP-40 40mm pulse particle beam gun x1, Arm armor x2',
    '',
    5999,
    1.0,
    7.0,
    8.5,
    3.5,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-robotech-mospeada-transformable-cyclone-rand/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech B2Five Robotech Mospeada Transformable Cyclone - Rand',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/04/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    743,
    'b2five-marine-sieger-stronghold-st2m',
    'B2Five Marine Sieger Stronghold ST2M',
    'WAVE 2aMarine Sieger Stronghold The Marine Sieger Stronghold ST2M set comes inclusive with a Stronghold vehicle developed to transform into two different modes: tank and armor mode. Also included is a 1:28 scale military pilot that is highly poseable with 21 points of articulation. Additional accessories include a Riffle gun. Features: 1 K6 Jungle Stronghold ST2K 1 Pilot Soldier 1 Riffle',
    'BW2_01',
    7498,
    2.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-marine-sieger-stronghold-st2m/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    7498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'B2Five Marine Sieger Stronghold ST2M',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    744,
    'macross-zentradi-regault-tactical-battlepod-vinyl-figure',
    'Macross Zentradi (Regault) Tactical Battlepod Vinyl Figure',
    'Macross Zentradi (Regault) Tactical Battlepod Vinyl Figure 2010 Convention Exclusive! In scale with our 1/100 superposeable action figure line, we''re offering the Zentradi (Regault) Tactical Battlepod Vinyl Figure, featuring the movie''s deco scheme! Limited in production to 1,000 pieces.',
    '',
    7998,
    3.0,
    11.0,
    7.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-zentradi-regault-tactical-battlepod-vinyl-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    7998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Zentradi (Regault) Tactical Battlepod Vinyl Figure',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    745,
    'comic-con-2015-exclusive-acid-rain-green-jeep-green-sol-commander',
    'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander',
    'Acid Rain gets nostalgic with an American classic! Revisit childhood memories of toy soldier battles with the Acid Rain Green Jeep which includes a fully articulated Green Sol Commander 1:18 scale figure. All Acid Rain exclusives are notorious for instantly selling out, so be sure to come early for yours! Limited to 1500 pieces Worldwide, 300 US',
    'CC2015-AcidRain',
    6998,
    3.0,
    10.0,
    10.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    1,
    'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander',
    'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander',
    'comic con, sdcc, exclusive, acid rain, oritoy, green, jeep, army, men, man, military, toy',
    '/comic-con-2015-exclusive-acid-rain-green-jeep-green-sol-commander/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'comic con, sdcc, exclusive, acid rain, oritoy, green, jeep, army, men, man, military, toy',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    746,
    'acid-rain-amm-prospector',
    'Acid Rain AMM Prospector',
    'Acid Rain AMM ProspectorAcid Rain presents the first female character in the 1:18 scale Acid Rain series.AMM (Apis mellifera mellifera), a security unit employed by the multi-national corporation called Beehive, is responsible for protecting Beehive''s staff as it travels the globe in search of honey, a precious commodity in the new, wrecked world. The AMM Prospector is highly articulated, and includes weapons, a backpack and helmet.Features: 1 AMM Prospector 1 Helmet 1 Back pack 2 Pistols 1 Submachine gun',
    'AR-1760S',
    2999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-amm-prospector/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain AMM Prospector',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    747,
    'robotech-poseable-action-figures-set-of-5',
    'Robotech Poseable Action Figures (Set of 5)',
    'ROBOTECH RETRO-STYLE ACTION FIGURES (Set of 5) Weekday afternoon cartoons, action figures and ROBOTECH always equaled a happy childhood! Now that feeling is back with this brand-new assortment of ROBOTECH action figures! All your favorite ROBOTECH characters are here, fully articulated and featuring removable helmets and display stands! 4.25" tall Figures: Roy Fokker, Rick Hunter, Max Sterling, Miriya & Minmei Multiple points of articulation Comes with removable helmet and stand',
    '11470',
    5999,
    1.0,
    10.0,
    7.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-poseable-action-figures-set-of-5/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech Poseable Action Figures (Set of 5)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    748,
    'sdcc-2013-exclusive-futurama-destructor-gender-bender-box-set',
    'SDCC 2013 Exclusive: Futurama Destructor Gender Bender Box Set',
    'Futurama fans, you asked for it and now it''s here! Introducing the limited edition Destructor - Gender Bender box set! This set comes complete with Destructor and the previously unreleased Gender Bender figure packaged together in this exclusive box set. This is a must have for Futurama fans and collectors alike!Limited to 2000 worldwideBoxed San Diego Comic Con 2013 ExclusiveMeasures 12" x 8" x 14", 4 lbs.',
    'CC-2013-Destructor',
    7498,
    5.0,
    14.0,
    14.0,
    8.0,
    'new',
    '8-16355-00769-0',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'SDCC 2013 Exclusive Futurama Destructor and Gender Bender Box Set',
    'SDCC 2013 Exclusive Futurama Destructor and Gender Bender Box Set',
    'toy, collectible, exclusive, sdcc, comicon, toynami, futurama, vinyl, figure, destructor, gender, bender, toy',
    '/sdcc-2013-exclusive-futurama-destructor-gender-bender-box-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    7498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'SDCC 2013 Exclusive: Futurama Destructor Gender Bender Box Set',
    NULL,
    false,
    'CC-2013-Destructor',
    '8-16355-00769-0',
    'Default Tax Class',
    NULL,
    'destructor, gender, bender, futurama, vinyl, figure, toy, comicon, sdcc, exclusive',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    749,
    'naruto-shippuden-poseable-action-figure-gaara',
    'Naruto Shippuden Poseable Action Figure - Gaara',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... We are proud to announce the second series in the Naruto Poseable action figures! You can choose from three of your favorite characters: Pain, Gaara and Sasuke. Each figure is fully articulated and features accessories and display stands! 4" tall Gaara Figure Over 15 points of articulation Multiple interchangeable hands Display stand included',
    '11730',
    2499,
    1.0,
    9.0,
    7.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-poseable-action-figure-gaara/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Poseable Action Figure - Gaara',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    750,
    'acid-rain-speeder-mk-ii-sand',
    'Acid Rain Speeder MK.II (Sand)',
    'Acid Rain Speeder MK.II (Sand) The Speeder Mk. II is a 1:18 scale fully-painted military action vehicle with highly-detailed weathering effect, can switch between "Buggy mode" and "Armor mode" (20 points of articulation in Armor mode). The cockpit is designed with a roll cage, soft seat-belt, built to accommodate the "Sol Commander" Pilot figure (included) and can fit any other 1:18 figures. Additional accessories include removable shoulder armor pack, machine gun magazine, soft seat-belt and tires, and team logo decal (1 of 2 random styles). Speeder MK.II (Sand) 3.75" Sol Commander pilot figure',
    'AR-1420S',
    14999,
    3.0,
    15.0,
    9.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-speeder-mk-ii-sand/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    14999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Speeder MK.II (Sand)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    751,
    'skelanimals-marcy-the-monkey-vinyl-figure',
    'Skelanimals Marcy the Monkey Vinyl Figure',
    'You can always find Marcy hanging around out in the trees Her powerful tail makes swinging a breeze. She''s cool and content, hanging even upside down But Iit makes her quite happy, even happier to have you around! This vinyl figure comes in her own window display box.',
    '3518',
    1998,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00558-0',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals Marcy the Monkey Vinyl Figure',
    'Skelanimals Marcy the Monkey Vinyl Figure',
    'skelanimals, marcy, monkey, vinyl, figure, pvc, dead, undead, animal, pet, cute, goth, skull',
    '/skelanimals-marcy-the-monkey-vinyl-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Marcy the Monkey Vinyl Figure',
    NULL,
    false,
    NULL,
    '8-16355-00558-0',
    'Default Tax Class',
    NULL,
    'skelanimals, marcy, monkey, vinyl, figure, pvc, dead, undead, animal, pet, cute, goth, skull',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    752,
    'macross-saga-retro-transformable-1-100-series-complete-set-of-5',
    'Macross Saga: Retro Transformable 1/100 Series - Complete Set of 5',
    'MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION - COMPLETE SET OF 5 GET THE ENTIRE COLLECTION AT A SPECIAL PRICE! SET INCLUDES ICHIJO''S VF-1J, ROY FOCKER''S VF-1S, MAX JENIUS'' VF-1J, MILIA''S VF-1J & VF-1A VALKYRIE! The Macross Saga A gigantic spaceship crash lands on Earth, foreshadowing the arrival of an alien armada bent on war and destruction. The world unites to unlock the secrets of its miraculous alien technology knows as Robotech to defend the world against impending invasion. The challenges they would face would be greater than anyone could have imagined... Macross is a Japanese science fiction anime series that takes place ten years after an alien space ship the size of a city crashed onto South Atalia Island. The space ship was found and reconstructed by humans who turned it into the SDF-1 Macross. It''s up to Earth Defense Pilots to defend and save our world! Toynami is proud to offer five new editions from the MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION! Features: Transformable to three modes: Battroid, Gerwalk & Fighter Highly poseable with over 30 points of articulation Stands over 5" tall in Battroid Mode & 6" long in Fighter Mode Interchangeable hands, missiles & accessories included Each comes with pilot Includes adjustable display stand for maximum versatility & poseability Classic 1980''s retro packaging Don''t miss out on the ultimate in MACROSS SAGA collectibles!',
    '',
    29995,
    6.0,
    14.0,
    10.0,
    10.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    17,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-saga-retro-transformable-1-100-series-complete-set-of-5/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    29995,
    0,
    2,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Saga: Retro Transformable 1/100 Series - Complete Set of 5',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    753,
    'skelanimals-dc-heroes-poison-ivy-plush',
    'Skelanimals / DC Heroes Poison Ivy Plush',
    'Skelanimals / DC Heroes Girls of Gotham City Plush These adorable 10-inch plushes transplant everyone''s favorite Skelanimals into the dark, gritty world of BATMAN''s Gotham City! Choose your favorite or collect them all! Skelanimals Foxy as DC Hero Poison Ivy 10" Tall Plush',
    '12290',
    2499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/skelanimals-dc-heroes-poison-ivy-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals / DC Heroes Poison Ivy Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    754,
    'macross-hikaru-ichijyo-s-shogun-warrior-vf-1j',
    'Macross Hikaru Ichijyo''s Shogun Warrior VF-1J',
    'Features: 24 inch (60 cm) tall figure Rolling wheels Shooting Fist Gun-pod with firing missiles',
    '',
    37500,
    10.0,
    28.0,
    16.0,
    9.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-hikaru-ichijyo-s-shogun-warrior-vf-1j/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    37500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Hikaru Ichijyo''s Shogun Warrior VF-1J',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    755,
    'robotech-1-100-scale-transformable-vf-1d-super-veritech',
    'Robotech 1/100 Scale Transformable VF-1D Super Veritech',
    'Introduce the first ever VF-1D! Fully equipped with a Super Veritech pack! The VF-1D Super Veritech Trainer stands approximately 6 inches tall, is fully articulated, and can be converted into three different modes: Fighter, Battloid or Gerwalk mode. The Robotech VF-1D Veritech, was most commonly used in practice during the First Robotech War. It is well known for its tandem cockpit which made it the primary vehicle for training Veritech pilots. Features: Forearm armor Leg armor Missile clusters Thruster packs Gunpod weapon accessory Adjustable display stand, for maximum versatility and poseability.',
    '10240',
    6998,
    3.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-1-100-scale-transformable-vf-1d-super-veritech/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech 1/100 Scale Transformable VF-1D Super Veritech',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/03/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    756,
    'angel-of-death-b-w-version',
    'Angel of Death (B&W version)',
    'Angel of Death B&W versionThe Angel of Death B&W version is brought to you by Mitchell Bernal aka Senti. This amazing pieces is limited to only 50 units worldwide. Artist Mitchell Bernal, has worked for Disney Feature Animation for 15 years, is the Creator of Skelanimals and Co-Creator of My Germ-Free Bubble Pets with Martin Ansolabehere. STATUS: PRE-ORDERETD: LATE JANUARY',
    '',
    17500,
    5.0,
    16.0,
    12.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/angel-of-death-b-w-version/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    17500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Angel of Death (B&W version)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    757,
    'little-foots-blind-box-figurine',
    'Little Foots Blind Box Figurine',
    'While walking quietly on the moss-covered forest floor, where moonlight filters in through the tree boughs, if you ever come across a fairy ring of mushrooms, turn your lights off and wait. You may be lucky enough to witness the "unearthing" of a baby Little Foot. They are born under the earth right in the middle of fairy rings, protected and nurtured by the fairy folk of the forest. We are proud to introduce the 5th blind box collection from Miyo''s Mystic Musing, Little Foots Blind Box Figurines! Making their first US debut, the Little Foots figures are approximately 3" tall and feature: Pebbles Slosh Sleet Squatch PURCHASED INDIVIDUALLY: The figurines come blind boxed so you will be receiving a random figure. No exchanges or returns.',
    '',
    1200,
    0.4,
    3.0,
    4.0,
    2.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-foots-blind-box-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Foots Blind Box Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    758,
    'b2five-robotech-mospeada-transformable-cyclone-scott-bernard',
    'B2Five Robotech Mospeada Transformable Cyclone - Scott Bernard',
    'B2Five, the same manufacturer who brought Acid Rain and Votoms to the 1/28 scale collectible world, introduces the Veritech Cyclone from the Robotech New Generation Saga. Each model can be fully transformable from Cyclone to Robot mode. Having over 21 points of articulation, this Mecha is a must-have for all Robotech fans! 2.5" SCOTT BERNARD FIGUREVR-052F BATTLER CYCLONESTANDARD JOINT FOR INTERCHANGEABLE PARTSFULL ARTICULATION AND POSEABLE21 JOINTS ACTION FIGURE IS INCLUDED Includes: Base stand x1, EP-37 60mm pulse particle beam gun x1, GR-103 mini-missile launcher x2',
    '',
    5999,
    1.0,
    7.0,
    8.5,
    3.5,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-robotech-mospeada-transformable-cyclone-scott-bernard/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech B2Five Robotech Mospeada Transformable Cyclone - Scott Bernard',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    759,
    'skelanimals-diego-the-bat-vinyl-figure',
    'Skelanimals Diego the Bat Vinyl Figure',
    'Diego''s favorite scary movie is "Birds." You can usually find him in the dark upper corner of your closet sleeping during the day. At night he flies around pestering the other Skelanimals to play. He''s as playful as Dax, who sometimes joins him looking for fireflies in the dark. While you''re asleep, Diego will watch over you to make sure the bugs don''t bother you. This vinyl figure comes in his own window display box.',
    '3519',
    1998,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00559-7',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals Diego the Bat Vinyl Figure',
    'Skelanimals Diego the Bat Vinyl Figure',
    'skelanimals, diego, bat, vinyl, figure, pvc, goth, cute, dead, undead, collectible, skull',
    '/skelanimals-diego-the-bat-vinyl-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Diego the Bat Vinyl Figure',
    NULL,
    false,
    NULL,
    '8-16355-00559-7',
    'Default Tax Class',
    NULL,
    'skelanimals, diego, bat, vinyl, figure, pvc, goth, cute, dead, undead, collectible, skull',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    760,
    'skelanimals-blind-box-series-3-figurine',
    'Skelanimals Blind Box Series 3 Figurine',
    'We are proud to announce our 2.5" Skelanimals Blind Box figurines! All 9 of your favorite figures get a GLOW IN THE DARK makeover!Skelanimals are adorable little animals who have met an untimely end mostly due to their own reckless and ill-advised behavior. The Skelanimals characters are brought to life through funny poems describing their demise. They may be dead, but they are also light-hearted and cute!Adopt a Skelanimal today! They are waiting with open hearts for you to bring them home!The Skelanimals Blind Box Figurines include the following: Maxx (bulldog) Diego (bat) Marcy (monkey) Daxx (dog) Jack (rabbit) Pudge (turtle) Pen (penguin) Jae (wolf) Kit (cat) *You will be receiving one random GLOW IN THE DARK figurine! Collect them all! Note: These figurines come blind boxed. You will be receiving a random figure. No exchanges or returns.',
    '15160',
    799,
    0.6,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/skelanimals-blind-box-series-3-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    799,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Blind Box Series 3 Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    761,
    'angel-of-death-color-version',
    'Angel of Death (Color version)',
    'Angel of Death Color versionThe Angel of Death Color version is brought to you by Mitchell Bernal aka Senti. This amazing pieces is limited to only 50 units worldwide. Artist Mitchell Bernal, has worked for Disney Feature Animation for 15 years, is the Creator of Skelanimals and Co-Creator of My Germ-Free Bubble Pets with Martin Ansolabehere. STATUS: PRE-ORDERETD: LATE JANUARY',
    '',
    17500,
    5.0,
    16.0,
    12.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/angel-of-death-color-version/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    17500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Angel of Death (Color version)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    762,
    'b2five-88th-sand-laurel-la4s4',
    'B2Five 88th Sand Laurel LA4S4',
    'WAVE 2a88th Sand Laurel set The first Laurel to be released in the new B2Five line! The 88th Sand Laurel LA4SA is a military powered suit with a cockpit which is built to accommodate the Laurel Soldier or any 1:28 scale pilot soldier. Also included is a 1:28 scale Laurel military pilot that is highly poseable with 21 points of articulation. Additional accessories include a submachine gun. Features: 1 88th Sand Laurel LA4S4 1 Pilot Soldier 1 Submachine Gun',
    'BW2_02',
    5699,
    2.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-88th-sand-laurel-la4s4/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5699,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'B2Five 88th Sand Laurel LA4S4',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    763,
    'skelanimals-dc-heroes-batgirl-plush',
    'Skelanimals / DC Heroes Batgirl Plush',
    'Skelanimals / DC Heroes Girls of Gotham City Plush These adorable 10-inch plushes transplant everyone''s favorite Skelanimals into the dark, gritty world of BATMAN''s Gotham City! Choose your favorite or collect them all! Skelanimals Quackee as DC Hero Batgirl 10" Tall Plush',
    '12300',
    2499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/skelanimals-dc-heroes-batgirl-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals / DC Heroes Batgirl Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    764,
    'skelanimals-dc-heroes-3-vinyl-figures-assortment',
    'Skelanimals DC Heroes 3" Vinyl Figures Assortment',
    'Skelanimals: DC Heroes 3" Vinyl Assortment Your favorite Skelanimals DC characters are now available in popular vinyl format! Full Set Includes: Batman Jae (wolf) Superman Dax (dog) Robin Pen (penguin) Wonder Woman Kit (cat) Harley Quinn Marcy (monkey) Each vinyl figure stands approximately 3 inches tall and comes packaged in a collectible window box.',
    '2206',
    5999,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    '8-16355-00774-4',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals DC Heroes 3 inch Vinyl Figure Assortment',
    'Skelanimals DC Heroes 3 inch Vinyl Figure Assortment',
    'skelanimals, dc, comics, figures, vinyl, superhero, cute, batman, robin, harley quinn, wonder woman, superman',
    '/skelanimals-dc-heroes-3-vinyl-figures-assortment/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals DC Heroes 3" Vinyl Figures Assortment',
    NULL,
    false,
    NULL,
    '8-16255-00774',
    'Default Tax Class',
    NULL,
    'skelanimals, dc, comics, figures, vinyl, superhero, cute, batman, robin, harley quinn, wonder woman, superman',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    765,
    'robotech-x-eepmon-vf-1j-rick-hunter-aviator-flight-jacket',
    'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket',
    'ROBOTECH X EEPMONWORLDWIDE SHIPPING // UPDATE: LIMITED TO 100 UNITS COLOR: GREYToynami in collaboration with famed digital artist EEPMON is excited to present the Robotech VF-1J Rick Hunter Aviator Flight Jacket!This highly limited and numbered jacket is based directly off a real fighter pilot jacket and adorned with over 10 iconic Robotech symbols and patches curated by EEPMON. This 100% Polyester jacket (with lightweight Polyester Fill) features a die cast metal VF-1J zipper pull only available on this release. The back of the jacket features a custom VF-1J Rick Hunter image by EEPMON that blends seamlessly into the Robotech universe. Each jacket is custom made to order and individually numbered. This highly limited run of only 300 units is sure to sell out quickly, so don''t hesitate and order yours today! This will only be available during the pre order window or until the run sells out.More about EEPMON:EEPMON is an internationally acclaimed Digital Artist working at the intersections in computer arts, coding and experiential design. His clients include MARVEL, Canada Goose, Alpha Industries, Microsoft Xbox, MINI, and the Canada Science & Technology Museum. His work has been featured in HYPEBEAST, GQ France, Complex, JAY-Z''s Life+Times to Computer Arts, and Applied Arts Magazines. His creativity and entrepreneurism represents the ever-changing landscape of modern day industries and is a direct result of the digital tools that empower EEPMON to create new innovative works.EEPMON travels frequently between Canada, USA, China and Japan.http://eepmon.comInstagram: EEPMON ORDER TODAY!Payment will be processed upon check out. SEE SIZE CHART! CUSTOM MADE TO ORDER!',
    '12800',
    30000,
    3.0,
    20.0,
    14.0,
    7.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    5,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-x-eepmon-vf-1j-rick-hunter-aviator-flight-jacket/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    30000,
    0,
    12,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'Robotech jacket, Robotech, Eepmon, Bomber jacket, fighter pilot jacket',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    766,
    'comic-con-2015-exclusive-robotech-gbp-1-stealth-fighter-heavy-armor',
    'Comic Con 2015 Exclusive: Robotech GBP-1 - Stealth Fighter - Heavy Armor',
    'Robotech GBP-1 - Stealth Fighter - Heavy Armor In honor of Robotech''s 30th Anniversary, Toynami is excited to present the Heavy Armor GBP-1 Stealth Fighter 1:100 Scale figure. It is fully articulated just like the classic 1:100 transformables, and can be converted into Fighter, Battloid or Gerwalk modes. The Armored Veritech GBP-1S system allows a single VF-1 fighter to wield the artillery firepower of an entire squadron. The armor is able to withstand several withering barrages from enemy fire, but prevents the Veritech from transforming into fighter mode, and must be jettisoned if the pilot needs maneuverability. *Heavy Armor accessories can only be used in Battloid mode. Limited to 1000 pieces Size: 6" Tall',
    'CC2015-Robotech GBP',
    12999,
    2.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    'Comic Con 2015 Exclusive: Robotech GBP-1 - Stealth Fighter - Heavy Armor',
    'Comic Con 2015 Exclusive: Robotech GBP-1 - Stealth Fighter - Heavy Armor',
    'sdcc, 2015, comic con, san diego, robotech, exclusive, stealth, fighter, GBP-1S, mecha, macross, valkyrie, veritech, shadow',
    '/comic-con-2015-exclusive-robotech-gbp-1-stealth-fighter-heavy-armor/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Comic Con 2015 Exclusive: Robotech GBP-1 - Stealth Fighter - Heavy Armor',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'sdcc, 2015, comic con, san diego, robotech, exclusive, stealth, fighter, GBP-1S, mecha, macross, valkyrie, veritech, shadow',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    767,
    'sdcc-2013-exclusive-badtz-maru-ryu-plush',
    'SDCC 2013 Exclusive: Badtz Maru Ryu Plush',
    'Toynami celebrates an epic genre and culture combination with STREET FIGHTER X SANRIO(R). Beloved Badtz Maru makes his game debut as one of the most iconic Street Fighter characters, Ryu! Outfitted with a ''gi'' and his trademark spiky hair held back by a red headband, this penguin is ready for battle! Available in very limited quantity. Limited to 1000 worldwide San Diego Comic Con 2013 Exclusive 12" Plush',
    'CC2013-Batz',
    4999,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'SDCC 2013 Exclusive Sanrio x Streetfighter Badtz Maru Ryu Plush',
    'SDCC 2013 Exclusive Sanrio x Streetfighter Badtz Maru Ryu Plush',
    'Badtz, Batz, Maru, Ryu, plush, toy, sdcc, comicon, exclusive, collectible, streetfighter, sanrio, toynami, hello kitty, cute',
    '/sdcc-2013-exclusive-badtz-maru-ryu-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'SDCC 2013 Exclusive: Badtz Maru Ryu Plush',
    NULL,
    false,
    'CC2013-Batz',
    NULL,
    'Default Tax Class',
    NULL,
    'batz, badtz, maru, plush, ryu, cute, toy, doll, streetfighter, sanrio, hello kitty, sdcc, comicon, exclusive',
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    768,
    'naruto-shippuden-poseable-action-figure-sasuke',
    'Naruto Shippuden Poseable Action Figure - Sasuke',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... We are proud to announce the second series in the Naruto Poseable action figures! You can choose from three of your favorite characters: Pain, Gaara and Sasuke. Each figure is fully articulated and features accessories and display stands! 4" tall Sasuke Figure Over 25 points of articulation Multiple interchangeable hands Display stand included',
    '11740',
    2499,
    1.0,
    9.0,
    7.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-poseable-action-figure-sasuke/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Poseable Action Figure - Sasuke',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    769,
    'emily-the-strange-6-bendy-figure-convention-exclusive',
    'Emily the Strange 6" Bendy Figure Convention Exclusive',
    'If you are lucky enough to be reading this right now, it means you are invited to the celebration of all things strange. Toynami is proud to present the Emily the Strange 6" action figure--and this Convention Exclusive version has a catty twist! Emily has cat ears! LIMITED TO 1,000 UNITS WORLDWIDE! A sharp-witted and rebellious young woman, Emily is one bad cat. She looks out on her surroundings with disinterest, but hey, what else is new? Is she mad or just curious? She is anti-cool, a sub-culture of one, and a follower of no one but herself. She is the anti-hero for the ''Do-It-Yourself'' movement! Her favorite phrase is "Get Lost!", which is both an invitation to travel to unknown places and an instruction to "Take a Hike!" Her creative spirit stems from a fusion of equal parts rock n roll, punk surrealism, weird science, unbridled sarcasm and a love for furry creatures that meow. When she isn''t in her lab tinkering and cobbling together a particle accelerator, she is napping with her four black cats-Miles, Mystery, Sabbath and Nee Chee. The 6" Emily Action Figure features bendable arms and legs, a display stand and her eldest cat Mystery.',
    '',
    2500,
    10.0,
    12.0,
    8.0,
    3.0,
    'new',
    '819872013205',
    true,
    true,
    'active',
    'by product',
    282,
    0,
    NULL,
    NULL,
    NULL,
    '/emily-the-strange-6-bendy-figure-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2500,
    0,
    3,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Emily the Strange Emily the Strange 6" Bendy Figure Convention Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/30/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    770,
    'robotech-1-100-rick-hunter-vf-1j-super-veritech',
    'Robotech 1/100 Rick Hunter VF-1J Super Veritech',
    'This Robotech Rick Hunter''s 1:100 Scale VF-1J Super Veritech Action Figure comes fully equipped with a Super Veritech pack! The VF-1J Action Figure stands approximately 6-inches tall, is fully articulated, and can be converted into three modes: Fighter, Guardian, or Battloid. Features: Super armor pack Weapon accessories Adjustable display stand, for maximum versatility and poseability.',
    '10540',
    6998,
    3.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-1-100-rick-hunter-vf-1j-super-veritech/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech 1/100 Rick Hunter VF-1J Super Veritech',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    771,
    'godzilla-1989-limited-edition-plush',
    'Godzilla 1989 - Limited Edition Plush',
    'Limited Edition GODZILLA ROARING PLUSHCuddle up with your favorite giant monster in this premium, limited edition Godzilla Plush! Hear him roar when you hug him! Based on the 1989 version, only 1989 of these plush will be made worldwide. Limited Edition - only 1989 pieces made worldwide Commemorates the 1989 version in Godzilla vs. Biollante Super cuddly, premium plush Official Godzilla roar sound when hugged or squeezed Approximately 12" x 12" x 12"',
    '10630',
    9999,
    3.0,
    12.0,
    10.0,
    10.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/godzilla-1989-limited-edition-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    9999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Godzilla 1989 - Limited Edition Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    772,
    '6-sage-mode-naruto-with-scroll-exclusive',
    '6" Sage Mode Naruto with Scroll Exclusive',
    '6" Sage Mode Naruto with Scroll Exclusive NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... We are proud to announce the 6" Sage Mode Naruto with Scroll Exclusive! 6" figure Limited to 1,000',
    'CC2018-Naruto',
    5999,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/6-sage-mode-naruto-with-scroll-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto 6" Sage Mode Naruto with Scroll Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    773,
    'b2five-robotech-mospeada-transformable-cyclone-lance-belmont',
    'B2Five Robotech Mospeada Transformable Cyclone - Lance Belmont',
    'B2Five, the same manufacturer who brought Acid Rain and Votoms to the 1/28 scale collectible world, introduces the Veritech Cyclone from the Robotech New Generation Saga. Each model can be fully transformable from Cyclone to Robot mode. Having over 21 points of articulation, this Mecha is a must-have for all Robotech fans! 2.5" LANCE FIGUREVR-041H SABER CYCLONESTANDARD JOINT FOR INTERCHANGEABLE PARTSFULL ARTICULATION AND POSEABLE21 JOINTS ACTION FIGURE IS INCLUDED Includes: Base stand x1, CADS-1 high frequency blade x2',
    '',
    5999,
    1.0,
    7.0,
    8.5,
    3.5,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-robotech-mospeada-transformable-cyclone-lance-belmont/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech B2Five Robotech Mospeada Transformable Cyclone - Lance Belmont',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/27/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    774,
    'little-burnt-embers-special-edition-figurines-set-2022-convention-exclusive',
    'Little Burnt Embers Special Edition Figurines Set - 2022 CONVENTION EXCLUSIVE',
    'When sitting in front of a friendly fire, maybe with a cup of cocoa wrapped in a cozy blanket on a winter''s night or perhaps roasting marshmallows with friends around a summer campfire... There is a moment when the flames die down leaving the logs glowing red. Then, you hear it, a slight crackle as a spent log falls apart and embers fly up into the air. That is the moment when Little Baby Embers are born! You may not see them as they play in the hearth amongst the ashes, covered in soot. But remember they are there before you go poking about in the ashes! If you are lucky, you might see a puff of a dragon''s kiss! The Little Burnt Embers Blind Box Figurines are approximately 2.5" tall and feature a limited-edition special color deco edition of: Soot Sparks Cinder Ash Flames Limited to 500 sets Limit 2 per customer Set Includes: Soot, Sparks, Cinder, Ash & Flames WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    '',
    5999,
    1.0,
    7.0,
    5.0,
    3.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-burnt-embers-special-edition-figurines-set-2022-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    5399,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Burnt Embers Special Edition Figurines Set - 2022 CONVENTION EXCLUSIVE',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/24/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    775,
    'robotech-poseable-action-figures-series-2-set-of-5',
    'Robotech Poseable Action Figures Series 2 (Set of 5)',
    'Robotech Poseable Action Figures Series 2 (Set of 5) The new Series 2 Robotech action figure set is here! Don''t miss out on your chance to get your favorite characters from the 80''s animated hit, Robotech! As a throwback to the 80''s, these figures stand 4.25" tall and have multiple points of articulation. Series 2 set includes: Captain Gloval Lisa Hayes w/ Dress Uniform Rick Hunter w/ Dress Uniform Claudia Grant w/ Dress Uniform Ben Dixon w/ Space Suit Includes removable helmet and stand PLEASE NOTE: ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    '11270',
    6998,
    1.0,
    10.0,
    7.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    -6,
    NULL,
    NULL,
    'robotech, macross, sdcc 2021, poseable figures, pilots',
    '/robotech-poseable-action-figures-series-2-set-of-5/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech Poseable Action Figures Series 2 (Set of 5)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'robotech figures, series 2, sdcc',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    776,
    'kyanite-plush',
    'Kyanite Plush',
    'PRE-ORDER FOR 2024 SDCC CONVENTION EXCLUSIVE KYANITE DELUXE LARGE PLUSH.',
    'CCKyanite',
    4999,
    3.0,
    12.0,
    10.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/kyanite-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    true,
    'Kyanite Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    777,
    'bloody-bunny-7-inch-mini-plush',
    'Bloody Bunny 7-inch Mini Plush',
    'Bloody Bunny Mini Plush Bloody Bunny has gained a great deal of popularity in Thailand, where it originated, as well as other parts of Asia such as Japan, where it has become a viral video sensation. Join the viral video Bloody Bunny craze with the Bloody Bunny Mini 7-Inch Plush! Made with extra cuddly faux fur, Bloody Bunny is super comfortable, but you definitely want to avoid getting on this guy''s bad side because he''s not afraid of resorting to samurai code to get you in line.',
    '12190',
    1499,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Bloody Bunny 7-inch Mini Plush',
    'Bloody Bunny 7-inch Mini Plush',
    'bloody, bunny, plush, toy, white, rabbit, plush, plushie, cute, adorable, thailand, 2-spot, toynami',
    '/bloody-bunny-7-inch-mini-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Bloody Bunny 7-inch Mini Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'toy, bloody, bunny, plush, white, rabbit, plushie, cute, adorable, thailand, 2-spot, toynami',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    778,
    'comic-con-2016-exclusive-skelanimals-bonita-plush',
    'Comic Con 2016 Exclusive: Skelanimals Bonita Plush',
    'Skelanimals are adorable little animals who have met an untimely end-mostly due to their own reckless and ill-advised behavior. Bonita Unicorn has recently had a bad case of the rainbows. See our exclusive Bonita with a new purple look and rainbow horn! You are bound to fall in love with this plush. Limited to 1,000 Worldwide! 10" Deluxe plush Exclusive Purple Color Exclusive Rainbow Horn',
    'CC2016-Bonita',
    3000,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/comic-con-2016-exclusive-skelanimals-bonita-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2016 Exclusive: Skelanimals Bonita Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    779,
    'acid-rain-sofi',
    'Acid Rain Sofi',
    'Acid Rain Sofi The year she turned eight, Sofi lost her parents to the chaos of war. The Bucks Team sniper Argus found her alone in the smoky rubble and brought her under his care. Growing up, Sofi was a strong spirit who refused to be defined by her childhood trauma. She rejected all offers of help and insisted on solving problems on her own.By the time she turned fifteen, Sofi had mastered every battle technique imaginable, even honing her reconnaissance and sniping skills to match that of her adoptive father. She argued frequently with Argus, who strongly opposed her joining the Bucks Team, even though she could strike a tie in combat with any Bucks Team member. The day she came of age, a starry-eyed Sofi ran away to join the Agurts 303rd Marines, swiftly passing the test to become the division''s youngest female SA pilot.Features: Sofi Backpack, Vest, Belt, Extra Holster, Cloak, Gear Buckle, ASR5 Sniper Rifle, ASMG3 Submachine Gun, AP3 Pistol, ARL8 Rocket Launcher, Rocket Case, Helmet, Half Face Gas Mask',
    'AR-1810S',
    2999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-sofi/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Sofi',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    780,
    'acid-rain-raptor-speeder-mk-i-marine',
    'Acid Rain Raptor (Speeder MK.I)(Marine)',
    'Acid Rain Raptor (Speeder MK. I)(Marine) The Raptor (Speeder Mk. 1) is a 1:18 scale fully-painted military action vehicle with highly-detailed weathering effect, can switch between "Beach Buggy mode" and "Armor mode" (6 articulation points). The cockpit is designed with a roll cage, soft seat-belt, built to accommodate the "Marine Corporal" Pilot (included) and can fit any other 1:18 figures. Additional accessories include rotatable mini guns, cloth blanket and team logo decal (1 of 2 random styles). Acid Rain Raptor (Speeder MK.I)(Marine) 3.75" Marine Corporal pilot',
    'AR-1440S',
    8999,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-raptor-speeder-mk-i-marine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    8999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Raptor (Speeder MK.I)(Marine)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    781,
    'acid-rain-space-prisoner',
    'Acid Rain Space Prisoner',
    'Acid Rain Space Prisoner The Space Prisoner is the first Space character to launch in the Acid Rain AR-series. Prisoner is a highly poseable 1:18 fully-painted space action figure with highly-detailed weathering effect. The figure comes fully equipped with a removable space helmet and a pair of robotic gloves which allow for the figure to hold things in hand. 3.75" Space Prisoner figure Astronaut helmet Set of robotic gloves Astronaut helmet Highly articulated Storage case',
    'AR-1660S',
    4999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-space-prisoner/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Space Prisoner',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    782,
    'naruto-shippuden-exclusive-two-pack-set-sasuke-vs-itachi',
    'Naruto Shippuden Exclusive Two-Pack Set: Sasuke vs. Itachi',
    'Naruto Shippuden Exclusive Two-Pack Set: Sasuke vs. Itachi Toynami is proud to introduce the exclusive 4" poseable action figure two pack set: Sasuke vs. Itachi. Paying tribute to the fated battle between Sasuke and his brother Itachi, also known as the ''Master''s Prophecy and Vengeance''. You won''t want to miss out on this amazing two-pack set which includes two poseable action figures, interchangeable hands and weapons! 4" poseable figures: Sasuke and Itachi Limited to 1,000',
    '11640',
    6498,
    1.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-exclusive-two-pack-set-sasuke-vs-itachi/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Exclusive Two-Pack Set: Sasuke vs. Itachi',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    783,
    '40th-anniversary-voltron-shirt-sdcc-exclusive',
    '40th Anniversary Voltron Shirt SDCC Exclusive',
    'Officially Licensed Style: Tri-Blend Jersey Unisex T-Shirt Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% RayonCollar: Crew NeckFit Type: ClassicSize Range: S-3XL',
    '',
    3500,
    1.0,
    15.0,
    11.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/40th-anniversary-voltron-shirt-sdcc-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Voltron 40th Anniversary Voltron Shirt SDCC Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    784,
    'sdcc-2013-exclusive-dc-heroes-skelanimals-harley-quinn-mini-plush',
    'SDCC 2013 Exclusive: DC Heroes Skelanimals Harley Quinn Mini Plush',
    'DC Heroes meets the very dead - but lovable - Skelanimals! Starring Marcy the Monkey as Harley Quinn from Batman. Marcy looks adorable in Harley Quinn''s satin costume, complete with jester headpiece, collar and white puffy cuffs.San Diego Comic Con 2013 Exclusive6" Plush',
    'CC2013-Harley',
    2999,
    1.5,
    9.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'SDCC 2013 Exclusive DC Heroes Skelanimals Harley Quinn Plush',
    'SDCC 2013 Exclusive DC Heroes Skelanimals Harley Quinn Plush',
    'toy, exclusive, sdcc, comicon, toynami, plush, cute, doll, harley quinn, mini, dc, skelanimals, marcy, monkey',
    '/sdcc-2013-exclusive-dc-heroes-skelanimals-harley-quinn-mini-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'SDCC 2013 Exclusive: DC Heroes Skelanimals Harley Quinn Mini Plush',
    NULL,
    false,
    'CC2013-Harley',
    NULL,
    'Default Tax Class',
    NULL,
    'harley quinn, mini, plush, dc, skelanimals, cute, marcy, monkey, sdcc, comicon, exclusive',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    785,
    'comic-con-2016-exclusive-robotech-tineez-minmay-plush',
    'Comic Con 2016 Exclusive: Robotech Tineez Minmay Plush',
    'An aspiring singer and songwriter, Minmay finds her big break though the unforeseen accident that transferred Macross City into space, and then aboard the SDF-1. Minmay, only a teenager throughout the original series, becomes "Ms. Macross" and a famous singer aboard ship. The adorable Lynn Minmay in Chibi form! Limited to 1,000 Worldwide! 6" Tineez plush',
    '10530',
    2000,
    2.0,
    6.0,
    4.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/comic-con-2016-exclusive-robotech-tineez-minmay-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Comic Con 2016 Exclusive: Robotech Tineez Minmay Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    786,
    'super-poseable-die-cast-voltron',
    'Super Poseable Die Cast Voltron',
    '30th Anniversary Super Poseable Die Cast Voltron Crafted of die-cast metal and plastic, this mini Super Deformed Voltron is huge on features! Highly poseable with an impressive 25 points of articulation, 3 interchangeable faces, and battery-operated light-up LED eyes. He also comes packed with multiple swords, shield and stand accessories, so you can create endless unique poses for the ultimate in Lion Force expression.',
    '10120',
    7998,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Super Poseable Altimites Die Cast Voltron',
    'Super Poseable Altimites Die Cast Voltron',
    'voltron, die cast, sd, super deformed, poseable, cute, cool, robot, metal, toynami, chibi, toy',
    '/super-poseable-die-cast-voltron/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    7998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Voltron Super Poseable Die Cast Voltron',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'toy, cool, cute, toynami, voltron, die cast, sd, super deformed, poseable, robot, metal, chibi',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    787,
    'acid-rain-stealth-camelbot-hr12e',
    'Acid Rain Stealth Camelbot HR12e',
    'Acid Rain Stealth Camelbot HR12e The Stealth Camelbot HR12e is a transformable mechanical soldier imported from the N.A.U.S. These robotic units are often sent as first recon for operations in hazardous regions, where they transform between two distinct operating modes. In transport mode, the Camelbot acts as auxiliary support, while in humanoid mode, it performs complex tasks and operates a wide variety of weapons with the agility of a human soldier.1:18 scale Stealth Camelbot Includes: Stealth Camelbot HR12e x1, AAR7 Assault Rifle x2',
    'FAV-A08',
    5999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-stealth-camelbot-hr12e/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Stealth Camelbot HR12e',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    788,
    'robotech-1-100-max-sterling-vf-1j-super-veritech',
    'Robotech 1/100 Max Sterling VF-1J Super Veritech',
    'This Robotech Max Sterling''s 1:100 Scale VF-1J Super Veritech Action Figure comes fully equipped with a Super Veritech pack! The VF-1J Action Figure stands approximately 6-inches tall, is fully articulated, and can be converted into three modes: Fighter, Guardian, or Battloid. Features: Super armor pack Weapon accessories Adjustable display stand, for maximum versatility and poseability.',
    '10550',
    6998,
    3.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-1-100-max-sterling-vf-1j-super-veritech/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech 1/100 Max Sterling VF-1J Super Veritech',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    789,
    'naruto-shippuden-mininja-figurines-series-1',
    'Naruto Shippuden Mininja Figurines - Series 1',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... Series 1 Figures include: Naruto Sasuke Itachi Kakashi',
    '',
    1200,
    0.5,
    7.0,
    4.0,
    2.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-mininja-figurines-series-1/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Mininja Figurines - Series 1',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    790,
    'deluxe-6-pvc-statue-sasuke',
    'Deluxe 6" PVC Statue: Sasuke',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... Deluxe 6" PVC Statue: Sasuke 6" tall Comes with extra accessories and stand',
    '11780',
    2499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/deluxe-6-pvc-statue-sasuke/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Deluxe 6" PVC Statue: Sasuke',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    791,
    'naruto-shippuden-poseable-action-figure-deidara',
    'Naruto Shippuden Poseable Action Figure - Deidara',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path...We are proud to announce the third series in the Naruto Poseable action figures! You can choose from three of your favorite characters: Deidara, Kakashi and Sasuke. Each figure is fully articulated and features accessories and display stands! 4" tall Deidara Figure Multiple points of articulation Comes with extra accessories and stand',
    '',
    2499,
    1.0,
    9.0,
    7.0,
    5.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-poseable-action-figure-deidara/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Poseable Action Figure - Deidara',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    792,
    'comic-con-2016-exclusive-trollhunters-bular-maquette',
    'Comic Con 2016 Exclusive: Trollhunters Bular Maquette',
    'DreamWorks Animation and Netflix bring to you acclaimed Filmmaker Guillermo del Toro''s Trollhunters! This limited edition Trollhunters Bular maquette is individually signed by Guillermo del Toro himself! Get yours today! Limited to 200 worldwide Size: 12" tall Jim figure NOT included with purchase (please inquire if interested in purchasing a Jim figure)',
    'DWA-Bular',
    17999,
    22.0,
    20.0,
    14.0,
    22.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/comic-con-2016-exclusive-trollhunters-bular-maquette/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    17999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2016 Exclusive: Trollhunters Bular Maquette',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    793,
    'sanrio-x-street-fighter-2-player-figurine-assortment',
    'Sanrio x Street Fighter 2-Player Figurine Assortment',
    'Sanrio x Street Fighter 2-Player Figurine Sets Presenting the next exciting item from the new Sanrio x Street Fighter line: Sanrio x Street Fighter 2-Player PVC Box sets! These PVC box sets include two 3" figurines packaged in a collectible window box set against authentic Street Fighter backdrops. Featuring Chun Li vs Zangief, Ryu vs Cammy, and M. Bison vs E. Honda. Don''t miss out, collect them all!',
    '4908',
    5999,
    1.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00951-9',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Sanrio x Street Fighter 2-Player Figurine Assortment',
    'Sanrio x Street Fighter 2-Player Figurine Assortment',
    'sanrio, hello kitty, vinyl figure, figurine, pvc, street fighter, chun li, ryu, m bison, zangief, cammy, e honda',
    '/sanrio-x-street-fighter-2-player-figurine-assortment/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Sanrio x Street Fighter 2-Player Figurine Assortment',
    NULL,
    false,
    NULL,
    '8-16355-00951-9',
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    794,
    'acid-rain-b2five-stealth-chapel-hett-600e-exclusive',
    'Acid Rain B2Five Stealth Chapel HETT 600e Exclusive',
    'Acid Rain B2Five Stealth Chapel HETT 600e Exclusive Introducing the newest line in Acid Rain: Acid Rain B2Five by Beaver. Acid Rain B2Five is proud to announce the Stealth Chapel HETT 600e convention exclusive! The Stealth Chapel HETT 600e set comes with an Anti-tank rocket launcher vehicle able to transform into two different modes: tank and base mode. Also included is a highly poseable 1:28 scale military pilot with 21 points of articulation. Additional accessories include a submachine gun, minigun, SA sword and pistol cannons. Limited to 300 units for N. America',
    'BW3SP_01',
    10999,
    2.0,
    14.0,
    10.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-b2five-stealth-chapel-hett-600e-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    10999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain B2Five Stealth Chapel HETT 600e Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    795,
    'hellbender-infantry-fav-a122',
    'Hellbender Infantry FAV-A122',
    'THIS IS A PRE-ORDER ITEM AND WILL BE AVAILABLE END OF FEB 2025 The Hellbender Infantry from the Agurtan National Army''s 88th Sand Team are someof the most feared troops in the Estancian desert. Consisting mainly of refugees, theHellbender Infantry rank and file were a ragtag group when they started out, beatendown by the difficult lives they had suffered, but this changed under Spencer andDonovan''s leadership. The two charismatic fighters, both refugees themselves,forged the Hellbenders into a unified fighting force. At the peak of their powers, theywere unstoppable. But after Donovan disappeared, Spencer was a changed man.Hellbender discipline fell into disrepair. The Hellbenders are still as fierce as ever, butwithout anyone holding them back, their wild ferocity has made them less heroicand more notorious. Yet none of the Agurtans living along the border of theEstancian Gray Zone can deny their contribution to national security. contents:- Hellbender Infantry x 1- AR4s Rifle x 1- AP5 Pistol x 1- AS5 Silencer x 1- Grenade x 2- Workstation Handheld Tactical Computer',
    'FAV-A122',
    5200,
    1.0,
    5.0,
    7.0,
    5.0,
    'new',
    '4.71095E+12',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/hellbender-infantry-fav-a122/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Hellbender Infantry FAV-A122',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    796,
    'acid-rain-ajax-hoplitai',
    'Acid Rain Ajax Hoplitai',
    'Acid Rain Ajax Hoplitai The Ajax Hoplitai of Agurts''s 15th Stealth Team are assault elements responsible for administering preemptive surgical strikes against high-priority targets deep in hostile territories. These advanced units are outfitted with modified Power Armors (PA) similar to those of the 55th Forseti Forces and 88th Seth Rangers. Developed from the imported N.A.U.S Combat Powered Exoskeleton (CPE), the Ajax Hoplitai''s PA boast strong protective and adaptive qualities that enable the wearer to withstand extreme climates for extended lengths of time without sustaining corrosion from acid rain or other contaminants.1:18 scale Ajax Hoplitai Includes: Ajax Hoplitai x1,Power Armor Set x1, AP2 Pistol x2, ASMG6 Submachine Gun x1, AAR7 Assault Rifle x1',
    'FAV-A09',
    4799,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-ajax-hoplitai/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4799,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Ajax Hoplitai',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    797,
    'deluxe-6-pvc-statue-naruto',
    'Deluxe 6" PVC Statue: Naruto',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... Deluxe 6" PVC Statue: Naruto 6" tall Comes with extra accessories and stand',
    '',
    2499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/deluxe-6-pvc-statue-naruto/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Deluxe 6" PVC Statue: Naruto',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    798,
    'robotech-veritech-fighter-transformable-1-100-scale-4-25-pilot-action-figures-set-of-5',
    'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5',
    'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5 Weekday afternoon cartoons, action figures and ROBOTECH always equaled a happy childhood! Now that feeling is back with this returning assortment of ROBOTECH action figures! Back by popular demand, this assortment of Veritech Pilot action figures and Veritech Transformables has long been unavailable at retail and most recently reappeared as a sought-after convention exclusive box set. Here offered as an assortment, all your favorite ROBOTECH characters are approximately 4.25" tall, come fully articulated and feature removable helmets and display stands, along with a fully transformable version of their Veritech Fighter! Figure Features: 4.25" Pilot Figures in flight suits Multiple points of articulation Comes with removable helmet and stand. Veritech Features: Transformable to three modes: Battloid, Guardian, and Fighter Highly poseable with over 30 points of articulation Includes adjustable display stand for maximum versatility and poseability Gun pod and missile attachment accessories included Micro-figure for transformable veritech cockpit.',
    '',
    39500,
    6.0,
    16.0,
    10.0,
    10.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-veritech-fighter-transformable-1-100-scale-4-25-pilot-action-figures-set-of-5/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    39500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    799,
    'robotech-1-100-miriya-vf-1j-super-veritech',
    'Robotech 1/100 Miriya VF-1J Super Veritech',
    'This Robotech Miriya''s 1:100 Scale VF-1J Super Veritech Action Figure comes fully equipped with a Super Veritech pack! The VF-1J Action Figure stands approximately 6-inches tall, is fully articulated, and can be converted into three modes: Fighter, Guardian, or Battloid. Features: Super armor pack Weapon accessories Adjustable display stand, for maximum versatility and poseability.',
    '10560',
    6998,
    3.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-1-100-miriya-vf-1j-super-veritech/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech 1/100 Miriya VF-1J Super Veritech',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    800,
    'hello-sanrio-exclusive-two-pack-set-hello-kitty-pompompurin',
    'Hello Sanrio Exclusive Two-Pack Set - Hello Kitty & Pompompurin',
    'Hello Sanrio Exclusive Two-Pack Set - Hello Kitty & Pompompurin Say hello to the immersive new world of HELLO SANRIO! For the first time, your favorite Sanrio characters are featured all together in a super-cute immersive world filled with fun, friendship and big smiles! This year we will debut an exclusive two-pack Hello Sanrio capsule diorama set with your favorite characters Hello Kitty & Pompompurin! Limited to 1,000',
    '11250',
    3999,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/hello-sanrio-exclusive-two-pack-set-hello-kitty-pompompurin/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Hello Sanrio Exclusive Two-Pack Set - Hello Kitty & Pompompurin',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    801,
    'hello-sanrio-4-capsule-diorama-assortment-5-pack',
    'Hello Sanrio 4" Capsule Diorama Assortment (5 Pack)',
    'Toynami is proud to introduce the Hello Sanrio Capsule Diorama set! We''re bringing together five of your favorite characters: Hello Kitty, Keroppi, BadtzMaru, My Melody and Chococat! Each capsule stands approximately 4 inches tall and is perfect to display in or out of the vinyl display box.Size: 4" Tall',
    '11190',
    6500,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/hello-sanrio-4-capsule-diorama-assortment-5-pack/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Hello Sanrio 4" Capsule Diorama Assortment (5 Pack)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    802,
    'sdcc-2013-exclusive-futurama-hypnotoad-vinyl-figure',
    'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure',
    'Presenting the much adored Hypnotoad from the world of Futurama, with the power to hypnotize all surrounding animals and humans with his psychedelic eyes! Now you can capture some of the power for yourself with this Tineez vinyl figure. "ALL GLORY TO THE HYPNOTOAD!"Limited to 2000 worldwideBoxed San Diego Comic Con 2013 ExclusiveVinyl figure for the adult collectorFigure measures 3" x 2.5" x 2" (Box 4" x 3.5" x 3.5")',
    'CC2013-Hypnotoad',
    1599,
    1.5,
    9.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'SDCC 2013 Exclusive Futurama Hypnotoad Vinyl Figure',
    'SDCC 2013 Exclusive Futurama Hypnotoad Vinyl Figure',
    'toy, exclusive, sdcc, comicon, hypnotoad, futurama, vinyl, figure, toad, collectible, all glory, all hail, figurine, tineez',
    '/sdcc-2013-exclusive-futurama-hypnotoad-vinyl-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1599,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure',
    NULL,
    false,
    'CC2013-Hypnotoad',
    NULL,
    'Default Tax Class',
    NULL,
    'hypnotoad, futurama, vinyl, figure, toy, comicon, sdcc, exclusive, toad, all glory',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    803,
    'acid-rain-eos-raider',
    'Acid Rain EOS Raider',
    'Acid Rain EOS Raider Eos Raider "Eos" is an elite unit of the Agurts 303rd Marines. Their name derives from the ancient tale of Eos, when the peninsula came under siege and civilians along the coast were called to arms. During the attack, a well known fisherman- Eos leaped into the stormy seas and severed the invading navy''s anchors, causing enemy ships to collide and sink in the storm. The story of Eos inspired the incorporation of local fishermen to form the region''s first amphibious force.Amphibious warfare have undergone great changes since the Gray Summer, troopships and aircraft carriers have limited effectiveness in coastal conflicts today. Missions must be carried out with a small but deadly group of soldiers. The Eos specialize in amphibious assault, armed with a diverse arsenal, these units are capable of destroying heavy fortifications and performing rapid assaults at the same time.That night, when Bob sensed the headstrong girl was on her way to etch out her own fate, he slipped his orange scarf into the bottom of her backpack, a memento of support and blessing. Features: Eos, AP4 Pistol, Bob''s Scarf, Helmet, AAR3 Assault Rifle, ASMG4 Submachine Gun, ARL5 Bazooka, Extra Masked Head, Backpack, Spray Gun, "303" Stencil',
    'AR-1820S',
    2999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-eos-raider/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain EOS Raider',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    804,
    'deluxe-6-pvc-statue-gaara',
    'Deluxe 6" PVC Statue: Gaara',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... Deluxe 6" PVC Statue: Gaara 6" tall Comes with extra accessories and stand',
    '11790',
    2499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/deluxe-6-pvc-statue-gaara/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Deluxe 6" PVC Statue: Gaara',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    805,
    'sanrio-x-street-fighter-key-chains-assortment',
    'Sanrio x Street Fighter Key Chains Assortment',
    'Sanrio x Street Fighter Key Chains Introducing Sanrio x Street Fighter key chains! This assortment features characters from the 1st & 2nd series! These adorable mini figurines stand approximately 3 cm tall and come complete with interchangeable mobile strap and key chain attachments. Characters included are Chun Li, Ryu, M. Bison, Guile, Ken, and Cammy.',
    '16120',
    4000,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    '8-19872-01511-7',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Sanrio x Street Fighter Key Chains Assortment',
    'Sanrio x Street Fighter Key Chains Assortment',
    'sanrio, street fighter, hello kitty, chun li, ryu, m bison, cammy, zangief, e honda, key chain, mini, figure, figurine, toy, cute',
    '/sanrio-x-street-fighter-key-chains-assortment/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Sanrio x Street Fighter Key Chains Assortment',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    806,
    'comic-con-2016-exclusive-trollhunters-bular-maquette-jim-figure-combo',
    'Comic Con 2016 Exclusive: Trollhunters Bular Maquette & Jim Figure COMBO',
    'DreamWorks Animation and Netflix bring to you acclaimed Filmmaker Guillermo del Toro''s Trollhunters! This limited edition Trollhunters Bular Maquette is individually signed by Guillermo del Toro himself! Get your combo pack today! JIM FIGURE INCLUDED! For a limited time only or while supplies last! Bular 12" tall (2 pcs set) Jim 5" tall (1 pc) Ships in 2 separate boxes Bular signed by Guillermo del Toro',
    '',
    22998,
    28.0,
    22.0,
    18.0,
    26.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    2,
    0,
    NULL,
    NULL,
    NULL,
    '/comic-con-2016-exclusive-trollhunters-bular-maquette-jim-figure-combo/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    22998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2016 Exclusive: Trollhunters Bular Maquette & Jim Figure COMBO',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    807,
    'spencer-fav-a121',
    'Spencer FAV-A121',
    'THIS IS A PRE-ORDER ITEM AND WILL BE AVAILABLE END OF FEB 2025 Never forget. That was what Spencer, Captain of the Agurtan National Army 88thSand Team''s Hellbenders Squad, always told himself. How could he? Even with apounding headache from another wild night, the pain was still too near to him.Finding out his best friend Donovan had killed the woman he loved - and then ranoff. Why? It was a question that haunted him still. But as he stretched and went outto see his squad, he smiled. The Hellbenders were rowdy, yes. They were rough -sometimes too rough. But they were family, and they got the job done - no matterwhat job it was. Another day baking under the desert sun of the Estancian GrayZone: never forget, and keep moving forward. contents: - Spencer x 1- ASMG8 Submachine Gun x 1- AP5 Pistol x 1- AS5 Silencer x 1- AS2 Silencer x 1- Grenade x 1- Gun Sling x 1',
    'FAV-A121',
    5200,
    1.0,
    5.0,
    7.0,
    5.0,
    'new',
    '4.71095E+12',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/spencer-fav-a121/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Spencer FAV-A121',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    808,
    'robotech-angel-bird-exclusive',
    'Robotech Angel Bird Exclusive',
    'Robotech Angel Bird Exclusive Our 1/100 scale Veritech captures every minute detail and line of the renowned VF-1A Angel Bird with exacting precision. These bright colors are used by the Angel Bird squadron, a group of highly trained pilots that specialize in air show performances for public appearances of the VF-1 Valkyrie fighters. The Robotech VF-1A Angel Bird is fully transformable to three modes (Fighter, Guardian and Battloid) and is highly limited in production! Limited to 750',
    'CC2018-AngelBird',
    6998,
    1.0,
    8.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-angel-bird-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech Angel Bird Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    809,
    'rick-hunter-transformable-vf-1j-battle-cry-figure-2021-convention-exclusive',
    'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE',
    'Robotech: Rick Hunter''s VF-1J Battle Cry w/ Poseable Figure - 2021 Convention Exclusive In the episode "Battle Cry," Rick Hunter''s life is put on the line by Lt. Commander Lisa Hayes after she delays a counterattack against a Zentraedi ship. Though Rick narrowly escapes death, will Lisa be able to forgive herself? Will Rick be able to fly with the Skull Squadron as the same ace pilot he was before? Our 1/100 scale Veritech captures minute details and lines of Ricks'' renowned VF-1J with exacting precision. Features: Transformable to three modes: Battloid, Guardian, and Fighter Highly poseable with over 30 points of articulation Includes adjustable display stand for maximum versatility and poseability Gun pod and missile attachment accessories included Deluxe multi-step battle weathering effect CONVENTION EXCLUSIVE LIMITED TO 1000 UNITS! Limit 2 per customer Release date: August 2021 PLEASE NOTE: ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'CC2021-Rick VF1J',
    8000,
    2.0,
    8.0,
    8.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    -8,
    NULL,
    NULL,
    'robotech, macross, sdcc 2021, rick hunter, battle cry,',
    '/rick-hunter-transformable-vf-1j-battle-cry-figure-2021-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    8000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/27/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    810,
    'acid-rain-sand-antbike-ab7s',
    'Acid Rain Sand Antbike AB7s',
    'Acid Rain Sand Antbike AB7s The Sand Antbike AB7s is a combat engineer vehicle serving the 88th Sand Team. With the rapid advancement of SA warfare, the Flakbike''s classic design appeared increasingly outdated. At the same time, SA fleets were outgrowing their existing logistic provisions. In particular, the logistic capacity of the 88th Sand Team had been worn thin from years of dedicated service in the desert. Thus, the 88th Sand Team''s engineers saw great potential in the Flakbike''s powerful engine and refurbished the model into a revolutionary new combat engineer vehicle - the Antbike.The Antbike can act as a tractor unit linking multiple trailers, significantly boosting cargo capacity. When coupled with lifting cranes, folding shovels and ground drills, it can greatly facilitate construction and cargo movement. In addition, the Flakbike''s gun barrel can be reinstalled on the Antbike to become a formidable combat unit! 1:18 scale Sand Antbike AB7s Includes: Sand Antbike AB7s x1, Sand Cannoneer x1, Folding Shovel x1, AP2 Pistol x1, ARL11 Bazooka x1, Binoculars x1, Flakbike Cannon x1,',
    'FAV-A12',
    11499,
    3.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-sand-antbike-ab7s/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    11499,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Sand Antbike AB7s',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    811,
    'sanrio-x-street-fighter-mobile-plugs-assortment',
    'Sanrio x Street Fighter Mobile Plugs Assortment',
    'Sanrio x Street Fighter Mobile Plugs Introducing Sanrio x Street Fighter mobile plugs! This assortment features characters from the 1st & 2nd series! These adorable mini figurines stand approximately 3 cm tall and come complete with interchangeable mobile strap and key chain attachments. Characters included are Chun Li, Ryu, M. Bison, Guile, Ken, and Cammy.',
    '16130',
    4000,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    '8-19872-01512-4',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Sanrio x Street Fighter Mobile Plugs Assortment',
    'Sanrio x Street Fighter Mobile Plugs Assortment',
    'sanrio, hello kitty, street fighter, chun li, ryu, m bison, zangief, cammy, e honda, mobile, plug, cute, mini, figure, figurine, charm, kawaii',
    '/sanrio-x-street-fighter-mobile-plugs-assortment/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Sanrio x Street Fighter Mobile Plugs Assortment',
    NULL,
    false,
    NULL,
    '8-19872-01512-4',
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    812,
    'acid-rain-laurel-ghost-7',
    'Acid Rain Laurel Ghost 7',
    'Acid Rain Laurel Ghost 7 The Laurel is a 1:18 military heavy artillery armor suit with clear armor parts and weapon. The cockpit is highly detailed with linkage mechanic structure, built to accommodate the Pilot figure (Included) and can fit any other 1:18 figures. Laurel Ghost 7 Laurel Ghost pilot',
    'AR-1520S',
    9999,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-laurel-ghost-7/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    9999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Laurel Ghost 7',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    813,
    'robotech-30th-anniversary-1-100-roy-fokker-gbp-1-heavy-armor-veritech',
    'Robotech 30th Anniversary 1/100 Roy Fokker GBP-1 Heavy Armor Veritech',
    'Roy Fokker GBP-1 Heavy Armor Veritech Long awaited by fans, we are excited to offer the Robotech 1/100 scale GBP-1 Heavy Armored Veritechs! Like the original Transformables, each action figure stands approximately 6 inches tall, is fully articulated, and can be converted into Fighter, Battloid or Gerwalk modes. The Armored Veritech GBP-1 system allows a single VF-1 fighter to wield the artillery firepower of an entire squadron. The armor is able to withstand several withering barrages from enemy fire, but prevents the Veritech from transforming into fighter mode, and must be jettisoned if the pilot needs maneuverability. *Heavy Armor accessories can only be used in Battloid mode. Includes: Boosters (L-R) Chest Missile Pack Shoulder Missile Packs Inner & Outer Arm Cannons Hip Grenade Packs (L-R) Inner Leg Armor Outer Leg Missile Pack Calf Missile Pack Shin Armor Also included is a gunpod weapon accessory and an adjustable display stand, for maximum versatility and poseability.',
    '10300',
    7498,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    1,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-30th-anniversary-1-100-roy-fokker-gbp-1-heavy-armor-veritech/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    5999,
    7498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech 30th Anniversary 1/100 Roy Fokker GBP-1 Heavy Armor Veritech',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    814,
    'deluxe-6-pvc-statue-kakashi',
    'Deluxe 6" PVC Statue: Kakashi',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... Deluxe 6" PVC Statue: Kakashi 6" tall Comes with extra accessories and stand',
    '',
    2499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/deluxe-6-pvc-statue-kakashi/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Deluxe 6" PVC Statue: Kakashi',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    815,
    'hello-sanrio-exclusive-two-pack-set-pochacco-chococat',
    'Hello Sanrio Exclusive Two-Pack Set - Pochacco & Chococat',
    'Hello Sanrio Exclusive Two-Pack Set - Pochacco & Chococat Say hello to the immersive new world of HELLO SANRIO! For the first time, your favorite Sanrio characters are featured all together in a super-cute immersive world filled with fun, friendship and big smiles! This year we debuted the exclusive two-pack Hello Sanrio capsule diorama set with your favorite characters Pochacco & Chococat! Limited to 1,000',
    '11260',
    3999,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/hello-sanrio-exclusive-two-pack-set-pochacco-chococat/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Hello Sanrio Exclusive Two-Pack Set - Pochacco & Chococat',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    816,
    'comic-con-2014-exclusive-hello-kitty-chun-li-coin-bank',
    'Comic Con 2014 Exclusive: Hello Kitty Chun-Li Coin Bank',
    'Everyone can''t seem to get enough of Hello Kitty Chun-Li as the elite martial artist Chun-Li from the hit Street Fighter video game series. Available exclusively at the 2014 Comic Con is this premium vinyl Hello Kitty Chun-Li Coin Bank! Measuring in at 8-inches tall, she will protect your precious loot with her signature Hyakuretsukyaku move! Fans of Street Fighter and Hello Kitty will not want to miss out on this one! Limited to 1000 pieces Size: 8" Tall',
    '13060',
    4999,
    2.0,
    12.0,
    10.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Comic Con 2014 Exclusive Hello Kitty Chun-Li Coin Bank',
    'Hello Kitty Chun-Li Coin Bank Comic Con 2014 Exclusive',
    'sanrio, hello kitty, chun li, coin, bank, money, vinyl, figure, exclusive, toy, cute, kawaii, sdcc, comic con',
    '/comic-con-2014-exclusive-hello-kitty-chun-li-coin-bank/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2014 Exclusive: Hello Kitty Chun-Li Coin Bank',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'vinyl, cute, sanrio, hello kitty, chun li, figure, toy, kawaii, coin, bank, money, exclusive, sdcc, comic con',
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    817,
    'miss-maddy-deluxe-plush',
    'Miss Maddy Deluxe Plush',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Miss Maddy Deluxe Plush Miss Maddy the self-admiring and multi-talented primadonna. Size: 10" tall',
    '10710',
    1998,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/miss-maddy-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miss Maddy Deluxe Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    818,
    'naruto-shippuden-mininja-blind-box-figure',
    'Naruto Shippuden Mininja Blind Box Figure',
    'Naruto Shippuden Mininja Blind Box Figurines - Series 1 The Naruto Shippuden Blind Boxes includes: Sasuke Kakashi Naruto Deidara Sasuri Shikamaru Note: These figurines will come blind boxed. You will be receiving a random figure. No exchanges or returns.',
    '11590',
    1200,
    0.6,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-mininja-blind-box-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Mininja Blind Box Figure',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    819,
    '30th-anniversary-voltron-gift-set',
    '30th Anniversary Voltron Gift Set',
    '30th Anniversary Voltron Gift Set Celebrating 30 years, the legendary Voltron returns! Standing at 11 inches tall (nearly 13 inches with its display base), the 30th Anniversary edition features LED light-up eyes (powered by replaceable batteries), sturdy die-cast and ABS construction, special signature Voltron key badge (that can be used to activate light and sound features on the display base, including the legendary "lion''s roar"), and lion''s-mouth blade accessories, all packaged in the classic retro-styled anniversary box.',
    '10100',
    22499,
    6.0,
    20.0,
    15.0,
    8.5,
    'new',
    '8-19872-01010-5',
    false,
    true,
    'active',
    'none',
    0,
    0,
    '30th Anniversary Voltron Gift Set',
    '30th Anniversary Voltron Gift Set',
    'Voltron, die cast, robot, action figure, lion, lions, toy, collector, collectible, toynami, limited edition, toy nerd, cool',
    '/30th-anniversary-voltron-gift-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    22499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Voltron 30th Anniversary Voltron Gift Set',
    NULL,
    false,
    '10100',
    NULL,
    'Default Tax Class',
    NULL,
    'cool, collectible, Voltron, die cast, robot, action figure, lion, lions, toy, collector, toynami, limited edition, toy nerd',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    820,
    'metal-heat-series-getter-1-action-figure',
    'METAL HEAT Series Getter 1 Action Figure',
    'ITEM IS AVAILABLE FOR PRE-ORDER Materials: Die-cast, ABS, POM, PVC, PET fabricEstimated Shipping: September 2024 Based on the OVA Getter Robo Armageddon, this Getter 1 Mecha action figure is sure to be the next star of your collection. Carefully considered details seek to provide all the charm of the original work and bring the animation to life. Assemble the Trinity Death Beam (Getter Beam) effect and special platform components to recreate the unique Trinity Death Beam scattering scene (Spiral Getter Beam) in the Ryryoma drama!Features include and are not limited to: Highly articulated mecha figure A wide range of attachable hand shapes Effect accessories Two types of basic and giant Getter Wing cloaks (embedded with copper wire for easy jumping poses set up) PRODUCT CONTENTS Getter 1 Body Getter Wing (large) Getter wing Getter Tomahawk x2 Getter Tomahawk Parts x2 Getter Machine Gun x2 Abdomen Part Shoulder Part Open Hand Grip Hand Handles Hand Getter Beam effect parts Getter Beam effect connect parts x8 Getter Beam PET effect parts Display Stand Display Holder',
    '4.89841E+12',
    19999,
    4.0,
    12.0,
    15.0,
    5.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/metal-heat-series-getter-1-action-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    19999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'METAL HEAT Series Getter 1 Action Figure',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    821,
    'hashirama-senju-god-of-shinobi-epic-scale-statue',
    'Hashirama Senju "God of Shinobi" Epic Scale Statue',
    'Twenty years ago, the first chapter of Masashi Kishimoto''s ninja epic was published in Weekly Shonen Jump. Since then, Naruto has grown into one of the best-selling manga and anime of all time. To commemorate the world''s most popular ninja and its legions of fans, Toynami is proud to bring to market the Naruto Shippuden Epic Scale Statues!Now we are presenting the "God of Shinobi," a 1/6 scale statue with a dynamic environment display, featuring interchangeable heads. Each statue is individually numbered, with a limited worldwide production run of 800.We''re delighted to celebrate the history and longevity of NARUTO with this exciting new line of collectibles. Fans can expect at least two more releases following the debut of God of Shinobi. Who''s next? Keep checking our social media for future reveals! ABOUT THE STATUE Approximate dimensions: 16.5" H x 14.0" W x 12.0" D Made of polystone resin and comes with magnetic interchangeable arms with and without sword Comes with magnetic interchangeable heads EDITION SIZE: 800 units',
    '11910',
    67999,
    29.0,
    32.0,
    23.0,
    15.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/hashirama-senju-god-of-shinobi-epic-scale-statue/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    67999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Hashirama Senju "God of Shinobi" Epic Scale Statue',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    822,
    'acid-rain-green-commander-2019-sdcc-exclusive',
    'Acid Rain Green Commander 2019 SDCC Exclusive',
    'Acid Rain Green Commander 2019 SDCC Exclusive',
    'FAV-SP01',
    4999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-green-commander-2019-sdcc-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Green Commander 2019 SDCC Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    823,
    'little-nessies-blind-box-figurine',
    'Little Nessies Blind Box Figurine',
    'We are proud to present the 2nd collection from Miyo''s Mystic Musings, Little Nessies Blind Box Figurines! Right after a rainfall, when the air smells crisp and the sun starts peeking through the clouds, look down at a freshly created puddle. If you see a rainbow reflected within the rippling waters, close your eyes and make a wish. You might be surprised at what you get a glimpse of! Rainbow dappled puddles are where shy but mischievous Nessies emerge to play, splashing each other with their tiny flippers, and bathing in the sparkling light. "The little critters and creatures from Miyo''s Mystic Musings are born from my dreams, meditations and visions from other worlds. My wish is to share my world and my insights with you. Hopefully they will brighten this reality we live in today, with a little quirkiness and fun while still putting a smile on your face." - Miyo Nakamura The Little Nessies Blind Box Figurines are approximately 3" tall and feature: Waves Misty Splash Flow *Each blind box comes with a bonus COLLECT-A-PART piece. Collect all 4 pieces to reveal the bonus figure! Note: These figurines come blind boxed. You will be receiving a random figure. No exchanges or returns.',
    '14560',
    1099,
    0.4,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-nessies-blind-box-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1099,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Nessies Blind Box Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    824,
    'acid-rain-space-scientist',
    'Acid Rain Space Scientist',
    'Acid Rain Space ScientistNorth America Exclusive! Limited to 1,000 units Ready for exploration into the great unknown the Acid Rain Space Scientist is a highly articulated figure standing about 3.75 inches tall. Dressed from head to toe in space flight gear this figure features a removable helmet and a pair of robotic gloves. Also included is a heavy duty storage case. 3.75" Space Scientist figure Astronaut helmet Set of robotic gloves Highly articulated Storage case',
    'AR-1720S',
    3999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-space-scientist/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Space Scientist',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    825,
    'mega-man-fully-charged-clip-on-exclusive',
    'Mega Man: Fully Charged Clip-On Exclusive',
    'Mega Man: Fully Charged Clip-On Exclusive Toynami is excited to introduce a limited edition Mega Man: Fully Charged Clip-on!In celebration of 30 years of the iconic video game property, Mega Man returns in an ALL-NEW animated television series. Coming to Cartoon Network this summer. It''s time to get Meganized! Limited to 1,000 units',
    'CC2018-Megaman',
    1200,
    0.4,
    5.0,
    5.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/mega-man-fully-charged-clip-on-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Mega Man: Fully Charged Clip-On Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    826,
    'naruto-shippuden-mininja-figurines-series-2',
    'Naruto Shippuden Mininja Figurines - Series 2',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... Series 2 Figures include: Sage Mode Naruto Shikamaru Pain Deidara',
    '',
    1200,
    0.5,
    7.0,
    4.0,
    2.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-mininja-figurines-series-2/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Mininja Figurines - Series 2',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    827,
    'acid-rain-sand-bunker-set',
    'Acid Rain Sand Bunker Set',
    'Acid Rain Sand Bunker Set Construction of temporary fortifications and outposts on desert terrains proved highly difficult, Sand TEs often removed protective armor from their transport vehicles to use as shields. In response, the military introduced light weight riot shields shaped like chevaux de frise called Portable Blast Shields (PB Shields ). Amused soldiers nicknamed PB Shields "Sandbags", which can be installed on Armored Trailers to improve defenses or used to build temporary "Bunkers".1:18 scale Sand Bunker Set Includes: Sand Tactical Engineer x 1, PB-ShieldsSandbagx 2, Iron FistTrench Knife x 1, AP2 Pistol x 2, ASMG6 Submachine Gun x 1, AAR7 Assault Rifle x 1, AMBF17 Machine gun x 1',
    'FAV-A04',
    4999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-sand-bunker-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Sand Bunker Set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    828,
    'robotech-30th-anniversary-1-100-rick-hunter-gbp-1j-heavy-armor-veritech',
    'Robotech 30th Anniversary 1/100 Rick Hunter GBP-1J Heavy Armor Veritech',
    'Rick Hunter GBP-1J Heavy Armor Veritech Long awaited by fans, we are excited to offer the Robotech 1/100 scale GBP-1 Heavy Armored Veritechs! Like the original Transformables, each action figure stands approximately 6 inches tall, is fully articulated, and can be converted into Fighter, Battloid or Gerwalk modes. The Armored Veritech GBP-1 system allows a single VF-1 fighter to wield the artillery firepower of an entire squadron. The armor is able to withstand several withering barrages from enemy fire, but prevents the Veritech from transforming into fighter mode, and must be jettisoned if the pilot needs maneuverability. *Heavy Armor accessories can only be used in Battloid mode. Includes: Boosters (L-R) Chest Missile Pack Shoulder Missile Packs Inner & Outer Arm Cannons Hip Grenade Packs (L-R) Inner Leg Armor Outer Leg Missile Pack Calf Missile Pack Shin Armor Also included is a gunpod weapon accessory and an adjustable display stand, for maximum versatility and poseability.',
    '10310',
    7498,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-30th-anniversary-1-100-rick-hunter-gbp-1j-heavy-armor-veritech/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    5999,
    7498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech 30th Anniversary 1/100 Rick Hunter GBP-1J Heavy Armor Veritech',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/26/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    829,
    'macross-calibre-wings-1-72-f-14-un-spacy-max-type',
    'Macross Calibre Wings 1:72 F-14 UN Spacy MAX TYPE',
    '1:72 scale F-14 UN Spacy MAX TYPE from Calibre Wings! The F-14 UN SPACY MAX TYPE is an amazing die-cast metal model based of Max''s Mecha. These incredible sculpts are actually licensed from Northop Grumman and are built from Northop''s actual CAD designs for the F-14, bringing an incredible level of realism and accuracy to the fighter. Features include: All-metal body Geared swing wings Display stand Rubber landing wheels Opening cockpit Pilot figures Detachable missiles Detachable fuel tanks Limited edition collector''s serialized card PLEASE NOTE THAT WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'CA72RB03',
    13999,
    4.0,
    12.0,
    4.0,
    11.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    2,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-calibre-wings-1-72-f-14-un-spacy-max-type/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    13999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Calibre Wings 1:72 F-14 UN Spacy MAX TYPE',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    830,
    'unkl-hamz-critter-plush',
    'UNKL Hamz Critter Plush',
    'From the creative minds at UNKL comes the all new Hamz Critter plush! Famous for their masterful urban vinyl creations, the guys at UNKL have now brought one of their adorable Critter characters to life in plush format. Hamz brings instant comfort during the most stressful situations, just grab hold of this guy and all your troubles will vanish. Don''t miss out on this cute collectible 10" plush! Limited to 1200 worldwide10" Plush',
    '1749',
    1998,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00955-7',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'SDCC 2013 Exclusive UNKL Hamz Critter Plush',
    'SDCC 2013 Exclusive UNKL Hamz Critter Plush',
    'toy, sdcc, comicon, toynami, hamz, critter, plush, unipo, unkl, cute, hamster, doll, exclusive',
    '/unkl-hamz-critter-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'UNKL Hamz Critter Plush',
    NULL,
    false,
    '1749',
    '8-16355-00955-7',
    'Default Tax Class',
    NULL,
    'hamz, critter, plush, toy, unipo, unkl, sdcc, comicon, cute, hamster, toynami, doll',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    831,
    'comic-con-2014-exclusive-skelanimals-cute-as-hell-diego-plush',
    'Comic Con 2014 Exclusive: Skelanimals "Cute-As-Hell" Diego Plush',
    'Comic Con 2014 Exclusive Skelanimals Diego Cute-As-Hell Plush: Entertainment One Licensing is pleased to reveal this year''s exclusive Skelanimals release for San Diego Comic-Con: the "Cute-As-Hell" Diego! The latest in a series of collectible, limited-edition Skelanimals plush by Toynami, Cute-As-Hell Diego is distinguished by a red plush body and black hand stitching. This fan favorite character loves to cuddle during scary movies, but don''t sleep on this exclusive opportunity-this plush bat is limited to 1,000 pieces! Skelanimals are adorable little animals who have met an untimely end-mostly due to their own reckless and ill-advised behavior. The Skelanimals characters-a cat, rabbit, dog, and monkey, among others-are brought to life through funny poems describing their demise. They may be dead, but they are also light-hearted, cute and cuddly. Only 1,000 produced Size: 10" tall',
    'CC2014-Diego',
    2499,
    1.0,
    9.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Skelanimals Diego Plush Comic Con 2014 Exclusive',
    'Skelanimals Diego Plush Comic Con 2014 Exclusive',
    'skelanimals, diego, bat, red, plush, toy, cute, hell, goth, toy, exclusive, comic con, sdcc',
    '/comic-con-2014-exclusive-skelanimals-cute-as-hell-diego-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2014 Exclusive: Skelanimals "Cute-As-Hell" Diego Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, cute, toy, exclusive, sdcc, comic con, diego, bat, red, plush, hell, goth',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    832,
    'comic-con-2017-exclusive-sage-mode-naruto-figurine',
    'Comic Con 2017 Exclusive: Sage Mode Naruto Figurine',
    'We''re celebrating the return of Naruto to Toynami with our Mininja line of Super-Deformed figurines featuring this 2017 exclusive Naruto in Sage mode! This Naruto exclusive is limited in production to 1,000 units!',
    'WC2017-Naruto',
    1500,
    0.6,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/comic-con-2017-exclusive-sage-mode-naruto-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Comic Con 2017 Exclusive: Sage Mode Naruto Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    833,
    'acid-rain-laurel-airbourne',
    'Acid Rain Laurel Airbourne',
    'Acid Rain Laurel Airbourne Acid Rain presents the new Acid Rain Laurel Airbourne, affiliated to the 303rd Marine Team of Agurts. This item is set in the 1:18 scale, painted with a new military color scheme and highly detailed weathering effect. The Laurel Airbourne comes inclusive with Laurel Airbourne pilot, submachine gun and parachute armor. Features: 1 Laurel Airbourne 1 Laurel Airbourne pilot 1 Parachute Armor 1 Submachine gun',
    'AR-1730S',
    10999,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-laurel-airbourne/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    10999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Laurel Airbourne',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    834,
    'gloomy-deluxe-plush',
    'Gloomy Deluxe Plush',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Gloomy Deluxe Plush Gloomy the bold and adventurous mushroom girl. Size: 10" tall',
    '10690',
    1998,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/gloomy-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Gloomy Deluxe Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    835,
    'little-nimbus-special-edition-figurines-set-2021-convention-exclusive',
    'Little Nimbus Special Edition Figurines Set - 2021 CONVENTION EXCLUSIVE',
    'Little Nimbus Special Edition Figurines Set - 2021 CONVENTION EXCLUSIVE On a moonless night, nothing makes your heart flutter as much as spotting a shooting star. Some of these shooting stars fall amongst clustered storm clouds, and this is where baby nimbuses are born. When lightning streaks and thunder rolls, you might hear the clippity-clop of little nimbus hooves. These exclusive new babies were just born and need a safe haven to grow! Only 500 sets in this rambunctious bunch. Won''t you adopt them today? Officially licensed by Miyo. This exclusive limited edition set comes packed 4 styles in one box: Aurora, Midnight, Dawn, and Sunshine nimbuses! Each one is approximately 2.5" tall. Artist: Miyo, sculptor and creator of Miyo''s Mystic Musings. Set includes: Aurora, Midnight, Dawn, and Sunshine Limited to 500 sets Limit 2 per customer PLEASE NOTE ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'D-CON2021',
    5499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    -7,
    NULL,
    NULL,
    NULL,
    '/little-nimbus-special-edition-figurines-set-2021-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Nimbus Special Edition Figurines Set - 2021 CONVENTION EXCLUSIVE',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    836,
    '30th-anniversary-voltron-jumbo-lion-force-vinyl',
    '30th Anniversary Voltron Jumbo Lion Force Vinyl',
    '30th Anniversary Voltron Jumbo Lion Force Vinyl Voltron gets the epic Jumbo treatment in this retro vinyl rendition to celebrate its 30th Anniversary! Towering at a colossal 24 inches tall, this Voltron Jumbo, just like the classic giant robots you knew and loved from the 1970s, features spring-loaded firing fists and freewheeling rolling feet!',
    '10110',
    24999,
    9.0,
    15.0,
    27.0,
    9.0,
    'new',
    '8-19872-01011-2',
    false,
    true,
    'active',
    'none',
    0,
    0,
    '30th Anniversary Voltron Jumbo Lion Force Vinyl',
    '30th Anniversary Voltron Jumbo Lion Force Vinyl',
    'voltron, jumbo, machinder, shogun warriors, toynami, blow mold, retro, 70s, toy, giant, robot',
    '/30th-anniversary-voltron-jumbo-lion-force-vinyl/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    24999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Voltron 30th Anniversary Voltron Jumbo Lion Force Vinyl',
    NULL,
    false,
    '10110',
    NULL,
    'Default Tax Class',
    NULL,
    'voltron, jumbo, machinder, shogun warriors, toynami, blow mold, retro, 70s, toy, giant, robot',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    837,
    'acid-rain-b2five-agurts-beaver-wf4w',
    'Acid Rain B2Five Agurts Beaver WF4w',
    'Acid Rain B2Five Agurts Beaver WF4w Introducing the newest line in Acid Rain: Acid Rain B2Five by Beaver. Features: 1:28 SCALE MILITARY INFANTRY UNIT ARMORED VEHICLE SWITCHES BETWEEN 2 FORMS STANDARD JOINT FOR INTERCHANGEABLE PARTS FULL ARTICULATION AND POSEABLE 21 JOINTS ACTION FIGURE INCLUDED Includes: Beaver WF4w x1 Pilot x1 Drill x2 Engineer Tools Set x1',
    'BW4_01',
    7998,
    2.0,
    14.0,
    10.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-b2five-agurts-beaver-wf4w/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    7998,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain B2Five Agurts Beaver WF4w',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    838,
    'acid-rain-sand-tactical-engineer',
    'Acid Rain Sand Tactical Engineer',
    'Acid Rain Sand Tactical Engineer The Antbike''s success in improving logistic needs for the 88th Sand Team prompted the Agurts military to form mechanized tactical logistics teams with a brand new unit - the TE, or Tactical Engineer. Equipped with powerful weapons and seasoned by gruelling combat training, TEs are the special ops of the engineering world. Not only can they clear obstacles, pave bridges and fortify buildings, TEs can also pulverize enemies with deadly vengeance. TEs work on the forefront of battle zones without protection from infantry units. Upon encountering enemy forces, they will immediately become the front lines of resistance.1:18 scale Sand Tactical Engineer Includes: Sand Tactical Engineer x 1, Iron FistTrench Knife x 1, AP2 Pistol x 2, AAR7 Assault Rifle x 1',
    'FAV-A05',
    3499,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-sand-tactical-engineer/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Sand Tactical Engineer',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    839,
    'deluxe-6-pvc-statue-ichigo',
    'Deluxe 6" PVC Statue: Ichigo',
    'BLEACH, created by Tite Kubo, made its debut as manga in the pages of SHONEN JUMP, made the leap to television in Japan in 2004, and can currently be seen on CARTOON NETWORK''s Adult Swim. BLEACH tells the story of Ichigo, a high-school student with the ability to see ghosts, and his adventures with the Soul Reaper Rukia, as they search for ghosts and cleanse their evil spirits. Deluxe 6" PVC Statue: Ichigo 6" tall Comes with extra accessories and stand',
    '',
    2499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/deluxe-6-pvc-statue-ichigo/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Deluxe 6" PVC Statue: Ichigo',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    840,
    'pre-order-deposit-the-new-generation-yr-052f-transformable-cyclone',
    'PRE-ORDER DEPOSIT: The New Generation YR-052F Transformable Cyclone',
    'THIS ITEM PAGE IS FOR A 10% PRE-ORDER DEPOSIT. PLEASE NOTE THAT THE REMAINING COSTS (INCLUDING SHIPPING AND HANDLING) WILL HAVE TO BE PAID WHEN ITEM IS READY TO SHIP.RETAIL PRICE: $179.99, REQUIRED DEPOSIT $18.00 (TAX & SHIPPING NOT INCLUDED) ESTIMATED SHIPPING IS NOW FEBRUARY 2025 FOR ALL NEW ORDERS Following the successful deployment of the VR-030 and VF-040 series, the VR-050 series combined the best elements of previous Cyclone designs into one package, resulting in the final production model, the VR-052. In collaboration with Moshotoys, Toynami is proud to present the next evolution of the VR Cyclone: the YR-052F. These highly advanced Cyclones are used by the main characters for both combat and travel. They can transform into battle armor mode and are a key aspect of the New Generation''s fighting capabilities. These highly detailed Cyclones are made from die-cast metal, POM, and plastic injection parts, weighing over 1.5 kg in Battle Armor Mode and 2.4 kg with the base and accessories. Accessories include the EP-40 Pistol and 10 interchangeable hands for dynamic posing. Specifications: Cycle Mode: Length: 270 mm Height: 150 mm Depth: 75 mm Pilot: Height: 250 mm Width: 130 mm Depth: 70 mm Battle Armor Mode: Height: 290 mm Width: 190 mm Depth: 170 mm',
    'P12900',
    1800,
    10.0,
    12.0,
    16.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/pre-order-deposit-the-new-generation-yr-052f-transformable-cyclone/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1800,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    true,
    'PRE-ORDER DEPOSIT: The New Generation YR-052F Transformable Cyclone',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    841,
    'comic-con-2017-exclusive-b2five-stealth-mk1e-set',
    'Comic Con 2017 Exclusive: B2Five Stealth MK1e set',
    'Introducing the newest line of Acid Rain items: Acid Rain B2Five by Beaver. Acid Rain B2Five made its debut at SDCC 2017 with the Stealth MK1e convention exclusive! The Stealth MK1e set is a transformable, 4-wheel motorbike and armored vehicle, which stands approximately 3.5" tall. This set also includes a 2.5" military infantry figure that is fully poseable with 21 joints of articulation. The new B2Five line will come with standard joints, making for an easy interchange of figurine parts. You won''t want to miss out on this amazing exclusive! Size: 2.5" Tall Figure Limited in production',
    'BW0_02',
    3999,
    2.0,
    7.0,
    5.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/comic-con-2017-exclusive-b2five-stealth-mk1e-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2017 Exclusive: B2Five Stealth MK1e set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    842,
    'acid-rain-forseti-viking-shield',
    'Acid Rain Forseti Viking Shield',
    'Acid Rain Forseti Viking Shield Acid Rain presents the new Forseti - Viking Shield, a great addition to the Acid Rain collection!The Forseti comes inclusive with an armored viking ready for snow battle! A submachine gun, a helmet with goggles that hinge open and a packing box that matches perfectly with the Laurel scale. 3.75" Forseti figure Submachine gun Helmet with goggles Storage case',
    'AR-1620S',
    2999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-forseti-viking-shield/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Forseti Viking Shield',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    843,
    'robotech-30th-anniversary-1-100-max-sterling-gbp-1j-heavy-armor-veritech',
    'Robotech 30th Anniversary 1/100 Max Sterling GBP-1J Heavy Armor Veritech',
    'Max Sterling GBP-1J Heavy Armor Veritech Long awaited by fans, we are excited to offer the Robotech 1/100 scale GBP-1 Heavy Armored Veritechs! Like the original Transformables, each action figure stands approximately 6 inches tall, is fully articulated, and can be converted into Fighter, Battloid or Gerwalk modes. The Armored Veritech GBP-1 system allows a single VF-1 fighter to wield the artillery firepower of an entire squadron. The armor is able to withstand several withering barrages from enemy fire, but prevents the Veritech from transforming into fighter mode, and must be jettisoned if the pilot needs maneuverability. *Heavy Armor accessories can only be used in Battloid mode. Includes: Boosters (L-R) Chest Missile Pack Shoulder Missile Packs Inner & Outer Arm Cannons Hip Grenade Packs (L-R) Inner Leg Armor Outer Leg Missile Pack Calf Missile Pack Shin Armor Also included is a gunpod weapon accessory and an adjustable display stand, for maximum versatility and poseability.',
    '10320',
    7498,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-30th-anniversary-1-100-max-sterling-gbp-1j-heavy-armor-veritech/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    5999,
    7498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech 30th Anniversary 1/100 Max Sterling GBP-1J Heavy Armor Veritech',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/04/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    844,
    'comic-con-2014-exclusive-robotech-chibi-skull-leader-vf-1s-in-military-gray',
    'Comic Con 2014 Exclusive: Robotech Chibi Skull Leader VF-1S in Military Gray',
    'Comic Con 2014 Exclusive Robotech Chibi Skull Leader VF-1S in Military Gray Protecting Earth from alien conquest has never been more adorable! Strap into your Veritech and get ready for the 30th Anniversary of Robotech in 2015! Your favorite mecha get a chibi makeover in the Robotech Super Deformed Blind Box collection. Toynami is excited to present the debut figure - the highly revered Skull Leader VF-1S Comic-Con Exclusive in military gray. These are sure to go fast, get yours while they last! Limited to 2,000 pieces Size: 3" Tall',
    'CC2014-Robotech',
    1998,
    0.5,
    7.0,
    5.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Comic Con 2014 Exclusive Robotech Chibi Skull Leader VF-1S in Military Gray',
    'Comic Con 2014 Exclusive Robotech Chibi Skull Leader VF-1S in Military Gray',
    'Robotech, macross, rick hunter, vf-1s, military, gray, mecha, chibi, cute, exclusive, comic con, skull leader, super, deformed',
    '/comic-con-2014-exclusive-robotech-chibi-skull-leader-vf-1s-in-military-gray/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Comic Con 2014 Exclusive: Robotech Chibi Skull Leader VF-1S in Military Gray',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'cute, exclusive, comic con, Robotech, macross, rick hunter, vf-1s, military, gray, mecha, chibi, skull leader, super, deformed',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    845,
    'bubble-deluxe-plush',
    'Bubble Deluxe Plush',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Bubble Deluxe PlushBubble the shy mushroom boy. Size: 10" tall',
    '10680',
    1998,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/bubble-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Bubble Deluxe Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    846,
    'macross-calibre-wings-1-72-f-14-un-spacy-milia-type',
    'Macross Calibre Wings 1:72 F-14 UN Spacy MILIA TYPE',
    '1:72 scale F-14 UN Spacy MILIA TYPE From Calibre Wings! The F-14 UN SPACY MAX TYPE is an amazing die-cast metal model based of Milia''s Mecha. These incredible sculpts are actually licensed from Northop Grumman and are built from Northop''s actual CAD designs for the F-14, bringing an incredible level of realism and accuracy to the fighter. Features include: All-metal body Geared swing wings Display stand Rubber landing wheels Opening cockpit Pilot figures Detachable missiles Detachable fuel tanks Limited edition collector''s serialized card PLEASE NOTE THAT WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'CA72RB04',
    13999,
    4.0,
    12.0,
    4.0,
    11.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    2,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-calibre-wings-1-72-f-14-un-spacy-milia-type/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    13999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Calibre Wings 1:72 F-14 UN Spacy MILIA TYPE',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    847,
    'acid-rain-sand-armored-trailer-set',
    'Acid Rain Sand Armored Trailer Set',
    'Acid Rain Sand Armored Trailer Set Mechanized tactical logistics teams are formed by various units such as TEs, Transporters and Medics, who all follow the commands of the TL Sergeant. The size of each team depends on the scale of the mission. In addition to leading the team, the TL Sergeant is responsible for ensuring the timely delivery of resources to their destinations.Since desert sandstorms often damage the operating systems of high-tech vehicles, Sand TL Sergeants prefer to use durable, lightweight Armored Trailers to transport troops and supplies. Armored Trailers can also link light vehicles such as Wildebeests to their rear.1:18 scale Sand Armored Trailer Set Includes: Sand TL Sergeant x 1, Armored Trailer x 1, Iron FistTrench Knife x 1, AP2 Pistol x 2, ASMG6 Submachine Gun x 1, ARL11 Bazooka x 1, Vehicle Rack x 1, Railing x 1',
    'FAV-A06',
    7498,
    2.0,
    12.0,
    6.0,
    9.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-sand-armored-trailer-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    7498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Sand Armored Trailer Set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    848,
    'sdcc-2011-exclusive-canman-alex-pardee',
    'SDCC 2011 Exclusive: Canman Alex Pardee',
    'Alex Pardee put his twist on this 2011 Comic-Con Canmans Exclusive. Only 200 pieces were produced. The Canmans are a series of vinyl figures focused on graffiti artists and the art of collecting spray paint cans.Alex Pardee''s unique style is inspired from watching years of horror movies, writing graffiti, and listening to gangster rap. His work best represents that of a vibrant undead circus sideshow. Final pieces are often brought to life by translating random shapes and colors into signs of torment and absurdity. By juxtaposing these two conflicting moods, Alex makes his works more personal to his viewers, forcing them to project their own feelings and emotions onto each character in his twisted universe.Limited to 200 worldwideBoxed SDCC 2011 ExclusiveMoveable arms and detachable top pops off to reveal hollow storage inside7" tall',
    'CC-2011-CanMan',
    4999,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'SDCC 2011 Exclusive Alex Pardee Canman',
    'SDCC 2011 Exclusive Alex Pardee Canman',
    'canman, canmans, graffiti, collectible, exclusive, spray paint, alex pardee, artist, sdcc, comicon, toynami, stash, can',
    '/sdcc-2011-exclusive-canman-alex-pardee/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'SDCC 2011 Exclusive: Canman Alex Pardee',
    NULL,
    false,
    'CC-2011-CanMan',
    NULL,
    'Default Tax Class',
    NULL,
    'alex pardee, toynami, canman, canmans, graffiti, collectible, sdcc, exclusive, comicon, spray paint',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    849,
    'naruto-six-paths-sage-mode-1-1-bust-deposit-only',
    'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)',
    'PLEASE NOTE THAT THIS IS NOT THE TOTAL PRICE FOR THE ITEM. THIS PAGE IS FOR THE PRE-ORDER DEPOSIT ONLY! TOTAL PRICE IS $1299.99 USD (TAX AND SHIPPING NOT INCLUDED) CUSTOMERS WHO SUBMIT DEPOSIT WILL BE NOTIFIED WHEN ITEM IS AVAILABLE AND READY TO SHIP. AN ADDITIONAL TRANSACTION WILL BE REQUIRED TO SECURE PRE-ORDERED ITEM. Toynami is pleased to announce the expansion of its popular NARUTO SHIPPUDEN product line, with Life-Size 1:1 Scale Busts! Naruto also ended up receiving the Six Paths Senjutsu from the Sage of Six Paths and when combined with his Sage Mode, it gave rise to one of his strongest forms called the Six Paths Sage Mode. In this form, Naruto became strong enough to fight the likes of Madara Uchiha and even Kaguya Otsutsuki. Furthermore, Six Paths Senjutsu allowed him to create the Truth-Seeking Balls and made him incredibly versatile in combat. His sensory powers were heightened to the next level and his strength rose to a level great enough to overpower even the strongest of enemies. Naruto''s first taste of the Six Paths Sage Mode came after he fell at the hands of Madara Uchiha in the Fourth Great Ninja War. Having Kurama ripped from his body, Naruto was on the brink of death and while the likes of Gaara and Minato were attempting to save him, Naruto met the spirit of Hagoromo Otsutsuki. Being the reincarnation of Asura Otsutsuki, Naruto was offered half the power of the Sage, while Sasuke was given the other half. Upon returning to consciousness, Naruto had gained the incredible ability of the Six Paths Sage Mode. To put it simply, the Six Paths Sage Mode is a power that Hagoromo Otsutsuki gifted to him for having a strong will and the guts to never give up. This power is quite similar to Sage Mode in that it makes use of natural energy, or Senjutsu chakra, however, the scale at which it allows him to perform techniques is much bigger. Limited to 300 units!!',
    '12600-a',
    25980,
    74.0,
    26.0,
    30.0,
    23.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-six-paths-sage-mode-1-1-bust-deposit-only/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    129999,
    25980,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    850,
    'acid-rain-valdo-2021-convention-exclusive',
    'Acid Rain Valdo - 2021 CONVENTION EXCLUSIVE',
    'Acid Rain FAV-SP18 Valdo - 2021 Convention Exclusive On the Omangan battlefield, losing a limb or two is no excuse to retire from the frontlines. Cybernetic prosthetic technologies can reforge disabled soldiers with metallic bodies. A captain of Omanga''s southern border patrol, Valdo was given the Devil''s mechanical arm to better defend the frontiers. He dyed this sinful arm orange to remind himself of all the blood it spilled. He covered this arm with a glove whenever he was away from the battlefield, concealing the orange from the general public. Includes: Valdo figure Submachine Gun 2021 Worldwide Exclusive Limited quantities for N. America Limit 2 per customer PLEASE NOTE ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'FAV-SP18',
    6998,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    -4,
    NULL,
    NULL,
    'acid rain, sdcc 2021, fav-sp18',
    '/acid-rain-valdo-2021-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    10,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Valdo - 2021 CONVENTION EXCLUSIVE',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    851,
    'acid-rain-flame-trooper',
    'Acid Rain Flame Trooper',
    'Acid Rain Flame Trooper Flame Trooper of the Omanga Military is highly poseable with 30 points of articulation. This 1:18 military action figure is fully-painted with highly-detailed weathering effects. A deadly force to be reckoned with. With orange stripes on their armor and equipped with portable flamethrowers, the Flame Troopers have been improved by the Omanga Army to increase the arc and distance of flame jetting. They can project a stream of ignited flammable liquid into the trenches and bunkers of the enemy. Assisted by other soldiers, the Troopers are responsible for the second round of attacks in raids on the remaining hidden soldiers. They are seen as a powerful and scary force in the military. Features: 1 Flame Trooper 1 Flame Thrower 1 Sub Machine Gun',
    'AR-1690S',
    3299,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-flame-trooper/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3299,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Flame Trooper',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    852,
    'acid-rain-amphista',
    'Acid Rain Amphista',
    'Acid Rain Amphista Acid Rain Amphista, affiliated to the Agurts army''s 88th Sand Team. This item is set in the 1:18 scale, painted with military sand color scheme and highly detailed weathering effect. The Amphista comes inclusive with Sand Corporal figure, transformable all terrain vehicle, G18s pistol, stricker6 shotgun, machine gun MG09b and a mini gun. The joints are highly flexible, the smallest gear can be stored in the tactical backpack, which can also be clipped onto the roll cage. Sand Corporal G18s Pistol Stricker6 Shotgun Machine Gun MG09b Mini Gun Backpack',
    'AR-1560S',
    9999,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-amphista/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    9999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Amphista',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    853,
    'shogun-warriors-1964-godzilla-jumbo',
    'Shogun Warriors 1964 Godzilla Jumbo',
    'Shogun Warriors 1964 Godzilla Jumbo Godzilla returns in this retro vinyl rendition! Standing at 20 inches tall, this Godzilla Jumbo, is ready to do battle with the classic giant robots you knew and loved from the 1970s. Features a flicking fire-tongue, spring-loaded firing fists and freewheeling rolling feet!',
    '10600',
    24999,
    8.0,
    19.0,
    21.0,
    9.0,
    'new',
    '8-19872-01060-0',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Shogun Warriors 1964 Godzilla Jumbo',
    'Shogun Warriors 1964 Godzilla Jumbo',
    'godzilla, shogun, warriors, jumbo, machinder, blow mold, toy, collectible, dinosaur, roar, japan, anime, japanime, toynami, nerd, cool, retro, 70s, toy, giant, robot',
    '/shogun-warriors-1964-godzilla-jumbo/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    24999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Shogun Warriors 1964 Godzilla Jumbo',
    NULL,
    false,
    '10600',
    NULL,
    'Default Tax Class',
    NULL,
    'godzilla, shogun, warriors, jumbo, machinder, blow mold, toy, collectible, dinosaur, roar, japan, anime, japanime, toynami, nerd, cool, retro, 70s, toy, giant, robot',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    854,
    'pre-order-deposit-voltron-40th-anniversary-collectors-set',
    'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''s Set',
    'THIS ITEM PAGE IS FOR A 10% PRE-ORDER DEPOSIT. PLEASE NOTE THAT THE REMAINING COSTS (INCLUDING SHIPPING AND HANDLING) WILL HAVE TO BE PAID WHEN ITEM IS READY TO SHIP.RETAIL PRICE: $299.99, REQUIRED DEPOSIT $30.00 (TAX & SHIPPING NOT INCLUDED) ESTIMATED SHIPPING IS FEBRUARY 2025 VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET Fully transformable collectible includes never-before-seen light and sound features! Toynami is proud to announce that its upcoming VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET is now available for retailers to order! This limited-edition collectible will only be produced for the 40th anniversary, consisting of five fully transformable lions that unite to form Voltron, Defender of the Universe! Each lion, constructed of die-cast metal, will feature light-up eyes, activated by a unique magnetic key. When united, Voltron stands over 13 inches tall on an updated electronic light-up base, featuring a sequenced transformation sound file that is officially licensed by legendary voice actor Neil Ross. Incorporated into the base are storage positions for all five of the lions'' individual weapon blades. Also included is Voltron''s sword and shield. In addition, the upcoming VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET will feature contributions from VOLTRON''s original designer, legendary Toy Mechanic Designer Katsushi Murakami! Murakami, former managing director of toy companies POPY and Bandai, is known for his designs for landmark toy lines like CHOGOKIN, SUPER SENTAI, BEAST KING GOLION and ARMOURED FLEET DAIRUGGER XV. Voltron fans can look forward to never-before-seen artwork and behind-the-scenes insights as part of the VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET package! The 40th Anniversary has the following added features from its predecessors. Diecast lions made with zinc alloy. All new remaster Lion Heads on all Lions - now with light-up LED feature Updated electronic light-up base, featuring a sequenced transformation sound file that is officially licensed by legendary voice actor Neil Ross Updated weapons and accessories with corresponding colors Made with ABS, Zinc Alloy, POM, and PVC.',
    'P13600',
    3000,
    8.0,
    20.0,
    14.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/pre-order-deposit-voltron-40th-anniversary-collectors-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3000,
    0,
    5,
    NULL,
    NULL,
    0,
    NULL,
    true,
    'Voltron PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''s Set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    855,
    'fred-deluxe-plush',
    'Fred Deluxe Plush',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Fred Deluxe Plush Fred the adorable monster that longs to be frightening but never succeeds. Size: 10" tall',
    '10700',
    2495,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/fred-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2495,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Fred Deluxe Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    856,
    'comic-con-2014-exclusive-unkl-10-unipo-batman',
    'Comic Con 2014 Exclusive: UNKL 10" UniPo Batman',
    '10" Vinyl UNKL DC Batman Introducing the debut character from UNKL Presents DC Comics'' Heroes and Villians Blind Box Collection. More powerful than a locomotive, and just about as subtle...Inside this box you won''t find keys to the Batmobile, breath mints or the meaning of life, you''ll find something even better: The original 3" Batman UniPo magnified 340% exclusively for Comic-Con. He''s a "Bigger, Badder Bat" at 11" tall (including the ears). You might say if crime didn''t pay before, it''s in the poorhouse now. Limited to 200 pieces Size: 10" Tall',
    '13100',
    19999,
    5.0,
    15.0,
    14.0,
    13.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Comic Con 2014 Exclusive UNKL 10" UniPo Batman',
    'Comic Con 2014 Exclusive UNKL 10" UniPo Batman',
    'batman, unkl, unipo, urban, vinyl, dc, comic, comic con, sdcc, nycc, exclusive, toynami, toy, collectible',
    '/comic-con-2014-exclusive-unkl-10-unipo-batman/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    19999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2014 Exclusive: UNKL 10" UniPo Batman',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'vinyl, batman, toy, exclusive, sdcc, comic con, unkl, unipo, urban, comic, nycc, toynami, collectible',
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    857,
    'deluxe-6-pvc-statue-rukia',
    'Deluxe 6" PVC Statue: Rukia',
    'BLEACH, created by Tite Kubo, made its debut as manga in the pages of SHONEN JUMP, made the leap to television in Japan in 2004, and can currently be seen on CARTOON NETWORK''s Adult Swim. BLEACH tells the story of Ichigo, a high-school student with the ability to see ghosts, and his adventures with the Soul Reaper Rukia, as they search for ghosts and cleanse their evil spirits. Deluxe 6" PVC Statue: Rukia 6" tall Comes with extra accessories and stand',
    '',
    2499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/deluxe-6-pvc-statue-rukia/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Deluxe 6" PVC Statue: Rukia',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    858,
    'altimite-dx-transforming-voltron',
    'Altimite DX Transforming Voltron',
    '30th Anniversary Altimite DX Transforming Voltron This is Voltron as you''ve never seen before! Super Deformed! Fully Transformable! Mini-Pilot Figures included! The 5 lions will form Voltron, and each transform separately. Includes shield & blazing sword accessories. Sturdy construction, Made of plastic composites (ABS, POM, PE)',
    '10140',
    13500,
    3.0,
    16.0,
    12.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/altimite-dx-transforming-voltron/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    13500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Voltron Altimite DX Transforming Voltron',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    859,
    'acid-rain-field-vanguard',
    'Acid Rain Field Vanguard',
    'Acid Rain Field Vanguard Clad in rainproof and dustproof uniforms, Agurts'' 88th F109 Field Vanguards provide auxiliary combat support for main forces fighting on the frontlines. Equipped with large tactical backpacks, they often embark on field expeditions and liaison missions that last months at a time. 1:18 scale Field Vanguard Includes: Field Vanguard x1, AR9 Assault Rifle x1, AP2 Pistol x2, Iron Fist Trench Knife x1, Grenade x2, Tactical Backpack x1, Rainhat x1',
    'FAV-A13',
    3499,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-field-vanguard/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Field Vanguard',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    860,
    'mospeada-cyclone-limited-edition-vinyl-figure-stick',
    'Mospeada Cyclone Limited Edition Vinyl Figure - STICK',
    'STICK - CYCLONE RIDE ARMOR LIMITED EDITION VINYL! TOYNAMI X Jerome Lu (Hyperactive Monkey) collaboration which made its debut at Designer-Con! From the classic Japanese anime series Genesis Climber MOSPEADA comes the exclusive collectible Stick Bernard! Figure is brought to you in an amazingly detailed and fun 8" collectible vinyl format! Limited to 250 units each Officially licensed show exclusive Limit 2 per customer PLEASE NOTE ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    '',
    8999,
    3.0,
    12.0,
    6.0,
    9.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/mospeada-cyclone-limited-edition-vinyl-figure-stick/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    8999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Mospeada Cyclone Limited Edition Vinyl Figure - STICK',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    861,
    'acid-rain-nana-neo-atlantis-mascot-2021-convention-exclusive',
    'Acid Rain Nana (Neo Atlantis Mascot) - 2021 Convention Exclusive',
    'Acid Rain FAV-SP19 Nana (Neo Atlantis Mascot) - 2021 Convention Exclusive The famous mascot of Neo Atlantis, Nana often appears in her company''s celebrations and promotional activities. Only insiders know that beneath the iconic costume, Nana is an elite security agent ready to counter any sabotage Neo Atlantis may face. Includes: Nana figure Strap Briefcase Stapler submachine gun 2021 Worldwide Exclusive Limited quantities for N. America Limit 1 per customer Please note: All sales are final. Please make sure you want to go through with the purchase before completing the transaction. We are not able to accept cancellation requests. We do not guarantee mint condition packaging. If the packaging has a slight ding or crease, it is not subject to a return or exchange.',
    'FAV-SP19',
    6498,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    -3,
    NULL,
    NULL,
    'acid rain, sdcc 2021, fav-sp19, nana',
    '/acid-rain-nana-neo-atlantis-mascot-2021-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Nana (Neo Atlantis Mascot) - 2021 Convention Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    862,
    'acid-rain-laurel-corpse',
    'Acid Rain Laurel Corpse',
    'Acid Rain Laurel Corpse Laurel Corpse is the fully rusted version of Laurel. It''s a 1:18 scale fully painted military powered suit with highly detailed weathering effects. The cockpit with hatch features a linked mechanical structure between hatch and main engine, and is built to accommodate the "Corpse" pilot (included) or any other 3.75 inch figure. Different from Laurel Marine, the pilot is a corpse with detailed sculpting and dead-body color scheme. Instead of a robotic arm, a heavy machine gun is used for left arm. 3.75" Corpse pilot figure Laurel Corpse Vehicle Rifle Masked Head Helmet',
    'AR-1550S',
    9999,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-laurel-corpse/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    9999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Laurel Corpse',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    863,
    'macross-calibre-wings-1-72-f-14-vf-1d-convention-exclusive',
    'Macross Calibre Wings 1:72 F-14 VF-1D Convention Exclusive',
    '1:72 scale F-14 VF-1D CONVENTION EXCLUSIVE from Calibre Wings! The F-14 VF-1D is an amazing die-cast metal model based of Max''s Mecha. These incredible sculpts are actually licensed from Northop Grumman and are built from Northop''s actual CAD designs for the F-14, bringing an incredible level of realism and accuracy to the fighter. Features include: All-metal body Geared swing wings Display stand Rubber landing wheels Opening cockpit Pilot figures Detachable missiles Detachable fuel tanks Limited edition collector''s serialized card PLEASE NOTE THAT WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'CA72RB05EX',
    14999,
    5.0,
    12.0,
    4.0,
    11.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-calibre-wings-1-72-f-14-vf-1d-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    14999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Calibre Wings 1:72 F-14 VF-1D Convention Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    864,
    'comic-con-2014-exclusive-unkl-10-unipo-spongebob',
    'Comic Con 2014 Exclusive: UNKL 10" UniPo SpongeBob',
    'Exclusive 10" UNKL UniPo SpongeBob ''Absorbent and yellow and porous is he! SpongeBob SquarePants!'' In an exciting, crazy, and otherwise unpredictable partnership, UNKL has teamed up with Nickelodeon to bring this Limited Edition UNKL SpongeBob! The SpongeBob SquarePants UNKL Vinyl Figure measures 10-inches tall and features the optimistic sea sponge looking just as sponge-like as he does in the TV show, wearing his painted-on white dress shirt and red tie. He looks cool and scholarly sporting nifty with removeable glasses frames and a removable net in his right hand! Add to your SpongeBob collection with the fun and highly prized SpongeBob SquarePants 10" UNKL Vinyl Figure A unique look for SpongeBob SquarePants! Vinyl figure features a removable net and glasses. Measures an impressive 10-inches tall. Limited to 200 Worldwide!',
    '1747',
    19999,
    5.0,
    15.0,
    14.0,
    13.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Comic Con 2014 Exclusive UNKL 10" UniPo SpongeBob',
    'Comic Con 2014 Exclusive UNKL 10" UniPo SpongeBob',
    'spongebob, squarepants, vinyl, toy, exclusive, sdcc, comic con, unkl, unipo, urban, comic, nycc, toynami, collectible, nickelodeon, cute',
    '/comic-con-2014-exclusive-unkl-10-unipo-spongebob/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    19999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Comic Con 2014 Exclusive: UNKL 10" UniPo SpongeBob',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'vinyl, cute, toy, exclusive, sdcc, comic con, unkl, unipo, urban, comic, nycc, toynami, collectible, spongebob, squarepants, nickelodeon',
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    865,
    'naruto-shippuden-exclusive-two-pack-set-sage-mode-naruto-vs-pain',
    'Naruto Shippuden Exclusive Two-Pack Set: Sage Mode Naruto vs. Pain',
    'Naruto Shippuden Exclusive Two-Pack Set: Sage Mode Naruto vs Pain Considered by many to be the ultimate battle in the history of NARUTO, the clash between Naruto and Pain, leader of the Akatsuki and Amegakure, spans multiple episodes as the two struggle for possession of the Nine-Tails! This epic brawl is captured in this exclusive action-figure two-pack, consisting of 4-inch-scale, highly articulated action figures of Pain and Naruto in Sage Mode! First debuted at at San Diego Comic Con, only 400 sets were produced for the North American market! You won''t want to miss out on this amazing two-pack set which includes two poseable action figures, interchangeable hands and weapons! 4" poseable figures: Naruto & Pain Limited to 400 sets!',
    '',
    6498,
    1.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-exclusive-two-pack-set-sage-mode-naruto-vs-pain/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    4549,
    6498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Exclusive Two-Pack Set: Sage Mode Naruto vs. Pain',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    866,
    'mospeada-cyclone-limited-edition-vinyl-figure-ray',
    'Mospeada Cyclone Limited Edition Vinyl Figure - RAY',
    'RAY - CYCLONE RIDE ARMOR LIMITED EDITION VINYL! TOYNAMI X Jerome Lu (Hyperactive Monkey) collaboration which made its debut at Designer-Con! From the classic Japanese anime series Genesis Climber MOSPEADA comes the exclusive collectible Ray! Figure is brought to you in an amazingly detailed and fun 8" collectible vinyl format! Limited to 250 units each Officially licensed show exclusive Limit 2 per customer PLEASE NOTE ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    '',
    8999,
    3.0,
    12.0,
    6.0,
    9.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/mospeada-cyclone-limited-edition-vinyl-figure-ray/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    8999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Mospeada Cyclone Limited Edition Vinyl Figure - RAY',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    867,
    'acid-rain-fav-series-bucks-team-wildebeest-wb3b',
    'Acid Rain FAV Series Bucks Team Wildebeest WB3b',
    'Acid Rain FAV Series Bucks Team Wildebeest WB3b The Wildebeest WB3b is affiliated to the Agurts Bucks Team. This item is set in the 1:18 scale, painted with Bucks Team color scheme and highly detailed weathering effect. Other than the vehicle itself, the military bag can be taken off to use with other 1:18 figures. 1 Acid Rain off-road mototrcycle 2 military bags',
    'FAV-A01',
    2999,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-fav-series-bucks-team-wildebeest-wb3b/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain FAV Series Bucks Team Wildebeest WB3b',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    868,
    'fred-vinyl-coin-bank',
    'FRED Vinyl Coin Bank',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. "I''m Fred! As you can probably see, I am the scariest monster on the whole of Tulipop - ever. If I saw myself in a mirror I would definitely scream. If I wasn''t a monster that is, because monsters don''t get scared, do they?" Big coin bank featuring Fred, the adorable monster that longs to be frightening but never succeeds. The coin bank comes in a beautifully illustrated box. Size: 8" tall',
    '10820',
    2499,
    4.0,
    9.0,
    8.0,
    15.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/fred-vinyl-coin-bank/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'FRED Vinyl Coin Bank',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    869,
    'macross-calibre-wings-1-72-vf-1s-valkyrie-fighter',
    'Macross Calibre Wings 1:72 VF-1S Valkyrie Fighter',
    'Macross 1:72 VF-1S Valkyrie Fighter from Calibre Wings! The VF-1 Valkyrie is Earth''s first trans-atmospheric fighter. Powered by fusion engines, the VF-1 is fully space-capable, and is carried in great numbers on the SDF-1 as well as the Armor series of carriers. By itself, the VF-1 performs well in a variety of atmospheric operations, due to its sizable, variable-sweep wing surface area and high thrust-to-weight ratio. The VF-1 uses its wing hard points to mount a significant number of missiles as well as a gun pod for close range combat. The VF-1S "Skull Leader" is a rare fighter based on a prototype platform of the VF-1 specially designed for commanding officers of Valkyrie squadrons. The prototype number 001 (also known as Skull One) was the last known surviving VF-1S aboard the SDF-1. It miraculously survived through several years of battle and was never destroyed, making it a symbol of humankind''s invincibility.The VF-1 Valkyrie is an amazing die-cast metal model based off the Macross VF-1 Valkyrie. Set in 1:72 scale this high end non-transformable collectible comes equipped with a standing and sitting pilot. Features include: Variable Sweepwings Pivoting Missile Pylons Opening Cockpit Interchangeable Landing Gear Includes Seated and Standing Pilot Limited edition collector''s serialized card Limited to 1,500 units Worldwide! PLEASE NOTE THAT WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'CA72RB06',
    13999,
    3.0,
    10.0,
    3.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-calibre-wings-1-72-vf-1s-valkyrie-fighter/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    13999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Calibre Wings 1:72 VF-1S Valkyrie Fighter',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    870,
    'godzilla-1989-limited-edition-statue-polystone-resin',
    'Godzilla 1989 - Limited Edition Statue - Polystone Resin',
    'Godzilla 1989 - Limited Edition Statue - Polystone Resin The King of the Monsters stands tall in this gorgeous limited-edition statue! As seen in GODZILLA VS. BIOLLANTE, The GODZILLA 1989 statue comes with a volcanic diorama base, is constructed from polystone resin and is limited to 500 units worldwide! Volcanic base diorama Constructed of polystone resin Limited to 500 units worldwide Measures 16" L x 14" W x 12" H',
    '10660',
    39999,
    31.0,
    22.0,
    21.0,
    25.0,
    'new',
    '8-19872-01066-2',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Godzilla 1989 - Limited Edition Statue - Polystone Resin',
    'Godzilla 1989 - Limited Edition Statue - Polystone Resin',
    'godzilla, statue, polystone, resin, volcano, 1989, collectible, toynami, biollante',
    '/godzilla-1989-limited-edition-statue-polystone-resin/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    39999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Godzilla 1989 - Limited Edition Statue - Polystone Resin',
    NULL,
    false,
    '10660',
    NULL,
    'Default Tax Class',
    NULL,
    'godzilla, statue, polystone, resin, volcano, 1989, collectible, toynami, biollante',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    871,
    'the-canmans-blank-canman',
    'The Canmans Blank Canman',
    'They are a blank canvas, ready for you to do it yourself. The Canman figures have a removable lid for storing spraypaint tips and other items discretely. Each canman has a real spray paint tip that can be used or swapped out. Moveable arms and detachable top pops off to reveal hollow storage inside.7" tall',
    '7910',
    2499,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    '8-16355-00981-6',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'The Canmans Blank Canman',
    'The Canmans Blank Canman',
    'toynami, canman, canmans, graffiti, collectible, spray paint, art, artist, urban, vinyl',
    '/the-canmans-blank-canman/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'The Canmans Blank Canman',
    NULL,
    false,
    '7910',
    '8-16355-00981-6',
    'Default Tax Class',
    NULL,
    'toynami, canman, canmans, graffiti, collectible, spray paint, art, artist, urban, vinyl',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    872,
    'tulipop-fred-tineez-plush',
    'Tulipop Fred Tineez Plush',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Fred Tineez Plush Fred the adorable monster that longs to be frightening but never succeeds. Size: 5" tall',
    '10750',
    1200,
    1.0,
    6.0,
    4.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-fred-tineez-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Fred Tineez Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    873,
    'acid-rain-halogen-jeep-2021-convention-exclusive',
    'Acid Rain Halogen Jeep - 2021 Convention Exclusive',
    'Acid Rain FAV-SP20 Halogen Jeep - 2021 Convention Exclusive FAV-SP20 Viva la Loca - Halogen Jeep The Acid Rain World 1:18 Viva la Loca series are limited edition products for 2021 expos. Includes: Halogen Jeep 2021 Worldwide Exclusive Limited quantities for N. America Limit 1 per customer Payment for Pre-Order items will be captured to secure your order. PLEASE NOTE: ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'FAV-SP20',
    6998,
    3.0,
    12.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    11,
    -2,
    NULL,
    NULL,
    NULL,
    '/acid-rain-halogen-jeep-2021-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    2,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Halogen Jeep - 2021 Convention Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    874,
    'acid-rain-laurel-rescue',
    'Acid Rain Laurel Rescue',
    'Acid Rain Laurel RescueAcid Rain presents the new Acid Rain Laurel Rescue! This item is set in the 1:18 scale, painted with a new multi color scheme and highly detailed weathering effect. The Laurel Rescue comes inclusive with Laurel pilot, a jack hammer, a heavy tool set for the laurel pilot.Features: 1 Laurel Rescue 1 Laurel Pilot 1 Jack Hammer 1 Heavy Tool Set (for pilot use)',
    'AR-1770S',
    10499,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-laurel-rescue/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    10499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Laurel Rescue',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    875,
    'toys-alliance-millinillions-mi-k01-wenenu',
    'Toy''s Alliance MILLINILLIONS MI-K01 WENENU',
    'Wenenu is a fighting robot of the Underground Strike Association and was once imprisoned underground to provide people with entertainment. Artificial intelligence was mistakenly input into his system during routine maintenance allowing him to plan an escape of the terrible fighting arena. A dangerous adventure is just beginning... Kit Lau is the creator of the story, characters and products of the brand "Acid Rain World". Branded toy products are sold in multiple markets, and a Hong Kong game company is also authorized to develop the online game "Acid Rain World". Before this, Kit Lau was also a famous pop-up book author in Hong Kong. 1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    4,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k01-wenenu/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Toy''s Alliance MILLINILLIONS MI-K01 WENENU',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    876,
    'b2five-r711-laurel-la3r',
    'B2Five R711 Laurel LA3R',
    'WAVE 2bR711 Laurel LA3RThe R711 Lurel LA3R set comes inclusive with a Laurel military powered suit. The cockpit in the Laurel is built to accommodate any 1:28 scale pilot soldier and comes with standard joints for interchangeable parts. Also included is a 1:28 scale military pilot that is highly poseable with 21 points of articulation. Additional accessories include a Heavy handgun. Features: 1 R711 Lurel LA3R 1 Pilot Soldier 1 Heavy handgun',
    'BW2_03',
    5699,
    2.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-r711-laurel-la3r/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5699,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'B2Five R711 Laurel LA3R',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    877,
    'little-embers-series-2-blind-box-figurine',
    'Little Embers SERIES 2 Blind Box Figurine',
    '"The little critters and creatures from Miyo''s Mystic Musings are born from my dreams, meditations and visions from other worlds. My wish is to share my world and my insights with you. Hopefully they will brighten this reality we live in today, with a little quirkiness and fun while still putting a smile on your face." - Miyo Nakamura LITTLE EMBERS SERIES 2Little Embers are branching out and getting brave! Out of the hearths and into the light of the moon. Their existence is no coincidence. Light a candle and you may find they are closer to your heart than you think. Wherever there is a flame of desire, these little igniters will help you be brave too. The Little Embers Series 2 Blind Box Figurines are approximately 3" tall and come case packed 15 units per tray. Each tray will include three units of each style: Lava Blaze Kindle Torch Scorch PURCHASED INDIVIDUALLY: The figurines come blind boxed so you will be receiving a random figure. No exchanges or returns.',
    '14600',
    1200,
    0.4,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-embers-series-2-blind-box-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Embers SERIES 2 Blind Box Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/31/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    878,
    'macross-calibre-wings-1-72-vf-1s-fighter-valkyrie-stealth-2020-convention-exclusive-pre-order',
    'Macross Calibre Wings 1:72 VF-1S Fighter Valkyrie STEALTH - 2020 CONVENTION EXCLUSIVE PRE-ORDER',
    'MACROSS 1:72 VF-1S FIGHTER VALKYRIE STEALTH DIE-CAST METAL HI-END COLLECTIBLE MODEL! From Calibre Wings, the VF-1S ''STEALTH'' is an incredible die-cast fully detailed model based on the Macross VF-1S Valkyrie in a limited stealth design. Features: Variable Sweepwings Pivoting Missile Pylons Swappable Landing Gear Options Includes Pilot Seated/Standing CONVENTION EXCLUSIVE LIMITED TO 300 UNITS! Expected release date is July 2020 Limit 2 per customer PLEASE NOTE ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    '',
    12999,
    4.0,
    12.0,
    4.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-calibre-wings-1-72-vf-1s-fighter-valkyrie-stealth-2020-convention-exclusive-pre-order/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Calibre Wings 1:72 VF-1S Fighter Valkyrie STEALTH - 2020 CONVENTION EXCLUSIVE PRE-ORDER',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    879,
    'tulipop-miss-maddy-tineez-plush',
    'Tulipop Miss Maddy Tineez Plush',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Miss Maddy Tineez Plush Miss Maddy the self-admiring and multi-talented primadonna. Size: 5" tall',
    '10760',
    1200,
    1.0,
    6.0,
    4.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-miss-maddy-tineez-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Miss Maddy Tineez Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    880,
    'robotech-defense-force-poster-2018-sdcc-exclusive',
    'Robotech Defense Force Poster - 2018 SDCC Exclusive',
    'Robotech Defense Force Poster - 2018 SDCC Exclusive! "THE RDF WANTS YOU!" 12 mil smooth vinyl, approximately 20" X 50". Illustrated by Jamie Sullivan.',
    '',
    5999,
    2.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-defense-force-poster-2018-sdcc-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech Defense Force Poster - 2018 SDCC Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    881,
    'preorder-required-the-new-generation-yr-052f-transformable-cyclone-final-payment',
    'PREORDER REQUIRED: The New Generation YR-052F Transformable Cyclone (FINAL PAYMENT)',
    'THIS ITEM PAGE IS FOR CUSTOMERS WHO HAVE COMPLETED THEIR 10% PRE-ORDER DEPOSIT. PLEASE NOTE THAT THIS TRANSACTION IS FOR THE REMAINING COSTS (SHIPPING AND HANDLING NOT INCLUDED) OF THE ITEM. ALL TRANSACTIONS COMPLETED FOR THIS ITEM WILL REQUIRE PRE-ORDER CONFIRMATION. TRANSACTIONS WITHOUT PRE-ORDER CONFIRMATION WILL HAVE THEIR ORDER CANCELLED. ESTIMATED SHIPPING IS DECEMBER 2024**PAYMENT SUBMITTED AFTER DECEMBER 20TH, 2024 WILL BE PROCESSED AFTER THE WINTER HOLIDAY, JANUARY 2ND, 2025. Following the successful deployment of the VR-030 and VF-040 series, the VR-050 series combined the best elements of previous Cyclone designs into one package, resulting in the final production model, the VR-052. In collaboration with Moshotoys, Toynami is proud to present the next evolution of the VR Cyclone: the YR-052F. These highly advanced Cyclones are used by the main characters for both combat and travel. They can transform into battle armor mode and are a key aspect of the New Generation''s fighting capabilities. These highly detailed Cyclones are made from die-cast metal, POM, and plastic injection parts, weighing over 1.5 kg in Battle Armor Mode and 2.4 kg with the base and accessories. Accessories include the EP-40 Pistol and 10 interchangeable hands for dynamic posing. Specifications: Cycle Mode: Length: 270 mm Height: 150 mm Depth: 75 mm Pilot: Height: 250 mm Width: 130 mm Depth: 70 mm Battle Armor Mode: Height: 290 mm Width: 190 mm Depth: 170 mm',
    'F12900',
    16199,
    10.0,
    12.0,
    16.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    5,
    0,
    NULL,
    NULL,
    NULL,
    '/preorder-required-the-new-generation-yr-052f-transformable-cyclone-final-payment/',
    NOW(),
    '2025-06-01',
    'Pre-order item - ships when available',
    0,
    0,
    0,
    16199,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'PREORDER REQUIRED: The New Generation YR-052F Transformable Cyclone (FINAL PAYMENT)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    882,
    'futurama-robot-santa-build-a-bot-action-figure-set',
    'Futurama "Robot Santa Build-A-Bot" Action Figure Set',
    'This assortment of FUTURAMA action figures includes popular characters Fry, Leela and Bender in their super heroic guises as Captain Yesterday, Clobberella and Super King, as well as the sinister alien thief Nudar, robot actor extraordinaire Calculon and Planet Express Intern (and Martian heiress) Amy Wong. A 6-figure set that allows you to instantly build a 7th in the form of Robot Santa, the evil overlord of Xmas! Each action figure comes with build-a-bot part that when assembled make one complete Robot Santa action figure, allowing you to "perform over 50 mega-checks per second!" Each action figure stands approximately 6" tall Made of PVC and ABS plastic',
    '5015',
    7998,
    6.0,
    16.0,
    12.0,
    8.0,
    'new',
    '8-16355-00936-6',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Futurama "Robot Santa Build-A-Bot" Action Figure Set',
    'Futurama Robot Santa Build-A-Bot Action Figure Set',
    'futurama, toynami, robot, santa, action, figure, set, toy, vinyl, figurines, collectible',
    '/futurama-robot-santa-build-a-bot-action-figure-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    7998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Futurama "Robot Santa Build-A-Bot" Action Figure Set',
    NULL,
    false,
    '5015',
    '8-16355-00936-6',
    'Default Tax Class',
    NULL,
    'futurama, toynami, robot, santa, action, figure, set, toy, vinyl, figurines, collectible',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    883,
    'preorder-deposit-required-voltron-40th-anniversary-collectors-set',
    'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''s Set',
    'THIS ITEM PAGE IS FOR CUSTOMERS WITH A VALID PREORDER DEPOSIT. CUSTOMERS WITH NO DEPOSIT ON FILE WILL HAVE THEIR ORDERS CANCELLED. ESTIMATED SHIPPING IS FEBRUARY 2025 VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET Fully transformable collectible includes never-before-seen light and sound features! Toynami is proud to announce that its upcoming VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET is now available for retailers to order! This limited-edition collectible will only be produced for the 40th anniversary, consisting of five fully transformable lions that unite to form Voltron, Defender of the Universe! Each lion, constructed of die-cast metal, will feature light-up eyes, activated by a unique magnetic key. When united, Voltron stands over 13 inches tall on an updated electronic light-up base, featuring a sequenced transformation sound file that is officially licensed by legendary voice actor Neil Ross. Incorporated into the base are storage positions for all five of the lions'' individual weapon blades. Also included is Voltron''s sword and shield. In addition, the upcoming VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET will feature contributions from VOLTRON''s original designer, legendary Toy Mechanic Designer Katsushi Murakami! Murakami, former managing director of toy companies POPY and Bandai, is known for his designs for landmark toy lines like CHOGOKIN, SUPER SENTAI, BEAST KING GOLION and ARMOURED FLEET DAIRUGGER XV. Voltron fans can look forward to never-before-seen artwork and behind-the-scenes insights as part of the VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET package! The 40th Anniversary has the following added features from its predecessors. Diecast lions made with zinc alloy. All new remaster Lion Heads on all Lions - now with light-up LED feature Updated electronic light-up base, featuring a sequenced transformation sound file that is officially licensed by legendary voice actor Neil Ross Updated weapons and accessories with corresponding colors Made with ABS, Zinc Alloy, POM, and PVC.',
    'F13600',
    26999,
    8.0,
    20.0,
    14.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/preorder-deposit-required-voltron-40th-anniversary-collectors-set/',
    NOW(),
    '2025-06-01',
    'Pre-order item - ships when available',
    0,
    0,
    0,
    26999,
    0,
    5,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Voltron PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''s Set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    884,
    'tulipop-bubble-tineez-plush',
    'Tulipop Bubble Tineez Plush',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Bubble Tineez PlushBubble the shy mushroom boy. Size: 5" tall',
    '10740',
    1200,
    1.0,
    6.0,
    4.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-bubble-tineez-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Bubble Tineez Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    885,
    'acid-rain-shadow-of-assamite-2021-convention-exclusive',
    'Acid Rain Shadow of Assamite - 2021 Convention Exclusive',
    'Acid Rain FAV-C01 Shadow of Assamite - 2021 Convention Exclusive The Shadow of Assamite is a mysterious paramilitary group infamous for attacking trade convoys across the continent, but never robbing any cargo on their escapades. To this day, nobody has ever unearthed the motives behind their eerie attacks. The Acid Rain World 1:18 series are limited edition products for 2021 expos worldwide, featuring six random weapon combinations! Includes: Shadow of Assamite x1 6 random weapon combinations A Kukri x 1 SMG-96 Submachine Gun x 1 B T-82 Combat Knife x 1 NGP-5AAR11 Assault Rifle x 1 C L&D MW-90 Pistol x 1 NGP-13 Pistol x 1 Porcupine shotgun x 1 D TSMG-25 Submachine gun x 1 TMG-42 Machine Gun x 1 E NGP-13 Pistol x 1 NGP-73 Anti-materiel rifle x 1 F L&D MW-90 Pistol x 1 TAR-37 Assault Rifle x 1 2021 Worldwide Exclusive Limited quantities for N. America Limit 1 per customer Release date: August 2021 Payment for Pre-Order items will be captured to secure your order. PLEASE NOTE: ALL SALES ARE FINAL. PLEASE MAKE SURE YOU WANT TO GO THROUGH WITH THE PURCHASE BEFORE COMPLETING THE TRANSACTION. WE ARE NOT ABLE TO ACCEPT CANCELLATION REQUESTS. WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    'FAV-C01',
    2599,
    2.0,
    9.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    -5,
    NULL,
    NULL,
    NULL,
    '/acid-rain-shadow-of-assamite-2021-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2599,
    0,
    3,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Shadow of Assamite - 2021 Convention Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    886,
    'macross-saga-retro-transformable-1-100-vf-1j-ichijo-valkyrie',
    'Macross Saga: Retro Transformable 1/100 VF-1J Ichijo Valkyrie',
    'MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION - ICHIJO VALKYRIE The Macross Saga A gigantic spaceship crash lands on Earth, foreshadowing the arrival of an alien armada bent on war and destruction. The world unites to unlock the secrets of its miraculous alien technology knows as Robotech to defend the world against impending invasion. The challenges they would face would be greater than anyone could have imagined... Macross is a Japanese science fiction anime series that takes place ten years after an alien space ship the size of a city crashed onto South Atalia Island. The space ship was found and reconstructed by humans who turned it into the SDF-1 Macross. It''s up to Earth Defense Pilots to defend and save our world! Toynami is proud to offer five new editions from the MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION with the VF-1J 1/100 Ichijo Valkyrie. Features: Transformable to three modes: Battroid, Gerwalk & Fighter Highly poseable with over 30 points of articulation Stands over 5" tall in Battroid Mode & 6" long in Fighter Mode Interchangeable hands, missiles & accessories included Each comes with pilot Includes adjustable display stand for maximum versatility & poseability Classic 1980''s retro packaging Don''t miss out on the ultimate in MACROSS SAGA collectibles!',
    '10910',
    5999,
    1.0,
    9.0,
    6.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    14,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-saga-retro-transformable-1-100-vf-1j-ichijo-valkyrie/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    2,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Saga: Retro Transformable 1/100 VF-1J Ichijo Valkyrie',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    887,
    'toys-alliance-millinillions-mi-k02-tao-sor',
    'Toy''s Alliance MILLINILLIONS MI-K02 Tao-Sor',
    'Tao-Sor is the middle brother, he is working on the food delivery departments but often charged with deductions, because the product is lost along the way! Teera is a carpenter designer from Phuket. He is good at designing sculpture in the style of woodcarving with cute animal themes. Each of his limited releases in Thailand have quickly sold out! The designer personally also likes to describe himself in a humorous way, living in rocky crevices by streams surviving with squirrel meat as food. 1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    9,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k02-tao-sor/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Toy''s Alliance MILLINILLIONS MI-K02 Tao-Sor',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    888,
    'acid-rain-laurel-worker',
    'Acid Rain Laurel Worker',
    'Acid Rain Laurel Worker Laurel Worker is a 1:18 scale fully painted industrial powered suit with highly detailed weathering effects. The cockpit with hatch features a linked mechanical structure between hatch and main engine, and is built to accommodate the engineer pilot (included) or any other 3.75 inch figures. Additional accessories include an extendable pickaxe. 3.75" Laurel figure Laurel Worker Vehicle Pickaxe',
    'AR-1540S',
    11499,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-laurel-worker/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    11499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Laurel Worker',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    889,
    'tulipop-gloomy-tineez-plush',
    'Tulipop Gloomy Tineez Plush',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Gloomy Tineez Plush Gloomy the bold and adventurous mushroom girl. Size: 5" tall',
    '10730',
    1200,
    1.0,
    6.0,
    4.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-gloomy-tineez-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Gloomy Tineez Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    890,
    'futurama-tineez-series-1-2-mini-figure-3-pack',
    'Futurama Tineez Series 1.2 Mini-Figure 3-pack',
    'Musical Robot Devil, Alternate Universe Zoidberg & Bumblebee Bender unite forces in this 3 figure box set for maximum deviant fun! Small, detailed and happy! Great for the vinyl collector Approximately 3" tall each',
    '1589',
    2499,
    1.0,
    12.0,
    9.0,
    6.0,
    'new',
    '8-16355-00766-9',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Futurama Tineez Series 1.2 Mini-Figure 3-pack',
    'Futurama Tineez Series 1.2 Mini-Figure 3-pack',
    'futurama, toynami, robot, action, figure, set, toy, vinyl, figurines, collectible, tineez, bumblebee, bender, devil, alternate, universe, zoidberg',
    '/futurama-tineez-series-1-2-mini-figure-3-pack/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Futurama Tineez Series 1.2 Mini-Figure 3-pack',
    NULL,
    false,
    '1589',
    '8-16355-00766-9',
    'Default Tax Class',
    NULL,
    'futurama, toynami, robot, action, figure, set, toy, vinyl, figurines, collectible, tineez, bumblebee, bender, devil, alternate, universe, zoidberg',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    891,
    'mospeada-legioss-afc-01z-red',
    'Mospeada Legioss AFC-01Z (Red)',
    'Mospeada Legioss AFC-01Z (Red) From the classic Japanese anime series Genesis Climber MOSPEADA comes the second in the line of transformable collectibles, exclusively imported by Toynami! Manufactured by Evolution Toy, the Mospeada Legioss AFC-01Z (Red) is now avialable. The Legioss can be transformed into three different battle formations, the Armo-Fighter, the Armo-Diver and the Armo-Soldier. Made of sturdy PVC, die cast and ABS construction this Legioss comes complete with in scale fighter pilots, missile accessories and interchangeable air intake manifolds. Stands an impressive 8.5 inches in Armo-Soldier mode. Features include: In scale fighter pilot with Ride Armor Opening Weapon hatches Additional missile accessories Interchangeable air-intake manifolds PLEASE NOTE THAT WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    '',
    29999,
    3.0,
    14.0,
    4.0,
    10.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/mospeada-legioss-afc-01z-red/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    29999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Mospeada Legioss AFC-01Z (Red)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    892,
    'b2five-k6-jungle-speeder-mk1k',
    'B2Five K6 Jungle Speeder MK1K',
    'WAVE 2bK6 Jungle Speeder MK1K set The K6 Jungle Speeder MK1K is a fully detailed vehicle which can transform into two different modes: Speeder and Walker. The MK1K is built to accommodate one 1:28 scale military pilot (included), or any other 1:28 scale figures. All 1:28 scale figures are highly poseable with 21 points of articulation. Additional accessories include a heavy hand gun. Features: 1 K6 Jungle Speeder MK1K 1 Pilot Soldier 1 Heavy Handgun',
    'BW2_04',
    2999,
    2.0,
    7.0,
    5.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-k6-jungle-speeder-mk1k/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'B2Five K6 Jungle Speeder MK1K',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    893,
    'little-ember-iridescent-pearl-edition',
    'Little Ember Iridescent Pearl Edition',
    'Little Ember Iridescent Pearl EditionOfficially licensed by Miyo. This exclusive iridescent pearl edition comes packed 5 styles in one box: Soot, Sparks, Cinder, Ash and Flames! Each one is approximately 2.5" tall. Artist: Miyo, sculptor and creator of Miyo''s Mystic Musings.Edition of 500',
    '',
    4000,
    1.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-ember-iridescent-pearl-edition/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Ember Iridescent Pearl Edition',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    894,
    'acid-rain-field-flakbike-fb7f',
    'Acid Rain Field Flakbike FB7f',
    'Acid Rain Field Flakbike FB7fThe Flakbike FB7 is one of the oldest military machines still operated by the Agurts military. This is the first transformable vehicle developed after the catastrophic end of WWII.The FB7 has 2 modes, the mobile bike mode and the walker artillery mode. The FB7 is typically seen in its bike mode piloted by a single operator, with cargo space in the rear for additional personnel or haulage. In bike mode, the FB7has no offensive capabilities and offers little protection, it''s heavy tracks may affect its speed but it also enables the vehicle to traverse hostile environments with rough terrain.When deployed into artillery mode, the FB7 transforms into a bipedal long range artillery cannon. The legs are mainly used for targeting adjustments, mobility in artillery mode is very limited. These cannons can deal devastating damage to enemies from considerable range.Capable of both offensive and defensive roles, they operate best in numbers, taking formation and raining shells onto enemy fortifications, advancing vehicles or closely packed infantry squads. Skillful commanders can inflict heavy casualties with several barrages and relocate before enemy has the opportunity to retaliate, effectively crippling enemy morale.The FB7''s transformation requires the pilot to leave the vehicle, a feature that can no longer be seen in modern transformable vehicles and SA. Flakbikes are considered old fashioned in the modern age dominated by powerful SAs, but they are still found in the front lines of Agurts and Zamaii.The FB7 is often escorted by other forces as they lack any close range combat capabilities, making them an easy target during enemy raids.Features: 1 - Field Flakbike FB7f 1 - Field Cannoneer 1 - Handgun 1 - Folding Shovel 1 - Binoculars',
    'FAV-A02',
    11699,
    3.0,
    12.0,
    4.0,
    10.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-field-flakbike-fb7f/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    11699,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Field Flakbike FB7f',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    895,
    'naruto-sage-mode-epic-scale-statue',
    'Naruto Sage Mode Epic Scale Statue',
    'Naruto Shippuden Epic Scale Statue - Naruto Sage Mode Twenty years ago, the first chapter of Masashi Kishimoto''s ninja epic was published in Weekly Shonen Jump. Since then, Naruto has grown into one of the best-selling manga and anime of all time. To commemorate the world''s most popular ninja and its legions of fans, Toynami is proud to bring to market the Naruto Shippuden Epic Scale Statues! Kicking off the line will be "Naruto Sage Mode," a 1/6 scale statue with a dynamic environment display, featuring interchangeable heads. Each statue is individually numbered, with a limited worldwide production run of 800. We''re delighted to celebrate the history and longevity of NARUTO with this exciting new line of collectibles. Fans can expect at least two more releases following the debut of Naruto Sage Mode. Who''s next? Keep checking our social media for future reveals! Approximate dimensions: 21.2" H x 12.0" W x 11.9" DMaterial: Polystone resin with clear resin accents to accentuate the spiral motion effectsComes with magnetic interchangeable heads',
    '11900',
    64999,
    22.0,
    21.0,
    26.0,
    15.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    1,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-sage-mode-epic-scale-statue/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    64999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Sage Mode Epic Scale Statue',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'naruto, sage mode,',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    896,
    'tulipop-blind-boxes-figure-with-diorama',
    'Tulipop Blind Boxes Figure with Diorama',
    'Toynami is proud to announce, TULIPOP, our newest license, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by mother of two Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Blind Box figures! These unique 3.5" vinyl figures with diorama include: Fred Miss Maddy Bubble Gloomy Note: These figurines will come blind boxed. You will be receiving a random figure. No exchanges or returns.',
    '10770',
    1199,
    0.6,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-blind-boxes-figure-with-diorama/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1199,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Blind Boxes Figure with Diorama',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    897,
    'robotech-new-generation-mars-base-alpha-shirt',
    'Robotech New Generation Mars Base Alpha Shirt',
    'Officially Licensed Style: Tri-Blend Jersey Unisex T-Shirt Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% RayonCollar: Crew NeckFit Type: ClassicSize Range: S-3XL',
    '',
    3500,
    1.0,
    15.0,
    11.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    10,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-new-generation-mars-base-alpha-shirt/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech New Generation Mars Base Alpha Shirt',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/25/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    898,
    'the-new-generation-yr-052f-transformable-cyclone',
    'The New Generation YR-052F Transformable Cyclone',
    'THIS ITEM PAGE IS FOR NEW TRANSACTIONS. IF YOU HAVE PRE-ORDERED THIS ITEM, PLEASE REACH OUT TO OUR CUSTOMER SERVICE TEAM FOR INSTRUCTIONS ON HOW TO COMPLETE YOUR TRANSACTION. RETAIL PRICE: $229.99 (TAX & SHIPPING NOT INCLUDED) Following the successful deployment of the VR-030 and VF-040 series, the VR-050 series combined the best elements of previous Cyclone designs into one package, resulting in the final production model, the VR-052. In collaboration with Moshotoys, Toynami is proud to present the next evolution of the VR Cyclone: the YR-052F. These highly advanced Cyclones are used by the main characters for both combat and travel. They can transform into battle armor mode and are a key aspect of the New Generation''s fighting capabilities. These highly detailed Cyclones are made from die-cast metal, POM, and plastic injection parts, weighing over 1.5 kg in Battle Armor Mode and 2.4 kg with the base and accessories. Accessories include the EP-40 Pistol and 10 interchangeable hands for dynamic posing. Specifications: Cycle Mode: Length: 270 mm Height: 150 mm Depth: 75 mm Pilot: Height: 250 mm Width: 130 mm Depth: 70 mm Battle Armor Mode: Height: 290 mm Width: 190 mm Depth: 170 mm',
    '12900',
    22999,
    160.0,
    12.0,
    16.0,
    8.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/the-new-generation-yr-052f-transformable-cyclone/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    22999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'The New Generation YR-052F Transformable Cyclone',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/27/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    899,
    'naruto-kurama-link-mode-2020-convention-exclusive',
    'Naruto Kurama Link Mode 2020 CONVENTION EXCLUSIVE',
    'Shonen Jump Nauruto Shippuden Kurama Link Mode - 2020 Convention Exclusive! Kurama is known as the Nine-Tails. Centuries of being regarded as a mindless monster and sought after as a tool for war caused Kurama to hate humans. After being sealed into Naruto Uzumaki, Kurama attempts to maintain its negative opinions about the world, but with Naruto''s insistence on treating it with respect, the fox overturns its hatred and willingly strives to use its power for the world''s salvation. CONVENTION EXCLUSIVE LIMITED TO 1000 UNITS! Limited stock from 2020 Please note all sales are final. Please make sure you want to go through with the purchase before completing the transaction. We are not able to accept cancellation requests. We do not guarantee mint condition packaging. If the packaging has a slight ding or crease, it is not subject to a return or exchange.',
    'CC2020-Naruto',
    2499,
    2.0,
    9.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    -1,
    NULL,
    NULL,
    NULL,
    '/naruto-kurama-link-mode-2020-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Kurama Link Mode 2020 CONVENTION EXCLUSIVE',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    900,
    'toys-alliance-millinillions-mi-k03-tiger-bill',
    'Toy''s Alliance MILLINILLIONS MI-K03 Tiger Bill',
    '"Tiger Fury " is the senior apprentice of "Tiger Bill", holding the "Curve club" in his hand and using it to kill many enemies. The biggest enemy in the animal arena is "Wolfgang" Wankok from Malaysia!1000Tentacles studio is mainly engaged in toy creation and production. We all like quirky themes very much, and our creations are mainly based on monsters. We always feel that monsters are a very imaginative theme, so the works we produce are all weird and cute. 1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    2,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k03-tiger-bill/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Toy''s Alliance MILLINILLIONS MI-K03 Tiger Bill',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    901,
    'skelanimals-day-of-the-dead-kit-cat-mini-plush',
    'Skelanimals Day of the Dead Kit (Cat) Mini Plush',
    'Skelanimals Day of the Dead Kit (Cat) Mini Plush Skelanimals ''Day of the Dead 6" Mini Plush have been resurrected in traditional "Dia de los Muertos" fashion! Each character features the trademark Skelanimals bone pattern, and decorated in the classic sugar skull style with flowers, hearts, and ornate details.',
    '2249',
    1499,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    '8-16355-00932-8',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals Day of the Dead Kit (Cat) Mini Plush',
    'Skelanimals Day of the Dead Kit (Cat) Mini Plush',
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, kit, cat, kitty',
    '/skelanimals-day-of-the-dead-kit-cat-mini-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Day of the Dead Kit (Cat) Mini Plush',
    NULL,
    false,
    '2249',
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, kit, cat, kitty',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    902,
    'little-nimbus-blind-box-figurine',
    'Little Nimbus Blind Box Figurine',
    'On a moonless night, nothing makes your heart flutter as much as spotting a shooting star. Some of these shooting stars fall amongst clustered storm clouds, and this is where baby nimbuses are born. When lightning streaks and thunder rolls, you might hear the clippity-clop of little nimbus hooves. The Little Nimbus Blind Box Figurines are approximately 2.5" tall and feature: Thunder Lightning Sunny Stormy Artist: Miyo, sculptor and creator of Miyo''s Mystic Musings. PURCHASED INDIVIDUALLY: The figurines come blind boxed so you will be receiving a random figure. No exchanges or returns.',
    '14580',
    1200,
    0.2,
    3.0,
    3.0,
    2.5,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-nimbus-blind-box-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Nimbus Blind Box Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    903,
    'sonic-x-sanrio-blind-box-figure',
    'Sonic x Sanrio Blind Box Figure',
    'Toynami Presents Sonic the Hedgehog x Sanrio Blind Box Collection! These unique 3" vinyl figures feature: Hello Kitty x Sonic Badtz-Maru x Knuckles Chococat x Tails My Melody x Amy A must have for all Sonic the Hedgehog and Sanrio collectors! Note: These figurines will come blind boxed. You will be receiving a random figure. No exchanges or returns.',
    '11130',
    999,
    0.6,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/sonic-x-sanrio-blind-box-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Sonic x Sanrio Blind Box Figure',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/31/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    904,
    'mospeada-legioss-afc-01i-green',
    'Mospeada Legioss AFC-01I (Green)',
    'Mospeada Legioss AFC-01I (Green) From the classic Japanese anime series Genesis Climber MOSPEADA comes the third piece in the line of transformable collectibles, exclusively imported by Toynami! Manufactured by Evolution Toy, the Mospeada Legioss AFC-01I is now available. The Legioss can be transformed into three different battle formations, the Armo-Fighter, the Armo-Diver and the Armo-Soldier. Made of sturdy PVC, ABS construction with some die cast and this Legioss comes complete with in scale fighter pilots, missile accessories and interchangeable air intake manifolds. Stands an impressive 8.5 inches in Armo-Soldier mode. Features: In scale fighter pilot with Ride Armor Opening Weapon hatches Additional missile accessories Interchangeable air-intake manifolds PLEASE NOTE THAT WE DO NOT GUARANTEE MINT CONDITION PACKAGING. IF THE PACKAGING HAS A SLIGHT DING OR CREASE, IT IS NOT SUBJECT TO A RETURN OR EXCHANGE.',
    '',
    29999,
    3.0,
    14.0,
    4.0,
    10.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/mospeada-legioss-afc-01i-green/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    29999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Mospeada Legioss AFC-01I (Green)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    905,
    'acid-rain-field-wildebeest-wb3f',
    'Acid Rain Field Wildebeest WB3f',
    'Acid Rain Field Wildebeest WB3fTo satisfy mobility needs on the battlefield, the Agurts military imported the ORV-M from Central Europe''s largest vehicle manufacturer, Manfred. The ORV-M was a dual-sport motorcycle designed to enhance durability and increase market penetration. Simple and durable, the design sports low body weight, low failure rate and low maintenance costs.After numerous adjustments on the ORV-M design, the Agurts military finally created a speedy, lightweight and operationally practical military motorcycle with an elite suspension system that facilitates smooth transport. The model was named Wildebeest WB3f.The Wildebeest WB3f can weather rapid speeds in a variety of mountainous, desert and jungle terrains, and can withstand the impact of over 20 foot jumps. When deployed alone on the battlefield, they typically act as rapid transportation for weapons, ammunition and supplies across all types of battlefields and terrains. Often used in rapid attacks, reconnaissance and emergency responses, the Wildebeest WB3f has been widely distributed to various brigades of the Agurts military.Features: 1 - Field Wildebeest WB3f 1 - Field Cavalry 1 - Field Cavalry Gear 1 - Combat Medic Gear 3 - Military Bag 1 - Handgun',
    'FAV-A03',
    6498,
    3.0,
    7.0,
    12.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-field-wildebeest-wb3f/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6498,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Field Wildebeest WB3f',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    906,
    'macross-skull-leader-shogun-warrior-vf-1s-sdcc-2023-exclusive',
    'Macross Skull Leader Shogun Warrior VF-1S SDCC 2023 Exclusive',
    'SDCC 2023 EXCLUSIVE LIMITED TO 250 PIECES WORLDWIDE Features: 24 inch (60 cm) tall figure Rolling wheels Shooting Fist Gun-pod with firing missiles',
    '',
    37500,
    10.0,
    28.0,
    16.0,
    9.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-skull-leader-shogun-warrior-vf-1s-sdcc-2023-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    37500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Skull Leader Shogun Warrior VF-1S SDCC 2023 Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    907,
    'robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-rick-hunter-volume-1',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - RICK HUNTER VOLUME 1',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - RICK HUNTER VOLUME 1"Micronian" was the phrase used by Zentraedi to describe humans. It referred to the humans'' micronized size. The phrase could presumably be used any other race smaller than the Zentraedi as there is a legend saying that they should not harm a "Micronian" planet.Each set is fully equipped with 2 pilots; one cockpit pilot and one standing pilot. This Veritech stands approximately 6 inches tall, is fully articulated and can be converted into three different modes: Fighter, Battloid or Gerwalk. The Veritech Micronian Pilot Collection will each be packed in their limited-edition boxes which, when collected in its entirety, will showcase an image of all your favorite Robotech pilots!',
    '',
    3499,
    1.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-rick-hunter-volume-1/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - RICK HUNTER VOLUME 1',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    908,
    'b2five-k6-jungle-chapel-htt600k',
    'B2Five K6 Jungle Chapel HTT600k',
    'WAVE 3aK6 Jungle Chapel HTT600k set The K6 Jungle Chapel HTT600k set comes inclusive with an Anti-tank rocket launcher vehicle developed to transform into two different modes: tank and base mode. Also included is a 1:28 scale military pilot that is highly poseable with 21 points of articulation. Additional accessories include a machine gun, sniper rifle, SA sword and radio transceiver. Features: 1 K6 Jungle Chapel 1 Pilot Soldier 1 Machine gun 1 Sniper Rifle 1 SA sword 1 Radio transceiver',
    'BW3_01',
    6998,
    2.0,
    14.0,
    10.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-k6-jungle-chapel-htt600k/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    6998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World B2FIVE B2Five K6 Jungle Chapel HTT600k',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    909,
    'sdcc-2011-exclusive-futurama-robot-devil-plush',
    'SDCC 2011 Exclusive: Futurama Robot Devil Plush',
    'This colorful plush toy was a 2011 Comic-Con exclusive, and part of a devilishly limited edition of 666 pieces. You can now swap hands with your very own Beezlebot. The Devil''s Hands Are Idle Playthings! Only 666 made! 12" tall',
    'CC2011-Robot Devil',
    4499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'SDCC 2011 Exclusive Futurama Robot Devil Plush',
    'SDCC 2011 Exclusive Futurama Robot Devil Plush',
    'futurama, toynami, robot, devil, plush, toy, collectible, sdcc, exclusive, beezlebot, comic, con',
    '/sdcc-2011-exclusive-futurama-robot-devil-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Futurama SDCC 2011 Exclusive: Futurama Robot Devil Plush',
    NULL,
    false,
    'CC2011-Robot Devil',
    NULL,
    'Default Tax Class',
    NULL,
    'futurama, toynami, robot, devil, plush, toy, collectible, sdcc, exclusive, beezlebot, comic, con',
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
    '06/20/2025',
    '06/23/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    910,
    'skelanimals-day-of-the-dead-diego-bat-mini-plush',
    'Skelanimals Day of the Dead Diego (Bat) Mini Plush',
    'Skelanimals Day of the Dead Diego (Bat) Mini Plush Skelanimals ''Day of the Dead 6" Mini Plush have been resurrected in traditional "Dia de los Muertos" fashion! Each character features the trademark Skelanimals bone pattern, and decorated in the classic sugar skull style with flowers, hearts, and ornate details.',
    '2250',
    1499,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    '8-16355-00933-5',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals Day of the Dead Diego (Bat) Mini Plush',
    'Skelanimals Day of the Dead Diego (Bat) Mini Plush',
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, bat',
    '/skelanimals-day-of-the-dead-diego-bat-mini-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Skelanimals Day of the Dead Diego (Bat) Mini Plush',
    NULL,
    false,
    '2250',
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, bat',
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
    '06/20/2025',
    '06/23/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    911,
    'little-burnt-embers',
    'Little Burnt Embers',
    '"The little critters and creatures from Miyo''s Mystic Musings are born from my dreams, meditations and visions from other worlds. My wish is to share my world and my insights with you. Hopefully they will brighten this reality we live in today, with a little quirkiness and fun while still putting a smile on your face." - Miyo Nakamura LITTLE BUNRT EMBERSWhen sitting in front of a friendly fire, maybe with a cup of cocoa wrapped in a cozy blanket on a winter''s night or perhaps roasting marshmallows with friends around a summer campfire... There is a moment when the flames die down leaving the logs glowing red. Then, you hear it, a slight crackle as a spent log falls apart and embers fly up into the air. That is the moment when Little Baby Embers are born! You may not see them as they play in the hearth amongst the ashes, covered in soot. But remember they are there before you go poking about in the ashes! If you are lucky, you might see a puff of a dragon''s kiss! The Little Burnt Embers Blind Box Figurines are approximately 2.5" tall and feature: Soot Sparks Cinder Ash Flames PURCHASED INDIVIDUALLY: The figurines come blind boxed so you will be receiving a random figure. No exchanges or returns.',
    '14570',
    1099,
    0.2,
    3.0,
    3.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-burnt-embers/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1099,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Burnt Embers',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    912,
    'macross-saga-retro-transformable-1-100-vf-1s-roy-focker-valkyrie',
    'Macross Saga: Retro Transformable 1/100 VF-1S Roy Focker Valkyrie',
    'MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION - ROY FOCKER VALKYRIE The Macross Saga A gigantic spaceship crash lands on Earth, foreshadowing the arrival of an alien armada bent on war and destruction. The world unites to unlock the secrets of its miraculous alien technology knows as Robotech to defend the world against impending invasion. The challenges they would face would be greater than anyone could have imagined... Macross is a Japanese science fiction anime series that takes place ten years after an alien space ship the size of a city crashed onto South Atalia Island. The space ship was found and reconstructed by humans who turned it into the SDF-1 Macross. It''s up to Earth Defense Pilots to defend and save our world! Toynami is proud to offer five new editions from the MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION with the VF-1S 1/100 Roy Focker Valkyrie. Features: Transformable to three modes: Battroid, Gerwalk & Fighter Highly poseable with over 30 points of articulation Stands over 5" tall in Battroid Mode & 6" long in Fighter Mode Interchangeable hands, missiles & accessories included Each comes with pilot Includes adjustable display stand for maximum versatility & poseability Classic 1980''s retro packaging Don''t miss out on the ultimate in MACROSS SAGA collectibles!',
    '10930',
    5999,
    1.0,
    9.0,
    6.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-saga-retro-transformable-1-100-vf-1s-roy-focker-valkyrie/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    2,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Saga: Retro Transformable 1/100 VF-1S Roy Focker Valkyrie',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    913,
    'little-embers-blind-box-enamel-pin',
    'Little Embers Blind Box Enamel Pin',
    'LITTLE EMBERS BLIND BOX ENAMEL PINS When sitting in front of a friendly fire, maybe with a cup of cocoa wrapped in a cozy blanket on a winter''s night or perhaps roasting marshmallows with friends around a summer campfire... There is a moment when the flames die down leaving the logs glowing red. Then, you hear it, a slight crackle as a spent log falls apart and embers fly up into the air. That is the moment when Little Baby Embers are born!You may not see them as they play in the hearth amongst the ashes, covered in soot. But remember they are there before you go poking about in the ashes! If you are lucky, you might see a puff of a dragon''s kiss! The Little Embers Blind Box enamel pins are approximately 2" tall and come case packed 12 units per carton. Each tray will include two units of each style: Soot Sparks Cinder Ash Flames Blaze PURCHASED INDIVIDUALLY: The pins come blind boxed so you will be receiving a random figure. No exchanges or returns.',
    '14750',
    999,
    0.5,
    7.0,
    9.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-embers-blind-box-enamel-pin/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    500,
    999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Embers Blind Box Enamel Pin',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/29/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    914,
    'toys-alliance-millinillions-mi-k04-ryukin',
    'Toy''s Alliance MILLINILLIONS MI-K04 Ryukin',
    'Communication robot Ryukin designed by Kit LauMurase Zaimoku Murase Zaimoku is a Japanese art sculptor. His designs combine "hardness and softness" while designing mechas and sculptures with aquatic patterns. Murase developed the "Uomeka" and "Mechanical Water creatures" series of products, which are gradually expanding in Japan. 1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    9,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k04-ryukin/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'MILLINILLIONS Toy''s Alliance MILLINILLIONS MI-K04 Ryukin',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    915,
    'sonic-x-hello-kitty-10-inch-deluxe-plush',
    'Sonic x Hello Kitty 10 inch Deluxe Plush',
    'Sonic x Hello Kitty 10 inch Deluxe Plush Toynami introduces this all new crossover!Sonic x Sanrio 10 inch Deluxe Plush which feature: Sonic x Hello Kitty Amy x My Melody Knuckles x Badtz-Maru Tails x Chococat Choose your favorite or collect them all!',
    '11000',
    2499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/sonic-x-hello-kitty-10-inch-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Sanrio Sonic x Hello Kitty 10 inch Deluxe Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    916,
    'little-burnt-embers-series-2-blind-box-figurine',
    'Little BURNT Embers Series 2 Blind Box Figurine',
    '"The little critters and creatures from Miyo''s Mystic Musings are born from my dreams, meditations and visions from other worlds. My wish is to share my world and my insights with you. Hopefully they will brighten this reality we live in today, with a little quirkiness and fun while still putting a smile on your face." - Miyo Nakamura LITTLE BURNT EMBERS SERIES 2 Little Embers Series 2 are branching out and getting brave! Out of the hearths and into the light of the moon. Their existence is no coincidence. Light a candle and you may find they are closer to your heart than you think. Wherever there is a flame of desire, these little igniters will help you be brave too. The Little Burnt Embers Series 2 Blind Box Figurines are approximately 3" tall and feature the ''sooty'' color variation of Series 2 Little Embers. Burnt Lava Burnt Blaze Burnt Kindle Burnt Torch Burnt Scorch PURCHASED INDIVIDUALLY: The figurines come blind boxed so you will be receiving a random figure. No exchanges or returns.',
    '14610',
    1200,
    0.4,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-burnt-embers-series-2-blind-box-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little BURNT Embers Series 2 Blind Box Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/26/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    917,
    'skelanimals-day-of-the-dead-maxx-bulldog-mini-plush',
    'Skelanimals Day of the Dead Maxx (Bulldog) Mini Plush',
    'Skelanimals Day of the Dead Maxx (Bulldog) Mini Plush Skelanimals ''Day of the Dead 6" Mini Plush have been resurrected in traditional "Dia de los Muertos" fashion! Each character features the trademark Skelanimals bone pattern, and decorated in the classic sugar skull style with flowers, hearts, and ornate details.',
    '2251',
    1499,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    '8-16355-00934-2',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Skelanimals Day of the Dead Maxx (Bulldog) Mini Plush',
    'Skelanimals Day of the Dead Maxx (Bulldog) Mini Plush',
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, maxx, dog, bulldog',
    '/skelanimals-day-of-the-dead-maxx-bulldog-mini-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Skelanimals Day of the Dead Maxx (Bulldog) Mini Plush',
    NULL,
    false,
    '2251',
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, maxx, dog, bulldog',
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
    '06/20/2025',
    '06/23/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    918,
    '2010-sdcc-exclusive-macross-vinyl-figure-zentradi-regault-tactical-battlepod',
    '2010 SDCC Exclusive: Macross Vinyl Figure Zentradi (Regault) Tactical Battlepod',
    'In scale with our 1/100 super-poseable action figure line, we present the Zentradi (Regault) Tactical Battlepod Vinyl Figure, featuring the movie''s deco scheme! Limited to 1000 worldwide Ages 15 & up',
    'CC2010-Macross',
    4499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    '2010 SDCC Exclusive Macross Vinyl Figure Zentradi (Regault) Tactical Battlepod',
    '2010 SDCC Exclusive Macross Vinyl Figure Zentradi Regault Tactical Battlepod',
    'robotech, macross, zentradi, regault, tactical, battlepod, green, sdcc, 2010, exclusive, collectible, toy, robot, anime, japanime, japan',
    '/2010-sdcc-exclusive-macross-vinyl-figure-zentradi-regault-tactical-battlepod/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    4499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross 2010 SDCC Exclusive: Macross Vinyl Figure Zentradi (Regault) Tactical Battlepod',
    NULL,
    false,
    'CC2010-Macross',
    NULL,
    'Default Tax Class',
    NULL,
    'robotech, macross, zentradi, regault, tactical, battlepod, green, sdcc, 2010, exclusive, collectible, toy, robot, anime, japanime, japan',
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    919,
    'little-embers-figure-keychain',
    'Little Embers Figure Keychain',
    'LITTLE EMBERS FIGURE KEYCHAINS When sitting in front of a friendly fire, maybe with a cup of cocoa wrapped in a cozy blanket on a winter''s night or perhaps roasting marshmallows with friends around a summer campfire... There is a moment when the flames die down leaving the logs glowing red. Then, you hear it, a slight crackle as a spent log falls apart and embers fly up into the air. That is the moment when Little Baby Embers are born! You may not see them as they play in the hearth amongst the ashes, covered in soot. But remember they are there before you go poking about in the ashes! If you are lucky, you might see a puff of a dragon''s kiss! The Little Embers keychains are approximately 3" tall packaged on a hangtag header. Collect them all! Cinder (Purple) Ash (Blue) Flames (Pink)',
    '14930',
    1200,
    8.0,
    7.0,
    9.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-embers-figure-keychain/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    840,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Embers Figure Keychain',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/30/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    920,
    'macross-vf-1j-vermilion-squad-shirt',
    'Macross VF-1J Vermilion Squad Shirt',
    'Officially Licensed Style: Tri-Blend Jersey Unisex T-Shirt Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% RayonCollar: Crew NeckFit Type: ClassicSize Range: S-3XL',
    '',
    3500,
    2.0,
    15.0,
    11.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    29,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-vf-1j-vermilion-squad-shirt/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross VF-1J Vermilion Squad Shirt',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/03/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    921,
    'b2five-moose-laurel-la3b',
    'B2Five Moose Laurel LA3b',
    'Acid Rain B2Five Moose Laurel LA3bThe Moose Laurel LA3b is a military powered suit with a cockpit which is built to accommodate the Laurel Soldier or any 1:28 scale pilot soldier. Also included is a 1:28 scale Laurel military pilot that is highly poseable with 21 points of articulation. Additional accessories include a submachine gun.Features: 1 Moose Laurel LA3b 1 Bob Pilot Soldier 1 Knife 1 Heavy Hand gun 1 Submachine gun 1 SA Sniper Rifle',
    '',
    5699,
    2.0,
    12.0,
    9.0,
    3.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-moose-laurel-la3b/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5699,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World B2FIVE B2Five Moose Laurel LA3b',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    922,
    'macross-calibre-wings-max-miriya-1-72-vf-1j-fighter-valkyrie-gift-set',
    'Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set',
    'Macross 1/72 scale VF-1J Max & Miriya Gift Set New from Calibre Wings!The VF-1J Gift Set includes Max and Miriya die-cast metal models based off the Macross VF-1J Valkyrie. Set in 1:72 scale these high end non-transformable collectibles come fully equipped with a standing and sitting pilot. The models measures approx. 19cm long, have an extended wing span of 180cm and a height of 6cm. Features: Variable Sweepwings Pivoting Missile Pylons Opening Cockpit Interchangeable Landing Gear Includes Seated and Standing Pilot Limited edition collector''s serialized card Limited to 800 sets Worldwide!',
    '',
    21999,
    4.0,
    12.0,
    6.0,
    9.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    1,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-calibre-wings-max-miriya-1-72-vf-1j-fighter-valkyrie-gift-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    21999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    923,
    'skelanimals-day-of-the-dead-jae-wolf-mini-plush',
    'Skelanimals Day of the Dead Jae (Wolf) Mini Plush',
    'Skelanimals Day of the Dead Jae (Wolf) Mini Plush Skelanimals ''Day of the Dead 6" Mini Plush have been resurrected in traditional "Dia de los Muertos" fashion! Each character features the trademark Skelanimals bone pattern, and decorated in the classic sugar skull style with flowers, hearts, and ornate details.',
    '12250',
    1499,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    '8-19872-01225-3',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals Day of the Dead Jae (Wolf) Mini Plush',
    'Skelanimals Day of the Dead Jae (Wolf) Mini Plush',
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, wolf',
    '/skelanimals-day-of-the-dead-jae-wolf-mini-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Skelanimals Day of the Dead Jae (Wolf) Mini Plush',
    NULL,
    false,
    '12250',
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, wolf',
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
    '06/20/2025',
    '06/23/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    924,
    'acid-rain-phantom-team-a-mirage-eclipse',
    'Acid Rain Phantom Team A - [Mirage + Eclipse]',
    'Acid Rain Phantom Team A - [Mirage + Eclipse] Phantom Team is directly under the command of the Omanga Intelligence Agency, this black ops unit is assigned to carry out top secret missions involving assassinations, espionage, tactical strikes and inciting civil disorders in enemy territories. Acid Rain presents the new Acid Rain Phantom Team A (Mirage & Eclipse). This item is set in the 1:18 scale, painted with a new military color scheme and highly detailed weathering effect. The Acid Rain Phantom Team A comes inclusive with 2 figures, one submachine gun, one OM28R pulse rifle, one portable missile launcher. Features: 1/18 Scale Made of plastic Military color scheme Highly detailed weathering effect Fully articulated Contents: Mirage figure Eclipse figure Submachine gun OM28R Pulse Rifle Portable Missile Launcher',
    'AR-1740S',
    5499,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-phantom-team-a-mirage-eclipse/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5499,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Phantom Team A - [Mirage + Eclipse]',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/20/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    925,
    'voltron-40th-anniversary-collectors-set',
    'Voltron 40th Anniversary Collector''s Set',
    'VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET Fully transformable collectible includes never-before-seen light and sound features! Toynami is proud to announce that its upcoming VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET is now available for retailers to order! This limited-edition collectible will only be produced for the 40th anniversary, consisting of five fully transformable lions that unite to form Voltron, Defender of the Universe! Each lion, constructed of die-cast metal, will feature light-up eyes, activated by a unique magnetic key. When united, Voltron stands over 13 inches tall on an updated electronic light-up base, featuring a sequenced transformation sound file that is officially licensed by legendary voice actor Neil Ross. Incorporated into the base are storage positions for all five of the lions'' individual weapon blades. Also included is Voltron''s sword and shield. In addition, the upcoming VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET will feature contributions from VOLTRON''s original designer, legendary Toy Mechanic Designer Katsushi Murakami! Murakami, former managing director of toy companies POPY and Bandai, is known for his designs for landmark toy lines like CHOGOKIN, SUPER SENTAI, BEAST KING GOLION and ARMOURED FLEET DAIRUGGER XV. Voltron fans can look forward to never-before-seen artwork and behind-the-scenes insights as part of the VOLTRON 40TH ANNIVERSARY COLLECTOR''S SET package! The 40th Anniversary has the following added features from its predecessors. Diecast lions made with zinc alloy. All new remaster Lion Heads on all Lions - now with light-up LED feature Updated electronic light-up base, featuring a sequenced transformation sound file that is officially licensed by legendary voice actor Neil Ross Updated weapons and accessories with corresponding colors Made with ABS, Zinc Alloy, POM, and PVC.',
    '13600',
    32999,
    128.0,
    20.0,
    14.0,
    6.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    1000,
    -1,
    NULL,
    NULL,
    NULL,
    '/voltron-40th-anniversary-collectors-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    32999,
    0,
    0,
    NULL,
    NULL,
    1,
    NULL,
    false,
    'Voltron Voltron 40th Anniversary Collector''s Set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/30/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    926,
    'toys-alliance-millinillions-mi-k05-rainbow-yume',
    'Toy''s Alliance MILLINILLIONS MI-K05 Rainbow Yume',
    'The incarnation of cuteness and justice, holding a water cannon and looking for other friends, shuttles on the ruthless battlefield, with a round and firm face that is not afraid of the ever-changing world. Cuteness is justice. Ben Huang is a toy designer from Taiwan who designs for capsule toys. He''s liked painting and clay modeling since he was a child. Even after graduating from college with a major in digital animation and working in an animation company, he still couldn''t hide his love for dolls and toys. In 2016, he began to working on the world of toys, first collaborating with "kitan club" which is from Japan, and then establishing the Taiwanese toy brand "Creative Toys". 1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    8,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k05-rainbow-yume/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'MILLINILLIONS Toy''s Alliance MILLINILLIONS MI-K05 Rainbow Yume',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    927,
    'robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-ben-dixon-volume-2',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - BEN DIXON VOLUME 2',
    'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - BEN DIXON VOLUME 2"Micronian" was the phrase used by Zentraedi to describe humans. It referred to the humans'' micronized size. The phrase could presumably be used any other race smaller than the Zentraedi as there is a legend saying that they should not harm a "Micronian" planet.Each set is fully equipped with 2 pilots; one cockpit pilot and one standing pilot. This Veritech stands approximately 6 inches tall, is fully articulated and can be converted into three different modes: Fighter, Battloid or Gerwalk. The Veritech Micronian Pilot Collection will each be packed in their limited-edition boxes which, when collected in its entirety, will showcase an image of all your favorite Robotech pilots!',
    '',
    3499,
    1.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-vf-1-transformable-veritech-fighter-with-micronian-pilot-ben-dixon-volume-2/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - BEN DIXON VOLUME 2',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    928,
    'amy-x-my-melody-10-inch-deluxe-plush',
    'Amy x My Melody 10 inch Deluxe Plush',
    'Amy x My Melody 10 inch Deluxe Plush Toynami introduces this all new crossover!Sonic x Sanrio 10 inch Deluxe Plush which feature: Sonic x Hello Kitty Amy x My Melody Knuckles x Badtz-Maru Tails x Chococat Choose your favorite or collect them all!',
    '11020',
    2499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/amy-x-my-melody-10-inch-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Sanrio Amy x My Melody 10 inch Deluxe Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    929,
    'robotech-roy-fokkers-shogun-warrior-vf-1s',
    'Robotech Roy Fokker''s Shogun Warrior VF-1S',
    'Features: 24 inch (60 cm) tall figure Rolling wheels Shooting Fist Gun-pod with firing missiles',
    '',
    37999,
    10.0,
    28.0,
    16.0,
    9.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-roy-fokkers-shogun-warrior-vf-1s/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    37999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech Roy Fokker''s Shogun Warrior VF-1S',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    930,
    'b2five-bucks-team-trooper-set',
    'B2Five Bucks Team Trooper Set',
    'WAVE 3aBucks Team Trooper Set The Bucks Team Trooper set set comes fully equipped with three1:28 scale Bucks Team troopers. All 1:28 scale figures are highly poseable with 21 points of articulation and fit perfectly into any Acid Rain B2Five armored vehicles . Additional accessories include heavy hand guns, submachine guns, mini gun, knife, pistols, and a radio transceiver. Features: (x3) Bucks Team Troopers (x2) Heavy hand gun (x2) Submachine Gun (x1) Mini Gun (x1) Knife (x2) Pistol (x1) Radio Transceiver',
    'BW3_02',
    3899,
    2.0,
    7.0,
    5.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-bucks-team-trooper-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3899,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World B2FIVE B2Five Bucks Team Trooper Set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    931,
    'macross-saga-retro-transformable-1-100-vf-1j-max-jenius-valkyrie',
    'Macross Saga: Retro Transformable 1/100 VF-1J Max Jenius Valkyrie',
    'MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION - MAX JENIUS VALKYRIE The Macross Saga A gigantic spaceship crash lands on Earth, foreshadowing the arrival of an alien armada bent on war and destruction. The world unites to unlock the secrets of its miraculous alien technology knows as Robotech to defend the world against impending invasion. The challenges they would face would be greater than anyone could have imagined... Macross is a Japanese science fiction anime series that takes place ten years after an alien space ship the size of a city crashed onto South Atalia Island. The space ship was found and reconstructed by humans who turned it into the SDF-1 Macross. It''s up to Earth Defense Pilots to defend and save our world! Toynami is proud to offer five new editions from the MACROSS SAGA: RETRO TRANSFORMABLE COLLECTION with the VF-1J 1/100 Max Jenius Valkyrie. Features: Transformable to three modes: Battroid, Gerwalk & Fighter Highly poseable with over 30 points of articulation Stands over 5" tall in Battroid Mode & 6" long in Fighter Mode Interchangeable hands, missiles & accessories included Each comes with pilot Includes adjustable display stand for maximum versatility & poseability Classic 1980''s retro packaging Don''t miss out on the ultimate in MACROSS SAGA collectibles!',
    '10920',
    5999,
    1.0,
    9.0,
    6.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    20,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-saga-retro-transformable-1-100-vf-1j-max-jenius-valkyrie/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5999,
    0,
    2,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross Saga: Retro Transformable 1/100 VF-1J Max Jenius Valkyrie',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    932,
    'skelanimals-series-3-vinyl-figure-set-of-3',
    'Skelanimals Series 3 Vinyl Figure Set of 3',
    'Adopt 3 Skelanimals favorites in this box set! Pen the Penguin, Jae the Wolf, and Pudge the Turtle are waiting with open hearts for you to bring them home! Ages 4 & up',
    '3546',
    1499,
    1.0,
    12.0,
    9.0,
    6.0,
    'new',
    '8-16355-00609-9',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals Series 3 Vinyl Figure Set of 3',
    'Skelanimals Series 3 Vinyl Figure Set of 3',
    'skelanimals, vinyl, figure, figurine, pen, penguin, jae, wolf, pudge, turtle, cute, collectible, goth, dead, animal, toynami, toy',
    '/skelanimals-series-3-vinyl-figure-set-of-3/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Skelanimals Series 3 Vinyl Figure Set of 3',
    NULL,
    false,
    '3546',
    '8-16355-00609-9',
    'Default Tax Class',
    NULL,
    'skelanimals, vinyl, figure, figurine, pen, penguin, jae, wolf, pudge, turtle, cute, collectible, goth, dead, animal, toynami, toy',
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    933,
    'little-glowing-embers-blind-box-figurine',
    'Little Glowing Embers Blind Box Figurine',
    '"The little critters and creatures from Miyo''s Mystic Musings are born from my dreams, meditations and visions from other worlds. My wish is to share my world and my insights with you. Hopefully they will brighten this reality we live in today, with a little quirkiness and fun while still putting a smile on your face." - Miyo Nakamura LITTLE GLOWING EMBERSWhen sitting in front of a friendly fire, maybe with a cup of cocoa wrapped in a cozy blanket on a winter''s night or perhaps roasting marshmallows with friends around a summer campfire... There is a moment when the flames die down leaving the logs glowing red. Then, you hear it, a slight crackle as a spent log falls apart and embers fly up into the air. That is the moment when Little Baby Embers are born!You may not see them as they play in the hearth amongst the ashes, covered in soot. But remember they are there before you go poking about in the ashes! If you are lucky, you might see a puff of a dragon''s kiss!The Little Glowing Embers Blind Box Figurines are approximately 2.5" tall and feature: Glowing Soot Glowing Sparks Glowing Cinder Glowing Ash Glowing Flames PURCHASED INDIVIDUALLY: The figurines come blind boxed so you will be receiving a random figure. No exchanges or returns.',
    '14620',
    1200,
    0.4,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/little-glowing-embers-blind-box-figurine/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    1000,
    1200,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Miyo''s Mystic Musings Little Glowing Embers Blind Box Figurine',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/25/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    934,
    'skelanimals-day-of-the-dead-jack-rabbit-mini-plush',
    'Skelanimals Day of the Dead Jack (Rabbit) Mini Plush',
    'Skelanimals Day of the Dead Jack (Rabbit) Mini Plush Skelanimals ''Day of the Dead 6" Mini Plush have been resurrected in traditional "Dia de los Muertos" fashion! Each character features the trademark Skelanimals bone pattern, and decorated in the classic sugar skull style with flowers, hearts, and ornate details.',
    '12260',
    1499,
    1.0,
    9.0,
    6.0,
    4.0,
    'new',
    '8-19872-01226-0',
    false,
    true,
    'active',
    'none',
    0,
    0,
    'Skelanimals Day of the Dead Jack (Rabbit) Mini Plush',
    'Skelanimals Day of the Dead Jack (Rabbit) Mini Plush',
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, bunny, rabbit, jack',
    '/skelanimals-day-of-the-dead-jack-rabbit-mini-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Skelanimals Day of the Dead Jack (Rabbit) Mini Plush',
    NULL,
    false,
    '12260',
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, plush, toy, day of the dead, dia de los muertos, toynami, hot topic, goth, gothic, girl, cute, bunny, rabbit, jack',
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
    '06/20/2025',
    '06/23/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    935,
    'macross-vf-1s-skull-squad-shirt',
    'Macross VF-1S Skull Squad Shirt',
    'Officially Licensed Style: Tri-Blend Jersey Unisex T-Shirt Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% RayonCollar: Crew NeckFit Type: ClassicSize Range: S-3XL',
    '',
    3500,
    2.0,
    15.0,
    11.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/macross-vf-1s-skull-squad-shirt/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross Macross VF-1S Skull Squad Shirt',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/23/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    936,
    'skelanimals-deluxe-backpack-kit-cat',
    'Skelanimals Deluxe Backpack Kit (Cat)',
    'Skelanimals Deluxe Backpack Kit (Cat) Pack your favorite Skelanimals pals around with you wherever you go, with these adorable backpacks! You''ll never be alone with your favorite Skelanimals pal clinging to your shoulders! The Skelanimals Deluxe Backpack is constructed of sturdy materials, and super-soft plush fabric with a zipper closure. Measures approximately 12-inches tall.',
    '1927',
    3499,
    1.0,
    12.0,
    9.0,
    6.0,
    'new',
    '8-16355-00392-0',
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Skelanimals Deluxe Backpack Kit (Cat)',
    'Skelanimals Deluxe Backpack Kit (Cat)',
    'skelanimals, plush, backpack, bag, purse, tote, toy, toynami, hot topic, goth, gothic, girl, cute, kit, cat, kitty',
    '/skelanimals-deluxe-backpack-kit-cat/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3499,
    0,
    5,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Skelanimals Deluxe Backpack Kit (Cat)',
    NULL,
    false,
    '1927',
    NULL,
    'Default Tax Class',
    NULL,
    'skelanimals, plush, backpack, bag, purse, tote, toy, toynami, hot topic, goth, gothic, girl, cute, kit, cat, kitty',
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
    '06/20/2025',
    '06/23/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    937,
    'knuckles-x-badtz-maru-10-inch-deluxe-plush',
    'Knuckles x Badtz-Maru 10 inch Deluxe Plush',
    'Knuckles x Badtz-Maru 10 inch Deluxe Plush Toynami introduces this all new crossover!Sonic x Sanrio 10 inch Deluxe Plush which feature: Sonic x Hello Kitty Amy x My Melody Knuckles x Badtz-Maru Tails x Chococat Choose your favorite or collect them all!',
    '11010',
    2499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/knuckles-x-badtz-maru-10-inch-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Sanrio Knuckles x Badtz-Maru 10 inch Deluxe Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    938,
    'sdcc-2012-exclusive-dc-comics-x-skelanimals-the-dark-knight-rises-batman-jae-plush',
    'SDCC 2012 Exclusive: DC Comics x Skelanimals The Dark Knight Rises Batman Jae Plush',
    'Dead animals will rise! This exclusive plush features Jae the Wolf as Batman in The Dark Knight Rises. San Diego Comic Con 2012 Exclusive Limited to 1000 worldwide 12" tall',
    'CC2012-DCSkelanimal',
    3999,
    2.0,
    9.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'none',
    0,
    0,
    'SDCC 2012 Exclusive DC Comics x Skelanimals The Dark Knight Rises Batman Jae Plush',
    'SDCC 2012 Exclusive DC Comics x Skelanimals The Dark Knight Rises Batman Jae Plush',
    'toynami, skelanimals, batman, jae, wolf, sdcc, comic, con, exclusive, plush, toy, dark, knight, rises, cool, cute, dc, comics, stuffed, animal, superhero',
    '/sdcc-2012-exclusive-dc-comics-x-skelanimals-the-dark-knight-rises-batman-jae-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals SDCC 2012 Exclusive: DC Comics x Skelanimals The Dark Knight Rises Batman Jae Plush',
    NULL,
    false,
    'CC2012-DCSkelanimal',
    NULL,
    'Default Tax Class',
    NULL,
    'toynami, skelanimals, batman, jae, wolf, sdcc, comic, con, exclusive, plush, dark, knight, rises, toy, cool, cute, dc, comics, stuffed, animal, superhero',
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
    '06/20/2025',
    '07/22/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    939,
    'toys-alliance-millinillions-mi-k06-boss-k',
    'Toy''s Alliance MILLINILLIONS MI-K06 Boss K',
    '1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k06-boss-k/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'MILLINILLIONS Toy''s Alliance MILLINILLIONS MI-K06 Boss K',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    940,
    'b2five-abaddon-trooper-set',
    'B2Five Abaddon Trooper Set',
    'Acid Rain B2Five Abaddon Trooper SetThe Abaddon Trooper set set comes fully equipped with three1:28 scale Abaddon soldiers. All 1:28 scale figures are highly poseable with 21 points of articulation and fit perfectly into any Acid Rain B2Five armored vehicles . Additional accessories include hand gun, submachine guns, machine gun and knife.Features: 3 Hand Guns 2 Submachine Guns 1 Submachine Gun L 1 Machine Gun 1 Knife',
    '',
    3899,
    2.0,
    7.0,
    5.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-abaddon-trooper-set/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3899,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World B2FIVE B2Five Abaddon Trooper Set',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    941,
    'emily-the-strange-6-bendy-figure',
    'Emily the Strange 6" Bendy Figure',
    'If you are lucky enough to be reading this right now, it means you are invited to the celebration of all things strange. Toynami is proud to present the Emily the Strange 6" action figure.A sharp-witted and rebellious young woman, Emily is one bad cat. She looks out on her surroundings with disinterest, but hey, what else is new? Is she mad or just curious? She is anti-cool, a sub-culture of one, and a follower of no one but herself. She is the anti-hero for the ''Do-It-Yourself'' movement! Her favorite phrase is "Get Lost!", which is both an invitation to travel to unknown places and an instruction to "Take a Hike!" Her creative spirit stems from a fusion of equal parts rock n roll, punk surrealism, weird science, unbridled sarcasm and a love for furry creatures that meow. When she isn''t in her lab tinkering and cobbling together a particle accelerator, she is napping with her four black cats-Miles, Mystery, Sabbath and Nee Chee. The 6" Emily Action Figure features bendable arms and legs, a display stand and her eldest cat Mystery.',
    '13200',
    1499,
    10.0,
    12.0,
    8.0,
    3.0,
    'new',
    '819872013205',
    true,
    true,
    'active',
    'by product',
    285,
    0,
    NULL,
    NULL,
    NULL,
    '/emily-the-strange-6-bendy-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1499,
    0,
    3,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Emily the Strange Emily the Strange 6" Bendy Figure',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    942,
    'acid-rain-phantom-team-b-parhelion-aurora',
    'Acid Rain Phantom Team B - [Parhelion + Aurora]',
    'Acid Rain Phantom Team B - [Parhelion + Aurora] Phantom Team is directly under the command of the Omanga Intelligence Agency, this black ops unit is assigned to carry out top secret missions involving assassinations, espionage, tactical strikes and inciting civil disorders in enemy territories. Acid Rain presents the new Acid Rain Phantom Team B (Pharhelion & Aurora). This item is set in the 1:18 scale, painted with a new military color scheme and highly detailed weathering effect. The Acid Rain Phantom Team B comes inclusive with 2 figures, one sniper rifle and one flamethrower. Features: 1/18 Scale Made of plastic Military color scheme Highly detailed weathering effect Fully articulated Contents: Parhelion figure Aurora figure Sniper Rifle Flamethrower',
    'AR-1750S',
    5499,
    2.0,
    6.0,
    6.0,
    4.0,
    'new',
    NULL,
    false,
    false,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/acid-rain-phantom-team-b-parhelion-aurora/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    5499,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World Acid Rain Phantom Team B - [Parhelion + Aurora]',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    943,
    'skelanimals-maxx-the-bulldog-vinyl-figure',
    'Skelanimals Maxx the Bulldog Vinyl Figure',
    'Maxx may seem a bit rough on the outside, but deep down inside, he''s not really a tough guy! He''ll protect his friends, but his mean bite is just for show. He''s gentle and kind, just don''t tell him you know! His favorite movie is "The Dog Catcher." Get your very own best friend here now. This vinyl figure comes in his own window display box. About 4 1/2" tall',
    '3520',
    1998,
    2.0,
    10.0,
    10.0,
    8.0,
    'new',
    '816355005603',
    false,
    false,
    'active',
    'none',
    0,
    0,
    'Skelanimals Maxx the Bulldog Vinyl Figure',
    'Skelanimals Maxx the Bulldog Vinyl Figure',
    'toynami, skelanimals, vinyl, figure, toy, maxx, bulldog, dog, collectible, cute, dead, undead, pet',
    '/skelanimals-maxx-the-bulldog-vinyl-figure/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    1998,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Skelanimals Skelanimals Maxx the Bulldog Vinyl Figure',
    NULL,
    false,
    '3520',
    '8-16355-00560-3',
    'Default Tax Class',
    NULL,
    'toynami, skelanimals, vinyl, figure, toy, maxx, bulldog, dog, collectible, cute, dead, undead, pet',
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    944,
    'tails-x-chococat-10-inch-deluxe-plush',
    'Tails x Chococat 10 inch Deluxe Plush',
    'Tails x Chococat 10 inch Deluxe Plush Toynami introduces this all new crossover!Sonic x Sanrio 10 inch Deluxe Plush which feature: Sonic x Hello Kitty Amy x My Melody Knuckles x Badtz-Maru Tails x Chococat Choose your favorite or collect them all!',
    '11030',
    2499,
    2.0,
    12.0,
    9.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tails-x-chococat-10-inch-deluxe-plush/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Sanrio Tails x Chococat 10 inch Deluxe Plush',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    945,
    'naruto-shippuden-poseable-action-figure-naruto',
    'Naruto Shippuden Poseable Action Figure - Naruto',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... We are proud to announce the first series in the Naruto Poseable action figures! You can choose from three of your favorite characters: Naruto, Kakashi and Itachi. Each figure is fully articulated and features accessories and display stands! 4" tall Naruto Figure Multiple points of articulation Comes with extra accessories and stand',
    '11630',
    2499,
    1.0,
    9.0,
    7.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-poseable-action-figure-naruto/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Poseable Action Figure - Naruto',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    946,
    'toys-alliance-millinillions-mi-k07a-monster-child',
    'Toy''s Alliance MILLINILLIONS MI-K07A Monster Child',
    '1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k07a-monster-child/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    12000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'MILLINILLIONS Toy''s Alliance MILLINILLIONS MI-K07A Monster Child',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    947,
    'mospeada-cyclone-ride-armor-shirt',
    'Mospeada Cyclone Ride Armor Shirt',
    'Officially Licensed Style: Tri-Blend Jersey Unisex T-Shirt Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% RayonCollar: Crew NeckFit Type: ClassicSize Range: S-3XL',
    '',
    3500,
    2.0,
    15.0,
    11.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/mospeada-cyclone-ride-armor-shirt/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Mospeada Mospeada Cyclone Ride Armor Shirt',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/31/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    948,
    'robotech-rick-hunters-shogun-warrior-vf-1j',
    'Robotech Rick Hunter''s Shogun Warrior VF-1J',
    'Features: 24 inch (60 cm) tall figure Rolling wheels Shooting Fist Gun-pod with firing missiles',
    '',
    37999,
    10.0,
    28.0,
    16.0,
    9.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-rick-hunters-shogun-warrior-vf-1j/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    37999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech Rick Hunter''s Shogun Warrior VF-1J',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    949,
    '1-100-scale-transformable-macross-vf-1s-armored-valkyrie-gbp-1s-2019-convention-exclusive',
    '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive',
    '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S A gigantic spaceships crash lands on Earth, foreshadowing the arrival of an alien armada bent on war and destruction. The world unites to unlock the secrets of its miraculous alien technology known as Robotech to defend the world against impending invasion. The challenges they would face would be greater than anybody could have imagined...A throwback to the 80''s vintage package design and remastered for today''s collector while still staying true to the vintage design. Relive the nostalgia of your youth with this highly limited 1/100 scale transformable Macross VF-1S Armored Valkyrie GBP-1S. Making its first debut at SDCC 2019! SDCC 2019 Exclusive Limited to 1,000 units worldwide',
    'CC2019-Macross Heavy',
    9999,
    3.0,
    14.0,
    8.0,
    6.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/1-100-scale-transformable-macross-vf-1s-armored-valkyrie-gbp-1s-2019-convention-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    9999,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Macross 1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    950,
    'b2five-r711-speeder-mk1r',
    'B2Five R711 Speeder MK1R',
    'WAVE 1R711 Speeder MK1r set The R711 Speeder MK1r is a fully detailed vehicle which can transform into two different modes: Speeder and Walker. The MK1r is built to accommodate one 2.5 inch military pilot (included), or any other 2.5 inch figures. All 2.5 inch scale figures are highly poseable with 21 points of articulation. Additional accessories include a heavy hand gun. Features: Speeder MK1r 2.5" Pilot Soldier Heavy Hand Gun',
    'BW1_01',
    2999,
    2.0,
    7.0,
    5.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-r711-speeder-mk1r/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World B2FIVE B2Five R711 Speeder MK1R',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    951,
    'toys-alliance-millinillions-mi-k07b-monster-child',
    'Toy''s Alliance MILLINILLIONS MI-K07B Monster Child',
    '1:18 Scale Action Figure Made of plastic Highly articulated figure Compatible with other sets in the line',
    '',
    12000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    4,
    0,
    NULL,
    NULL,
    NULL,
    '/toys-alliance-millinillions-mi-k07b-monster-child/',
    NOW(),
    NULL,
    NULL,
    0,
    11999,
    0,
    11999,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'MILLINILLIONS Toy''s Alliance MILLINILLIONS MI-K07B Monster Child',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    952,
    'tulipop-vinyl-keychain-bubble',
    'Tulipop Vinyl Keychain - Bubble',
    'Toynami is proud to announce, TULIPOP, brought to you all the way from Iceland! The Enchanted world of Tulipop, dreamt up by a mother of two, Signy and Helga, is an original, beautiful and magical range like no other! In this collaboration we will bring to you a range of Tulipop items, both plush toys and vinyl figures featuring the four main characters, Bubble, Gloomy, Fred and Miss Maddy. Tulipop Vinyl Keychain - Bubble',
    '10830',
    499,
    0.6,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/tulipop-vinyl-keychain-bubble/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Tulipop Tulipop Vinyl Keychain - Bubble',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    953,
    'robotech-x-eepmon-vf-1s-skull-leader-aviator-flight-jacket',
    'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket',
    'ROBOTECH X EEPMONLIMITED TO 100 UNITS COLOR: BLACK WORLDWIDE SHIPPING (some exclusions apply)Toynami in collaboration with famed digital artist EEPMON is excited to present the Robotech VF-1S Skull Leader Aviator Flight Jacket!This highly limited and numbered jacket is based directly off a real fighter pilot jacket and adorned with over 10 iconic Robotech symbols and patches curated by EEPMON. This Black 100% Polyester jacket (with lightweight Polyester Fill) features a die cast metal VF-1S zipper pull. The back of the jacket features a custom VF-1S Skull Leader image by EEPMON that blends seamlessly into the Robotech universe. Each jacket is custom made to order and individually numbered. This highly limited run of only 100 units is sure to sell out quickly, so don''t hesitate and order yours today! More about EEPMON:EEPMON is an internationally acclaimed Digital Artist working at the intersections in computer arts, coding and experiential design. His clients include MARVEL, Canada Goose, Alpha Industries, Microsoft Xbox, MINI, and the Canada Science & Technology Museum. His work has been featured in HYPEBEAST, GQ France, Complex, JAY-Z''s Life+Times to Computer Arts, and Applied Arts Magazines. His creativity and entrepreneurism represents the ever-changing landscape of modern day industries and is a direct result of the digital tools that empower EEPMON to create new innovative works.EEPMON travels frequently between Canada, USA, China and Japan.http://eepmon.comInstagram: EEPMON PLEASE REFER TO SIZE CHART!',
    '12810',
    30000,
    3.0,
    20.0,
    14.0,
    7.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'none',
    9,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-x-eepmon-vf-1s-skull-leader-aviator-flight-jacket/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    30000,
    0,
    12,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    'Robotech jacket, Robotech, Eepmon, Bomber jacket, fighter pilot jacket',
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
    '06/20/2025',
    '07/28/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    954,
    'b2five-k6-jungle-soldiers',
    'B2Five K6 Jungle Soldiers',
    'WAVE 1K6 Jungle Soldier set The Jungle Soldier set comes fully equipped with one 2.5 inch Bucks Team Steel figure and two K6 Jungle Infantry. All 2.5 inch figures are highly poseable with 21 points of articulation and fit perfectly into any Acid Rain B2Five armored vehicles . Additional accessories include a heavy hand gun, submachine guns, mini gun, anti-tank rocket launcher, anti-tank rockets and a rocket case. Features: 2.5" Bucks Team Steel figure (x2) 2.5" K6 Jungle Infantry figures (x2) Heavy Hand Gun (x2) Submachine Gun (x2) Mini Gun (x3) Anti-tank Rockets Anti-tank Rocket Launcher Rocket case',
    'BW1_02',
    3899,
    2.0,
    7.0,
    5.0,
    5.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/b2five-k6-jungle-soldiers/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3899,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Acid Rain World B2FIVE B2Five K6 Jungle Soldiers',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    955,
    'naruto-shippuden-poseable-action-figure-kakashi',
    'Naruto Shippuden Poseable Action Figure - Kakashi',
    'NARUTO: SHIPPUDEN picks up the adventures of the now more mature Naruto and his fellow ninjas on Team Kakashi, reunited after a two and a half year separation. Naruto returns to Hidden Leaf Village with more power and stamina than ever. He still dreams of becoming the next Hokage, but obstacles keep popping up to block his path... We are proud to announce the first series in the Naruto Poseable action figures! You can choose from three of your favorite characters: Naruto, Kakashi and Itachi. Each figure is fully articulated and features accessories and display stands! 4" tall Kakashi Figure Multiple points of articulation Comes with extra accessories and stand',
    '11620',
    2499,
    1.0,
    9.0,
    7.0,
    5.0,
    'new',
    NULL,
    true,
    false,
    'active',
    'none',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-shippuden-poseable-action-figure-kakashi/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Shippuden Poseable Action Figure - Kakashi',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/15/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    956,
    'naruto-six-paths-sage-mode-1-1-bust-final-payment-only',
    'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)',
    'PLEASE NOTE THAT THIS IS NOT THE TOTAL PRICE FOR THE ITEM. THIS PAGE IS FOR THE REMAINING PAYMENT AFTER DEPOSIT ONLY! IF YOU HAVE NOT SUBMITTED A DEPOSIT FOR THIS ITEM, PLEASE DO NOT ADD THIS ITEM TO YOUR CART. TOTAL PRICE IS $1299.99 USD (TAX AND SHIPPING NOT INCLUDED) Toynami is pleased to announce the expansion of its popular NARUTO SHIPPUDEN product line, with Life-Size 1:1 Scale Busts! Naruto also ended up receiving the Six Paths Senjutsu from the Sage of Six Paths and when combined with his Sage Mode, it gave rise to one of his strongest forms called the Six Paths Sage Mode. In this form, Naruto became strong enough to fight the likes of Madara Uchiha and even Kaguya Otsutsuki. Furthermore, Six Paths Senjutsu allowed him to create the Truth-Seeking Balls and made him incredibly versatile in combat. His sensory powers were heightened to the next level and his strength rose to a level great enough to overpower even the strongest of enemies. Naruto''s first taste of the Six Paths Sage Mode came after he fell at the hands of Madara Uchiha in the Fourth Great Ninja War. Having Kurama ripped from his body, Naruto was on the brink of death and while the likes of Gaara and Minato were attempting to save him, Naruto met the spirit of Hagoromo Otsutsuki. Being the reincarnation of Asura Otsutsuki, Naruto was offered half the power of the Sage, while Sasuke was given the other half. Upon returning to consciousness, Naruto had gained the incredible ability of the Six Paths Sage Mode. To put it simply, the Six Paths Sage Mode is a power that Hagoromo Otsutsuki gifted to him for having a strong will and the guts to never give up. This power is quite similar to Sage Mode in that it makes use of natural energy, or Senjutsu chakra, however, the scale at which it allows him to perform techniques is much bigger. Limited to 300 units!!',
    '12600-b',
    104019,
    41.0,
    32.0,
    28.0,
    14.0,
    'new',
    NULL,
    false,
    false,
    'active',
    'by product',
    197,
    0,
    NULL,
    NULL,
    NULL,
    '/naruto-six-paths-sage-mode-1-1-bust-final-payment-only/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    129999,
    104019,
    0,
    1,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '06/23/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    957,
    'deluxe-6-pvc-statue-toshiro',
    'Deluxe 6" PVC Statue: Toshiro',
    'BLEACH, created by Tite Kubo, made its debut as manga in the pages of SHONEN JUMP, made the leap to television in Japan in 2004, and can currently be seen on CARTOON NETWORK''s Adult Swim. BLEACH tells the story of Ichigo, a high-school student with the ability to see ghosts, and his adventures with the Soul Reaper Rukia, as they search for ghosts and cleanse their evil spirits. Toshiro - A Soul Reaper who grew up in the Rukongai, Toshiro was a child prodigy with very rare talents and is the youngest captain in the history of the Soul Society. Deluxe 6" PVC Statue: Toshiro 6" tall Comes with extra accessories and stand',
    '',
    2499,
    2.0,
    9.0,
    8.0,
    4.0,
    'new',
    NULL,
    false,
    false,
    'active',
    'by product',
    0,
    0,
    NULL,
    NULL,
    NULL,
    '/deluxe-6-pvc-statue-toshiro/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    2499,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Naruto Deluxe 6" PVC Statue: Toshiro',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '06/20/2025',
    '07/30/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    958,
    'admiral-hunter-s-exclusive-vr-052f-cyclone',
    'Admiral Hunter''s Exclusive VR-052F Cyclone',
    'WAVE 1 IS SOLD OUT WAVE 2 SHIPPING END OF AUGUST - EARLY SEPTEMBER 2025 Following the end of the REF Civil War, Admiral Rick Hunter has returned to lead the Robotech Expeditionary Force-and now, his personal VR-052F Cyclone is available to you. This exclusive collector''s edition features a custom Admiral Hunter head sculpt and his Cyclone decked out in the iconic Skull Squadron colors from the original Macross Saga. Limited to just 500 units worldwide, this is a must-have centerpiece for any true Robotech fan. Used by the heroes of the New Generation for both combat and travel, Cyclones are highly versatile transformable mecha capable of converting into powerful Battle Armor mode. Crafted with exceptional detail, this figure is constructed from die-cast metal, POM, and high-grade plastic injection parts. It weighs over 1.5 kg in Battle Armor Mode, and a full 2.4 kg with the base and accessories. Celebrate Robotech history and the enduring legacy of Admiral Hunter with this premium collectible. Features: Transformable VR-052F Cyclone Figure EP-40 pistol, 10 interchangeable hands for a variety of dynamic poses Iconic Skull Squadron Visor paint scheme to honor the Elite Veritech ''Skull Squadron; Admiral Hunter commanded in his youth.',
    'SDCC2025-Cyclone',
    32999,
    9.0,
    12.0,
    16.0,
    8.0,
    'new',
    NULL,
    false,
    true,
    'active',
    'by product',
    0,
    0,
    'Admiral Hunter''s Exclusive VR-052F Cyclone',
    NULL,
    NULL,
    '/admiral-hunter-s-exclusive-vr-052f-cyclone/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    32999,
    0,
    0,
    NULL,
    NULL,
    0,
    1,
    false,
    'Robotech Admiral Hunter''s Exclusive VR-052F Cyclone',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '07/22/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    959,
    '40th-anniversary-super-veritech-morpher-rick-hunter-vf1j-edition',
    '40th Anniversary Super Veritech Morpher - Rick Hunter VF1J Edition',
    'Celebrate 40 years of Robotech with this exclusive Super Veritech Morpher - Rick Hunter VF1J! This adorable yet powerful collectible features a transformable design, allowing it to shift from Robotech mecha mode to fighter jet mode with ease. Equipped with pull-back motorized action, it races into battle like never before. Each unit includes a booster pack with armor accessories to enhance your display or play. Limited to just 1,000 units worldwide, this special release is a must-have for longtime fans and collectors honoring four decades of Robotech legacy. Features: VF-1J Transformable Veritech mecha figure',
    '13450',
    3000,
    1.0,
    0.0,
    0.0,
    0.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    71,
    0,
    '40th Anniversary Super Veritech Morpher - Rick Hunter VF1J Edition',
    NULL,
    NULL,
    '/40th-anniversary-super-veritech-morpher-rick-hunter-vf1j-edition/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3000,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech 40th Anniversary Super Veritech Morpher - Rick Hunter VF1J Edition',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '07/22/2025',
    '08/08/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    960,
    'robotech-skull-cyclone-shirt-2025-sdcc-exclusive',
    'Robotech Skull Cyclone Shirt 2025 SDCC Exclusive',
    'Officially Licensed Style: Tri-Blend Jersey Unisex T-Shirt Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% RayonCollar: Crew NeckFit Type: ClassicSize Range: S-3XL',
    'SDCC2025-CycloneShirt',
    3500,
    1.0,
    15.0,
    11.0,
    1.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    9,
    0,
    NULL,
    NULL,
    NULL,
    '/robotech-skull-cyclone-shirt-2025-sdcc-exclusive/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    3500,
    0,
    0,
    NULL,
    NULL,
    0,
    NULL,
    false,
    'Robotech Robotech Skull Cyclone Shirt 2025 SDCC Exclusive',
    NULL,
    false,
    NULL,
    NULL,
    'Default Tax Class',
    NULL,
    NULL,
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
    '08/05/2025',
    '08/07/2025'
);
INSERT INTO products (
    id, slug, name, description, sku, base_price_cents, weight, width, height, depth,
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
    961,
    'pre-order-deposit-robotech-the-new-generation-combat-alpha-fighter',
    'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter',
    'THIS ITEM PAGE IS FOR A 20% PRE-ORDER DEPOSIT. PLEASE NOTE THAT THE REMAINING COSTS (INCLUDING SHIPPING AND HANDLING) WILL HAVE TO BE PAID WHEN ITEM IS READY TO SHIP.RETAIL PRICE: $499.99*, REQUIRED DEPOSIT $99.99(TAX & SHIPPING NOT INCLUDED) PREORDER DEADLINE: SEPTEMBER 25TH, 2025ESTIMATED SHIPPING: MAY 2026 *PRICE INCLUDES TARIFF FEES SPECIFICATIONS: Materials Diecast, ABS, POM, PVC LED light up feature (Batteries NOT INCLUDED) 377/LR626/AG4 x8 pcs button cell batteries required Features Include and are not limited to: Highly articulated transformable ~13" figure DAWNSEEKER''S Blade accessory 1/28 fully poseable Scott Bernard action figure LED Light up feature Dimensions L x W x H (cm): 49.5 x 35.5 x 17 Weight (kg): 3.6 PRODUCT CONTENTS: VAF-6C Combat Alpha Body Armor Fighter Head Cover A Armor Fighter Head Cover B Armor Fighter Head Cover C Armor Fighter Head Cover D Cockpit (with light-emitting unit) Left wing cover A Left wing cover B Left wing cover C Right wing cover A Right wing cover B Right wing cover C Wing struts (6 pieces) Shoulder missile pod (left and right) set Arm armor cover A x 2 Arm armor cover B x 2 Leg armor cover A x 2 Leg armor cover B x 2 Leg armor cover C x 2 Cyclone Storage 1/28 fully poseable action figure (Scott Bernard) DAWNSEEKER''S BLADE GU-XX GU-XX Part A GU-XX Part B GU-XX magazine (with magnetic switch) GU-XX magazine cove',
    'P12960',
    9999,
    8.0,
    12.0,
    16.0,
    8.0,
    'new',
    NULL,
    true,
    true,
    'active',
    'by product',
    26,
    0,
    NULL,
    NULL,
    NULL,
    '/pre-order-deposit-robotech-the-new-generation-combat-alpha-fighter/',
    NOW(),
    NULL,
    NULL,
    0,
    0,
    0,
    9999,
    0,
    0,
    NULL,
    NULL,
    1,
    NULL,
    true,
    'Robotech PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter',
    NULL,
    false,
    NULL,
    NULL,
    'Non-taxable',
    NULL,
    NULL,
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
    '08/06/2025',
    '08/09/2025'
);

-- ======================================
-- 🔗 Product Categories
-- ======================================
INSERT INTO product_categories (product_id, category_id)
SELECT 700, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 701, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 702, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 703, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 704, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 705, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 706, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 707, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 708, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 709, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 710, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 711, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 712, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 713, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 713, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 714, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 715, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 716, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 717, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 718, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 719, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 720, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 721, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 722, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 723, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 724, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 724, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 725, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 726, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 727, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 728, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 729, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 730, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 731, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 732, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 733, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 734, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 735, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 736, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 737, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 738, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 739, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 740, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 741, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 742, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 743, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 744, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 745, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 746, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 747, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 748, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 749, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 750, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 751, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 752, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 753, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 754, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 755, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 756, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 757, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 758, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 759, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 760, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 761, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 762, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 763, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 764, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 765, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 766, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 767, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 768, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 769, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 769, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 770, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 771, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 772, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 773, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 774, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 774, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 775, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 776, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 777, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 778, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 779, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 780, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 781, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 782, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 783, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 783, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 784, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 785, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 786, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 787, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 788, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 789, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 790, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 791, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 792, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 793, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 794, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 795, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 796, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 797, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 798, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 799, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 800, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 801, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 802, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 803, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 804, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 805, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 806, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 807, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 808, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 809, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 809, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 810, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 811, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 812, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 813, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 814, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 815, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 816, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 817, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 818, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 819, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 820, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 821, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 822, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 823, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 824, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 825, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 826, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 827, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 828, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 829, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 830, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 831, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 832, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 833, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 834, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 835, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 835, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 836, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 837, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 838, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 839, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 840, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 841, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 842, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 843, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 844, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 845, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 846, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 847, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 848, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 849, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 850, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 851, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 852, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 853, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 854, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 855, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 856, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 857, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 858, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 859, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 860, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 861, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 862, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 863, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 864, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 865, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 866, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 867, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 868, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 869, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 870, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 871, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 872, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 873, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 874, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 875, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 876, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 877, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 878, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 879, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 880, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 881, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 882, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 883, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 884, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 885, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 886, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 887, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 888, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 889, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 890, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 891, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 892, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 893, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 894, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 895, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 896, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 897, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 897, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 898, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 899, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 900, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 901, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 902, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 903, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 904, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 905, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 906, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 907, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 908, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 909, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 910, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 911, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 912, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 913, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 914, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 915, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 916, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 917, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 918, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 919, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 920, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 920, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 921, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 922, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 923, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 924, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 925, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 926, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 927, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 928, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 929, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 930, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 931, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 932, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 933, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 934, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 935, id FROM categories WHERE slug = 'hidden';
INSERT INTO product_categories (product_id, category_id)
SELECT 936, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 937, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 938, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 939, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 940, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 941, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 942, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 943, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 944, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 945, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 946, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 947, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 947, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 948, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 949, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 950, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 951, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 952, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 953, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 954, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 955, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 956, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 957, id FROM categories WHERE slug = 'the-archive';
INSERT INTO product_categories (product_id, category_id)
SELECT 958, id FROM categories WHERE slug = 'pre-orders';
INSERT INTO product_categories (product_id, category_id)
SELECT 959, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 959, id FROM categories WHERE slug = 'new-products';
INSERT INTO product_categories (product_id, category_id)
SELECT 959, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 960, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 960, id FROM categories WHERE slug = 'convention-exclusives';
INSERT INTO product_categories (product_id, category_id)
SELECT 961, id FROM categories WHERE slug = 'products';
INSERT INTO product_categories (product_id, category_id)
SELECT 961, id FROM categories WHERE slug = 'new-products';
INSERT INTO product_categories (product_id, category_id)
SELECT 961, id FROM categories WHERE slug = 'pre-orders';

-- ======================================
-- 🖼️ Product Images
-- ======================================
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (700, 'https://www.toynamishop.com/product_images/h/789/hypnotoad_01_121012__91095__49166.jpg', 'Futurama Hypnotoad Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (701, 'https://www.toynamishop.com/product_images/g/187/risk_img_5909__10260__45072.jpg', 'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (701, 'https://www.toynamishop.com/product_images/i/999/risk_img_5914__47946__77428.jpg', 'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (701, 'https://www.toynamishop.com/product_images/w/198/risk_img_5911__84199__30181.jpg', 'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (701, 'https://www.toynamishop.com/product_images/j/988/risk_img_5916__74682__97238.jpg', 'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (701, 'https://www.toynamishop.com/product_images/c/369/risk_img_5931__12022__08787.jpg', 'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (701, 'https://www.toynamishop.com/product_images/x/220/risk_img_5932__65407__61537.jpg', 'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (701, 'https://www.toynamishop.com/product_images/u/158/risk_img_5933__75841__16493.jpg', 'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (701, 'https://www.toynamishop.com/product_images/v/028/the_canmans_risk_oleum2__31361__11427.jpg', 'COMIKAZE 2013 Exclusive: Canmans RISK-OLEUM', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (702, 'https://www.toynamishop.com/product_images/h/204/skelanimal_dc_deluxe_plush_04__20381__85634.jpg', 'Skelanimals DC Robin Pen 10" Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (702, 'https://www.toynamishop.com/product_images/b/277/skelanimal_dc_deluxe_plush_05__89376__64879.jpg', 'Skelanimals DC Robin Pen 10" Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (703, 'https://www.toynamishop.com/product_images/l/055/Skelanimals_backpack_diego_deluxe_encore__90498__52621.jpg', 'Skelanimals Deluxe Backpack Diego (Bat)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (704, 'https://www.toynamishop.com/product_images/k/223/DSC_0352__44102__61584.jpg', 'B2Five K6 Jungle Stronghold ST2K', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (704, 'https://www.toynamishop.com/product_images/s/786/DSC_0359__00393__28674.jpg', 'B2Five K6 Jungle Stronghold ST2K', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (704, 'https://www.toynamishop.com/product_images/d/139/DSC_0371__86838__77529.jpg', 'B2Five K6 Jungle Stronghold ST2K', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (704, 'https://www.toynamishop.com/product_images/k/220/DSC_0403__89600__01229.jpg', 'B2Five K6 Jungle Stronghold ST2K', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (704, 'https://www.toynamishop.com/product_images/i/398/DSC_0407__39949__83372.jpg', 'B2Five K6 Jungle Stronghold ST2K', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (704, 'https://www.toynamishop.com/product_images/l/067/DSC_0401__13181__77929.jpg', 'B2Five K6 Jungle Stronghold ST2K', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (705, 'https://www.toynamishop.com/product_images/x/305/sol_009__78175__71832.jpg', 'Acid Rain Sol Commander [Re-run] 2017', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (705, 'https://www.toynamishop.com/product_images/l/908/sol_010__36518__43797.jpg', 'Acid Rain Sol Commander [Re-run] 2017', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (705, 'https://www.toynamishop.com/product_images/d/906/sol_012__64185__99412.jpg', 'Acid Rain Sol Commander [Re-run] 2017', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (705, 'https://www.toynamishop.com/product_images/f/563/sol_011__08160__30985.jpg', 'Acid Rain Sol Commander [Re-run] 2017', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (706, 'https://www.toynamishop.com/product_images/w/673/stronghold_m_001__26351__39440.jpg', 'Acid Rain Stronghold (Marine)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (706, 'https://www.toynamishop.com/product_images/x/168/stronghold_m_002__13047__20801.jpg', 'Acid Rain Stronghold (Marine)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (706, 'https://www.toynamishop.com/product_images/q/734/stronghold_m_006__18375__84784.jpg', 'Acid Rain Stronghold (Marine)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (706, 'https://www.toynamishop.com/product_images/h/866/stronghold_m_005__75735__87247.jpg', 'Acid Rain Stronghold (Marine)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (706, 'https://www.toynamishop.com/product_images/b/776/stronghold_m_007__45237__30161.jpg', 'Acid Rain Stronghold (Marine)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (706, 'https://www.toynamishop.com/product_images/n/092/stronghold_m_003__90822__87311.jpg', 'Acid Rain Stronghold (Marine)', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (707, 'https://www.toynamishop.com/product_images/z/084/itachi-4-inch_01__41623__15852.jpg', 'Naruto Shippuden Poseable Action Figure - Itachi', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (707, 'https://www.toynamishop.com/product_images/i/611/itachi-4-inch_06__07556__42972.jpg', 'Naruto Shippuden Poseable Action Figure - Itachi', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (707, 'https://www.toynamishop.com/product_images/t/597/itachi-4-inch_02__67233__10622.jpg', 'Naruto Shippuden Poseable Action Figure - Itachi', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (707, 'https://www.toynamishop.com/product_images/t/621/shippuden_4-inch-figures_series1_0061__94574__84455.jpg', 'Naruto Shippuden Poseable Action Figure - Itachi', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (707, 'https://www.toynamishop.com/product_images/v/905/shippuden_4-inch-figures_series1_0054__73157__76876.jpg', 'Naruto Shippuden Poseable Action Figure - Itachi', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (707, 'https://www.toynamishop.com/product_images/r/597/shippuden_4-inch-figures_series1_0058__69969__34242.jpg', 'Naruto Shippuden Poseable Action Figure - Itachi', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (708, 'https://www.toynamishop.com/product_images/y/856/micronian_roy_fokker_battloid_01__11920__52794.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - ROY FOKKER VOLUME 3', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (708, 'https://www.toynamishop.com/product_images/q/743/micronian_roy_fokker_guardian_01__78472__20330.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - ROY FOKKER VOLUME 3', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (708, 'https://www.toynamishop.com/product_images/r/099/micronian_roy_fokker_fighter_01__71122__74908.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - ROY FOKKER VOLUME 3', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (708, 'https://www.toynamishop.com/product_images/c/237/ROBOTECH_MICRONIAN-PILOTS_VOL3_ROY-FOKKER__76780__79975.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - ROY FOKKER VOLUME 3', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (709, 'https://www.toynamishop.com/product_images/w/382/Robotech_SD-Figurines_Series-2.0_01__05216__31727.jpg', 'Robotech New Generation Super Deformed Blind Box Figurines', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (709, 'https://www.toynamishop.com/product_images/g/835/Robotech_SD_Figurines__84006__27364.jpg', 'Robotech New Generation Super Deformed Blind Box Figurines', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (709, 'https://www.toynamishop.com/product_images/w/698/IMG_5143__56905__08699.jpg', 'Robotech New Generation Super Deformed Blind Box Figurines', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (710, 'https://www.toynamishop.com/product_images/q/526/Bleach_series_2_Renji_1__25439__50275.jpg', 'Deluxe 6" PVC Statue: Renji', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (710, 'https://www.toynamishop.com/product_images/d/644/Bleach_series_2_Renji_2__79770__05193.jpg', 'Deluxe 6" PVC Statue: Renji', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (710, 'https://www.toynamishop.com/product_images/t/146/BLEACH_collection-2_renji-and-toshiro__52394__67731.jpg', 'Deluxe 6" PVC Statue: Renji', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (711, 'https://www.toynamishop.com/product_images/i/948/product_239__72856__59437.jpg', 'Tulipop Vinyl Keychain - Gloomy', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (711, 'https://www.toynamishop.com/product_images/q/579/unspecified3__46604__60071.jpg', 'Tulipop Vinyl Keychain - Gloomy', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (712, 'https://www.toynamishop.com/product_images/g/850/macross_milia_vf-1J_valkyrie__24720__03700.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Milia Valkyrie', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (712, 'https://www.toynamishop.com/product_images/n/187/vf-1j_miriya_battroid_01__41707__84438.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Milia Valkyrie', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (712, 'https://www.toynamishop.com/product_images/u/881/vf-1j_miriya_gerwalk_01__38441__14990.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Milia Valkyrie', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (712, 'https://www.toynamishop.com/product_images/c/495/vf-1j_miriya_valkyrie_01__44905__83493.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Milia Valkyrie', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (712, 'https://www.toynamishop.com/product_images/o/032/vf-1j_miriya_battroid_02__02096__03225.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Milia Valkyrie', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (713, 'https://www.toynamishop.com/product_images/z/764/robotech_T-Shirts_2022-04__40184__61697.jpg', 'Robotech VF-1S Skull Leader Shirt', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (713, 'https://www.toynamishop.com/product_images/a/478/Screenshot_62__61127__20264.png', 'Robotech VF-1S Skull Leader Shirt', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (713, 'https://www.toynamishop.com/product_images/p/738/Screenshot_63__68468__55352.png', 'Robotech VF-1S Skull Leader Shirt', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (714, 'https://www.toynamishop.com/product_images/i/293/281861301_171313945331846_5214368172004617510_n__79874__52546.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07C Monster Child', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (714, 'https://www.toynamishop.com/product_images/b/213/283112887_171313925331848_2990295889090771686_n__59092__59403.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07C Monster Child', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (714, 'https://www.toynamishop.com/product_images/t/492/283291822_171313955331845_962294454815982383_n__92448__51970.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07C Monster Child', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (715, 'https://www.toynamishop.com/product_images/g/278/futurama_plush_s2_kiff__13894__54861.jpg', 'Futurama Kif Kroker Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (716, 'https://www.toynamishop.com/product_images/l/045/marcy_backpack__17433__64519.jpg', 'Skelanimals Deluxe Backpack Marcy (Monkey)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (716, 'https://www.toynamishop.com/product_images/v/257/marcy_backpack02__61506__78122.jpg', 'Skelanimals Deluxe Backpack Marcy (Monkey)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/g/571/naruto_six_paths_bust_01__42049__39641.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/h/819/naruto_six_paths_bust_07__00758__74162.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/e/177/naruto_six_paths_bust_09__04793__16955.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/u/123/naruto_six_paths_bust_05__98423__94231.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/a/089/naruto_six_paths_bust_08__82699__25209.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/n/253/naruto_six_paths_bust_04__15890__82175.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/t/019/naruto_six_paths_bust_02__37884__55767.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/o/148/naruto_six_paths_bust_06__49614__00284.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/c/232/naruto_six_paths_bust_03__13629__31495.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (717, 'https://www.toynamishop.com/product_images/h/321/naruto_six_paths_bust_02_pq__21095__72335.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust', false, 11);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (718, 'https://www.toynamishop.com/product_images/w/997/unkl_DC_COMICS_UniPo_all__48587__84416.jpg', 'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (718, 'https://www.toynamishop.com/product_images/d/492/unkl_dccomics_unipo_theflash__18997__11125.jpg', 'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (718, 'https://www.toynamishop.com/product_images/a/924/unkl_dccomics_unipo_superman__06690__21181.jpg', 'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (718, 'https://www.toynamishop.com/product_images/g/762/unkl_dccomics_unipo_harleyquinn__44670__04911.jpg', 'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (718, 'https://www.toynamishop.com/product_images/y/006/unkl_dccomics_unipo_joker__84632__59759.jpg', 'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (718, 'https://www.toynamishop.com/product_images/h/364/unkl_dccomics_unipo_batman__93842__52319.jpg', 'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (718, 'https://www.toynamishop.com/product_images/b/906/unkl_dccomics_unipo_mrfreeze__25005__74299.jpg', 'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (718, 'https://www.toynamishop.com/product_images/d/444/unkl_DC_COMICS_UniPo_pq__52640__01556.jpg', 'UNKL DC Heroes & Villains Blind Box Collection - Full Tray of 12', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (719, 'https://www.toynamishop.com/product_images/c/748/product_242__55816__14726.jpg', 'Tulipop Vinyl Keychain - Miss Maddy', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (719, 'https://www.toynamishop.com/product_images/j/817/product_241__95795__35363.jpg', 'Tulipop Vinyl Keychain - Miss Maddy', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (719, 'https://www.toynamishop.com/product_images/k/439/unspecified4__71253__87727.jpg', 'Tulipop Vinyl Keychain - Miss Maddy', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (720, 'https://www.toynamishop.com/product_images/r/546/futurama_plush_s2_morbo__96521__94154.jpg', 'Futurama Morbo Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (721, 'https://www.toynamishop.com/product_images/t/987/mythic-minis_little-embers__83569__07475.jpg', 'Little Embers Blind Box Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (721, 'https://www.toynamishop.com/product_images/a/014/little_ember_blind_box__11836__79439.jpg', 'Little Embers Blind Box Figurine', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (721, 'https://www.toynamishop.com/product_images/o/211/little_embers__s1_display_tray__10557__89312.jpg', 'Little Embers Blind Box Figurine', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (722, 'https://www.toynamishop.com/product_images/i/966/micronian_max_sterling_battloid_01__18693__59299.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MAX STERLING VOLUME4', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (722, 'https://www.toynamishop.com/product_images/e/154/micronian_max_sterling_fighter_01__11307__59710.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MAX STERLING VOLUME4', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (722, 'https://www.toynamishop.com/product_images/o/116/micronian_max_sterling_guardian_01__58630__42390.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MAX STERLING VOLUME4', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (722, 'https://www.toynamishop.com/product_images/n/797/ROBOTECH_MICRONIAN-PILOTS_VOL4_MAX-STERLING__96044__52716.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MAX STERLING VOLUME4', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (723, 'https://www.toynamishop.com/product_images/h/142/IMG_0015_whitebackground__63368__80897.jpg', 'Acid Rain Sand Infantry', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (723, 'https://www.toynamishop.com/product_images/e/728/IMG_0016__74844__75530.JPG', 'Acid Rain Sand Infantry', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (723, 'https://www.toynamishop.com/product_images/w/657/IMG_0017__03896__78011.JPG', 'Acid Rain Sand Infantry', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (723, 'https://www.toynamishop.com/product_images/b/350/IMG_0021__85878__48534.JPG', 'Acid Rain Sand Infantry', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (724, 'https://www.toynamishop.com/product_images/a/619/robotech_T-Shirts_2022-03__16671__04129.jpg', 'Robotech VF-1J Rick Hunter Shirt', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (724, 'https://www.toynamishop.com/product_images/y/382/Screenshot_62__83102__97132.png', 'Robotech VF-1J Rick Hunter Shirt', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (724, 'https://www.toynamishop.com/product_images/s/406/Screenshot_63__95660__36142.png', 'Robotech VF-1J Rick Hunter Shirt', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (725, 'https://www.toynamishop.com/product_images/o/806/robotech-1-100_VF-1D-Trainer-exclusive__11203__26745.jpg', 'Comic Con 2016 Exclusive: Robotech VF-1D (VT-102)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (726, 'https://www.toynamishop.com/product_images/a/323/DSC_0119__40170__97010.jpg', 'B2Five 88th Sand Deluxe', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (726, 'https://www.toynamishop.com/product_images/y/649/DSC_0115__86700__85618.jpg', 'B2Five 88th Sand Deluxe', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (726, 'https://www.toynamishop.com/product_images/b/066/DSC_0156__92584__58810.jpg', 'B2Five 88th Sand Deluxe', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (727, 'https://www.toynamishop.com/product_images/t/785/hypnotoad_MG_5316__02473__73807.jpg', 'Futurama Hypnotoad Coin Bank', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (727, 'https://www.toynamishop.com/product_images/b/884/hypnotoad_MG_5313__23802__32542.jpg', 'Futurama Hypnotoad Coin Bank', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (727, 'https://www.toynamishop.com/product_images/a/757/hypnotoad_coin_bank_pq__27968__76606.jpg', 'Futurama Hypnotoad Coin Bank', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (728, 'https://www.toynamishop.com/product_images/o/317/pain-4-inch__02__57188__44868.jpg', 'Naruto Shippuden Poseable Action Figure - Pain', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (728, 'https://www.toynamishop.com/product_images/d/476/pain-4-inch__03__53395__56716.jpg', 'Naruto Shippuden Poseable Action Figure - Pain', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (728, 'https://www.toynamishop.com/product_images/k/941/pain_4inch_01__45800__07516.jpg', 'Naruto Shippuden Poseable Action Figure - Pain', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (728, 'https://www.toynamishop.com/product_images/p/066/pain_4inch_04__21824__24369.jpg', 'Naruto Shippuden Poseable Action Figure - Pain', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (728, 'https://www.toynamishop.com/product_images/r/628/pain_4inch_05__21986__49979.jpg', 'Naruto Shippuden Poseable Action Figure - Pain', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (729, 'https://www.toynamishop.com/product_images/p/505/281923824_171313761998531_1033459954187083704_n__73062__29728.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K08 Lightning', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (729, 'https://www.toynamishop.com/product_images/s/033/282236708_171313771998530_5466034254031672446_n__13752__49075.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K08 Lightning', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (729, 'https://www.toynamishop.com/product_images/a/532/283765273_171313801998527_1739465539036996834_n__40751__81229.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K08 Lightning', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (730, 'https://www.toynamishop.com/product_images/t/586/NEW_2018_shippuden_4-inch-figures_series1__62849__44867.jpg', 'Naruto Shippuden Poseable Action Figures (Set of 3)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (730, 'https://www.toynamishop.com/product_images/k/294/shippuden_4-inch-figures_series1_set_of_3__07281__25691.jpg', 'Naruto Shippuden Poseable Action Figures (Set of 3)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (730, 'https://www.toynamishop.com/product_images/v/383/naruto-4-inch__08__51173__76077.jpg', 'Naruto Shippuden Poseable Action Figures (Set of 3)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (730, 'https://www.toynamishop.com/product_images/l/385/itachi-4-inch_01__55814__31610.jpg', 'Naruto Shippuden Poseable Action Figures (Set of 3)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (730, 'https://www.toynamishop.com/product_images/e/111/kakashi-4-inch_03__52173__38683.jpg', 'Naruto Shippuden Poseable Action Figures (Set of 3)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (731, 'https://www.toynamishop.com/product_images/z/404/stronghold_s_007__62418__10135.jpg', 'Acid Rain Stronghold (Sand)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (731, 'https://www.toynamishop.com/product_images/o/288/stronghold_s_008__32665__81057.jpg', 'Acid Rain Stronghold (Sand)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (731, 'https://www.toynamishop.com/product_images/c/433/stronghold_s_001__20432__36327.jpg', 'Acid Rain Stronghold (Sand)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (731, 'https://www.toynamishop.com/product_images/k/665/stronghold_s_003__32839__79918.jpg', 'Acid Rain Stronghold (Sand)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (731, 'https://www.toynamishop.com/product_images/y/199/stronghold_s_004__08746__14478.jpg', 'Acid Rain Stronghold (Sand)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (732, 'https://www.toynamishop.com/product_images/t/256/supersonic_x_hellokitty_clip-on__17502__86197.jpg', 'Comic Con 2016 Exclusive: Gold Sonic x Hello Kitty Clip On Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (733, 'https://www.toynamishop.com/product_images/m/048/macross_standard_valkyrie__41901__42588.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1A Valkyrie', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (733, 'https://www.toynamishop.com/product_images/r/742/vf-1a_batroid_01__52325__65900.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1A Valkyrie', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (733, 'https://www.toynamishop.com/product_images/a/709/vf-1a_gerwalk_01__92466__58174.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1A Valkyrie', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (733, 'https://www.toynamishop.com/product_images/r/989/vf-1a_fighter_01__61468__56799.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1A Valkyrie', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (733, 'https://www.toynamishop.com/product_images/g/816/vf-1a_batroid_02__16879__67188.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1A Valkyrie', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (734, 'https://www.toynamishop.com/product_images/t/200/blanka_hellokitty_plush01__23123__48653.jpg', 'COMIKAZE 2013 Exclusive: Hello Kitty Blanka Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (734, 'https://www.toynamishop.com/product_images/j/838/blanka_hellokitty_plush02__97021__36870.jpg', 'COMIKAZE 2013 Exclusive: Hello Kitty Blanka Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (734, 'https://www.toynamishop.com/product_images/b/603/blanka_hellokitty_plush03__46552__48895.jpg', 'COMIKAZE 2013 Exclusive: Hello Kitty Blanka Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (734, 'https://www.toynamishop.com/product_images/q/681/street_fighter_x_sanrio_blanka_plush__54517__27346.jpg', 'COMIKAZE 2013 Exclusive: Hello Kitty Blanka Plush', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (735, 'https://www.toynamishop.com/product_images/b/951/product_238__12654__93576.jpg', 'Tulipop Vinyl Keychain - Fred', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (735, 'https://www.toynamishop.com/product_images/f/706/product_237__41310__27508.jpg', 'Tulipop Vinyl Keychain - Fred', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (736, 'https://www.toynamishop.com/product_images/p/043/little-nessies_iridescent-edition_01__15196__81322.jpg', 'Little Nessies Limited Edition Iridescent Figurines Set-Convention Exclusive!', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (737, 'https://www.toynamishop.com/product_images/b/846/little_embers_plush_flames_01__48166__04673.jpg', 'Little Embers Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (737, 'https://www.toynamishop.com/product_images/p/170/little_embers_plush_soot_01__64099__18321.jpg', 'Little Embers Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (737, 'https://www.toynamishop.com/product_images/j/290/little_embers_plush_cinder_01__62851__97017.jpg', 'Little Embers Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (737, 'https://www.toynamishop.com/product_images/d/327/little_embers_plush_sparks_01__38381__85309.jpg', 'Little Embers Plush', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (737, 'https://www.toynamishop.com/product_images/o/101/little_embers_plush_ash_01__21886__81123.jpg', 'Little Embers Plush', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (738, 'https://www.toynamishop.com/product_images/h/795/skelanimals_dcheroes_girls-of-gotham-city_05__38695__59895.jpg', 'Skelanimals / DC Heroes Harley Quinn Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (738, 'https://www.toynamishop.com/product_images/z/626/skelanimals_dcheroes_girls-of-gotham-city_06__27430__10010.jpg', 'Skelanimals / DC Heroes Harley Quinn Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (738, 'https://www.toynamishop.com/product_images/s/682/skelanimals_dc_gogc_plush__14296__36538.jpg', 'Skelanimals / DC Heroes Harley Quinn Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (739, 'https://www.toynamishop.com/product_images/o/180/RebornTrooper_white_backdrop__76988__21971.jpg', 'Acid Rain Reborn Trooper', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (739, 'https://www.toynamishop.com/product_images/o/810/pose_02__54268__07757.JPG', 'Acid Rain Reborn Trooper', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (739, 'https://www.toynamishop.com/product_images/v/117/pose_03__68503__70350.JPG', 'Acid Rain Reborn Trooper', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (740, 'https://www.toynamishop.com/product_images/d/139/micronian_miriya_battloid_01__09134__20510.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MIRIYA STERLING VOLUME 5', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (740, 'https://www.toynamishop.com/product_images/e/885/micronian_miriya_fighter_01__86515__08549.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MIRIYA STERLING VOLUME 5', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (740, 'https://www.toynamishop.com/product_images/p/742/micronian_miriya_guardian_01__79796__08068.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MIRIYA STERLING VOLUME 5', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (740, 'https://www.toynamishop.com/product_images/d/623/ROBOTECH_MICRONIAN-PILOTS_VOL5_MIRIYA__54717__33982.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - MIRIYA STERLING VOLUME 5', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (741, 'https://www.toynamishop.com/product_images/j/997/futurama_hats_nibbler001__92957__09020.jpg', 'Futurama Nibbler Knit Hat', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (741, 'https://www.toynamishop.com/product_images/p/405/futurama_hats_nibbler002__88507__04673.jpg', 'Futurama Nibbler Knit Hat', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (742, 'https://www.toynamishop.com/product_images/r/272/n3S-t_JU__61902__23044.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Rand', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (742, 'https://www.toynamishop.com/product_images/x/962/hFfak6XI__16064__76292.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Rand', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (742, 'https://www.toynamishop.com/product_images/w/525/KEPJEcjA__88577__03453.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Rand', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (742, 'https://www.toynamishop.com/product_images/s/098/ER9xKMe8__13370__95370.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Rand', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (743, 'https://www.toynamishop.com/product_images/e/125/DSC_0589__98898__50121.JPG', 'B2Five Marine Sieger Stronghold ST2M', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (743, 'https://www.toynamishop.com/product_images/g/335/DSC_0584__37742__26193.JPG', 'B2Five Marine Sieger Stronghold ST2M', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (743, 'https://www.toynamishop.com/product_images/j/086/DSC_0594__88318__18621.JPG', 'B2Five Marine Sieger Stronghold ST2M', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (743, 'https://www.toynamishop.com/product_images/j/143/DSC_0599__19575__85539.JPG', 'B2Five Marine Sieger Stronghold ST2M', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (743, 'https://www.toynamishop.com/product_images/y/373/DSC_0580__21988__95015.JPG', 'B2Five Marine Sieger Stronghold ST2M', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (744, 'https://www.toynamishop.com/product_images/d/941/macross-battlepod_vinyl01__18441__32194.jpg', 'Macross Zentradi (Regault) Tactical Battlepod Vinyl Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (744, 'https://www.toynamishop.com/product_images/p/418/macross_battlepod02__26797__03676.jpg', 'Macross Zentradi (Regault) Tactical Battlepod Vinyl Figure', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (744, 'https://www.toynamishop.com/product_images/r/940/IMG_4112__22292__13696.jpg', 'Macross Zentradi (Regault) Tactical Battlepod Vinyl Figure', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (744, 'https://www.toynamishop.com/product_images/v/991/IMG_4111__93841__35433.jpg', 'Macross Zentradi (Regault) Tactical Battlepod Vinyl Figure', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (745, 'https://www.toynamishop.com/product_images/a/967/acid_rain_sdcc2015_exclusive__28588__16164.jpg', 'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (745, 'https://www.toynamishop.com/product_images/q/790/IMG_0004__12612__58566.JPG', 'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (745, 'https://www.toynamishop.com/product_images/s/607/IMG_0008__59259__93703.JPG', 'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (745, 'https://www.toynamishop.com/product_images/x/363/IMG_0007__63150__14948.JPG', 'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (745, 'https://www.toynamishop.com/product_images/p/603/IMG_0013__14907__39268.JPG', 'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (745, 'https://www.toynamishop.com/product_images/p/071/IMG_0015__47570__87963.JPG', 'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (745, 'https://www.toynamishop.com/product_images/t/094/IMG_0016__54223__82627.JPG', 'Comic Con 2015 Exclusive - Acid Rain Green Jeep + Green Sol Commander', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (746, 'https://www.toynamishop.com/product_images/c/179/IMG_0017__20028__51424.JPG', 'Acid Rain AMM Prospector', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (746, 'https://www.toynamishop.com/product_images/m/246/IMG_0002__05155__70646.JPG', 'Acid Rain AMM Prospector', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (746, 'https://www.toynamishop.com/product_images/d/849/IMG_0001__84270__27435.JPG', 'Acid Rain AMM Prospector', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (746, 'https://www.toynamishop.com/product_images/g/951/IMG_0009__80433__96958.JPG', 'Acid Rain AMM Prospector', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (746, 'https://www.toynamishop.com/product_images/o/009/IMG_0010__84783__76526.JPG', 'Acid Rain AMM Prospector', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (746, 'https://www.toynamishop.com/product_images/g/479/IMG_0014__59361__88736.JPG', 'Acid Rain AMM Prospector', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (746, 'https://www.toynamishop.com/product_images/a/629/IMG_0016__01417__94520.JPG', 'Acid Rain AMM Prospector', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (747, 'https://www.toynamishop.com/product_images/z/950/robotech_action-figures_02__45660__73240.jpg', 'Robotech Poseable Action Figures (Set of 5)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (747, 'https://www.toynamishop.com/product_images/f/326/robotech_action-figures_01__74125__29268.jpg', 'Robotech Poseable Action Figures (Set of 5)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (747, 'https://www.toynamishop.com/product_images/m/153/robotech_action_figures_Rick-Hunter_02__26132__95415.jpg', 'Robotech Poseable Action Figures (Set of 5)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (747, 'https://www.toynamishop.com/product_images/u/530/robotech_action_figures_roy_fokker_01__78059__66880.jpg', 'Robotech Poseable Action Figures (Set of 5)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (747, 'https://www.toynamishop.com/product_images/o/343/robotech_action_figures_miriya__95300__30660.jpg', 'Robotech Poseable Action Figures (Set of 5)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (747, 'https://www.toynamishop.com/product_images/e/758/robotech_action_figures_max_sterling__56394__23056.jpg', 'Robotech Poseable Action Figures (Set of 5)', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (747, 'https://www.toynamishop.com/product_images/o/485/robotech_action_figures_minmei_01__39177__09264.jpg', 'Robotech Poseable Action Figures (Set of 5)', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (748, 'https://www.toynamishop.com/product_images/f/153/futurama_destructor_gender_bender_exclusive__57552__23935.jpg', 'SDCC 2013 Exclusive: Futurama Destructor Gender Bender Box Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (748, 'https://www.toynamishop.com/product_images/e/824/futurama_destructor_gender_bender_exclusive_genderbender__06843__54804.jpg', 'SDCC 2013 Exclusive: Futurama Destructor Gender Bender Box Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (748, 'https://www.toynamishop.com/product_images/y/672/futurama_destructor_gender_bender_exclusive_destructor__65973__84963.jpg', 'SDCC 2013 Exclusive: Futurama Destructor Gender Bender Box Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (748, 'https://www.toynamishop.com/product_images/q/762/futurama_destructor_gender_bender_box__74215__15825.jpg', 'SDCC 2013 Exclusive: Futurama Destructor Gender Bender Box Set', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (748, 'https://www.toynamishop.com/product_images/l/014/futurama_destructor_gender_bender_box_set_01__42974__90182.jpg', 'SDCC 2013 Exclusive: Futurama Destructor Gender Bender Box Set', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (749, 'https://www.toynamishop.com/product_images/l/239/gaara_4inch_01__12882__35965.jpg', 'Naruto Shippuden Poseable Action Figure - Gaara', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (749, 'https://www.toynamishop.com/product_images/x/228/gaara_4-inch_02__78410__73553.jpg', 'Naruto Shippuden Poseable Action Figure - Gaara', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (749, 'https://www.toynamishop.com/product_images/l/881/gaara_4inch_03__06631__78532.jpg', 'Naruto Shippuden Poseable Action Figure - Gaara', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (749, 'https://www.toynamishop.com/product_images/v/377/gaara_4inch_04__91383__90635.jpg', 'Naruto Shippuden Poseable Action Figure - Gaara', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (749, 'https://www.toynamishop.com/product_images/p/702/gaara_4inch_05__06796__89742.jpg', 'Naruto Shippuden Poseable Action Figure - Gaara', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (750, 'https://www.toynamishop.com/product_images/s/839/speeder_mk2_004__63680__76689.jpg', 'Acid Rain Speeder MK.II (Sand)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (750, 'https://www.toynamishop.com/product_images/l/577/speeder_mk2_002__02017__72945.jpg', 'Acid Rain Speeder MK.II (Sand)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (750, 'https://www.toynamishop.com/product_images/z/331/speeder_mk2_003__33228__57514.jpg', 'Acid Rain Speeder MK.II (Sand)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (750, 'https://www.toynamishop.com/product_images/i/429/speeder_mk2_006__67146__63225.jpg', 'Acid Rain Speeder MK.II (Sand)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (750, 'https://www.toynamishop.com/product_images/j/302/speeder_mk2_007__88675__33068.jpg', 'Acid Rain Speeder MK.II (Sand)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (750, 'https://www.toynamishop.com/product_images/z/105/speeder_mk2_009__69478__85515.jpg', 'Acid Rain Speeder MK.II (Sand)', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (750, 'https://www.toynamishop.com/product_images/v/753/speeder_mk2_012__65865__30832.jpg', 'Acid Rain Speeder MK.II (Sand)', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (750, 'https://www.toynamishop.com/product_images/u/531/speeder_mk2_010__81642__55159.jpg', 'Acid Rain Speeder MK.II (Sand)', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (751, 'https://www.toynamishop.com/product_images/v/450/skelanimal_vinyl_series2_marcy__37908__64643.jpg', 'Skelanimals Marcy the Monkey Vinyl Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (752, 'https://www.toynamishop.com/product_images/b/407/macross_vintage_collection__69141__51319.jpg', 'Macross Saga: Retro Transformable 1/100 Series - Complete Set of 5', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (752, 'https://www.toynamishop.com/product_images/o/930/macross_hikaru_valkyrie__73769__50142.jpg', 'Macross Saga: Retro Transformable 1/100 Series - Complete Set of 5', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (752, 'https://www.toynamishop.com/product_images/p/402/macross_roy-focker_valkyrie__62223__21959.jpg', 'Macross Saga: Retro Transformable 1/100 Series - Complete Set of 5', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (752, 'https://www.toynamishop.com/product_images/u/822/macross_max_vf-1j_valkyrie__58992__13610.jpg', 'Macross Saga: Retro Transformable 1/100 Series - Complete Set of 5', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (752, 'https://www.toynamishop.com/product_images/t/073/macross_milia_vf-1J_valkyrie__56529__43288.jpg', 'Macross Saga: Retro Transformable 1/100 Series - Complete Set of 5', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (752, 'https://www.toynamishop.com/product_images/q/831/macross_standard_valkyrie__02200__93548.jpg', 'Macross Saga: Retro Transformable 1/100 Series - Complete Set of 5', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (753, 'https://www.toynamishop.com/product_images/j/692/skelanimals_dcheroes_girls-of-gotham-city_01__31115__94272.jpg', 'Skelanimals / DC Heroes Poison Ivy Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (753, 'https://www.toynamishop.com/product_images/z/299/skelanimals_dcheroes_girls-of-gotham-city_02__93115__68226.jpg', 'Skelanimals / DC Heroes Poison Ivy Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (753, 'https://www.toynamishop.com/product_images/l/797/skelanimals_dc_gogc_plush__18336__91937.jpg', 'Skelanimals / DC Heroes Poison Ivy Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (754, 'https://www.toynamishop.com/product_images/h/777/macross_shogun-warriors_VF-1J_01__39122__34230.jpg', 'Macross Hikaru Ichijyo''''s Shogun Warrior VF-1J', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (754, 'https://www.toynamishop.com/product_images/g/982/macross_shogun-warriors_VF-1J_02__91885__18268.jpg', 'Macross Hikaru Ichijyo''''s Shogun Warrior VF-1J', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (754, 'https://www.toynamishop.com/product_images/q/357/macross_shogun-warriors_VF-1J_03__43835__02276.jpg', 'Macross Hikaru Ichijyo''''s Shogun Warrior VF-1J', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (754, 'https://www.toynamishop.com/product_images/j/219/macross_shogun-warriors_VF-1J_04__07233__40600.jpg', 'Macross Hikaru Ichijyo''''s Shogun Warrior VF-1J', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (755, 'https://www.toynamishop.com/product_images/w/983/robotech-1-100_VF-1D-Trainer_super-veritech-armor_01__71570__78626.jpg', 'Robotech 1/100 Scale Transformable VF-1D Super Veritech', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (755, 'https://www.toynamishop.com/product_images/w/353/robotech-1-100_VF-1D-Trainer_super-veritech-armor_04__49462__55218.jpg', 'Robotech 1/100 Scale Transformable VF-1D Super Veritech', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (755, 'https://www.toynamishop.com/product_images/t/277/robotech-1-100_VF-1D-Trainer_super-veritech-armor_05__72065__96263.jpg', 'Robotech 1/100 Scale Transformable VF-1D Super Veritech', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (755, 'https://www.toynamishop.com/product_images/l/692/robotech-1-100_VF-1D-Trainer_super-veritech-armor-2__49643__55477.jpg', 'Robotech 1/100 Scale Transformable VF-1D Super Veritech', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (756, 'https://www.toynamishop.com/product_images/n/900/Angel_of_Death_BW_version_Toynamishop__28473__14668.jpg', 'Angel of Death (B&W version)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (757, 'https://www.toynamishop.com/product_images/s/144/little-foots_collection__89752__30780.jpg', 'Little Foots Blind Box Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (757, 'https://www.toynamishop.com/product_images/a/997/little_foots_05__40580__01526.jpg', 'Little Foots Blind Box Figurine', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (757, 'https://www.toynamishop.com/product_images/m/615/little_foots_09__59635__30750.jpg', 'Little Foots Blind Box Figurine', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (757, 'https://www.toynamishop.com/product_images/c/992/little_foots_16__99727__14258.jpg', 'Little Foots Blind Box Figurine', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (757, 'https://www.toynamishop.com/product_images/z/145/little_foots_01__75756__84357.jpg', 'Little Foots Blind Box Figurine', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (758, 'https://www.toynamishop.com/product_images/m/750/CYeXrKN8__51048__91196.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Scott Bernard', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (758, 'https://www.toynamishop.com/product_images/s/390/m3CBymV4__36477__34519.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Scott Bernard', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (758, 'https://www.toynamishop.com/product_images/x/806/7o34H_rc__42888__11504.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Scott Bernard', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (758, 'https://www.toynamishop.com/product_images/b/938/C_gIZGkk__24386__61985.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Scott Bernard', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (759, 'https://www.toynamishop.com/product_images/w/595/skelanimal_vinyl_series2_diego__60373__65479.jpg', 'Skelanimals Diego the Bat Vinyl Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (760, 'https://www.toynamishop.com/product_images/r/772/skelanimal_blind-box_pack-2016__00854__18303.jpg', 'Skelanimals Blind Box Series 3 Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (760, 'https://www.toynamishop.com/product_images/i/728/skelanimal_blind-box_pack-20162__58404__40869.jpg', 'Skelanimals Blind Box Series 3 Figurine', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (761, 'https://www.toynamishop.com/product_images/y/277/Angel_of_Death_2_Toynamishop__93803__20674.jpg', 'Angel of Death (Color version)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (762, 'https://www.toynamishop.com/product_images/p/022/DSC_0554__01061__24710.JPG', 'B2Five 88th Sand Laurel LA4S4', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (762, 'https://www.toynamishop.com/product_images/a/683/DSC_0546__62882__32372.JPG', 'B2Five 88th Sand Laurel LA4S4', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (762, 'https://www.toynamishop.com/product_images/b/852/DSC_0527__06569__63320.JPG', 'B2Five 88th Sand Laurel LA4S4', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (762, 'https://www.toynamishop.com/product_images/s/615/DSC_0540__16125__25874.JPG', 'B2Five 88th Sand Laurel LA4S4', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (762, 'https://www.toynamishop.com/product_images/z/795/DSC_0559__38319__17119.JPG', 'B2Five 88th Sand Laurel LA4S4', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (763, 'https://www.toynamishop.com/product_images/u/614/skelanimals_dcheroes_girls-of-gotham-city_03__97381__26804.jpg', 'Skelanimals / DC Heroes Batgirl Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (763, 'https://www.toynamishop.com/product_images/a/187/skelanimals_dcheroes_girls-of-gotham-city_04__58787__65115.jpg', 'Skelanimals / DC Heroes Batgirl Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (763, 'https://www.toynamishop.com/product_images/w/045/skelanimals_dc_gogc_plush__21341__89334.jpg', 'Skelanimals / DC Heroes Batgirl Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (764, 'https://www.toynamishop.com/product_images/r/613/dc_skelanimals_vinyl_figurines_all1__89276__71221.jpg', 'Skelanimals DC Heroes 3" Vinyl Figures Assortment', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (764, 'https://www.toynamishop.com/product_images/g/098/skelanimal_dc_heroes_3_inch_vinyl_harleyquinn__03988__16364.jpg', 'Skelanimals DC Heroes 3" Vinyl Figures Assortment', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (764, 'https://www.toynamishop.com/product_images/i/125/skelanimal_dc_heroes_3_inch_vinyl_batman__93048__71169.jpg', 'Skelanimals DC Heroes 3" Vinyl Figures Assortment', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (764, 'https://www.toynamishop.com/product_images/r/802/skelanimal_dc_heroes_3_inch_vinyl_wonderwoman__34812__95379.jpg', 'Skelanimals DC Heroes 3" Vinyl Figures Assortment', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (764, 'https://www.toynamishop.com/product_images/v/972/skelanimal_dc_heroes_3_inch_vinyl_robin__94555__63944.jpg', 'Skelanimals DC Heroes 3" Vinyl Figures Assortment', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (764, 'https://www.toynamishop.com/product_images/h/117/skelanimal_dc_heroes_3_inch_vinyl_superman__78692__40451.jpg', 'Skelanimals DC Heroes 3" Vinyl Figures Assortment', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (764, 'https://www.toynamishop.com/product_images/d/657/dc_skelanimals_vinyl_figurines_all__21938__78681.jpg', 'Skelanimals DC Heroes 3" Vinyl Figures Assortment', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (764, 'https://www.toynamishop.com/product_images/q/915/skelanimal_dc_heroes_3_inch_vinyl_assortment__13076__42055.jpg', 'Skelanimals DC Heroes 3" Vinyl Figures Assortment', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (765, 'https://www.toynamishop.com/product_images/m/411/robotech-x-eepmon_12-1280x960__24166__62376.jpg', 'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (765, 'https://www.toynamishop.com/product_images/z/738/Aviator_Flight_Jacket__71370__88657.jpg', 'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (765, 'https://www.toynamishop.com/product_images/z/244/robotech-x-eepmon_11-1280x960__37980__82286.jpg', 'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (765, 'https://www.toynamishop.com/product_images/z/604/robotech-x-eepmon_2-1280x960__90629__14893.jpg', 'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (765, 'https://www.toynamishop.com/product_images/t/378/robotech-x-eepmon_8-1280x960__05817__00629.jpg', 'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (765, 'https://www.toynamishop.com/product_images/b/553/robotech-x-eepmon_10-1280x960__69199__33038.jpg', 'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (765, 'https://www.toynamishop.com/product_images/f/617/robotech-x-eepmon_3-1280x960__05143__42567.jpg', 'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (765, 'https://www.toynamishop.com/product_images/n/545/robotech-x-eepmon_13-1280x960__50361__67190.jpg', 'Robotech X eepmon - VF-1J Rick Hunter Aviator Flight Jacket', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (766, 'https://www.toynamishop.com/product_images/c/949/robotech_1_100_30th_anniversary_series_2_vf_1j_GBP_1_shadow_heavy_armor__80387__57153.jpg', 'Comic Con 2015 Exclusive: Robotech GBP-1 - Stealth Fighter - Heavy Armor', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (767, 'https://www.toynamishop.com/product_images/t/440/badtz_maru_ryu_plush01__73607__44480.jpg', 'SDCC 2013 Exclusive: Badtz Maru Ryu Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (767, 'https://www.toynamishop.com/product_images/s/396/badtz_maru_ryu_plush03__32030__02584.jpg', 'SDCC 2013 Exclusive: Badtz Maru Ryu Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (767, 'https://www.toynamishop.com/product_images/r/838/badtz_maru_ryu_plush02__56015__21364.jpg', 'SDCC 2013 Exclusive: Badtz Maru Ryu Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (767, 'https://www.toynamishop.com/product_images/e/883/street_fighter_x_sanrio_badtzmaru_ryu_plush__63586__03358.jpg', 'SDCC 2013 Exclusive: Badtz Maru Ryu Plush', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (768, 'https://www.toynamishop.com/product_images/i/338/sasuke_4inch_03__26202__29908.jpg', 'Naruto Shippuden Poseable Action Figure - Sasuke', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (768, 'https://www.toynamishop.com/product_images/x/147/sasuke_4inch_02__86833__65501.jpg', 'Naruto Shippuden Poseable Action Figure - Sasuke', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (768, 'https://www.toynamishop.com/product_images/x/027/sasuke_4inch_01__53299__62812.jpg', 'Naruto Shippuden Poseable Action Figure - Sasuke', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (768, 'https://www.toynamishop.com/product_images/v/611/sasuke_4inch_04__92654__32676.jpg', 'Naruto Shippuden Poseable Action Figure - Sasuke', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (768, 'https://www.toynamishop.com/product_images/i/125/sasuke_4inch_05__30268__18315.jpg', 'Naruto Shippuden Poseable Action Figure - Sasuke', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (769, 'https://www.toynamishop.com/product_images/v/583/emily-Bendy_excluosive_01__94129__75733.jpg', 'Emily the Strange 6" Bendy Figure Convention Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (770, 'https://www.toynamishop.com/product_images/w/001/1-100-scale_super-veritech__rick-hunter_battloid__05459__75924.jpg', 'Robotech 1/100 Rick Hunter VF-1J Super Veritech', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (770, 'https://www.toynamishop.com/product_images/x/046/1-100-scale_super-veritech__rick-hunter_guardian__89462__35006.jpg', 'Robotech 1/100 Rick Hunter VF-1J Super Veritech', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (770, 'https://www.toynamishop.com/product_images/l/609/1-100-scale_super-veritech__rick-hunter_fighter__75957__58975.jpg', 'Robotech 1/100 Rick Hunter VF-1J Super Veritech', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (770, 'https://www.toynamishop.com/product_images/y/504/robotech_1-100_VF-1J_rick_hunter_super_veritech_armor__83382__69739.jpg', 'Robotech 1/100 Rick Hunter VF-1J Super Veritech', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (771, 'https://www.toynamishop.com/product_images/r/666/Godzilla_plush_01__42645__52730.jpg', 'Godzilla 1989 - Limited Edition Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (771, 'https://www.toynamishop.com/product_images/t/099/Godzilla_plush_05__64391__74646.jpg', 'Godzilla 1989 - Limited Edition Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (771, 'https://www.toynamishop.com/product_images/l/482/Godzilla_plush_02__18396__26602.jpg', 'Godzilla 1989 - Limited Edition Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (771, 'https://www.toynamishop.com/product_images/c/343/Godzilla_plush_03__04586__49369.jpg', 'Godzilla 1989 - Limited Edition Plush', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (772, 'https://www.toynamishop.com/product_images/k/338/naruto_sage-mode_pvc-statue_2__43077__35058.jpg', '6" Sage Mode Naruto with Scroll Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (772, 'https://www.toynamishop.com/product_images/s/954/naruto_sage-mode_pvc-statue__17408__63899.jpg', '6" Sage Mode Naruto with Scroll Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (773, 'https://www.toynamishop.com/product_images/p/649/HvWIhifw__22822__78616.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Lance Belmont', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (773, 'https://www.toynamishop.com/product_images/l/396/7qu76EBM__20424__23972.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Lance Belmont', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (773, 'https://www.toynamishop.com/product_images/b/760/C-AHv7zg__03663__28315.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Lance Belmont', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (773, 'https://www.toynamishop.com/product_images/o/250/FGzbSLPg__66392__26871.jpg', 'B2Five Robotech Mospeada Transformable Cyclone - Lance Belmont', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (774, 'https://www.toynamishop.com/product_images/j/859/TCDTLxgQ__51762__49605.png', 'Little Burnt Embers Special Edition Figurines Set - 2022 CONVENTION EXCLUSIVE', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (774, 'https://www.toynamishop.com/product_images/l/136/IMG_0692__52096__01051.jpg', 'Little Burnt Embers Special Edition Figurines Set - 2022 CONVENTION EXCLUSIVE', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/d/127/Robotech_action_Figures_series2_0000_group__66651__51728.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/w/053/Robotech_action_Figures_series2_0000s_0001_rick__92847__72850.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/d/315/Robotech_action_Figures_series2_0005_rick-hunter__package_front__03314__86843.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/a/359/Robotech_action_Figures_series2_0000s_0003_lisa__19227__94474.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/i/425/Robotech_action_Figures_series2_0004_lisa-hayes__package_front__55085__86843.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/c/123/Robotech_action_Figures_series2_0000s_0000_captain__71034__01390.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/u/627/Robotech_action_Figures_series2_0002_captain-gloval__package_front__25686__48102.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/n/791/Robotech_action_Figures_series2_0000s_0002_claudia__48297__12239.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/b/398/Robotech_action_Figures_series2_0003_claudia-grant__package_front__02955__87851.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/r/271/Robotech_action_Figures_series2_0000s_0004_ben__09265__89239.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 11);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (775, 'https://www.toynamishop.com/product_images/u/815/Robotech_action_Figures_series2_0001_ben-dixon__package_front__29585__51323.jpg', 'Robotech Poseable Action Figures Series 2 (Set of 5)', false, 12);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (776, 'https://www.toynamishop.com/product_images/r/585/1080x1080_Embers_kyanite_plush_2024__21536__74293.jpg', 'Kyanite Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (777, 'https://www.toynamishop.com/product_images/c/197/bloody_bunny_plush01__21530__60827.jpg', 'Bloody Bunny 7-inch Mini Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (777, 'https://www.toynamishop.com/product_images/o/822/bloody_bunny_plush_pq__37101__49901.jpg', 'Bloody Bunny 7-inch Mini Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (778, 'https://www.toynamishop.com/product_images/r/090/CC2016_bonita-6-inch-plush__72438__59579.jpg', 'Comic Con 2016 Exclusive: Skelanimals Bonita Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (779, 'https://www.toynamishop.com/product_images/p/032/20190331_170218__90595__02019.jpg', 'Acid Rain Sofi', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (779, 'https://www.toynamishop.com/product_images/o/113/20190331_165329__23884__58845.jpg', 'Acid Rain Sofi', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (779, 'https://www.toynamishop.com/product_images/q/083/20190331_165633__84159__88366.jpg', 'Acid Rain Sofi', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (779, 'https://www.toynamishop.com/product_images/r/497/20190331_162135__89149__61105.jpg', 'Acid Rain Sofi', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (779, 'https://www.toynamishop.com/product_images/j/536/20190331_164308__42812__73889.jpg', 'Acid Rain Sofi', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (779, 'https://www.toynamishop.com/product_images/f/785/20190331_163015__43973__69129.jpg', 'Acid Rain Sofi', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/i/588/raptor_001__90588__97654.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/j/036/raptor_004__65101__33812.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/q/540/raptor_002__74814__91922.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/u/526/raptor_006__63382__30728.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/b/924/raptor_008__82197__45965.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/o/133/raptor_010__49272__54346.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/j/192/raptor_009__39209__16199.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/s/621/raptor_012__77513__98788.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (780, 'https://www.toynamishop.com/product_images/y/213/raptor_011__29647__44071.jpg', 'Acid Rain Raptor (Speeder MK.I)(Marine)', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (781, 'https://www.toynamishop.com/product_images/q/252/content2__72196__95871.jpg', 'Acid Rain Space Prisoner', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (781, 'https://www.toynamishop.com/product_images/h/579/pose_01__69975__76991.JPG', 'Acid Rain Space Prisoner', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (781, 'https://www.toynamishop.com/product_images/o/468/pose_03__16414__69222.JPG', 'Acid Rain Space Prisoner', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (781, 'https://www.toynamishop.com/product_images/z/937/pose_05__82866__49376.JPG', 'Acid Rain Space Prisoner', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (781, 'https://www.toynamishop.com/product_images/o/138/pose_06__08453__97717.JPG', 'Acid Rain Space Prisoner', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (781, 'https://www.toynamishop.com/product_images/k/988/pose_08__72659__95049.jpg', 'Acid Rain Space Prisoner', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (782, 'https://www.toynamishop.com/product_images/t/377/sasuke_vs_itachi_03__04900__61094.jpg', 'Naruto Shippuden Exclusive Two-Pack Set: Sasuke vs. Itachi', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (782, 'https://www.toynamishop.com/product_images/b/234/sasuke_vs_itachi_01__67982__50205.jpg', 'Naruto Shippuden Exclusive Two-Pack Set: Sasuke vs. Itachi', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (783, 'https://www.toynamishop.com/product_images/y/604/Toynami_2024_Voltron_T-SHIRT__31111__97666.jpg', '40th Anniversary Voltron Shirt SDCC Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (783, 'https://www.toynamishop.com/product_images/s/787/Screenshot_62__74710__54771.png', '40th Anniversary Voltron Shirt SDCC Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (783, 'https://www.toynamishop.com/product_images/m/373/Screenshot_63__43921__18188.png', '40th Anniversary Voltron Shirt SDCC Exclusive', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (784, 'https://www.toynamishop.com/product_images/c/617/skelanimal_dc_heroes_plush_HarleyQuinn_sdcc2013_02__74575__92978.jpg', 'SDCC 2013 Exclusive: DC Heroes Skelanimals Harley Quinn Mini Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (784, 'https://www.toynamishop.com/product_images/o/901/harleyquinn_marcy_02__81406__54572.jpg', 'SDCC 2013 Exclusive: DC Heroes Skelanimals Harley Quinn Mini Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (784, 'https://www.toynamishop.com/product_images/x/571/harleyquinn_marcy_03__15824__72730.jpg', 'SDCC 2013 Exclusive: DC Heroes Skelanimals Harley Quinn Mini Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (784, 'https://www.toynamishop.com/product_images/n/394/harleyquinn_marcy_04__89384__98966.jpg', 'SDCC 2013 Exclusive: DC Heroes Skelanimals Harley Quinn Mini Plush', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (784, 'https://www.toynamishop.com/product_images/p/754/skelanimal_dc_heroes_plush_HarleyQuinn_sdcc2013__19637__07601.jpg', 'SDCC 2013 Exclusive: DC Heroes Skelanimals Harley Quinn Mini Plush', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (785, 'https://www.toynamishop.com/product_images/z/990/Robotech_Minmay_6_inch_doll_SDCC16__15951__71074.jpg', 'Comic Con 2016 Exclusive: Robotech Tineez Minmay Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/j/551/voltron_super_poseable_figure_01__97140__16038.jpg', 'Super Poseable Die Cast Voltron', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/l/169/voltron_super_poseable_figure_02__17686__04587.jpg', 'Super Poseable Die Cast Voltron', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/y/659/voltron_super_poseable_figure_03__93901__37704.jpg', 'Super Poseable Die Cast Voltron', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/h/409/voltron_super_poseable_figure_05__62986__18648.jpg', 'Super Poseable Die Cast Voltron', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/g/689/voltron_super_poseable_figure_04__52553__46710.jpg', 'Super Poseable Die Cast Voltron', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/b/134/voltron_super_poseable_figure5__98532__46776.jpg', 'Super Poseable Die Cast Voltron', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/e/818/voltron_super_poseable_figure6__26897__19690.jpg', 'Super Poseable Die Cast Voltron', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/k/263/voltron_super_deformed_poseable_figure__95976__74553.jpg', 'Super Poseable Die Cast Voltron', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/z/526/voltron_super_poseable_figure4__10394__28032.jpg', 'Super Poseable Die Cast Voltron', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/h/354/voltron_super_poseable_figure2__60396__97432.jpg', 'Super Poseable Die Cast Voltron', false, 11);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/o/137/voltron_super_poseable_figure3__54481__55188.jpg', 'Super Poseable Die Cast Voltron', false, 12);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (786, 'https://www.toynamishop.com/product_images/y/736/voltron_super_poseable_figure1__16092__46323.jpg', 'Super Poseable Die Cast Voltron', false, 13);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (787, 'https://www.toynamishop.com/product_images/l/153/fav-08a__55569__03821.jpg', 'Acid Rain Stealth Camelbot HR12e', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (787, 'https://www.toynamishop.com/product_images/l/705/fav-08b__75835__88809.jpg', 'Acid Rain Stealth Camelbot HR12e', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (787, 'https://www.toynamishop.com/product_images/r/804/fav-08c__92937__77185.jpg', 'Acid Rain Stealth Camelbot HR12e', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (788, 'https://www.toynamishop.com/product_images/m/490/1-100-scale_super-veritech__0026-Recovered__25746__34469.jpg', 'Robotech 1/100 Max Sterling VF-1J Super Veritech', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (788, 'https://www.toynamishop.com/product_images/x/987/1-100-scale_super-veritech__max-sterling_guardian__16601__76462.jpg', 'Robotech 1/100 Max Sterling VF-1J Super Veritech', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (788, 'https://www.toynamishop.com/product_images/z/081/1-100-scale_super-veritech__max-sterling_fighter__70670__64324.jpg', 'Robotech 1/100 Max Sterling VF-1J Super Veritech', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (788, 'https://www.toynamishop.com/product_images/z/216/robotech_1-100_VF-1J_max_sterling_super_veritech_armor__54162__10568.jpg', 'Robotech 1/100 Max Sterling VF-1J Super Veritech', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/z/378/naruto_mininja-figurines_ASSORTMENT1__28410__39042.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/f/861/x8QTmNYk__45745__80198.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/u/577/WVEZ6Flk__21578__86087.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/z/768/0E_vyEB0__79183__27759.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/b/292/Mi4GqF3w__99071__44052.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/t/993/qs8Ko8Lg__88157__50068.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/m/927/kibaKjmA__34438__33818.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/z/635/a5h7laps__21724__44942.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/w/594/Pcez8zOw__41773__98634.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/v/640/leilbzq4__29424__13109.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 11);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/r/324/xOXKpzEc__34964__38292.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 12);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/w/467/9CLIsGbU__61229__95719.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 13);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (789, 'https://www.toynamishop.com/product_images/e/517/jFfFl5cQ__60048__87068.jpg', 'Naruto Shippuden Mininja Figurines - Series 1', false, 14);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (790, 'https://www.toynamishop.com/product_images/w/685/naruto_shippuden_6inch_pvc_sasuke_01__19790__74388.jpg', 'Deluxe 6" PVC Statue: Sasuke', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (790, 'https://www.toynamishop.com/product_images/e/221/naruto_shippuden_6inch_pvc_sasuke_02__33005__14006.jpg', 'Deluxe 6" PVC Statue: Sasuke', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (790, 'https://www.toynamishop.com/product_images/r/344/naruto_shippuden_6inch_pvc_sasuke_03__91800__09322.jpg', 'Deluxe 6" PVC Statue: Sasuke', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (790, 'https://www.toynamishop.com/product_images/g/553/naruto_shippuden_6inch_pvc_sasuke_04__10297__26182.jpg', 'Deluxe 6" PVC Statue: Sasuke', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (790, 'https://www.toynamishop.com/product_images/c/839/naruto_shippuden_6inch_pvc_sasuke_05__47797__24127.jpg', 'Deluxe 6" PVC Statue: Sasuke', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (791, 'https://www.toynamishop.com/product_images/y/096/naruto_4inch_s3_deidara_03__08185__64556.jpg', 'Naruto Shippuden Poseable Action Figure - Deidara', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (791, 'https://www.toynamishop.com/product_images/v/979/naruto_4inch_s3_deidara_01___64576__40228.jpg', 'Naruto Shippuden Poseable Action Figure - Deidara', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (791, 'https://www.toynamishop.com/product_images/k/647/naruto_4inch_s3_deidara_02__89957__19879.jpg', 'Naruto Shippuden Poseable Action Figure - Deidara', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (792, 'https://www.toynamishop.com/product_images/x/917/troll_hunter_bular01__02044__70199.jpg', 'Comic Con 2016 Exclusive: Trollhunters Bular Maquette', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (792, 'https://www.toynamishop.com/product_images/n/646/troll_hunter_bular03__66313__16702.jpg', 'Comic Con 2016 Exclusive: Trollhunters Bular Maquette', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (792, 'https://www.toynamishop.com/product_images/c/792/troll_hunter_signature__77675__17000.jpg', 'Comic Con 2016 Exclusive: Trollhunters Bular Maquette', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (792, 'https://www.toynamishop.com/product_images/e/245/troll_hunter_bular3__59776__41290.jpg', 'Comic Con 2016 Exclusive: Trollhunters Bular Maquette', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (793, 'https://www.toynamishop.com/product_images/r/360/HKxSF_Series_1_figurines_set1_3__00212__87368.jpg', 'Sanrio x Street Fighter 2-Player Figurine Assortment', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (793, 'https://www.toynamishop.com/product_images/o/707/HKxSF_Series_1_figurines_set2__28652__76407.jpg', 'Sanrio x Street Fighter 2-Player Figurine Assortment', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (793, 'https://www.toynamishop.com/product_images/t/341/HKxSF_Series_1_figurines_set1__75332__51235.jpg', 'Sanrio x Street Fighter 2-Player Figurine Assortment', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (793, 'https://www.toynamishop.com/product_images/s/781/HKxSF_Series_1_figurines_set3__68490__86433.jpg', 'Sanrio x Street Fighter 2-Player Figurine Assortment', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (793, 'https://www.toynamishop.com/product_images/b/433/HKxSF_figurines_series1_pq__06456__50019.jpg', 'Sanrio x Street Fighter 2-Player Figurine Assortment', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (794, 'https://www.toynamishop.com/product_images/j/869/acid-rain_b2five_stealth-chapel_sdcc18-exclusive_3__33814__10393.jpg', 'Acid Rain B2Five Stealth Chapel HETT 600e Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (794, 'https://www.toynamishop.com/product_images/e/938/acid-rain_b2five_stealth-chapel_sdcc18-exclusive2__34720__23739.jpg', 'Acid Rain B2Five Stealth Chapel HETT 600e Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (795, 'https://www.toynamishop.com/product_images/i/562/FAV-A122_IG-02__85095__60925.jpg', 'Hellbender Infantry FAV-A122', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (795, 'https://www.toynamishop.com/product_images/n/938/FAV-A122_IG-08__68412__43585.jpg', 'Hellbender Infantry FAV-A122', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (795, 'https://www.toynamishop.com/product_images/d/369/FAV-A122_IG-05__79850__79702.jpg', 'Hellbender Infantry FAV-A122', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (795, 'https://www.toynamishop.com/product_images/q/220/FAV-A122_IG-04__52468__94857.jpg', 'Hellbender Infantry FAV-A122', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (796, 'https://www.toynamishop.com/product_images/t/336/fav-09a__58415__06822.jpg', 'Acid Rain Ajax Hoplitai', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (796, 'https://www.toynamishop.com/product_images/z/047/fav-09b__71566__57482.jpg', 'Acid Rain Ajax Hoplitai', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (796, 'https://www.toynamishop.com/product_images/c/072/fav-09c__14217__52899.jpg', 'Acid Rain Ajax Hoplitai', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (797, 'https://www.toynamishop.com/product_images/p/914/NARUTO__68961__07971.jpg', 'Deluxe 6" PVC Statue: Naruto', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (797, 'https://www.toynamishop.com/product_images/q/750/naruto_pvcfigures_naruto_01__07097__28086.jpg', 'Deluxe 6" PVC Statue: Naruto', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (797, 'https://www.toynamishop.com/product_images/h/510/naruto_pvcfigures_naruto_03__62824__63978.jpg', 'Deluxe 6" PVC Statue: Naruto', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (797, 'https://www.toynamishop.com/product_images/l/878/naruto_pvc_figure_box_front__49376__57328.jpg', 'Deluxe 6" PVC Statue: Naruto', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (797, 'https://www.toynamishop.com/product_images/f/003/naruto_pvc_figure_box_back__22258__40221.jpg', 'Deluxe 6" PVC Statue: Naruto', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (798, 'https://www.toynamishop.com/product_images/v/561/TOYNAMI_robotech_combo_sets_1-5__81459__46217.jpg', 'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (798, 'https://www.toynamishop.com/product_images/b/250/TOYNAMI_robotech_combo_sets_1-5_action_figures__96451__14664.jpg', 'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (798, 'https://www.toynamishop.com/product_images/p/705/TOYNAMI_robotech_combo_set_max_vf-1j__67722__33680.jpg', 'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (798, 'https://www.toynamishop.com/product_images/n/741/TOYNAMI_robotech_combo_set_miriya_vf-1j__74995__64973.jpg', 'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (798, 'https://www.toynamishop.com/product_images/v/483/TOYNAMI_robotech_combo_set_roy_vf-1s__94764__07386.jpg', 'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (798, 'https://www.toynamishop.com/product_images/w/261/TOYNAMI_robotech_combo_set_ben_dixon_vf-1a__47055__68531.jpg', 'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (798, 'https://www.toynamishop.com/product_images/f/358/TOYNAMI_robotech_combo_set_rick_hunter_vf-1j__83002__49319.jpg', 'Robotech Veritech Fighter Transformable 1/100 scale + 4.25" Pilot Action Figures Set of 5', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (799, 'https://www.toynamishop.com/product_images/r/369/1-100-scale_super-veritech__miriya_battloid__23110__09885.jpg', 'Robotech 1/100 Miriya VF-1J Super Veritech', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (799, 'https://www.toynamishop.com/product_images/h/028/1-100-scale_super-veritech__miriya_guardian__65793__22541.jpg', 'Robotech 1/100 Miriya VF-1J Super Veritech', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (799, 'https://www.toynamishop.com/product_images/r/407/1-100-scale_super-veritech__miriya_fighter__48688__57931.jpg', 'Robotech 1/100 Miriya VF-1J Super Veritech', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (799, 'https://www.toynamishop.com/product_images/b/396/robotech_1-100_VF-1J_miriya_super_veritech_armor__97231__32621.jpg', 'Robotech 1/100 Miriya VF-1J Super Veritech', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (800, 'https://www.toynamishop.com/product_images/u/088/hello-sanrio_SDCC-2018-EXCLUSIVE_capsule-diorama_03__06740__73419.jpg', 'Hello Sanrio Exclusive Two-Pack Set - Hello Kitty & Pompompurin', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (800, 'https://www.toynamishop.com/product_images/y/563/hello-sanrio_SDCC-2018-EXCLUSIVE_capsule-diorama__92637__75284.jpg', 'Hello Sanrio Exclusive Two-Pack Set - Hello Kitty & Pompompurin', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (801, 'https://www.toynamishop.com/product_images/f/029/hello_sannrio_capsule_banner-1__50755__85473.jpg', 'Hello Sanrio 4" Capsule Diorama Assortment (5 Pack)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (801, 'https://www.toynamishop.com/product_images/t/207/hello-sanrio_my-melody_03__88549__48195.jpg', 'Hello Sanrio 4" Capsule Diorama Assortment (5 Pack)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (801, 'https://www.toynamishop.com/product_images/q/930/hello-sanrio_hello-kitty_01__40464__74646.jpg', 'Hello Sanrio 4" Capsule Diorama Assortment (5 Pack)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (801, 'https://www.toynamishop.com/product_images/z/941/hello-sanrio_chococat_01__20812__23843.jpg', 'Hello Sanrio 4" Capsule Diorama Assortment (5 Pack)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (801, 'https://www.toynamishop.com/product_images/b/500/hello-sanrio_keroppi_01__01411__68676.jpg', 'Hello Sanrio 4" Capsule Diorama Assortment (5 Pack)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (801, 'https://www.toynamishop.com/product_images/b/522/hello-sanrio_badtz-maru_01__54591__72781.jpg', 'Hello Sanrio 4" Capsule Diorama Assortment (5 Pack)', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/h/603/hypnotoad_package_3__49465__64905.jpg', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/c/477/futurama_hypnotoadvinyl_06__60252__53823.JPG', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/k/679/hypnotoad_tineez_figurine__16418__32100.jpg', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/r/543/futurama_hypnotoadvinyl_03__69238__87803.jpg', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/s/046/futurama_hypnotoadvinyl_box02__19098__82903.jpg', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/p/698/futurama_hypnotoadvinyl_01__58731__90915.jpg', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/q/858/futurama_hypnotoadvinyl_04__05615__54637.jpg', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/q/093/futurama_hypnotoadvinyl_02__88146__08586.jpg', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (802, 'https://www.toynamishop.com/product_images/j/208/futurama_hypnotoadvinyl_05__06949__15841.jpg', 'SDCC 2013 Exclusive: Futurama Hypnotoad Vinyl Figure', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (803, 'https://www.toynamishop.com/product_images/j/969/20190331_170614__29186__22524.jpg', 'Acid Rain EOS Raider', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (803, 'https://www.toynamishop.com/product_images/s/070/20190331_152637__46499__54775.jpg', 'Acid Rain EOS Raider', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (803, 'https://www.toynamishop.com/product_images/k/692/20190331_153533__87007__65772.jpg', 'Acid Rain EOS Raider', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (803, 'https://www.toynamishop.com/product_images/p/428/20190331_154630__05728__29759.jpg', 'Acid Rain EOS Raider', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (803, 'https://www.toynamishop.com/product_images/r/455/20190331_204323__30008__03107.jpg', 'Acid Rain EOS Raider', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (803, 'https://www.toynamishop.com/product_images/a/581/20190331_155240__17240__59596.jpg', 'Acid Rain EOS Raider', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (804, 'https://www.toynamishop.com/product_images/t/883/naruto_shippuden_6inch_pvc_gaara_01__57149__50030.jpg', 'Deluxe 6" PVC Statue: Gaara', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (804, 'https://www.toynamishop.com/product_images/c/161/naruto_shippuden_6inch_pvc_gaara_02__75694__32378.jpg', 'Deluxe 6" PVC Statue: Gaara', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (804, 'https://www.toynamishop.com/product_images/q/728/naruto_shippuden_6inch_pvc_gaara_03__37130__55429.jpg', 'Deluxe 6" PVC Statue: Gaara', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (804, 'https://www.toynamishop.com/product_images/x/313/naruto_shippuden_6inch_pvc_gaara_04__81794__86099.jpg', 'Deluxe 6" PVC Statue: Gaara', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (804, 'https://www.toynamishop.com/product_images/o/603/naruto_shippuden_6inch_pvc_gaara_06__08888__60270.jpg', 'Deluxe 6" PVC Statue: Gaara', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (805, 'https://www.toynamishop.com/product_images/u/675/hello_kitty_street_fighter_keychains_mobile_charm3__80718__16445.jpg', 'Sanrio x Street Fighter Key Chains Assortment', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (806, 'https://www.toynamishop.com/product_images/o/179/IMG_8930_legal__60511__95815.jpg', 'Comic Con 2016 Exclusive: Trollhunters Bular Maquette & Jim Figure COMBO', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (806, 'https://www.toynamishop.com/product_images/w/218/troll_hunter_bular03__73931__72440.jpg', 'Comic Con 2016 Exclusive: Trollhunters Bular Maquette & Jim Figure COMBO', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (806, 'https://www.toynamishop.com/product_images/p/730/troll_hunter_signature__78436__30320.jpg', 'Comic Con 2016 Exclusive: Trollhunters Bular Maquette & Jim Figure COMBO', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (807, 'https://www.toynamishop.com/product_images/i/275/FAV-A121_IG-02__01763__53769.jpg', 'Spencer FAV-A121', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (807, 'https://www.toynamishop.com/product_images/e/401/FAV-A121_IG-08__86010__59663.jpg', 'Spencer FAV-A121', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (807, 'https://www.toynamishop.com/product_images/b/928/FAV-A121_IG-03__88334__35206.jpg', 'Spencer FAV-A121', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (807, 'https://www.toynamishop.com/product_images/y/904/FAV-A121_IG-05__18684__59190.jpg', 'Spencer FAV-A121', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (808, 'https://www.toynamishop.com/product_images/p/466/angel-birds_VF-1A__35293__32151.jpg', 'Robotech Angel Bird Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (808, 'https://www.toynamishop.com/product_images/z/532/angel-birds_VF-1A_2__36979__50361.jpg', 'Robotech Angel Bird Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/e/832/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_08__69970__26691.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/a/892/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_02__92284__33381.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/z/240/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_05__51212__62181.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/k/141/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_01__59895__06588.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/j/271/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_06__31507__07698.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/v/050/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_03__57950__25705.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/t/775/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_04__20917__80875.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/l/044/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_07__45275__81576.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (809, 'https://www.toynamishop.com/product_images/z/216/Robotech_Battlecry_Rick-Hunter_VF-1J_Combo-exlusive_contents_09__93034__87721.jpg', 'Rick Hunter Transformable 1/100 VF-1J Battle Cry w/ Figure 2021 CONVENTION EXCLUSIVE', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (810, 'https://www.toynamishop.com/product_images/b/160/fav-12c__18053__70954.jpg', 'Acid Rain Sand Antbike AB7s', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (810, 'https://www.toynamishop.com/product_images/t/523/fav-12b__05519__69111.jpg', 'Acid Rain Sand Antbike AB7s', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (810, 'https://www.toynamishop.com/product_images/j/137/fav-12d__52017__33367.jpg', 'Acid Rain Sand Antbike AB7s', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (811, 'https://www.toynamishop.com/product_images/q/292/hello_kitty_street_fighter_keychains_mobile_phone_plug__30542__44892.jpg', 'Sanrio x Street Fighter Mobile Plugs Assortment', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (812, 'https://www.toynamishop.com/product_images/c/706/ACID-RAIN_LAUREL_GHOST_7_01__66749__87833.jpg', 'Acid Rain Laurel Ghost 7', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (812, 'https://www.toynamishop.com/product_images/m/923/ACID-RAIN_LAUREL_GHOST_7_03__74108__50202.jpg', 'Acid Rain Laurel Ghost 7', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (812, 'https://www.toynamishop.com/product_images/l/032/ACID-RAIN_LAUREL_GHOST_7_02__81414__31495.jpg', 'Acid Rain Laurel Ghost 7', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (813, 'https://www.toynamishop.com/product_images/g/927/B00YHYFSTS.MAIN.jpg__54744__38830.jpg', 'Robotech 30th Anniversary 1/100 Roy Fokker GBP-1 Heavy Armor Veritech', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (813, 'https://www.toynamishop.com/product_images/l/129/B00YHYFSTS.PT01.jpg__72757__68149.jpg', 'Robotech 30th Anniversary 1/100 Roy Fokker GBP-1 Heavy Armor Veritech', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (813, 'https://www.toynamishop.com/product_images/t/885/B00YHYFSTS.PT02.jpg__90747__70838.jpg', 'Robotech 30th Anniversary 1/100 Roy Fokker GBP-1 Heavy Armor Veritech', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (813, 'https://www.toynamishop.com/product_images/q/480/B00YHYFSTS.PT03.jpg__47098__31448.jpg', 'Robotech 30th Anniversary 1/100 Roy Fokker GBP-1 Heavy Armor Veritech', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (814, 'https://www.toynamishop.com/product_images/p/114/KAKASHI__14350__04819.jpg', 'Deluxe 6" PVC Statue: Kakashi', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (814, 'https://www.toynamishop.com/product_images/k/583/naruto_pvcfigures_kakashi_02__32582__82376.jpg', 'Deluxe 6" PVC Statue: Kakashi', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (814, 'https://www.toynamishop.com/product_images/b/437/naruto_pvcfigures_kakashi_01__34967__69335.jpg', 'Deluxe 6" PVC Statue: Kakashi', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (814, 'https://www.toynamishop.com/product_images/k/453/naruto_kakashi_pvc_figure_box_front__86538__74682.jpg', 'Deluxe 6" PVC Statue: Kakashi', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (814, 'https://www.toynamishop.com/product_images/h/088/naruto_kakashi_pvc_figure_box_back__45015__31122.jpg', 'Deluxe 6" PVC Statue: Kakashi', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (815, 'https://www.toynamishop.com/product_images/l/888/2018-CONVENTION-EXCLUSIVE_POCHACCO-CHOCOCAT_02__29895__85966.jpg', 'Hello Sanrio Exclusive Two-Pack Set - Pochacco & Chococat', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (815, 'https://www.toynamishop.com/product_images/y/921/2018-CONVENTION-EXCLUSIVE_POCHACCO-CHOCOCAT__09470__75693.jpg', 'Hello Sanrio Exclusive Two-Pack Set - Pochacco & Chococat', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (816, 'https://www.toynamishop.com/product_images/h/589/street_fighte_x_sanrio_chun_li_coinbank01__04455__13811.jpg', 'Comic Con 2014 Exclusive: Hello Kitty Chun-Li Coin Bank', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (816, 'https://www.toynamishop.com/product_images/t/058/street_fighte_x_sanrio_chun_li_coinbank02__39369__67932.jpg', 'Comic Con 2014 Exclusive: Hello Kitty Chun-Li Coin Bank', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (816, 'https://www.toynamishop.com/product_images/k/741/street_fighte_x_sanrio_chun_li_coinbank03__79351__28038.jpg', 'Comic Con 2014 Exclusive: Hello Kitty Chun-Li Coin Bank', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (816, 'https://www.toynamishop.com/product_images/a/514/street_fighte_x_sanrio_chun_li_coinbank__11134__86158.jpg', 'Comic Con 2014 Exclusive: Hello Kitty Chun-Li Coin Bank', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (817, 'https://www.toynamishop.com/product_images/y/636/Tulipop-Deluxe-Plush_miss-maddy01__88662__68932.jpg', 'Miss Maddy Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (817, 'https://www.toynamishop.com/product_images/i/924/04maddy_plush__67811__99279.jpg', 'Miss Maddy Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (817, 'https://www.toynamishop.com/product_images/r/111/missmaddy_plush_deluxe-01__22216__14366.jpg', 'Miss Maddy Deluxe Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (818, 'https://www.toynamishop.com/product_images/g/736/10986515_av2__19471__89139.jpg', 'Naruto Shippuden Mininja Blind Box Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (818, 'https://www.toynamishop.com/product_images/w/736/mininja_series-1_blindbox_01__22150__28180.jpg', 'Naruto Shippuden Mininja Blind Box Figure', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (818, 'https://www.toynamishop.com/product_images/k/670/Naruto-shippuden_2017_mininja_Series-1-blindbox__46460__56665.jpg', 'Naruto Shippuden Mininja Blind Box Figure', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (819, 'https://www.toynamishop.com/product_images/m/248/voltron_30th_anniversary_edition_complete_set_02__29956__10937.jpg', '30th Anniversary Voltron Gift Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (819, 'https://www.toynamishop.com/product_images/w/197/voltron_30th_anniversary_edition_robot_form01__57485__85390.jpg', '30th Anniversary Voltron Gift Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (819, 'https://www.toynamishop.com/product_images/a/209/voltron_30th_anniversary_edition_complete_set__51501__03121.jpg', '30th Anniversary Voltron Gift Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (819, 'https://www.toynamishop.com/product_images/q/916/voltron_30th_anniversary_edition_light_up_weapons_platform__62905__52235.jpg', '30th Anniversary Voltron Gift Set', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (819, 'https://www.toynamishop.com/product_images/t/372/toynami_voltron_30th_anniversary_set_ad__68848__87318.jpg', '30th Anniversary Voltron Gift Set', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (820, 'https://www.toynamishop.com/product_images/y/936/Pose_Heat_Getter_1_Official_Photos_ENG_00-Kv01__17734__18660.jpg', 'METAL HEAT Series Getter 1 Action Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (820, 'https://www.toynamishop.com/product_images/y/360/Pose_Heat_Getter_1_Official_Photos_ENG_03-xFull_Gear__45847__90126.jpg', 'METAL HEAT Series Getter 1 Action Figure', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (820, 'https://www.toynamishop.com/product_images/t/319/Pose_Heat_Getter_1_Official_Photos_ENG_00-Kv02__93523__43245.jpg', 'METAL HEAT Series Getter 1 Action Figure', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/o/852/naruto_epic_scale_hashirama_01__54325__29207.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/e/191/naruto_epic_scale_hashirama_11__79187__87245.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/c/382/naruto_epic_scale_hashirama_14__06609__10836.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/u/961/naruto_epic_scale_hashirama_12__40940__27809.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/t/271/naruto_epic_scale_hashirama_13__47897__53512.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/q/058/naruto_epic_scale_hashirama_08__03245__67819.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/g/353/naruto_epic_scale_hashirama_09__35595__91177.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/r/861/naruto_epic_scale_hashirama_04__92777__25115.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (821, 'https://www.toynamishop.com/product_images/k/547/naruto_epic_scale_hashirama_10__68925__31813.jpg', 'Hashirama Senju "God of Shinobi" Epic Scale Statue', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (822, 'https://www.toynamishop.com/product_images/x/723/FAV-SP01--SDCC__43559__04477.jpg', 'Acid Rain Green Commander 2019 SDCC Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (822, 'https://www.toynamishop.com/product_images/r/027/FAV-SP01--02__24752__82117.jpg', 'Acid Rain Green Commander 2019 SDCC Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (822, 'https://www.toynamishop.com/product_images/e/578/FAV-SP01-__34754__68510.jpg', 'Acid Rain Green Commander 2019 SDCC Exclusive', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (823, 'https://www.toynamishop.com/product_images/x/440/little-nessies_final__55610__69608.jpg', 'Little Nessies Blind Box Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (824, 'https://www.toynamishop.com/product_images/z/807/Space_scientist_White_background__41501__74290.jpg', 'Acid Rain Space Scientist', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (824, 'https://www.toynamishop.com/product_images/t/914/IMG_0004__32540__60356.JPG', 'Acid Rain Space Scientist', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (824, 'https://www.toynamishop.com/product_images/o/297/IMG_0005__70525__52841.JPG', 'Acid Rain Space Scientist', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (824, 'https://www.toynamishop.com/product_images/q/858/IMG_0008__00612__27324.JPG', 'Acid Rain Space Scientist', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (824, 'https://www.toynamishop.com/product_images/o/777/IMG_0014__03232__92922.JPG', 'Acid Rain Space Scientist', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (825, 'https://www.toynamishop.com/product_images/z/571/mega-man_keychain__92763__63447.jpg', 'Mega Man: Fully Charged Clip-On Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/i/025/b82f0e4e-34ac-fa78-ee34-83ee888f05ea__99147__50745.jpg', 'Naruto Shippuden Mininja Figurines - Series 2', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/l/749/wzSGpX9Y__54737__94489.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/a/532/KVyPp83k__25710__30208.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/v/286/Hc6kvfGE__03250__17780.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/i/177/dlOnJI8k__66429__72853.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/s/715/IwJDQZPg__81587__41129.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/c/549/6AZaiFt4__41113__12886.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/h/733/PUMOB8x0__89811__10556.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/n/643/CeBBOkBQ__69811__20013.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/i/187/kh6_DI1s__61928__64835.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 11);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/z/877/CeQ9BHfM__93933__99118.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 12);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/t/704/OSzN7gB8__12029__73145.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 13);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (826, 'https://www.toynamishop.com/product_images/z/703/uh5raaKQ__96158__45889.png', 'Naruto Shippuden Mininja Figurines - Series 2', false, 14);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (827, 'https://www.toynamishop.com/product_images/k/778/FAV-A-04_PRODUCT_SHOT_5__69713__93924.jpg', 'Acid Rain Sand Bunker Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (827, 'https://www.toynamishop.com/product_images/c/182/FAV-A-04_PRODUCT_SHOT_1_-_Copy__96294__14079.jpg', 'Acid Rain Sand Bunker Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (827, 'https://www.toynamishop.com/product_images/s/860/FAV-A-04_PRODUCT_SHOT_3__25463__87613.jpg', 'Acid Rain Sand Bunker Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (828, 'https://www.toynamishop.com/product_images/f/078/B00YHYI8EU.MAIN.jpg__61335__36068.jpg', 'Robotech 30th Anniversary 1/100 Rick Hunter GBP-1J Heavy Armor Veritech', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (828, 'https://www.toynamishop.com/product_images/p/579/B00YHYI8EU.PT01.jpg__01566__33278.jpg', 'Robotech 30th Anniversary 1/100 Rick Hunter GBP-1J Heavy Armor Veritech', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (828, 'https://www.toynamishop.com/product_images/h/932/B00YHYI8EU.PT02.jpg__88743__82592.jpg', 'Robotech 30th Anniversary 1/100 Rick Hunter GBP-1J Heavy Armor Veritech', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (828, 'https://www.toynamishop.com/product_images/k/851/B00YHYI8EU.PT03.jpg__55440__13710.jpg', 'Robotech 30th Anniversary 1/100 Rick Hunter GBP-1J Heavy Armor Veritech', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (829, 'https://www.toynamishop.com/product_images/c/292/macross_calibre_wings_f14_max04__15969__34385.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MAX TYPE', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (829, 'https://www.toynamishop.com/product_images/x/092/macross_calibre_wings_f14_max01__77505__09709.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MAX TYPE', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (829, 'https://www.toynamishop.com/product_images/j/267/macross_calibre_wings_f14_max02__98001__08109.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MAX TYPE', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (829, 'https://www.toynamishop.com/product_images/q/884/macross_calibre_wings_f14_max03__11926__75561.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MAX TYPE', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (829, 'https://www.toynamishop.com/product_images/n/543/macross_calibre_wings_f14_max05__58609__20141.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MAX TYPE', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (830, 'https://www.toynamishop.com/product_images/v/565/hamz_unipo_plush_sdcc2013_01__96943__77641.jpg', 'UNKL Hamz Critter Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (830, 'https://www.toynamishop.com/product_images/q/594/hamz_unipo_plush_sdcc2013__29035__70155.jpg', 'UNKL Hamz Critter Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (830, 'https://www.toynamishop.com/product_images/u/308/hamz_hazmapo_plush_02__15300__02056.jpg', 'UNKL Hamz Critter Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (830, 'https://www.toynamishop.com/product_images/d/382/hamz_hazmapo_plush_01__11115__30344.jpg', 'UNKL Hamz Critter Plush', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (830, 'https://www.toynamishop.com/product_images/x/973/hamz_hazmapo_plush_03__65952__29567.jpg', 'UNKL Hamz Critter Plush', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (831, 'https://www.toynamishop.com/product_images/d/482/skelanimals_plush_cute_as_hell_diego4__57580__78243.jpg', 'Comic Con 2014 Exclusive: Skelanimals "Cute-As-Hell" Diego Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (831, 'https://www.toynamishop.com/product_images/y/509/skelanimals_plush_cute_as_hell_diego3__57536__51966.jpg', 'Comic Con 2014 Exclusive: Skelanimals "Cute-As-Hell" Diego Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (831, 'https://www.toynamishop.com/product_images/w/015/skelanimals_plush_cute_as_hell_diego2__38786__99070.jpg', 'Comic Con 2014 Exclusive: Skelanimals "Cute-As-Hell" Diego Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (832, 'https://www.toynamishop.com/product_images/p/228/naruto-shippuden_sage-mode-Naruto__75432__39915.jpg', 'Comic Con 2017 Exclusive: Sage Mode Naruto Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (833, 'https://www.toynamishop.com/product_images/t/101/IMG_0019__09603__95774.JPG', 'Acid Rain Laurel Airbourne', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (833, 'https://www.toynamishop.com/product_images/x/108/IMG_0007__62338__12625.JPG', 'Acid Rain Laurel Airbourne', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (833, 'https://www.toynamishop.com/product_images/v/345/IMG_0008__34363__65297.JPG', 'Acid Rain Laurel Airbourne', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (833, 'https://www.toynamishop.com/product_images/t/801/IMG_0015__56161__37715.JPG', 'Acid Rain Laurel Airbourne', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (833, 'https://www.toynamishop.com/product_images/m/811/IMG_0017__94059__73648.JPG', 'Acid Rain Laurel Airbourne', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (833, 'https://www.toynamishop.com/product_images/d/657/IMG_0018_copy__00053__66874.jpg', 'Acid Rain Laurel Airbourne', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (834, 'https://www.toynamishop.com/product_images/w/081/Tulipop-Deluxe-Plush_Gloomy01__83391__90650.jpg', 'Gloomy Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (834, 'https://www.toynamishop.com/product_images/c/796/04gloomy_plush__67620__60762.jpg', 'Gloomy Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (834, 'https://www.toynamishop.com/product_images/u/855/gloomy_plush_deluxe-04__46303__51148.jpg', 'Gloomy Deluxe Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (835, 'https://www.toynamishop.com/product_images/d/362/little_nimbus_special_edition__68571__50326.jpg', 'Little Nimbus Special Edition Figurines Set - 2021 CONVENTION EXCLUSIVE', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (835, 'https://www.toynamishop.com/product_images/z/946/little_nimbus_special_edition__01__48806__42638.jpg', 'Little Nimbus Special Edition Figurines Set - 2021 CONVENTION EXCLUSIVE', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (835, 'https://www.toynamishop.com/product_images/d/037/little_nimbus_special_edition__03__00725__44417.jpg', 'Little Nimbus Special Edition Figurines Set - 2021 CONVENTION EXCLUSIVE', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (835, 'https://www.toynamishop.com/product_images/n/276/little_nimbus_special_edition__02__17206__43600.jpg', 'Little Nimbus Special Edition Figurines Set - 2021 CONVENTION EXCLUSIVE', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (835, 'https://www.toynamishop.com/product_images/d/844/little_nimbus_special_edition__04__43573__38885.jpg', 'Little Nimbus Special Edition Figurines Set - 2021 CONVENTION EXCLUSIVE', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (836, 'https://www.toynamishop.com/product_images/t/194/voltron_30th_anniversary_jumbo_lion_robot_01__75868__06086.jpg', '30th Anniversary Voltron Jumbo Lion Force Vinyl', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (836, 'https://www.toynamishop.com/product_images/n/563/voltron_30th_anniversary_jumbo_lion_robot_04__99745__26135.jpg', '30th Anniversary Voltron Jumbo Lion Force Vinyl', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (836, 'https://www.toynamishop.com/product_images/f/576/voltron_30th_anniversary_jumbo_lion_robot_03__64871__19481.jpg', '30th Anniversary Voltron Jumbo Lion Force Vinyl', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (836, 'https://www.toynamishop.com/product_images/e/403/voltron_30th_anniversary_jumbo_lion_robot_02__80493__20291.jpg', '30th Anniversary Voltron Jumbo Lion Force Vinyl', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (836, 'https://www.toynamishop.com/product_images/v/904/voltron_30th_anniversary_jumbo_lion_robot_newsletter__98043__26756.jpg', '30th Anniversary Voltron Jumbo Lion Force Vinyl', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (837, 'https://www.toynamishop.com/product_images/c/315/Cover__54626__04956.jpg', 'Acid Rain B2Five Agurts Beaver WF4w', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (837, 'https://www.toynamishop.com/product_images/k/886/V_form2__84023__61844.jpg', 'Acid Rain B2Five Agurts Beaver WF4w', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (837, 'https://www.toynamishop.com/product_images/i/779/worker__89808__26380.jpg', 'Acid Rain B2Five Agurts Beaver WF4w', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (837, 'https://www.toynamishop.com/product_images/k/323/combine2__56774__60145.jpg', 'Acid Rain B2Five Agurts Beaver WF4w', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (837, 'https://www.toynamishop.com/product_images/v/063/all_parts__26426__68328.jpg', 'Acid Rain B2Five Agurts Beaver WF4w', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (837, 'https://www.toynamishop.com/product_images/e/272/b2five_agurts_beaver_wf4w_11__66045__46429.jpg', 'Acid Rain B2Five Agurts Beaver WF4w', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (838, 'https://www.toynamishop.com/product_images/p/859/FAV-A-05_PRODUCT_SHOT_5__32479__41935.jpg', 'Acid Rain Sand Tactical Engineer', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (838, 'https://www.toynamishop.com/product_images/m/450/FAV-A-05_PRODUCT_SHOT_2__91159__90377.jpg', 'Acid Rain Sand Tactical Engineer', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (838, 'https://www.toynamishop.com/product_images/g/895/FAV-A-05_PRODUCT_SHOT_4__26104__09240.jpg', 'Acid Rain Sand Tactical Engineer', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (839, 'https://www.toynamishop.com/product_images/e/797/ICHIGO__70849__42729.jpg', 'Deluxe 6" PVC Statue: Ichigo', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (839, 'https://www.toynamishop.com/product_images/z/839/bleach_6inch_ichigo_02__44008__32631.jpg', 'Deluxe 6" PVC Statue: Ichigo', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (839, 'https://www.toynamishop.com/product_images/l/114/bleach_6inch_ichigo_01__72894__58000.jpg', 'Deluxe 6" PVC Statue: Ichigo', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (839, 'https://www.toynamishop.com/product_images/b/884/bleach_ichigo_action_figure_box_front__22046__04588.jpg', 'Deluxe 6" PVC Statue: Ichigo', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (839, 'https://www.toynamishop.com/product_images/h/567/bleach_ichigo_action_figure_box_back__12185__35722.jpg', 'Deluxe 6" PVC Statue: Ichigo', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (840, 'https://www.toynamishop.com/product_images/d/710/Robotech_YR-052F_Cyclone_10__09584__52495.jpg', 'PRE-ORDER DEPOSIT: The New Generation YR-052F Transformable Cyclone', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (840, 'https://www.toynamishop.com/product_images/x/336/Robotech_YR-052F_Cyclone_02__79872__33480.jpg', 'PRE-ORDER DEPOSIT: The New Generation YR-052F Transformable Cyclone', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (840, 'https://www.toynamishop.com/product_images/x/195/Robotech_YR-052F_Cyclone_01__73278__12981.jpg', 'PRE-ORDER DEPOSIT: The New Generation YR-052F Transformable Cyclone', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (840, 'https://www.toynamishop.com/product_images/t/115/Robotech_YR-052F_Cyclone_09__77256__29451.jpg', 'PRE-ORDER DEPOSIT: The New Generation YR-052F Transformable Cyclone', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (840, 'https://www.toynamishop.com/product_images/m/737/Robotech_YR-052F_Cyclone_08__28144__49287.jpg', 'PRE-ORDER DEPOSIT: The New Generation YR-052F Transformable Cyclone', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (841, 'https://www.toynamishop.com/product_images/x/882/BW0_02_01__19488__08749.jpg', 'Comic Con 2017 Exclusive: B2Five Stealth MK1e set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (841, 'https://www.toynamishop.com/product_images/c/968/BW0_02_02__37745__74769.JPG', 'Comic Con 2017 Exclusive: B2Five Stealth MK1e set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (841, 'https://www.toynamishop.com/product_images/j/186/BW0_02_03__85274__32716.JPG', 'Comic Con 2017 Exclusive: B2Five Stealth MK1e set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (842, 'https://www.toynamishop.com/product_images/v/714/IMG_NEW__91314__96118.jpg', 'Acid Rain Forseti Viking Shield', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (842, 'https://www.toynamishop.com/product_images/b/569/IMG_0011__94154__95347.JPG', 'Acid Rain Forseti Viking Shield', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (842, 'https://www.toynamishop.com/product_images/d/255/IMG_0013__38477__73443.JPG', 'Acid Rain Forseti Viking Shield', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (842, 'https://www.toynamishop.com/product_images/j/643/IMG_0019__58020__64932.JPG', 'Acid Rain Forseti Viking Shield', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (842, 'https://www.toynamishop.com/product_images/e/778/IMG_0018__66215__35606.JPG', 'Acid Rain Forseti Viking Shield', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (842, 'https://www.toynamishop.com/product_images/u/091/IMG_0017__03544__75812.JPG', 'Acid Rain Forseti Viking Shield', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (843, 'https://www.toynamishop.com/product_images/e/401/B00YHYX2SW.MAIN.jpg__41141__39517.jpg', 'Robotech 30th Anniversary 1/100 Max Sterling GBP-1J Heavy Armor Veritech', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (843, 'https://www.toynamishop.com/product_images/k/947/B00YHYX2SW.PT03.jpg__53566__10463.jpg', 'Robotech 30th Anniversary 1/100 Max Sterling GBP-1J Heavy Armor Veritech', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (843, 'https://www.toynamishop.com/product_images/r/029/B00YHYX2SW.PT01.jpg__50919__49533.jpg', 'Robotech 30th Anniversary 1/100 Max Sterling GBP-1J Heavy Armor Veritech', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (843, 'https://www.toynamishop.com/product_images/o/097/B00YHYX2SW.PT02.jpg__00440__94540.jpg', 'Robotech 30th Anniversary 1/100 Max Sterling GBP-1J Heavy Armor Veritech', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (844, 'https://www.toynamishop.com/product_images/s/386/robotech_SD_figurines_sdcc01__97150__87027.jpg', 'Comic Con 2014 Exclusive: Robotech Chibi Skull Leader VF-1S in Military Gray', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (844, 'https://www.toynamishop.com/product_images/j/051/robotech_SD_figurines_sdcc03__27009__87083.jpg', 'Comic Con 2014 Exclusive: Robotech Chibi Skull Leader VF-1S in Military Gray', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (844, 'https://www.toynamishop.com/product_images/g/914/robotech_SD_figurines_sdcc02__26698__38021.jpg', 'Comic Con 2014 Exclusive: Robotech Chibi Skull Leader VF-1S in Military Gray', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (845, 'https://www.toynamishop.com/product_images/i/447/Tulipop-Deluxe-Plush_bubble01__99243__83537.jpg', 'Bubble Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (845, 'https://www.toynamishop.com/product_images/y/546/04bubble__88076__18338.jpg', 'Bubble Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (845, 'https://www.toynamishop.com/product_images/e/659/bubble_plush_deluxe-03__20587__56067.jpg', 'Bubble Deluxe Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (846, 'https://www.toynamishop.com/product_images/i/869/macross_calibre_wings_f14_miriya04__28900__37270.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MILIA TYPE', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (846, 'https://www.toynamishop.com/product_images/q/562/macross_calibre_wings_f14_miriya01__34470__58893.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MILIA TYPE', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (846, 'https://www.toynamishop.com/product_images/f/785/macross_calibre_wings_f14_miriya02__07647__83522.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MILIA TYPE', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (846, 'https://www.toynamishop.com/product_images/v/409/macross_calibre_wings_f14_miriya03__76232__45883.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MILIA TYPE', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (846, 'https://www.toynamishop.com/product_images/c/964/macross_calibre_wings_f14_miriya05__70727__83045.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MILIA TYPE', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (846, 'https://www.toynamishop.com/product_images/x/813/macross_calibre_wings_miriya_sterling_f14_banner__36328__53068.jpg', 'Macross Calibre Wings 1:72 F-14 UN Spacy MILIA TYPE', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (847, 'https://www.toynamishop.com/product_images/j/695/FAV-A-06_PRODUCT_SHOT_5__69952__20434.jpg', 'Acid Rain Sand Armored Trailer Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (847, 'https://www.toynamishop.com/product_images/u/241/FAV-A-06_PRODUCT_SHOT_2__67434__77878.jpg', 'Acid Rain Sand Armored Trailer Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (847, 'https://www.toynamishop.com/product_images/d/855/FAV-A-06_PRODUCT_SHOT_3__30697__15186.jpg', 'Acid Rain Sand Armored Trailer Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (848, 'https://www.toynamishop.com/product_images/h/927/alexpardee_img_5918__04434__18516.jpg', 'SDCC 2011 Exclusive: Canman Alex Pardee', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (848, 'https://www.toynamishop.com/product_images/t/161/alexpardee_img_5928__67127__59488.jpg', 'SDCC 2011 Exclusive: Canman Alex Pardee', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (848, 'https://www.toynamishop.com/product_images/c/750/alexpardee_img_5930__48091__60165.jpg', 'SDCC 2011 Exclusive: Canman Alex Pardee', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (848, 'https://www.toynamishop.com/product_images/o/530/alexpardee_img_5929__28707__83064.jpg', 'SDCC 2011 Exclusive: Canman Alex Pardee', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (848, 'https://www.toynamishop.com/product_images/r/975/alexpardee_img_5920__78335__57617.jpg', 'SDCC 2011 Exclusive: Canman Alex Pardee', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (848, 'https://www.toynamishop.com/product_images/p/027/alexpardee_img_5922__68964__32238.jpg', 'SDCC 2011 Exclusive: Canman Alex Pardee', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (848, 'https://www.toynamishop.com/product_images/y/018/alexpardee_img_5924__43264__81418.jpg', 'SDCC 2011 Exclusive: Canman Alex Pardee', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/h/830/naruto_six_paths_bust_01__38330__88337.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/p/333/naruto_six_paths_bust_07__88537__41097.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/v/367/naruto_six_paths_bust_09__39921__10083.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/m/054/naruto_six_paths_bust_05__57705__42292.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/z/866/naruto_six_paths_bust_08__67197__14567.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/p/913/naruto_six_paths_bust_04__40476__30986.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/s/967/naruto_six_paths_bust_02__20861__17293.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/e/873/naruto_six_paths_bust_06__41972__04919.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/d/532/naruto_six_paths_bust_03__48478__99582.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (849, 'https://www.toynamishop.com/product_images/h/563/naruto_six_paths_bust_02_pq__70396__32208.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (DEPOSIT ONLY)', false, 11);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (850, 'https://www.toynamishop.com/product_images/o/445/FAV-SP18-order-FN_01__35350__11498.jpg', 'Acid Rain Valdo - 2021 CONVENTION EXCLUSIVE', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (850, 'https://www.toynamishop.com/product_images/k/106/FAV-SP18-order-FN_02__00672__80995.jpg', 'Acid Rain Valdo - 2021 CONVENTION EXCLUSIVE', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (850, 'https://www.toynamishop.com/product_images/j/484/FAV-SP18-order-FN_03__28017__77462.jpg', 'Acid Rain Valdo - 2021 CONVENTION EXCLUSIVE', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (851, 'https://www.toynamishop.com/product_images/r/012/White_background__07788__85581.JPG', 'Acid Rain Flame Trooper', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (851, 'https://www.toynamishop.com/product_images/n/907/pose_01__48192__56152.JPG', 'Acid Rain Flame Trooper', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (851, 'https://www.toynamishop.com/product_images/z/430/pose_02__33883__99467.JPG', 'Acid Rain Flame Trooper', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (851, 'https://www.toynamishop.com/product_images/o/682/pose_06__47761__64186.JPG', 'Acid Rain Flame Trooper', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (851, 'https://www.toynamishop.com/product_images/e/013/pose_04__13347__35052.JPG', 'Acid Rain Flame Trooper', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (852, 'https://www.toynamishop.com/product_images/j/177/Amphista2__40593__57423.jpg', 'Acid Rain Amphista', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (852, 'https://www.toynamishop.com/product_images/k/991/IMG_0009__80851__11594.JPG', 'Acid Rain Amphista', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (852, 'https://www.toynamishop.com/product_images/m/353/IMG_0011__02847__43652.JPG', 'Acid Rain Amphista', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (852, 'https://www.toynamishop.com/product_images/l/005/IMG_0020__87191__63843.JPG', 'Acid Rain Amphista', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (852, 'https://www.toynamishop.com/product_images/m/309/IMG_0021__14591__49752.JPG', 'Acid Rain Amphista', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (852, 'https://www.toynamishop.com/product_images/t/200/IMG_0024__54010__61198.JPG', 'Acid Rain Amphista', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (852, 'https://www.toynamishop.com/product_images/h/923/IMG_0025__02915__35081.JPG', 'Acid Rain Amphista', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (853, 'https://www.toynamishop.com/product_images/x/105/shogun_warriors_godzilla_03__34714__78586.jpg', 'Shogun Warriors 1964 Godzilla Jumbo', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (853, 'https://www.toynamishop.com/product_images/e/596/shogun_warriors_godzilla_06__93652__52113.jpg', 'Shogun Warriors 1964 Godzilla Jumbo', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (853, 'https://www.toynamishop.com/product_images/d/985/shogun_warriors_godzilla_07__23098__38106.jpg', 'Shogun Warriors 1964 Godzilla Jumbo', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (853, 'https://www.toynamishop.com/product_images/g/984/shogun_warriors_godzilla_04__91127__13031.jpg', 'Shogun Warriors 1964 Godzilla Jumbo', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (853, 'https://www.toynamishop.com/product_images/v/515/shogun_warriors_godzilla_05__12572__47142.jpg', 'Shogun Warriors 1964 Godzilla Jumbo', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (853, 'https://www.toynamishop.com/product_images/q/350/shogun_warrior_godzilla_02__28585__21902.jpg', 'Shogun Warriors 1964 Godzilla Jumbo', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (854, 'https://www.toynamishop.com/product_images/j/449/voltron_40th_anniversary_18__28411__61290.jpg', 'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''''s Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (854, 'https://www.toynamishop.com/product_images/t/687/voltron_40th_anniversary_19__46340__10159.jpg', 'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''''s Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (854, 'https://www.toynamishop.com/product_images/b/125/voltron_40th_anniversary_20__61467__10035.jpg', 'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''''s Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (854, 'https://www.toynamishop.com/product_images/o/186/voltron_40th_anniversary_07__22559__61096.jpg', 'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''''s Set', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (854, 'https://www.toynamishop.com/product_images/r/547/voltron_40th_anniversary_06__34167__40720.jpg', 'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''''s Set', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (854, 'https://www.toynamishop.com/product_images/r/426/voltron_40th_anniversary_22__50828__19371.jpg', 'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''''s Set', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (854, 'https://www.toynamishop.com/product_images/g/837/voltron_40th_anniversary_23__48148__05893.jpg', 'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''''s Set', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (854, 'https://www.toynamishop.com/product_images/n/339/voltron_40th_anniversary_21__48962__76487.jpg', 'PRE-ORDER DEPOSIT: Voltron 40th Anniversary Collector''''s Set', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (855, 'https://www.toynamishop.com/product_images/x/464/Tulipop-Deluxe-Plush_fred01__69550__91372.jpg', 'Fred Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (855, 'https://www.toynamishop.com/product_images/e/455/04fred__18686__68038.jpg', 'Fred Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (855, 'https://www.toynamishop.com/product_images/u/768/fred_plush_deluxe-02__19285__26475.jpg', 'Fred Deluxe Plush', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (856, 'https://www.toynamishop.com/product_images/v/342/unkl_DC_COMICS_batman_10inch01__84989__91006.jpg', 'Comic Con 2014 Exclusive: UNKL 10" UniPo Batman', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (856, 'https://www.toynamishop.com/product_images/l/396/unkl_DC_COMICS_batman_10inch02__27413__94760.jpg', 'Comic Con 2014 Exclusive: UNKL 10" UniPo Batman', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (856, 'https://www.toynamishop.com/product_images/x/827/unkl_DC_COMICS_batman_10inch03__83449__14877.jpg', 'Comic Con 2014 Exclusive: UNKL 10" UniPo Batman', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (856, 'https://www.toynamishop.com/product_images/n/493/unkl_DC_COMICS_batman_10inch__13437__44995.jpg', 'Comic Con 2014 Exclusive: UNKL 10" UniPo Batman', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (857, 'https://www.toynamishop.com/product_images/i/157/RUKIA__21058__48379.jpg', 'Deluxe 6" PVC Statue: Rukia', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (857, 'https://www.toynamishop.com/product_images/n/590/bleach_6inch_rukia_03__73276__50334.jpg', 'Deluxe 6" PVC Statue: Rukia', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (857, 'https://www.toynamishop.com/product_images/o/869/bleach_rukia_action_figure_box_front__85564__33594.jpg', 'Deluxe 6" PVC Statue: Rukia', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (857, 'https://www.toynamishop.com/product_images/w/511/bleach_rukia_action_figure_box_back__55883__29932.jpg', 'Deluxe 6" PVC Statue: Rukia', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (858, 'https://www.toynamishop.com/product_images/k/466/B013RKEG0Y.MAIN.jpg__47824__97524.jpg', 'Altimite DX Transforming Voltron', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (858, 'https://www.toynamishop.com/product_images/f/703/B013RKEG0Y.BACK.jpg__59725__39170.jpg', 'Altimite DX Transforming Voltron', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (858, 'https://www.toynamishop.com/product_images/j/597/B013RKEG0Y.PT01.jpg__71314__57529.jpg', 'Altimite DX Transforming Voltron', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (858, 'https://www.toynamishop.com/product_images/s/125/B013RKEG0Y.PT02.jpg__07050__08864.jpg', 'Altimite DX Transforming Voltron', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (859, 'https://www.toynamishop.com/product_images/u/750/fav-13d__43457__75676.jpg', 'Acid Rain Field Vanguard', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (859, 'https://www.toynamishop.com/product_images/i/910/fav-13b__36595__99196.jpg', 'Acid Rain Field Vanguard', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (859, 'https://www.toynamishop.com/product_images/j/531/fav-13c__47003__75320.jpg', 'Acid Rain Field Vanguard', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (859, 'https://www.toynamishop.com/product_images/t/329/acid_rain_field_vanguard_11__39990__91721.jpg', 'Acid Rain Field Vanguard', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (859, 'https://www.toynamishop.com/product_images/o/889/acid_rain_field_vanguard_12__25003__77495.jpg', 'Acid Rain Field Vanguard', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (860, 'https://www.toynamishop.com/product_images/m/225/mospeada_cyclone_ride_armor_stick_03__97307__04880.jpg', 'Mospeada Cyclone Limited Edition Vinyl Figure - STICK', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (860, 'https://www.toynamishop.com/product_images/w/128/mospeada_cyclone_ride_armor_stick_06__68197__10187.jpg', 'Mospeada Cyclone Limited Edition Vinyl Figure - STICK', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (861, 'https://www.toynamishop.com/product_images/l/708/FAV-SP19-order-FN_01__85057__93501.jpg', 'Acid Rain Nana (Neo Atlantis Mascot) - 2021 Convention Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (861, 'https://www.toynamishop.com/product_images/u/455/FAV-SP19-order-FN_02__26057__10094.jpg', 'Acid Rain Nana (Neo Atlantis Mascot) - 2021 Convention Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (861, 'https://www.toynamishop.com/product_images/m/036/FAV-SP19-order-FN_03__97724__36282.jpg', 'Acid Rain Nana (Neo Atlantis Mascot) - 2021 Convention Exclusive', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (862, 'https://www.toynamishop.com/product_images/r/188/IMG_0017__38505__35210.JPG', 'Acid Rain Laurel Corpse', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (862, 'https://www.toynamishop.com/product_images/j/818/IMG_0004__14903__14550.JPG', 'Acid Rain Laurel Corpse', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (862, 'https://www.toynamishop.com/product_images/j/821/IMG_0002__22911__11891.JPG', 'Acid Rain Laurel Corpse', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (862, 'https://www.toynamishop.com/product_images/p/865/IMG_0006__84941__33674.JPG', 'Acid Rain Laurel Corpse', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (862, 'https://www.toynamishop.com/product_images/o/490/IMG_0007__80401__29481.JPG', 'Acid Rain Laurel Corpse', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (862, 'https://www.toynamishop.com/product_images/m/068/IMG_0008__63582__85553.JPG', 'Acid Rain Laurel Corpse', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (862, 'https://www.toynamishop.com/product_images/d/897/IMG_0009__68856__73654.JPG', 'Acid Rain Laurel Corpse', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (863, 'https://www.toynamishop.com/product_images/e/262/VF-1D_CONVENTION-EXCLUSIVE_2__12849__14044.jpg', 'Macross Calibre Wings 1:72 F-14 VF-1D Convention Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (864, 'https://www.toynamishop.com/product_images/j/681/unkl_10_inch_spongebob01__67058__71028.jpg', 'Comic Con 2014 Exclusive: UNKL 10" UniPo SpongeBob', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (864, 'https://www.toynamishop.com/product_images/t/817/unkl_10_inch_spongebob02__12630__34217.jpg', 'Comic Con 2014 Exclusive: UNKL 10" UniPo SpongeBob', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (864, 'https://www.toynamishop.com/product_images/b/581/unkl_10_inch_spongebob__72597__72091.jpg', 'Comic Con 2014 Exclusive: UNKL 10" UniPo SpongeBob', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (865, 'https://www.toynamishop.com/product_images/z/308/PAIN_VS_NARUTO_DELUXE_COMBO_PACK__95963__14366.jpg', 'Naruto Shippuden Exclusive Two-Pack Set: Sage Mode Naruto vs. Pain', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (866, 'https://www.toynamishop.com/product_images/y/005/mospeada_cyclone_ride_armor_ray_05__06916__24331.jpg', 'Mospeada Cyclone Limited Edition Vinyl Figure - RAY', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (866, 'https://www.toynamishop.com/product_images/x/011/mospeada_cyclone_ride_armor_ray_07__56137__73863.jpg', 'Mospeada Cyclone Limited Edition Vinyl Figure - RAY', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (867, 'https://www.toynamishop.com/product_images/h/927/FAV-A01_PROMO_3__92565__76023.jpg', 'Acid Rain FAV Series Bucks Team Wildebeest WB3b', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (867, 'https://www.toynamishop.com/product_images/m/026/FAV-A01_PROMO_2__96206__20093.jpg', 'Acid Rain FAV Series Bucks Team Wildebeest WB3b', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (867, 'https://www.toynamishop.com/product_images/m/257/FAV-A-01_PRODUCT_SHOT_4__95144__87963.jpg', 'Acid Rain FAV Series Bucks Team Wildebeest WB3b', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (867, 'https://www.toynamishop.com/product_images/k/589/FAV-A-01_PRODUCT_SHOT_3__24903__86193.jpg', 'Acid Rain FAV Series Bucks Team Wildebeest WB3b', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (867, 'https://www.toynamishop.com/product_images/m/214/FAV-A-01_PRODUCT_SHOT_2__73396__29899.jpg', 'Acid Rain FAV Series Bucks Team Wildebeest WB3b', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (867, 'https://www.toynamishop.com/product_images/c/645/FAV-A-01_PRODUCT_SHOT_1__67681__07144.jpg', 'Acid Rain FAV Series Bucks Team Wildebeest WB3b', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (868, 'https://www.toynamishop.com/product_images/n/267/Tulipop_Fred_coin-bank_01__82208__13633.jpg', 'FRED Vinyl Coin Bank', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (868, 'https://www.toynamishop.com/product_images/c/900/Tulipop_Fred_coin-bank_02-1__21635__33872.jpg', 'FRED Vinyl Coin Bank', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (868, 'https://www.toynamishop.com/product_images/a/923/Tulipop_Fred-Coin-Bank-box-1__26991__86714.jpg', 'FRED Vinyl Coin Bank', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (869, 'https://www.toynamishop.com/product_images/f/385/P1301483__23379__75418.jpg', 'Macross Calibre Wings 1:72 VF-1S Valkyrie Fighter', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (869, 'https://www.toynamishop.com/product_images/x/993/P1301485__79399__80210.jpg', 'Macross Calibre Wings 1:72 VF-1S Valkyrie Fighter', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (869, 'https://www.toynamishop.com/product_images/l/106/CA72RB06-1__40200__54764.jpg', 'Macross Calibre Wings 1:72 VF-1S Valkyrie Fighter', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (869, 'https://www.toynamishop.com/product_images/m/609/CA72RB06-2__90290__36866.jpg', 'Macross Calibre Wings 1:72 VF-1S Valkyrie Fighter', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (869, 'https://www.toynamishop.com/product_images/l/880/1__01327__97031.jpg', 'Macross Calibre Wings 1:72 VF-1S Valkyrie Fighter', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/a/278/godzilla_statue_01__37648__85276.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/e/317/godzilla_statue_07__96020__06812.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/y/084/godzilla_statue_02__71767__88756.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/g/691/godzilla_statue_06__32175__08339.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/l/098/godzilla_statue_05__73871__07244.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/c/998/godzilla_statue_04__61481__56632.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/e/851/godzilla_statue_08__96871__24008.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/n/251/godzilla_statue_03__06134__77592.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (870, 'https://www.toynamishop.com/product_images/p/093/godzilla_statue_09__78273__21933.jpg', 'Godzilla 1989 - Limited Edition Statue - Polystone Resin', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (871, 'https://www.toynamishop.com/product_images/n/350/canman_blank_01__57387__58315.jpg', 'The Canmans Blank Canman', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (871, 'https://www.toynamishop.com/product_images/z/561/canman_blank_02__92475__79371.jpg', 'The Canmans Blank Canman', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (871, 'https://www.toynamishop.com/product_images/x/178/canman_blank_03__10620__70240.jpg', 'The Canmans Blank Canman', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (872, 'https://www.toynamishop.com/product_images/p/025/Tulipop_tineez_mini_plush_Fred__35443__99947.jpg', 'Tulipop Fred Tineez Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (873, 'https://www.toynamishop.com/product_images/w/261/FAV-SP20-order-FN_01__87756__42567.jpg', 'Acid Rain Halogen Jeep - 2021 Convention Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (873, 'https://www.toynamishop.com/product_images/o/082/FAV-SP20-order-FN_02__59925__85883.jpg', 'Acid Rain Halogen Jeep - 2021 Convention Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (873, 'https://www.toynamishop.com/product_images/t/351/FAV-SP20-order-FN_03__80505__55578.jpg', 'Acid Rain Halogen Jeep - 2021 Convention Exclusive', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (874, 'https://www.toynamishop.com/product_images/v/483/IMG_0001__51706__18795.JPG', 'Acid Rain Laurel Rescue', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (874, 'https://www.toynamishop.com/product_images/h/917/IMG_0016__45006__00550.JPG', 'Acid Rain Laurel Rescue', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (874, 'https://www.toynamishop.com/product_images/q/187/IMG_0019__59659__23721.JPG', 'Acid Rain Laurel Rescue', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (874, 'https://www.toynamishop.com/product_images/f/131/IMG_0018__88526__04949.JPG', 'Acid Rain Laurel Rescue', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (874, 'https://www.toynamishop.com/product_images/a/364/IMG_0012__62242__24319.JPG', 'Acid Rain Laurel Rescue', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (875, 'https://www.toynamishop.com/product_images/x/847/FEy4HJnaMAEndjX__08917__14178.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K01 WENENU', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (875, 'https://www.toynamishop.com/product_images/v/167/FEy4HJmagAE333z__41909__42485.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K01 WENENU', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (875, 'https://www.toynamishop.com/product_images/m/174/FEy4HJlaMAEf3MK__79285__92896.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K01 WENENU', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (875, 'https://www.toynamishop.com/product_images/b/418/FEy4HJlagAUcrwz__16175__55614.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K01 WENENU', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (876, 'https://www.toynamishop.com/product_images/e/191/DSC_0520__55510__69000.JPG', 'B2Five R711 Laurel LA3R', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (876, 'https://www.toynamishop.com/product_images/p/940/DSC_0485__45606__47045.JPG', 'B2Five R711 Laurel LA3R', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (876, 'https://www.toynamishop.com/product_images/g/433/DSC_0491__78676__06968.JPG', 'B2Five R711 Laurel LA3R', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (876, 'https://www.toynamishop.com/product_images/w/729/DSC_0502__10105__50857.JPG', 'B2Five R711 Laurel LA3R', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (876, 'https://www.toynamishop.com/product_images/n/021/DSC_0508__87163__16481.JPG', 'B2Five R711 Laurel LA3R', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (877, 'https://www.toynamishop.com/product_images/v/074/little-embers_blind-box-series-2__83794__49787.jpg', 'Little Embers SERIES 2 Blind Box Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (877, 'https://www.toynamishop.com/product_images/d/344/little_embers_Series2_04__22864__24147.jpg', 'Little Embers SERIES 2 Blind Box Figurine', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (877, 'https://www.toynamishop.com/product_images/j/871/little_embers_Series2_01__06832__59813.jpg', 'Little Embers SERIES 2 Blind Box Figurine', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (877, 'https://www.toynamishop.com/product_images/n/723/little_embers_Series2_07__64462__10673.jpg', 'Little Embers SERIES 2 Blind Box Figurine', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (877, 'https://www.toynamishop.com/product_images/m/507/little_embers_Series2_14__99701__07831.jpg', 'Little Embers SERIES 2 Blind Box Figurine', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (877, 'https://www.toynamishop.com/product_images/d/569/little_embers_Series2_10__14284__77703.jpg', 'Little Embers SERIES 2 Blind Box Figurine', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (878, 'https://www.toynamishop.com/product_images/q/981/P1017753__17041__34643.jpg', 'Macross Calibre Wings 1:72 VF-1S Fighter Valkyrie STEALTH - 2020 CONVENTION EXCLUSIVE PRE-ORDER', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (878, 'https://www.toynamishop.com/product_images/r/642/P1017704__75821__10366.jpg', 'Macross Calibre Wings 1:72 VF-1S Fighter Valkyrie STEALTH - 2020 CONVENTION EXCLUSIVE PRE-ORDER', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (878, 'https://www.toynamishop.com/product_images/r/092/P1017700__53047__72123.jpg', 'Macross Calibre Wings 1:72 VF-1S Fighter Valkyrie STEALTH - 2020 CONVENTION EXCLUSIVE PRE-ORDER', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (878, 'https://www.toynamishop.com/product_images/c/468/P1017706__30382__77796.jpg', 'Macross Calibre Wings 1:72 VF-1S Fighter Valkyrie STEALTH - 2020 CONVENTION EXCLUSIVE PRE-ORDER', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (878, 'https://www.toynamishop.com/product_images/l/009/P1017751__17934__21493.jpg', 'Macross Calibre Wings 1:72 VF-1S Fighter Valkyrie STEALTH - 2020 CONVENTION EXCLUSIVE PRE-ORDER', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (879, 'https://www.toynamishop.com/product_images/w/928/Tulipop_tineez_mini_plush_Miss_Maddy_10_inch__71979__11301.jpg', 'Tulipop Miss Maddy Tineez Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (880, 'https://www.toynamishop.com/product_images/e/502/robotech-limited-edition-poster_SDCC2018__09370__59497.jpg', 'Robotech Defense Force Poster - 2018 SDCC Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (881, 'https://www.toynamishop.com/product_images/p/466/Robotech_YR-052F_Cyclone_10__36244__36116.jpg', 'PREORDER REQUIRED: The New Generation YR-052F Transformable Cyclone (FINAL PAYMENT)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (881, 'https://www.toynamishop.com/product_images/x/514/Robotech_YR-052F_Cyclone_02__95747__42531.jpg', 'PREORDER REQUIRED: The New Generation YR-052F Transformable Cyclone (FINAL PAYMENT)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (881, 'https://www.toynamishop.com/product_images/y/624/Robotech_YR-052F_Cyclone_01__40467__46125.jpg', 'PREORDER REQUIRED: The New Generation YR-052F Transformable Cyclone (FINAL PAYMENT)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (881, 'https://www.toynamishop.com/product_images/t/794/Robotech_YR-052F_Cyclone_09__73402__57361.jpg', 'PREORDER REQUIRED: The New Generation YR-052F Transformable Cyclone (FINAL PAYMENT)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (881, 'https://www.toynamishop.com/product_images/p/820/Robotech_YR-052F_Cyclone_08__58557__59053.jpg', 'PREORDER REQUIRED: The New Generation YR-052F Transformable Cyclone (FINAL PAYMENT)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (882, 'https://www.toynamishop.com/product_images/c/937/futurama_robot_santa_collection__54317__06589.jpg', 'Futurama "Robot Santa Build-A-Bot" Action Figure Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (882, 'https://www.toynamishop.com/product_images/s/884/futurama_robot_santa_collection2__76349__28626.jpg', 'Futurama "Robot Santa Build-A-Bot" Action Figure Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (883, 'https://www.toynamishop.com/product_images/o/618/voltron_40th_anniversary_18__49687__55983.jpg', 'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''''s Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (883, 'https://www.toynamishop.com/product_images/v/788/voltron_40th_anniversary_19__80862__36003.jpg', 'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''''s Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (883, 'https://www.toynamishop.com/product_images/p/761/voltron_40th_anniversary_20__29751__43832.jpg', 'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''''s Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (883, 'https://www.toynamishop.com/product_images/d/495/voltron_40th_anniversary_07__81955__39392.jpg', 'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''''s Set', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (883, 'https://www.toynamishop.com/product_images/k/988/voltron_40th_anniversary_06__75102__23800.jpg', 'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''''s Set', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (883, 'https://www.toynamishop.com/product_images/x/184/voltron_40th_anniversary_22__80445__44289.jpg', 'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''''s Set', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (883, 'https://www.toynamishop.com/product_images/b/626/voltron_40th_anniversary_23__15577__81196.jpg', 'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''''s Set', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (883, 'https://www.toynamishop.com/product_images/y/833/voltron_40th_anniversary_21__58000__53477.jpg', 'PREORDER DEPOSIT REQUIRED: Voltron 40th Anniversary Collector''''s Set', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (884, 'https://www.toynamishop.com/product_images/s/550/Tulipop_tineez_bubble_01__09651__69091.jpg', 'Tulipop Bubble Tineez Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (885, 'https://www.toynamishop.com/product_images/t/636/FAV-C01-order-FN_01__94443__42108.jpg', 'Acid Rain Shadow of Assamite - 2021 Convention Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (885, 'https://www.toynamishop.com/product_images/z/937/FAV-C01-order-FN_02__29462__71049.jpg', 'Acid Rain Shadow of Assamite - 2021 Convention Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (886, 'https://www.toynamishop.com/product_images/d/462/macross_hikaru_valkyrie__50398__65781.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Ichijo Valkyrie', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (886, 'https://www.toynamishop.com/product_images/a/327/macross_hikaru_valkyrie_01__15774__01285.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Ichijo Valkyrie', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (886, 'https://www.toynamishop.com/product_images/f/890/macross_hikaru_valkyrie_04__73934__80309.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Ichijo Valkyrie', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (886, 'https://www.toynamishop.com/product_images/f/643/macross_hikaru_valkyrie_03__15930__63932.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Ichijo Valkyrie', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (886, 'https://www.toynamishop.com/product_images/p/876/macross_hikaru_valkyrie_02__05728__89341.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Ichijo Valkyrie', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (887, 'https://www.toynamishop.com/product_images/i/420/MIK-02-order-01__36696__94837.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K02 Tao-Sor', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (887, 'https://www.toynamishop.com/product_images/q/512/MIK-02-order-04__43942__77370.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K02 Tao-Sor', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (887, 'https://www.toynamishop.com/product_images/c/411/MIK-02-order-03__67343__28965.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K02 Tao-Sor', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (888, 'https://www.toynamishop.com/product_images/k/104/IMG_NEW__75784__73717.jpg', 'Acid Rain Laurel Worker', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (888, 'https://www.toynamishop.com/product_images/t/628/c2da99f0-3eaa-4b05-b43b-548ef7b0302d__12983__08555.jpg', 'Acid Rain Laurel Worker', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (888, 'https://www.toynamishop.com/product_images/r/858/4f26e8fc-beae-456c-83fa-9e5d4b82e93f__38961__82018.jpg', 'Acid Rain Laurel Worker', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (888, 'https://www.toynamishop.com/product_images/s/828/ba04311e-e1fc-4980-bf77-9b30a32c3130__55089__18880.jpg', 'Acid Rain Laurel Worker', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (889, 'https://www.toynamishop.com/product_images/y/238/Tulipop_tineez_mini_plush_Gloomy__41396__88020.jpg', 'Tulipop Gloomy Tineez Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (890, 'https://www.toynamishop.com/product_images/z/621/futurama_tineez1_2_package__89125__60885.jpg', 'Futurama Tineez Series 1.2 Mini-Figure 3-pack', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (890, 'https://www.toynamishop.com/product_images/m/029/futurama_tineez1_2_alternate_universe_zoidberg_01__88370__44047.jpg', 'Futurama Tineez Series 1.2 Mini-Figure 3-pack', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (890, 'https://www.toynamishop.com/product_images/b/185/futurama_tineez1_2_bumblebee_bender_01__94930__34504.jpg', 'Futurama Tineez Series 1.2 Mini-Figure 3-pack', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (890, 'https://www.toynamishop.com/product_images/c/355/futurama_tineez1_2_robot_devil_01__37598__00518.jpg', 'Futurama Tineez Series 1.2 Mini-Figure 3-pack', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (891, 'https://www.toynamishop.com/product_images/z/818/main__93022__86347.jpg', 'Mospeada Legioss AFC-01Z (Red)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (891, 'https://www.toynamishop.com/product_images/c/005/img_02__93983__80111.jpg', 'Mospeada Legioss AFC-01Z (Red)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (891, 'https://www.toynamishop.com/product_images/o/918/img01__80115__04443.jpg', 'Mospeada Legioss AFC-01Z (Red)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (892, 'https://www.toynamishop.com/product_images/t/546/DSC_0454__76468__84229.jpg', 'B2Five K6 Jungle Speeder MK1K', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (892, 'https://www.toynamishop.com/product_images/q/409/DSC_0447__11645__43772.jpg', 'B2Five K6 Jungle Speeder MK1K', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (892, 'https://www.toynamishop.com/product_images/f/285/DSC_0444__76218__71722.jpg', 'B2Five K6 Jungle Speeder MK1K', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (892, 'https://www.toynamishop.com/product_images/s/385/DSC_0462__35095__58910.jpg', 'B2Five K6 Jungle Speeder MK1K', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (892, 'https://www.toynamishop.com/product_images/p/886/DSC_0463__26147__96935.jpg', 'B2Five K6 Jungle Speeder MK1K', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (893, 'https://www.toynamishop.com/product_images/g/521/Little_Ember_Iridescent_Pearl_Edition__94354__49574.jpg', 'Little Ember Iridescent Pearl Edition', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (893, 'https://www.toynamishop.com/product_images/n/280/little-embers_pearlescent-edition__88910__62145.jpg', 'Little Ember Iridescent Pearl Edition', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (893, 'https://www.toynamishop.com/product_images/d/379/little-embers_pearlescent-edition2__00496__57364.jpg', 'Little Ember Iridescent Pearl Edition', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (894, 'https://www.toynamishop.com/product_images/t/253/FAV-A02-PIC_6__07686__10060.jpg', 'Acid Rain Field Flakbike FB7f', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (894, 'https://www.toynamishop.com/product_images/j/225/FAV-A02-PIC_1__18039__51132.jpg', 'Acid Rain Field Flakbike FB7f', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (894, 'https://www.toynamishop.com/product_images/p/132/FAV-A02-PIC_2__40634__54466.jpg', 'Acid Rain Field Flakbike FB7f', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (895, 'https://www.toynamishop.com/product_images/i/028/a598e3ea-23b3-403f-875a-ef3faf048c81__56039__15087.jpg', 'Naruto Sage Mode Epic Scale Statue', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (895, 'https://www.toynamishop.com/product_images/r/312/39e51ef6-e2bf-4687-a843-d38fde5d858b__54992__41610.jpg', 'Naruto Sage Mode Epic Scale Statue', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (896, 'https://www.toynamishop.com/product_images/w/706/10822903_hi__81052__86046.jpg', 'Tulipop Blind Boxes Figure with Diorama', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (896, 'https://www.toynamishop.com/product_images/u/353/10822903_av2__89097__04392.jpg', 'Tulipop Blind Boxes Figure with Diorama', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (897, 'https://www.toynamishop.com/product_images/j/716/robotech_new_gen_alpha_t-shirt__78249__43919.jpg', 'Robotech New Generation Mars Base Alpha Shirt', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (897, 'https://www.toynamishop.com/product_images/o/581/Screenshot_62__88692__70901.png', 'Robotech New Generation Mars Base Alpha Shirt', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (897, 'https://www.toynamishop.com/product_images/e/964/Screenshot_63__76679__30400.png', 'Robotech New Generation Mars Base Alpha Shirt', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (898, 'https://www.toynamishop.com/product_images/k/825/Robotech_YR-052F_Cyclone_10__31264__17851.jpg', 'The New Generation YR-052F Transformable Cyclone', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (898, 'https://www.toynamishop.com/product_images/v/052/Robotech_YR-052F_Cyclone_02__04086__60242.jpg', 'The New Generation YR-052F Transformable Cyclone', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (898, 'https://www.toynamishop.com/product_images/z/366/Robotech_YR-052F_Cyclone_01__46441__34352.jpg', 'The New Generation YR-052F Transformable Cyclone', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (898, 'https://www.toynamishop.com/product_images/n/236/Robotech_YR-052F_Cyclone_09__10054__05470.jpg', 'The New Generation YR-052F Transformable Cyclone', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (898, 'https://www.toynamishop.com/product_images/q/007/Robotech_YR-052F_Cyclone_08__22526__05019.jpg', 'The New Generation YR-052F Transformable Cyclone', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (899, 'https://www.toynamishop.com/product_images/r/891/naruto_shippuden_4inch_Kurama_Link_Mode_05__53795__78605.jpg', 'Naruto Kurama Link Mode 2020 CONVENTION EXCLUSIVE', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (899, 'https://www.toynamishop.com/product_images/m/814/naruto_shippuden_4inch_Kurama_Link_Mode_01__60665__19906.jpg', 'Naruto Kurama Link Mode 2020 CONVENTION EXCLUSIVE', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (899, 'https://www.toynamishop.com/product_images/u/906/naruto_shippuden_4inch_Kurama_Link_Mode_04__79179__20118.jpg', 'Naruto Kurama Link Mode 2020 CONVENTION EXCLUSIVE', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (899, 'https://www.toynamishop.com/product_images/r/718/naruto_shippuden_4inch_Kurama_Link_Mode_02__91449__47736.jpg', 'Naruto Kurama Link Mode 2020 CONVENTION EXCLUSIVE', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (899, 'https://www.toynamishop.com/product_images/a/750/naruto_shippuden_4inch_Kurama_Link_Mode_03__91714__67150.jpg', 'Naruto Kurama Link Mode 2020 CONVENTION EXCLUSIVE', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (899, 'https://www.toynamishop.com/product_images/e/530/naruto_shippuden_4inch_Kurama_Link_Mode_06__08633__05120.jpg', 'Naruto Kurama Link Mode 2020 CONVENTION EXCLUSIVE', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (900, 'https://www.toynamishop.com/product_images/c/383/MIK-03-order-1__62891__26458.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K03 Tiger Bill', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (900, 'https://www.toynamishop.com/product_images/v/531/MIK-03-order-4__78002__77812.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K03 Tiger Bill', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (900, 'https://www.toynamishop.com/product_images/u/702/MIK-03-order-3__73303__58657.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K03 Tiger Bill', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (901, 'https://www.toynamishop.com/product_images/e/885/skelanimal_DotD_mini_plush_kit_01__77227__02595.jpg', 'Skelanimals Day of the Dead Kit (Cat) Mini Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (902, 'https://www.toynamishop.com/product_images/o/336/little_nimbus_figurines__08082__17867.jpg', 'Little Nimbus Blind Box Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (903, 'https://www.toynamishop.com/product_images/z/585/10822905_av2__10799__77191.jpg', 'Sonic x Sanrio Blind Box Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (903, 'https://www.toynamishop.com/product_images/i/810/10822905_hi__38370__36548.jpg', 'Sonic x Sanrio Blind Box Figure', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (904, 'https://www.toynamishop.com/product_images/y/091/Legioss_Typ_AFC-01I_1__90557__00068.jpg', 'Mospeada Legioss AFC-01I (Green)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (904, 'https://www.toynamishop.com/product_images/s/252/Legioss_Typ_AFC-01I_2__95653__99953.jpg', 'Mospeada Legioss AFC-01I (Green)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (904, 'https://www.toynamishop.com/product_images/q/997/Legioss_Typ_AFC-01I_5__66878__96505.jpg', 'Mospeada Legioss AFC-01I (Green)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (904, 'https://www.toynamishop.com/product_images/a/542/KAHEN_LEGIOSS_TYPE-JOTA_02__03862__00983.jpg', 'Mospeada Legioss AFC-01I (Green)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (905, 'https://www.toynamishop.com/product_images/n/800/FAV-A-03-PIC-6__64585__24724.jpg', 'Acid Rain Field Wildebeest WB3f', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (905, 'https://www.toynamishop.com/product_images/c/016/FAV-A-03-PIC-3__20380__16029.jpg', 'Acid Rain Field Wildebeest WB3f', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (905, 'https://www.toynamishop.com/product_images/h/435/FAV-A-03-PIC-5__51148__70316.jpg', 'Acid Rain Field Wildebeest WB3f', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (906, 'https://www.toynamishop.com/product_images/g/412/MACROSS_shogun_warriors_VF-1S__29967__70625.jpg', 'Macross Skull Leader Shogun Warrior VF-1S SDCC 2023 Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (906, 'https://www.toynamishop.com/product_images/e/625/MACROSS_shogun_warriors_VF-1S_01__36854__72075.jpg', 'Macross Skull Leader Shogun Warrior VF-1S SDCC 2023 Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (906, 'https://www.toynamishop.com/product_images/l/818/MACROSS_shogun_warriors_VF-1S_02__55825__75476.jpg', 'Macross Skull Leader Shogun Warrior VF-1S SDCC 2023 Exclusive', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (906, 'https://www.toynamishop.com/product_images/v/976/MACROSS_shogun-warriors_VF-1S_03__39202__62553.jpg', 'Macross Skull Leader Shogun Warrior VF-1S SDCC 2023 Exclusive', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (907, 'https://www.toynamishop.com/product_images/o/204/rick-hunter_battloid_01__19590__50822.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - RICK HUNTER VOLUME 1', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (907, 'https://www.toynamishop.com/product_images/z/614/micronian_rick_hunter_fighter_01__93909__90360.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - RICK HUNTER VOLUME 1', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (907, 'https://www.toynamishop.com/product_images/r/425/micronian_rick_hunter_guardian_01__43564__63319.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - RICK HUNTER VOLUME 1', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (907, 'https://www.toynamishop.com/product_images/r/943/ROBOTECH_MICRONIAN-PILOTS_VOL1_RICK-HUNTER__05571__57439.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - RICK HUNTER VOLUME 1', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (908, 'https://www.toynamishop.com/product_images/x/348/chaple6__15237__75246.jpg', 'B2Five K6 Jungle Chapel HTT600k', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (908, 'https://www.toynamishop.com/product_images/p/097/chaple10__27438__96976.jpg', 'B2Five K6 Jungle Chapel HTT600k', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (908, 'https://www.toynamishop.com/product_images/p/386/chaple4__32401__91259.jpg', 'B2Five K6 Jungle Chapel HTT600k', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (908, 'https://www.toynamishop.com/product_images/p/081/chaple5__75677__73328.jpg', 'B2Five K6 Jungle Chapel HTT600k', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (908, 'https://www.toynamishop.com/product_images/d/978/chaple8__41425__27394.jpg', 'B2Five K6 Jungle Chapel HTT600k', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (909, 'https://www.toynamishop.com/product_images/c/859/futurama_plush_robot_devil_01__69006__39231.jpg', 'SDCC 2011 Exclusive: Futurama Robot Devil Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (910, 'https://www.toynamishop.com/product_images/y/966/skelanimal_DotD_mini_plush_diego_01__33637__09069.jpg', 'Skelanimals Day of the Dead Diego (Bat) Mini Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (911, 'https://www.toynamishop.com/product_images/r/004/Toynami-07_little_burnt_embers__83909__40297.jpg', 'Little Burnt Embers', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (912, 'https://www.toynamishop.com/product_images/f/655/macross_roy-focker_valkyrie__38255__21243.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1S Roy Focker Valkyrie', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (912, 'https://www.toynamishop.com/product_images/p/061/macross_roy-focker_valkyrie_01__09489__62367.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1S Roy Focker Valkyrie', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (912, 'https://www.toynamishop.com/product_images/g/247/macross_roy-focker_valkyrie_03__29028__11614.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1S Roy Focker Valkyrie', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (912, 'https://www.toynamishop.com/product_images/t/577/macross_roy-focker_valkyrie_04__68017__38860.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1S Roy Focker Valkyrie', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (912, 'https://www.toynamishop.com/product_images/x/058/macross_roy-focker_valkyrie_02__45742__51922.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1S Roy Focker Valkyrie', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (913, 'https://www.toynamishop.com/product_images/y/261/LIttle_Embers_Enamel_pins__74447__90426.jpg', 'Little Embers Blind Box Enamel Pin', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (914, 'https://www.toynamishop.com/product_images/c/924/MIK-04-order-1__31815__37669.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K04 Ryukin', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (914, 'https://www.toynamishop.com/product_images/a/399/MIK-04-order-4__90189__62570.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K04 Ryukin', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (914, 'https://www.toynamishop.com/product_images/t/943/MIK-04-order-3__14031__24058.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K04 Ryukin', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (915, 'https://www.toynamishop.com/product_images/v/563/Sonic_x_Hello_Kitty__07518__27900.jpg', 'Sonic x Hello Kitty 10 inch Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (915, 'https://www.toynamishop.com/product_images/a/146/11064189_hi__70009__22939.jpg', 'Sonic x Hello Kitty 10 inch Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (916, 'https://www.toynamishop.com/product_images/n/462/Picture1__63958__48423.jpg', 'Little BURNT Embers Series 2 Blind Box Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (916, 'https://www.toynamishop.com/product_images/x/669/little_burnt_embers_s2_16__94058__62565.jpg', 'Little BURNT Embers Series 2 Blind Box Figurine', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (916, 'https://www.toynamishop.com/product_images/b/331/little_burnt_embers_s2_15__06984__27743.jpg', 'Little BURNT Embers Series 2 Blind Box Figurine', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (917, 'https://www.toynamishop.com/product_images/a/201/skelanimal_DotD_mini_plush_maxx_01__04251__29854.jpg', 'Skelanimals Day of the Dead Maxx (Bulldog) Mini Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (918, 'https://www.toynamishop.com/product_images/k/766/macross_zentradibattlepod_07__33599__18849.jpg', '2010 SDCC Exclusive: Macross Vinyl Figure Zentradi (Regault) Tactical Battlepod', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (918, 'https://www.toynamishop.com/product_images/k/340/macross_zentradibattlepod_08__85241__13665.jpg', '2010 SDCC Exclusive: Macross Vinyl Figure Zentradi (Regault) Tactical Battlepod', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (918, 'https://www.toynamishop.com/product_images/j/329/macross_zentradibattlepod_09__89701__32069.jpg', '2010 SDCC Exclusive: Macross Vinyl Figure Zentradi (Regault) Tactical Battlepod', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (919, 'https://www.toynamishop.com/product_images/r/358/LIttle_Embers_Rubber-Keychains__92542__52816.jpg', 'Little Embers Figure Keychain', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (920, 'https://www.toynamishop.com/product_images/s/250/Macross_VF-1J_t-shirt__07461__30855.jpg', 'Macross VF-1J Vermilion Squad Shirt', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (920, 'https://www.toynamishop.com/product_images/f/882/robotech_T-Shirts_2022-01__07702__26120.jpg', 'Macross VF-1J Vermilion Squad Shirt', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (920, 'https://www.toynamishop.com/product_images/n/644/Screenshot_62__36252__76080.png', 'Macross VF-1J Vermilion Squad Shirt', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (920, 'https://www.toynamishop.com/product_images/k/087/Screenshot_63__34480__79138.png', 'Macross VF-1J Vermilion Squad Shirt', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (921, 'https://www.toynamishop.com/product_images/j/981/2__16715__96825.jpg', 'B2Five Moose Laurel LA3b', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (921, 'https://www.toynamishop.com/product_images/k/046/12__52196__53629.jpg', 'B2Five Moose Laurel LA3b', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (921, 'https://www.toynamishop.com/product_images/h/001/13__83325__91855.jpg', 'B2Five Moose Laurel LA3b', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (921, 'https://www.toynamishop.com/product_images/f/523/all_parts__45705__83041.jpg', 'B2Five Moose Laurel LA3b', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (922, 'https://www.toynamishop.com/product_images/i/025/CA72RB0708-1__62958__32719.jpg', 'Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (922, 'https://www.toynamishop.com/product_images/f/458/CA72RB0708-2__07423__66655.jpg', 'Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (922, 'https://www.toynamishop.com/product_images/q/580/P1011814__52385__20301.jpg', 'Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (922, 'https://www.toynamishop.com/product_images/g/268/P1011811__15034__48898.jpg', 'Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (922, 'https://www.toynamishop.com/product_images/h/997/P1011819__16943__21443.jpg', 'Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (922, 'https://www.toynamishop.com/product_images/f/657/P1011812__44985__97876.jpg', 'Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (922, 'https://www.toynamishop.com/product_images/z/918/P1011815__61247__65305.jpg', 'Macross Calibre Wings Max & Miriya 1:72 VF-1J Fighter Valkyrie Gift Set', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (923, 'https://www.toynamishop.com/product_images/e/463/skelanimal_DotD_mini_plush_jae_01__86611__99741.jpg', 'Skelanimals Day of the Dead Jae (Wolf) Mini Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (924, 'https://www.toynamishop.com/product_images/m/570/Phantom-Team-A__55592__88869.jpg', 'Acid Rain Phantom Team A - [Mirage + Eclipse]', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (924, 'https://www.toynamishop.com/product_images/k/941/IMG_0001__63115__49788.JPG', 'Acid Rain Phantom Team A - [Mirage + Eclipse]', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (924, 'https://www.toynamishop.com/product_images/u/292/IMG_0002__41085__71303.JPG', 'Acid Rain Phantom Team A - [Mirage + Eclipse]', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (924, 'https://www.toynamishop.com/product_images/k/938/IMG_0003__50833__47621.JPG', 'Acid Rain Phantom Team A - [Mirage + Eclipse]', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (924, 'https://www.toynamishop.com/product_images/g/048/IMG_0020__73783__73746.JPG', 'Acid Rain Phantom Team A - [Mirage + Eclipse]', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (925, 'https://www.toynamishop.com/product_images/v/597/voltron_40th_anniversary_18__18028__57272.jpg', 'Voltron 40th Anniversary Collector''''s Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (925, 'https://www.toynamishop.com/product_images/v/061/voltron_40th_anniversary_19__69666__73340.jpg', 'Voltron 40th Anniversary Collector''''s Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (925, 'https://www.toynamishop.com/product_images/o/212/voltron_40th_anniversary_20__51761__13869.jpg', 'Voltron 40th Anniversary Collector''''s Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (925, 'https://www.toynamishop.com/product_images/j/725/voltron_40th_anniversary_07__33112__70363.jpg', 'Voltron 40th Anniversary Collector''''s Set', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (925, 'https://www.toynamishop.com/product_images/y/454/voltron_40th_anniversary_06__56863__85204.jpg', 'Voltron 40th Anniversary Collector''''s Set', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (925, 'https://www.toynamishop.com/product_images/b/506/voltron_40th_anniversary_22__88122__38267.jpg', 'Voltron 40th Anniversary Collector''''s Set', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (925, 'https://www.toynamishop.com/product_images/r/373/voltron_40th_anniversary_23__76514__64085.jpg', 'Voltron 40th Anniversary Collector''''s Set', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (925, 'https://www.toynamishop.com/product_images/e/033/voltron_40th_anniversary_21__64645__50461.jpg', 'Voltron 40th Anniversary Collector''''s Set', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (926, 'https://www.toynamishop.com/product_images/m/893/MIK-05-order-1__26289__44112.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K05 Rainbow Yume', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (926, 'https://www.toynamishop.com/product_images/y/472/MIK-05-order-4__16738__27061.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K05 Rainbow Yume', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (926, 'https://www.toynamishop.com/product_images/h/294/MIK-05-order-3__31845__32512.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K05 Rainbow Yume', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (927, 'https://www.toynamishop.com/product_images/x/101/micronian_ben_dixon_battloid_01__46483__16642.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - BEN DIXON VOLUME 2', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (927, 'https://www.toynamishop.com/product_images/l/840/micronian_ben_dixon_fighter_01__70389__04653.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - BEN DIXON VOLUME 2', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (927, 'https://www.toynamishop.com/product_images/u/711/micronian_ben_dixon_guardian_01__10520__93052.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - BEN DIXON VOLUME 2', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (927, 'https://www.toynamishop.com/product_images/i/900/ROBOTECH_MICRONIAN-PILOTS_VOL2_BEN-DIXON-1__94517__71691.jpg', 'Robotech VF-1 Transformable Veritech Fighter with Micronian Pilot - BEN DIXON VOLUME 2', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (928, 'https://www.toynamishop.com/product_images/v/906/Amy_x_My_Melody__90406__72821.jpg', 'Amy x My Melody 10 inch Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (928, 'https://www.toynamishop.com/product_images/a/655/11064193_av1__57577__38640.jpg', 'Amy x My Melody 10 inch Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (929, 'https://www.toynamishop.com/product_images/j/854/Robotech_Shogun-Warriors_VF-1S__66994__67763.jpg', 'Robotech Roy Fokker''''s Shogun Warrior VF-1S', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (929, 'https://www.toynamishop.com/product_images/x/758/Robotech_Shogun-Warriors_VF-1S_01__16011__86941.jpg', 'Robotech Roy Fokker''''s Shogun Warrior VF-1S', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (929, 'https://www.toynamishop.com/product_images/x/573/Robotech_Shogun-Warriors_VF-1S_03__49088__75357.jpg', 'Robotech Roy Fokker''''s Shogun Warrior VF-1S', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (930, 'https://www.toynamishop.com/product_images/t/509/bucks1__70933__11376.jpg', 'B2Five Bucks Team Trooper Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (930, 'https://www.toynamishop.com/product_images/o/071/bucks2__22633__50614.jpg', 'B2Five Bucks Team Trooper Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (930, 'https://www.toynamishop.com/product_images/k/064/bucks3__40013__98065.jpg', 'B2Five Bucks Team Trooper Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (930, 'https://www.toynamishop.com/product_images/b/602/bucks9__41786__06868.jpg', 'B2Five Bucks Team Trooper Set', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (930, 'https://www.toynamishop.com/product_images/t/716/bucks10__21362__86522.jpg', 'B2Five Bucks Team Trooper Set', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (930, 'https://www.toynamishop.com/product_images/k/884/bucks7__69734__61700.jpg', 'B2Five Bucks Team Trooper Set', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (931, 'https://www.toynamishop.com/product_images/z/753/macross_max_vf-1j_valkyrie__74864__36162.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Max Jenius Valkyrie', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (931, 'https://www.toynamishop.com/product_images/c/234/vf-1j_max_battroid_01__34362__81898.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Max Jenius Valkyrie', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (931, 'https://www.toynamishop.com/product_images/d/496/vf-1j_max_gerwalk_01__77897__78457.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Max Jenius Valkyrie', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (931, 'https://www.toynamishop.com/product_images/t/331/vf-1j_max_valkyrie_01__77473__63787.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Max Jenius Valkyrie', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (931, 'https://www.toynamishop.com/product_images/z/056/vf-1j_max_battroid_02__11250__44843.jpg', 'Macross Saga: Retro Transformable 1/100 VF-1J Max Jenius Valkyrie', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (932, 'https://www.toynamishop.com/product_images/b/451/skelanimal_pvc_series_3_092810_08__24729__32417.jpg', 'Skelanimals Series 3 Vinyl Figure Set of 3', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (932, 'https://www.toynamishop.com/product_images/t/361/skelanimal_pvc_figurines_series_3__41084__32140.jpg', 'Skelanimals Series 3 Vinyl Figure Set of 3', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (933, 'https://www.toynamishop.com/product_images/i/397/Little_Glowing_Embers__39512__57013.jpg', 'Little Glowing Embers Blind Box Figurine', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (934, 'https://www.toynamishop.com/product_images/x/542/skelanimal_DotD_mini_plush_jack_01__36701__10348.jpg', 'Skelanimals Day of the Dead Jack (Rabbit) Mini Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (935, 'https://www.toynamishop.com/product_images/q/974/macross_VF-1S_t-shirt__24885__44400.jpg', 'Macross VF-1S Skull Squad Shirt', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (935, 'https://www.toynamishop.com/product_images/b/599/robotech_T-Shirts_2022-02__20629__61001.jpg', 'Macross VF-1S Skull Squad Shirt', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (935, 'https://www.toynamishop.com/product_images/o/477/Screenshot_62__29131__10611.png', 'Macross VF-1S Skull Squad Shirt', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (935, 'https://www.toynamishop.com/product_images/j/536/Screenshot_63__20072__93007.png', 'Macross VF-1S Skull Squad Shirt', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (936, 'https://www.toynamishop.com/product_images/p/903/Skelanimals_backpack_kit_deluxe_encore__03296__18468.jpg', 'Skelanimals Deluxe Backpack Kit (Cat)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (937, 'https://www.toynamishop.com/product_images/w/092/Knuckles_x_Badtz_Maru__79563__89654.jpg', 'Knuckles x Badtz-Maru 10 inch Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (937, 'https://www.toynamishop.com/product_images/r/904/11064191_av1__63931__88048.jpg', 'Knuckles x Badtz-Maru 10 inch Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (938, 'https://www.toynamishop.com/product_images/z/818/skelanimals_dc_heroes_dark_knight_exclusive02__29158__83118.jpg', 'SDCC 2012 Exclusive: DC Comics x Skelanimals The Dark Knight Rises Batman Jae Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (938, 'https://www.toynamishop.com/product_images/z/900/skelanimals_dc_heroes_dark_knight_exclusive01__41350__42487.jpg', 'SDCC 2012 Exclusive: DC Comics x Skelanimals The Dark Knight Rises Batman Jae Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (939, 'https://www.toynamishop.com/product_images/o/155/283462469_171315495331691_4609032428240053035_n__94300__58541.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K06 Boss K', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (939, 'https://www.toynamishop.com/product_images/c/397/281869831_171315505331690_6491266588225028275_n__16823__93998.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K06 Boss K', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (939, 'https://www.toynamishop.com/product_images/p/261/283304236_171315515331689_4046402623354121850_n__28552__00075.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K06 Boss K', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (940, 'https://www.toynamishop.com/product_images/k/175/ALL___42949__77661.jpg', 'B2Five Abaddon Trooper Set', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (940, 'https://www.toynamishop.com/product_images/v/549/1__19277__83743.jpg', 'B2Five Abaddon Trooper Set', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (940, 'https://www.toynamishop.com/product_images/p/069/9__76030__76347.jpg', 'B2Five Abaddon Trooper Set', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (940, 'https://www.toynamishop.com/product_images/f/346/5__40195__47375.jpg', 'B2Five Abaddon Trooper Set', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (940, 'https://www.toynamishop.com/product_images/p/354/7__12441__91642.jpg', 'B2Five Abaddon Trooper Set', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (941, 'https://www.toynamishop.com/product_images/s/617/emily_bendy_figure_01__98707__59345.jpg', 'Emily the Strange 6" Bendy Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (941, 'https://www.toynamishop.com/product_images/b/255/emily_bendy_figure_02__87763__56449.jpg', 'Emily the Strange 6" Bendy Figure', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (941, 'https://www.toynamishop.com/product_images/b/990/emily_bendy_figure_04__69395__88774.jpg', 'Emily the Strange 6" Bendy Figure', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (941, 'https://www.toynamishop.com/product_images/t/092/emily_bendy_figure_03__02496__95839.jpg', 'Emily the Strange 6" Bendy Figure', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (941, 'https://www.toynamishop.com/product_images/e/755/emily_bendy_figure_05__93270__94564.jpg', 'Emily the Strange 6" Bendy Figure', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (942, 'https://www.toynamishop.com/product_images/x/200/Phantom-Team-B__96125__73882.jpg', 'Acid Rain Phantom Team B - [Parhelion + Aurora]', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (942, 'https://www.toynamishop.com/product_images/s/226/IMG_0052__22775__15056.JPG', 'Acid Rain Phantom Team B - [Parhelion + Aurora]', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (942, 'https://www.toynamishop.com/product_images/f/849/IMG_0044__48090__04629.JPG', 'Acid Rain Phantom Team B - [Parhelion + Aurora]', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (942, 'https://www.toynamishop.com/product_images/q/062/IMG_0035__70466__46669.JPG', 'Acid Rain Phantom Team B - [Parhelion + Aurora]', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (942, 'https://www.toynamishop.com/product_images/k/959/IMG_0051__99112__90650.JPG', 'Acid Rain Phantom Team B - [Parhelion + Aurora]', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (943, 'https://www.toynamishop.com/product_images/h/525/skelanimal_vinyl_series2_maxx__11034__66934.jpg', 'Skelanimals Maxx the Bulldog Vinyl Figure', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (944, 'https://www.toynamishop.com/product_images/a/783/Tails_x_Chococat__01332__43681.jpg', 'Tails x Chococat 10 inch Deluxe Plush', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (944, 'https://www.toynamishop.com/product_images/z/710/11064195_av1__69053__38532.jpg', 'Tails x Chococat 10 inch Deluxe Plush', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (945, 'https://www.toynamishop.com/product_images/a/186/naruto-4-inch__08__44513__81433.jpg', 'Naruto Shippuden Poseable Action Figure - Naruto', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (945, 'https://www.toynamishop.com/product_images/l/933/naruto-4-inch_02__16731__36558.jpg', 'Naruto Shippuden Poseable Action Figure - Naruto', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (945, 'https://www.toynamishop.com/product_images/t/503/naruto-4-inch_03__96929__01196.jpg', 'Naruto Shippuden Poseable Action Figure - Naruto', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (945, 'https://www.toynamishop.com/product_images/j/805/shippuden_4-inch-figures_series1_0045__48474__63645.jpg', 'Naruto Shippuden Poseable Action Figure - Naruto', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (945, 'https://www.toynamishop.com/product_images/d/674/shippuden_4-inch-figures_series1_0046__27163__06592.jpg', 'Naruto Shippuden Poseable Action Figure - Naruto', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (945, 'https://www.toynamishop.com/product_images/x/519/shippuden_4-inch-figures_series1_0048__84735__17430.jpg', 'Naruto Shippuden Poseable Action Figure - Naruto', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (946, 'https://www.toynamishop.com/product_images/g/412/283755790_171315341998373_3594315868801986188_n__93451__14302.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07A Monster Child', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (946, 'https://www.toynamishop.com/product_images/z/128/281766779_171315365331704_5355448836561394613_n__57547__98523.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07A Monster Child', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (946, 'https://www.toynamishop.com/product_images/w/184/283246888_171315318665042_4205698843941398574_n__83500__85341.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07A Monster Child', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (947, 'https://www.toynamishop.com/product_images/o/742/cyclone_t-shirt__57647__09693.jpg', 'Mospeada Cyclone Ride Armor Shirt', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (947, 'https://www.toynamishop.com/product_images/k/147/robotech_T-Shirts_2022-05__50080__16555.jpg', 'Mospeada Cyclone Ride Armor Shirt', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (947, 'https://www.toynamishop.com/product_images/k/552/Screenshot_62__80801__57235.png', 'Mospeada Cyclone Ride Armor Shirt', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (947, 'https://www.toynamishop.com/product_images/e/683/Screenshot_63__22912__69369.png', 'Mospeada Cyclone Ride Armor Shirt', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (948, 'https://www.toynamishop.com/product_images/g/499/robotech_shogun-warriors_VF-1J_01__68917__32619.jpg', 'Robotech Rick Hunter''''s Shogun Warrior VF-1J', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (948, 'https://www.toynamishop.com/product_images/y/992/robotech_shogun-warriors_VF-1J_02__91925__51599.jpg', 'Robotech Rick Hunter''''s Shogun Warrior VF-1J', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (948, 'https://www.toynamishop.com/product_images/x/192/robotech_shogun-warriors_VF-1J_03__53432__57389.jpg', 'Robotech Rick Hunter''''s Shogun Warrior VF-1J', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (948, 'https://www.toynamishop.com/product_images/z/946/robotech_shogun-warriors_VF-1J__83414__84892.jpg', 'Robotech Rick Hunter''''s Shogun Warrior VF-1J', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (949, 'https://www.toynamishop.com/product_images/x/226/macross_gbp-1_vf-1s-valkyrie__10152__88897.jpg', '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (949, 'https://www.toynamishop.com/product_images/e/284/macross_gbp-1_vf-1s-battroid__71213__75039.jpg', '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (949, 'https://www.toynamishop.com/product_images/m/516/macross_gbp-1_vf-1s-battroid3__51349__89989.jpg', '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (949, 'https://www.toynamishop.com/product_images/h/270/macross_gbp-1_vf-1s-fighter__21265__70212.jpg', '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (949, 'https://www.toynamishop.com/product_images/c/683/macross_gbp-1_vf-1s-gerwalk__54998__35200.jpg', '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (949, 'https://www.toynamishop.com/product_images/x/667/Macross_VF-1S_Armored_Valkyrie_GBP-1S__34065__22314.jpg', '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (949, 'https://www.toynamishop.com/product_images/d/091/macross_gbp-1_vf-1s-package__58280__86608.jpg', '1/100 Scale Transformable Macross VF-1S Armored Valkyrie GBP-1S - 2019 Convention Exclusive', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (950, 'https://www.toynamishop.com/product_images/n/378/BW1_01__29431__05249.jpg', 'B2Five R711 Speeder MK1R', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (950, 'https://www.toynamishop.com/product_images/i/851/DSC_0015__04259__87656.jpg', 'B2Five R711 Speeder MK1R', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (950, 'https://www.toynamishop.com/product_images/r/749/DSC_0021__57144__05505.jpg', 'B2Five R711 Speeder MK1R', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (951, 'https://www.toynamishop.com/product_images/d/478/283112892_171314148665159_7613725488676118031_n__73766__71069.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07B Monster Child', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (951, 'https://www.toynamishop.com/product_images/d/852/282383999_171314108665163_1624826331944760417_n__07603__90201.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07B Monster Child', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (951, 'https://www.toynamishop.com/product_images/q/143/281854233_171314118665162_864120373636970174_n__25425__37214.jpg', 'Toy''''s Alliance MILLINILLIONS MI-K07B Monster Child', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (952, 'https://www.toynamishop.com/product_images/v/865/product_235__32289__13309.jpg', 'Tulipop Vinyl Keychain - Bubble', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (952, 'https://www.toynamishop.com/product_images/c/242/product_236__27359__86434.jpg', 'Tulipop Vinyl Keychain - Bubble', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/d/208/DSC_0759_final__25466__41490.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/y/932/Aviator_Flight_Jacket__98258__09488.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/e/325/DSC_0822_final__61931__72513.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/y/750/DSC_0814_final__32580__91258.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/f/959/DSC_0762_final__95311__94304.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/r/870/DSC_0765_final__77151__79359.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/j/016/DSC_0766_final__97093__98062.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/t/739/DSC_0827_final__20513__65002.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (953, 'https://www.toynamishop.com/product_images/h/043/DSC_0768_final__70510__31314.jpg', 'Robotech X eepmon - VF-1S Skull Leader Aviator Flight Jacket', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (954, 'https://www.toynamishop.com/product_images/j/505/DSC_0035__81377__70165.jpg', 'B2Five K6 Jungle Soldiers', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (954, 'https://www.toynamishop.com/product_images/i/190/DSC_0030__83901__61356.jpg', 'B2Five K6 Jungle Soldiers', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (954, 'https://www.toynamishop.com/product_images/m/058/DSC_0040__80468__95574.jpg', 'B2Five K6 Jungle Soldiers', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (954, 'https://www.toynamishop.com/product_images/n/193/DSC_0045__08048__39135.jpg', 'B2Five K6 Jungle Soldiers', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (954, 'https://www.toynamishop.com/product_images/m/327/DSC_0042__85766__69366.jpg', 'B2Five K6 Jungle Soldiers', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (955, 'https://www.toynamishop.com/product_images/q/380/kakashi-4-inch_03__02365__12416.jpg', 'Naruto Shippuden Poseable Action Figure - Kakashi', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (955, 'https://www.toynamishop.com/product_images/v/305/kakashi-4-inch_12__34252__90403.jpg', 'Naruto Shippuden Poseable Action Figure - Kakashi', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (955, 'https://www.toynamishop.com/product_images/z/867/kakashi-4-inch_08__42658__98216.jpg', 'Naruto Shippuden Poseable Action Figure - Kakashi', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (955, 'https://www.toynamishop.com/product_images/w/851/kakashi-4-inch_09__05321__79432.jpg', 'Naruto Shippuden Poseable Action Figure - Kakashi', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (955, 'https://www.toynamishop.com/product_images/y/329/shippuden_4-inch-figures_series1_0050__75115__28213.jpg', 'Naruto Shippuden Poseable Action Figure - Kakashi', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (955, 'https://www.toynamishop.com/product_images/t/782/shippuden_4-inch-figures_series1_0053__79113__02975.jpg', 'Naruto Shippuden Poseable Action Figure - Kakashi', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (955, 'https://www.toynamishop.com/product_images/k/553/shippuden_4-inch-figures_series1_0052__95803__89158.jpg', 'Naruto Shippuden Poseable Action Figure - Kakashi', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/z/063/naruto_six_paths_bust_01__57158__29259.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/r/596/naruto_six_paths_bust_07__51787__99831.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/h/723/naruto_six_paths_bust_09__28356__90260.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/m/964/naruto_six_paths_bust_05__52367__26866.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/o/057/naruto_six_paths_bust_08__99373__22779.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/t/396/naruto_six_paths_bust_04__99540__77143.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/z/484/naruto_six_paths_bust_02__21963__99471.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/q/462/naruto_six_paths_bust_06__79368__95587.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/i/130/naruto_six_paths_bust_03__41125__28559.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (956, 'https://www.toynamishop.com/product_images/x/340/naruto_six_paths_bust_02_pq__99257__98161.jpg', 'Naruto Six Paths Sage Mode 1:1 Bust (FINAL PAYMENT ONLY)', false, 11);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (957, 'https://www.toynamishop.com/product_images/j/591/Bleach_series_2_Toshiro_1__58469__79294.jpg', 'Deluxe 6" PVC Statue: Toshiro', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (957, 'https://www.toynamishop.com/product_images/s/075/Bleach_series_2_Toshiro_2__80912__53042.jpg', 'Deluxe 6" PVC Statue: Toshiro', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (957, 'https://www.toynamishop.com/product_images/l/261/BLEACH_collection-2_renji-and-toshiro__04930__13020.jpg', 'Deluxe 6" PVC Statue: Toshiro', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (958, 'https://www.toynamishop.com/product_images/w/955/SDCC2025_robotech_skull_cyclone_01__36218.jpg', 'Admiral Hunter''''s Exclusive VR-052F Cyclone', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (958, 'https://www.toynamishop.com/product_images/g/963/SDCC2025_robotech_skull_cyclone_02__91192.jpg', 'Admiral Hunter''''s Exclusive VR-052F Cyclone', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (959, 'https://www.toynamishop.com/product_images/z/258/SDCC2025_robotech_vf1j_morpher_01__25005.jpg', '40th Anniversary Super Veritech Morpher - Rick Hunter VF1J Edition', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (959, 'https://www.toynamishop.com/product_images/a/415/SDCC2025_robotech_vf1j_morpher_02__59435.jpg', '40th Anniversary Super Veritech Morpher - Rick Hunter VF1J Edition', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (960, 'https://www.toynamishop.com/product_images/w/153/SDCC2025_robotech_CYCLONE_40TH__t-shirt__65750.jpg', 'Robotech Skull Cyclone Shirt 2025 SDCC Exclusive', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (960, 'https://www.toynamishop.com/product_images/k/091/Screenshot_62__61127__20264.1750464106.1280.1280__34677.png', 'Robotech Skull Cyclone Shirt 2025 SDCC Exclusive', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (960, 'https://www.toynamishop.com/product_images/a/262/Screenshot_63__68468__55352.1750464106.1280.1280__05366.png', 'Robotech Skull Cyclone Shirt 2025 SDCC Exclusive', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/y/865/ALPHA_FIGHTER_official_photo_US_A1__62980.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 2);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/z/015/10_ALPHA_FIGHTER_official_photo_US_I1__83069.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 3);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/w/036/ALPHA_FIGHTER_official_photo_US_A2__01200.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 4);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/i/563/ALPHA_FIGHTER_official_photo_US_A3__59087.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 5);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/h/673/ALPHA_FIGHTER_official_photo_US_D1__27471.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 6);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/y/541/ALPHA_FIGHTER_official_photo_US_F2__35152.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 7);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/e/933/ALPHA_FIGHTER_official_photo_US_D5__38922.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 8);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/y/535/09_ALPHA_FIGHTER_official_photo_US_F3__90775.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 9);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/t/575/01_ALPHA_FIGHTER_official_photo_US_G1__89442.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 10);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/n/523/08_ALPHA_FIGHTER_official_photo_US_F1__29964.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 11);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/b/564/02_ALPHA_FIGHTER_official_photo_US_G2__29856.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 12);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/m/281/03_ALPHA_FIGHTER_official_photo_US_G3__24029.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 13);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/n/227/05_ALPHA_FIGHTER_official_photo_US_G5__38408.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 14);
INSERT INTO product_images (product_id, image_filename, alt_text, is_primary, position)
VALUES (961, 'https://www.toynamishop.com/product_images/r/673/04_ALPHA_FIGHTER_official_photo_US_G4__63131.jpg', 'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter', false, 15);

-- ======================================
-- 🔗 Link Brand IDs
-- ======================================
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 705;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 706;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 707;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 708;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 709;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 712;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 713;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 717;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 721;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 722;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 723;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 724;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 725;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 728;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 730;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 731;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 733;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 736;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 737;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 739;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 740;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 742;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 744;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 745;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 746;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 747;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 749;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 750;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 752;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 754;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 755;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 757;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 758;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 765;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 766;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 768;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Emily the Strange')))
WHERE id = 769;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 770;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 772;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 773;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 774;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 775;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 779;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 780;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 781;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 782;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Voltron')))
WHERE id = 783;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 785;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Voltron')))
WHERE id = 786;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 787;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 788;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 789;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 791;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 794;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 796;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 797;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 798;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 799;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 803;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 808;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 810;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 812;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 813;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 818;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Voltron')))
WHERE id = 819;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 822;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 823;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 824;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 826;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 827;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 828;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 829;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 832;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 833;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 835;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Voltron')))
WHERE id = 836;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 837;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 838;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 842;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 843;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 844;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 846;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 847;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 849;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 850;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 851;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 852;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Voltron')))
WHERE id = 854;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Voltron')))
WHERE id = 858;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 859;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 861;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 862;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 863;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 865;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 867;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 869;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 873;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 874;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 877;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 878;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 880;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Voltron')))
WHERE id = 883;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 885;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 886;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 888;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 893;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 894;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 895;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 897;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 899;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 902;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 905;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 906;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 907;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World B2FIVE')))
WHERE id = 908;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Futurama')))
WHERE id = 909;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Skelanimals')))
WHERE id = 910;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 911;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 912;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 913;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('MILLINILLIONS')))
WHERE id = 914;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Sanrio')))
WHERE id = 915;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 916;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Skelanimals')))
WHERE id = 917;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 918;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 919;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 920;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World B2FIVE')))
WHERE id = 921;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 922;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Skelanimals')))
WHERE id = 923;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 924;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Voltron')))
WHERE id = 925;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('MILLINILLIONS')))
WHERE id = 926;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 927;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Sanrio')))
WHERE id = 928;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 929;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World B2FIVE')))
WHERE id = 930;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 931;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Skelanimals')))
WHERE id = 932;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Miyo''s Mystic Musings')))
WHERE id = 933;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Skelanimals')))
WHERE id = 934;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 935;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Skelanimals')))
WHERE id = 936;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Sanrio')))
WHERE id = 937;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Skelanimals')))
WHERE id = 938;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('MILLINILLIONS')))
WHERE id = 939;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World B2FIVE')))
WHERE id = 940;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Emily the Strange')))
WHERE id = 941;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World')))
WHERE id = 942;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Skelanimals')))
WHERE id = 943;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Sanrio')))
WHERE id = 944;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 945;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('MILLINILLIONS')))
WHERE id = 946;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Mospeada')))
WHERE id = 947;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 948;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Macross')))
WHERE id = 949;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World B2FIVE')))
WHERE id = 950;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('MILLINILLIONS')))
WHERE id = 951;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Tulipop')))
WHERE id = 952;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 953;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Acid Rain World B2FIVE')))
WHERE id = 954;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 955;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 956;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Naruto')))
WHERE id = 957;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 958;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 959;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 960;
UPDATE products 
SET brand_id = (SELECT id FROM brands WHERE LOWER(TRIM(name)) = LOWER(TRIM('Robotech')))
WHERE id = 961;

-- ======================================
-- 📄 Pages (CMS Content)
-- ======================================
INSERT INTO pages (slug, title, content, meta_description, is_active, show_in_footer, sort_order) VALUES
    ('about', 'About Us', '<h2>About Toynami</h2><p>Toynami is a leading designer, manufacturer, and distributor of collectibles and toys based on popular licenses from film, television, animation, and video games.</p><p>Since 2000, we have been creating premium collectibles that celebrate the characters and stories fans love.</p>', 'Learn about Toynami - premium collectibles and toys since 2000', true, true, 1),
    ('contact', 'Contact Us', '<h2>Contact Information</h2><p>Have questions? We''re here to help\!</p><ul><li>Email: support@toynami.com</li><li>Phone: 1-800-TOYNAMI</li><li>Hours: Monday-Friday 9AM-5PM PST</li></ul>', 'Contact Toynami for customer support and inquiries', true, true, 2),
    ('shipping', 'Shipping & Returns', '<h2>Shipping Information</h2><p>We offer worldwide shipping on all products.</p><h3>Domestic Shipping</h3><ul><li>Standard (5-7 business days): $5.99</li><li>Express (2-3 business days): $12.99</li><li>Free shipping on orders over $75</li></ul><h3>Returns</h3><p>30-day return policy on unopened items.</p>', 'Shipping and return policy for Toynami products', true, true, 3),
    ('privacy', 'Privacy Policy', '<h2>Privacy Policy</h2><p>Your privacy is important to us. This policy describes how we collect and use your information.</p>', 'Privacy policy for Toynami online store', true, true, 4),
    ('terms', 'Terms of Service', '<h2>Terms of Service</h2><p>By using our website, you agree to these terms.</p>', 'Terms of service for Toynami online store', true, true, 5);

-- ======================================
-- 🗂️ Menus
-- ======================================
INSERT INTO menus (name, location, is_active) VALUES
    ('Main Navigation', 'header', true),
    ('Footer Links', 'footer', true),
    ('Mobile Menu', 'mobile', true);

-- ======================================
-- 🔗 Menu Items - Header Navigation
-- ======================================
-- Get menu IDs
DO $$
DECLARE
    header_menu_id UUID;
    footer_menu_id UUID;
    mobile_menu_id UUID;
    all_products_cat_id UUID;
    brands_cat_id UUID;
    on_sale_cat_id UUID;
    convention_cat_id UUID;
    new_products_cat_id UUID;
    archive_cat_id UUID;
    announcements_cat_id UUID;
    about_page_id UUID;
    contact_page_id UUID;
    shipping_page_id UUID;
    privacy_page_id UUID;
    terms_page_id UUID;
BEGIN
    -- Get menu IDs
    SELECT id INTO header_menu_id FROM menus WHERE location = 'header';
    SELECT id INTO footer_menu_id FROM menus WHERE location = 'footer';
    SELECT id INTO mobile_menu_id FROM menus WHERE location = 'mobile';
    
    -- Get category IDs
    SELECT id INTO all_products_cat_id FROM categories WHERE slug = 'products';
    SELECT id INTO brands_cat_id FROM categories WHERE slug = 'brands';
    SELECT id INTO on_sale_cat_id FROM categories WHERE slug = 'on-sale';
    SELECT id INTO convention_cat_id FROM categories WHERE slug = 'convention-exclusives';
    SELECT id INTO new_products_cat_id FROM categories WHERE slug = 'new-products';
    SELECT id INTO archive_cat_id FROM categories WHERE slug = 'the-archive';
    SELECT id INTO announcements_cat_id FROM categories WHERE slug = 'announcements';
    
    -- Get page IDs
    SELECT id INTO about_page_id FROM pages WHERE slug = 'about';
    SELECT id INTO contact_page_id FROM pages WHERE slug = 'contact';
    SELECT id INTO shipping_page_id FROM pages WHERE slug = 'shipping';
    SELECT id INTO privacy_page_id FROM pages WHERE slug = 'privacy';
    SELECT id INTO terms_page_id FROM pages WHERE slug = 'terms';
    
    -- Header Menu Items (matching the navigation we created)
    INSERT INTO menu_items (menu_id, title, url, type, target_id, target_slug, sort_order, is_active) VALUES
        (header_menu_id, 'ALL PRODUCTS', '/products', 'custom', NULL, NULL, 1, true),
        (header_menu_id, 'BRANDS', '/brands', 'category', brands_cat_id, 'brands', 2, true),
        (header_menu_id, 'ON SALE', '/on-sale', 'category', on_sale_cat_id, 'on-sale', 3, true),
        (header_menu_id, 'CONVENTION EXCLUSIVES', '/convention-exclusives', 'category', convention_cat_id, 'convention-exclusives', 4, true),
        (header_menu_id, 'NEW PRODUCTS', '/new-products', 'category', new_products_cat_id, 'new-products', 5, true),
        (header_menu_id, 'THE ARCHIVE', '/the-archive', 'category', archive_cat_id, 'the-archive', 6, true),
        (header_menu_id, 'ANNOUNCEMENTS', '/announcements', 'category', announcements_cat_id, 'announcements', 7, true);
    
    -- Footer Menu Items
    INSERT INTO menu_items (menu_id, title, url, type, target_id, target_slug, sort_order, is_active) VALUES
        (footer_menu_id, 'About Us', '/about', 'page', about_page_id, 'about', 1, true),
        (footer_menu_id, 'Contact Us', '/contact', 'page', contact_page_id, 'contact', 2, true),
        (footer_menu_id, 'Shipping & Returns', '/shipping', 'page', shipping_page_id, 'shipping', 3, true),
        (footer_menu_id, 'Privacy Policy', '/privacy', 'page', privacy_page_id, 'privacy', 4, true),
        (footer_menu_id, 'Terms of Service', '/terms', 'page', terms_page_id, 'terms', 5, true);
    
    -- Mobile Menu Items (same as header)
    INSERT INTO menu_items (menu_id, title, url, type, target_id, target_slug, sort_order, is_active) VALUES
        (mobile_menu_id, 'ALL PRODUCTS', '/products', 'custom', NULL, NULL, 1, true),
        (mobile_menu_id, 'BRANDS', '/brands', 'category', brands_cat_id, 'brands', 2, true),
        (mobile_menu_id, 'ON SALE', '/on-sale', 'category', on_sale_cat_id, 'on-sale', 3, true),
        (mobile_menu_id, 'CONVENTION EXCLUSIVES', '/convention-exclusives', 'category', convention_cat_id, 'convention-exclusives', 4, true),
        (mobile_menu_id, 'NEW PRODUCTS', '/new-products', 'category', new_products_cat_id, 'new-products', 5, true),
        (mobile_menu_id, 'THE ARCHIVE', '/the-archive', 'category', archive_cat_id, 'the-archive', 6, true),
        (mobile_menu_id, 'ANNOUNCEMENTS', '/announcements', 'category', announcements_cat_id, 'announcements', 7, true);
END $$;
-- ======================================
-- 📰 Blog Posts / Announcements
-- ======================================

INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, status, published_at, featured, meta_title, meta_description, tags) VALUES
(
    'rick-hunters-vf-1j-shogun-warriors-24-inch',
    'RICK HUNTER''S VF-1J LIMITED EDITION SHOGUN WARRIORS ROBOTECH 24" RETRO FIGURE',
    'Your favorite Robotech veritech now comes in a Jumbo format. Inspired by the classic Shogun Warriors of the 1970s.',
    'RICK HUNTER''S VF-1J LIMITED EDITION SHOGUN WARRIORS ROBOTECH 24" RETRO FIGURE Your favorite Robotech veritech now comes in a Jumbo format. Inspired by the classic Shogun Warriors toys of the 1970s, this massive figure stands at an impressive 24 inches tall and features spring-loaded missiles and classic retro styling.',
    'blog_images/robotech-blog-2.png',
    'published',
    '2025-06-21',
    true,
    'Rick Hunter VF-1J 24" Shogun Warriors Figure | Toynami',
    'Limited edition 24-inch Robotech VF-1J Shogun Warriors retro figure. Pre-order now!',
    ARRAY['robotech', 'shogun-warriors', 'vf-1j', 'rick-hunter', 'limited-edition']
),
(
    'rick-hunters-vf-1j-shogun-warriors-announcement',
    'RICK HUNTER''S VF-1J LIMITED EDITION SHOGUN WARRIORS ROBOTECH 24" RETRO FIGURE',
    'Your favorite Robotech veritech now comes in a Jumbo format. Inspired by the classic Shogun Warriors of the 1970s.',
    'RICK HUNTER''S VF-1J LIMITED EDITION SHOGUN WARRIORS ROBOTECH 24" RETRO FIGURE Your favorite Robotech veritech now comes in a Jumbo format. Inspired by the classic Shogun Warriors toys of the 1970s, this massive figure stands at an impressive 24 inches tall and features spring-loaded missiles and classic retro styling.',
    'blog_images/robotech-blog-3.png',
    'published',
    '2025-06-21',
    true,
    'Rick Hunter VF-1J Shogun Warriors Announcement | Toynami',
    'Announcing the limited edition 24-inch Robotech VF-1J Shogun Warriors retro figure.',
    ARRAY['robotech', 'shogun-warriors', 'vf-1j', 'rick-hunter', 'announcement']
),
(
    'new-generation-yr-052f-transformable-cyclone',
    'The New Generation YR-052F Transformable Cyclone',
    'These highly detailed Cyclones are made from die-cast metal, POM, and plastic injection parts, weighing over 1.5 kg in Battle Armor Mode.',
    'These highly detailed Cyclones are made from die-cast metal, POM, and plastic injection parts, weighing over 1.5 kg in Battle Armor Mode and 2.4 kg with the base and accessories included. Each Cyclone features full transformation capabilities, allowing you to switch between motorcycle and battle armor modes with incredible accuracy to the anime source material.',
    'blog_images/robotech-blog-1.png',
    'published',
    '2025-06-21',
    true,
    'New Generation YR-052F Transformable Cyclone | Toynami',
    'Premium die-cast transformable Cyclone from Robotech New Generation. Over 1.5kg of detailed engineering.',
    ARRAY['robotech', 'cyclone', 'new-generation', 'die-cast', 'transformable']
),
(
    'voltron-defender-of-the-universe-40th-anniversary',
    'VOLTRON: DEFENDER OF THE UNIVERSE',
    'This limited-edition collectible will only be produced for the 40th anniversary, consisting of five fully transformable lions.',
    'This limited-edition collectible will only be produced for the 40th anniversary, consisting of five fully transformable lions that unite to form Voltron, Defender of the Universe! Each lion features premium die-cast construction, LED lights, and sound effects. The complete set includes display stands, weapons, and a numbered certificate of authenticity.',
    'blog_images/voltron-blog.png',
    'published',
    '2025-06-21',
    true,
    'Voltron 40th Anniversary Limited Edition | Toynami',
    'Celebrate 40 years of Voltron with this limited edition fully transformable collector set.',
    ARRAY['voltron', '40th-anniversary', 'limited-edition', 'defender-of-the-universe', 'collectible']
);

-- ======================================
-- 🎠 Carousel Slides
-- ======================================

-- Default carousel slide with the Robotech combo pack banner (just image with link, no overlay text)
INSERT INTO carousel_slides (heading, text, button_text, link, image_url, display_order, is_active) VALUES
(
    NULL,
    NULL,
    NULL,
    '/products/robotech-veritech-fighter-transformable-1-100-scale-4-25-pilot-action-figures-set-of-5/',
    '/carousel_images/robotech_combo-pack_1700x490-banner.jpg',
    0,
    true
);

-- ======================================
-- ⚙️ Settings
-- ======================================

-- Social Media Settings with Toynami's actual social media URLs
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('social_facebook', 'https://www.facebook.com/Toynami', 'url', 'social', 'Facebook URL', 'Full URL to your Facebook page', 1, true),
    ('social_twitter', 'https://twitter.com/toynami', 'url', 'social', 'Twitter/X URL', 'Full URL to your Twitter/X profile', 2, true),
    ('social_instagram', 'https://www.instagram.com/toynami/', 'url', 'social', 'Instagram URL', 'Full URL to your Instagram profile', 3, true),
    ('social_linkedin', '', 'url', 'social', 'LinkedIn URL', 'Full URL to your LinkedIn page', 4, true),
    ('social_youtube', 'https://www.youtube.com/@Toynami', 'url', 'social', 'YouTube URL', 'Full URL to your YouTube channel', 5, true),
    ('social_tiktok', '', 'url', 'social', 'TikTok URL', 'Full URL to your TikTok profile', 6, true);

-- General Site Settings
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('site_name', 'Toynami Store', 'text', 'general', 'Site Name', 'The name of your website', 1, true),
    ('site_tagline', 'Premium Collectibles & Toys', 'text', 'general', 'Site Tagline', 'A short tagline for your site', 2, true),
    ('contact_email', 'support@toynami.com', 'text', 'general', 'Contact Email', 'Main contact email address', 3, true),
    ('contact_phone', '1-800-TOYNAMI', 'text', 'general', 'Contact Phone', 'Main contact phone number', 4, true),
    ('contact_address', '15101 Keswick St, Van Nuys, CA 91405', 'text', 'general', 'Contact Address', 'Physical store or office address', 5, true),
    ('footer_copyright', '© 2025 Toynami Inc. All rights reserved.', 'text', 'general', 'Footer Copyright', 'Copyright text in footer', 10, true),
    ('footer_newsletter_title', 'Sign Up For Our Mailing List', 'text', 'general', 'Newsletter Title', 'Newsletter section title in footer', 11, true),
    ('footer_newsletter_text', 'Stay up to date with the latest news and product releases.', 'text', 'general', 'Newsletter Description', 'Newsletter section description', 12, true);

-- SEO Settings
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('seo_title_suffix', ' | Toynami Store', 'text', 'seo', 'Title Suffix', 'Added to the end of all page titles', 1, false),
    ('seo_default_description', 'Shop premium collectibles, action figures, and exclusive toys from your favorite anime, movies, and games at Toynami Store', 'text', 'seo', 'Default Meta Description', 'Default description for pages without custom descriptions', 2, false),
    ('seo_keywords', 'collectibles, toys, action figures, anime, manga, robotech, naruto, voltron, futurama', 'text', 'seo', 'Default Keywords', 'Default keywords for SEO', 3, false);

-- Email/Newsletter Settings (defaults - admin needs to configure)
INSERT INTO settings (key, value, type, category, label, description, sort_order, is_public) VALUES
    ('newsletter_enabled', 'true', 'boolean', 'email', 'Newsletter Enabled', 'Enable newsletter signup', 1, false),
    ('newsletter_provider', 'mailchimp', 'text', 'email', 'Newsletter Provider', 'Email service provider (mailchimp, sendgrid, etc)', 2, false),
    ('newsletter_api_key', '', 'text', 'email', 'Newsletter API Key', 'API key for newsletter service', 3, false),
    ('newsletter_list_id', '', 'text', 'email', 'Newsletter List ID', 'List/Audience ID for newsletter', 4, false);

-- ======================================
-- 🌟 Mark Featured Products
-- ======================================
UPDATE products SET is_featured = true WHERE name IN (
    'Voltron 40th Anniversary Collector''s Set',
    'PRE-ORDER DEPOSIT: Robotech The New Generation Combat Alpha Fighter',
    'Little Glowing Embers Blind Box Figurine',
    'Little Embers Figure Keychain',
    'Little Embers Blind Box Enamel Pin'
);