# 📚 Complete UI Documentation

## Table of Contents
1. [Shop/Public Pages](#shoppublic-pages)
2. [Admin Pages](#admin-pages)
3. [Authentication Pages](#authentication-pages)
4. [Account Pages](#account-pages)

---

## Shop/Public Pages

### Homepage (`/`)
**Description:** Main landing page showcasing featured products, hero carousel, and promotional banners.
**Key Features:** Hero carousel, featured products grid, announcement banners, brand showcase.

### Products Catalog (`/products`)
**Description:** Browse all products with filtering and search capabilities.
**Key Features:** Product grid, category filters, price filters, search bar, pagination.

### Product Detail (`/products/[slug]`)
**Description:** Individual product page with images, details, and purchase options.
**Key Features:** Image gallery, product variants, add to cart, product specifications, related products.

### Category Pages (`/[slug]/page`)
**Description:** Products filtered by specific category.
**Key Features:** Category-specific products, subcategory navigation, category banners.

### Brand Pages (`/brands`)
**Description:** Browse all available brands.
**Key Features:** Brand grid with logos, product counts per brand.

### Brand Products (`/brands/[brand]`)
**Description:** Products from a specific brand.
**Key Features:** Brand header, filtered product grid, brand information.

### Shopping Cart (`/cart`)
**Description:** Review and modify items before checkout.
**Key Features:** Cart items list, quantity adjustment, price calculation, checkout button.

### Checkout (`/checkout`)
**Description:** Complete purchase with shipping and payment details.
**Key Features:** Address forms, shipping options, PayPal integration, order summary.

### Announcements (`/announcements`)
**Description:** Company news and updates.
**Key Features:** Announcement list, featured announcements, date filtering.

### Announcement Detail (`/announcements/[slug]`)
**Description:** Individual announcement or blog post.
**Key Features:** Full content, publish date, related announcements.

---

## Admin Pages

### Admin Dashboard (`/admin`)
**Purpose:** Central hub for store management with real-time metrics and quick actions.

**Key Metrics Displayed:**
- Total Revenue (current month)
- Active Orders count
- Total Products count
- Active Customers count

**Main Sections:**

#### Recent Orders
- Shows last 10 orders with status badges
- Columns: Order ID, Customer, Total, Status, Date
- Quick actions: View details, Update status
- Real-time updates from database

#### Low Stock Products
- Products with quantity ≤ 10
- Shows: Product name, SKU, Current stock, Quick restock link
- Helps prevent stockouts

#### Recent Activity
- Timeline of recent admin actions
- Includes: Order updates, Product changes, Customer registrations

**Usage Instructions:**
1. Review daily metrics at top of page
2. Check recent orders for processing
3. Monitor low stock alerts
4. Use quick links to navigate to detailed management pages

---

### Products Management (`/admin/products`)

**Purpose:** Complete product catalog management with CRUD operations.

**Features:**
- **Product Grid:** Displays all products with pagination
- **Search:** Real-time product search by name/SKU
- **Filters:** Category, brand, stock status, price range
- **Bulk Actions:** Delete multiple, export to CSV

**Product Fields:**
- Name, SKU, Description
- Price (regular & sale)
- Stock quantity
- Categories & Brand
- Images (multiple)
- SEO metadata
- Variants (size, color, etc.)
- Global options
- Featured flag

**How to Add a Product:**
1. Click "Add Product" button
2. Fill required fields (name, SKU, price)
3. Upload product images (drag & drop supported)
4. Select categories and brand
5. Add variants if applicable
6. Set stock levels
7. Configure SEO fields
8. Save as draft or publish immediately

**How to Edit a Product:**
1. Click edit icon on product row
2. Modify any fields
3. Preview changes
4. Save updates

**Bulk Import:**
1. Download CSV template
2. Fill product data
3. Upload CSV file
4. Review import preview
5. Confirm import

---

### Orders Management (`/admin/orders`)

**Purpose:** Process and track all customer orders with ShipStation integration.

**Order Statuses:**
- **Pending:** Awaiting payment
- **Processing:** Payment received, preparing shipment
- **Shipped:** Tracking number assigned
- **Delivered:** Confirmed delivery
- **Cancelled:** Order cancelled
- **Refunded:** Payment refunded

**Main Features:**

#### Order List View
- Sortable columns: Order #, Date, Customer, Total, Status
- Quick filters: Today, This Week, This Month
- Status filters: Show only specific statuses
- Search: By order ID, customer name, email

#### Order Details (`/admin/orders/[id]`)
**Sections:**
1. **Order Information**
   - Order number, date, status
   - Payment method and status
   - Customer notes

2. **Customer Information**
   - Name, email, phone
   - Billing address
   - Shipping address
   - Order history link

3. **Order Items**
   - Product list with quantities
   - Individual prices
   - Discounts applied
   - Tax calculation
   - Total breakdown

4. **Shipping Information**
   - Selected carrier
   - Tracking number (when available)
   - Shipping cost
   - Delivery updates

**Order Actions:**
- **Update Status:** Change order status with email notification
- **Print Invoice:** Generate PDF invoice
- **Print Packing Slip:** For warehouse
- **Create Shipping Label:** Via ShipStation
- **Issue Refund:** Process PayPal refund
- **Add Note:** Internal notes or customer messages
- **Resend Confirmation:** Email order details to customer

**ShipStation Integration:**
1. Orders sync automatically when placed
2. Click "Create Label" to generate shipping label
3. Select carrier and service
4. Label cost calculated in real-time
5. Tracking number auto-updates order
6. Customer receives tracking email

---

### Shipping Management (`/admin/shipments`)

**Purpose:** Manage all shipments and tracking through ShipStation.

**Shipment List:**
- Shows all shipments with tracking
- Columns: Shipment ID, Order #, Carrier, Tracking #, Status, Ship Date
- Real-time tracking updates

**Shipment Details (`/admin/shipments/[id]`)
- Complete shipment information
- Tracking history
- Delivery confirmation
- Label reprint option
- Cost breakdown

**Creating Shipments:**
1. Select order(s) to ship
2. Choose carrier (USPS, UPS, FedEx)
3. Select service level
4. Enter package dimensions/weight
5. Generate label
6. Print label
7. Mark as shipped

**Bulk Shipping:**
1. Select multiple orders
2. Apply same shipping method
3. Generate all labels at once
4. Download labels as PDF batch

---

### Customer Groups (`/admin/customer-groups`)

**Purpose:** Segment customers for targeted pricing and promotions.

**Group Properties:**
- Name and description
- Discount percentage
- Special pricing rules
- Access restrictions
- Auto-assignment rules

**Creating a Group:**
1. Click "Create Group"
2. Enter group name (e.g., "VIP Customers")
3. Set discount percentage
4. Define qualification criteria:
   - Minimum purchase amount
   - Number of orders
   - Registration date
   - Manual assignment
5. Save group

**Managing Members:**
- View all customers in group
- Add/remove customers manually
- Export member list
- Send group emails via Mailchimp

**Use Cases:**
- Wholesale customers (B2B pricing)
- VIP/loyalty tiers
- Employee discounts
- Beta testers
- Regional pricing

---

### Promotions & Discounts (`/admin/promotions`)

**Purpose:** Create and manage promotional campaigns and discount rules.

**Promotion Types:**

#### Percentage Off
- Set % discount (5-100%)
- Apply to: All products, specific categories, or brands
- Minimum purchase requirements

#### Fixed Amount Off
- Dollar amount discount
- Order minimum required
- Cannot exceed order total

#### Buy One Get One (BOGO)
- Configure trigger products
- Set free/discounted products
- Limit quantities

#### Bundle Deals
- Group products together
- Set bundle price
- Auto-apply when all items in cart

#### Tiered Discounts
- Spend $X get Y% off
- Multiple tiers supported
- Shows progress to next tier

#### Free Shipping
- Remove shipping costs
- Set minimum order value
- Restrict to regions

**Creating a Promotion:**
1. Click "Create Promotion"
2. Select promotion type
3. Configure rules:
   - Name and description
   - Start/end dates
   - Usage limits (per customer/total)
   - Combination rules
4. Set conditions:
   - Products/categories included
   - Customer groups
   - Minimum quantities
5. Preview and activate

**Promotion Management:**
- View active/scheduled/expired
- Real-time usage tracking
- Performance metrics
- A/B testing support
- Quick pause/resume

---

### Coupons (`/admin/coupons`)

**Purpose:** Generate and track coupon codes for customers.

**Coupon Features:**
- Unique or generic codes
- Single or multi-use
- Customer-specific assignment
- Expiration dates
- Usage tracking

**Creating Coupons:**
1. Click "Generate Coupons"
2. Choose type:
   - Single code (e.g., SAVE20)
   - Bulk unique codes
   - Pattern-based (PREFIX-XXXX)
3. Set discount value
4. Configure restrictions
5. Generate and distribute

**Distribution Methods:**
- Email via Mailchimp
- Export for print
- Display on site
- Include in orders

---

### Email Marketing (`/admin/email`)

**Purpose:** Mailchimp integration for customer communication.

**Features:**

#### Connection Setup
1. Enter Mailchimp API key
2. Select audience/list
3. Test connection
4. Enable sync options

#### Sync Options
- **Customers:** Auto-add new signups
- **Orders:** Track purchase behavior  
- **Products:** Enable recommendations
- **Carts:** Abandoned cart recovery

#### Manual Tools
- **Sync All Customers:** Initial data push
- **Sync Products:** Update catalog
- **View Sync Status:** Check pending/failed

**Automated Triggers (Event-Driven):**
- New customer signup → Welcome email
- Order completed → Confirmation + Receipt
- Cart abandoned (30min) → Recovery email
- Customer tagged → Segment campaigns

**Important:** No cron jobs required! Everything is event-driven and happens in real-time.

**Monitoring:**
- View sync logs
- Check failed syncs
- See customer sync status
- Track email performance (in Mailchimp)

---

### Categories (`/admin/categories`)

**Purpose:** Organize products into hierarchical categories.

**Category Structure:**
- Parent categories
- Unlimited subcategories
- Category images
- SEO metadata
- Featured flags

**Managing Categories:**
1. Create parent category
2. Add subcategories
3. Assign products
4. Set display order
5. Configure category page layout

**Bulk Operations:**
- Move products between categories
- Merge categories
- Delete with product reassignment

---

### Brands (`/admin/brands`)

**Purpose:** Manage product manufacturers and brands.

**Brand Properties:**
- Name and logo
- Description
- Website URL
- Product count
- Featured status

**Adding Brands:**
1. Click "Add Brand"
2. Enter brand name
3. Upload logo (recommended: 200x100px)
4. Add description
5. Set as featured (optional)

---

### Banners (`/admin/banners`)

**Purpose:** Manage promotional banners across the site.

**Banner Types:**
- Hero banners (homepage)
- Category banners
- Announcement bars
- Pop-ups
- Side promotions

**Creating Banners:**
1. Upload image (specify dimensions)
2. Add text overlay (optional)
3. Set link URL
4. Choose placement
5. Schedule display dates
6. Set priority order

---

### Blog/Content (`/admin/blog`)

**Purpose:** Create and manage blog posts and content pages.

**Content Types:**
- Blog posts
- News articles
- Help articles
- Policy pages

**Post Editor:**
- Rich text editor
- Image insertion
- SEO fields
- Categories/tags
- Publish scheduling

---

### Global Options (`/admin/options`)

**Purpose:** Define product options used across multiple products.

**Option Types:**
- Size charts
- Color swatches  
- Material options
- Customization fields

**Creating Global Options:**
1. Define option name
2. Add option values
3. Set price modifiers
4. Apply to product categories
5. Configure display style

---

### Settings (`/admin/settings`)

**Purpose:** Configure store-wide settings.

**Setting Categories:**

#### Store Information
- Store name, address
- Contact information
- Business hours
- Legal information

#### Payment Settings
- PayPal configuration
- Tax settings
- Currency options

#### Shipping Settings
- ShipStation API keys
- Default shipping rates
- Shipping zones
- Free shipping thresholds

#### Email Settings
- Transactional email templates
- Notification recipients
- Email footer content

#### SEO Settings
- Default meta tags
- Sitemap configuration
- Robots.txt rules
- Schema markup

---

### Tax Settings (`/admin/tax-settings`)

**Purpose:** Configure tax calculation with TaxCloud.

**Configuration:**
- TaxCloud API credentials
- Origin address
- Tax exemptions
- State tax nexus
- Product tax codes

**Testing:**
- Calculate sample taxes
- Verify rates by state
- Test exemption certificates

---

## Authentication Pages

### Login (`/auth/login`)
**Description:** User authentication page.
**Features:** Email/password login, Remember me, Forgot password link, Social login options.

### Sign Up (`/auth/signup`)
**Description:** New user registration.
**Features:** Email verification, Password requirements, Terms acceptance, Newsletter opt-in.

### Reset Password (`/auth/reset-password`)
**Description:** Password recovery flow.
**Features:** Email verification, Secure token validation, New password entry.

---

## Account Pages

### Account Dashboard (`/account`)
**Description:** Customer account overview.
**Features:** Order history, Account details, Address book, Wishlist access.

### Order History (`/account/orders`)
**Description:** View past orders and track shipments.
**Features:** Order list, Status tracking, Reorder functionality, Invoice downloads.

### Profile Settings (`/account/profile`)
**Description:** Manage personal information.
**Features:** Name/email update, Password change, Newsletter preferences, Account deletion.

### Address Book (`/account/addresses`)
**Description:** Manage shipping and billing addresses.
**Features:** Add/edit addresses, Set defaults, Address validation.

### Wishlist (`/account/wishlist`)
**Description:** Saved products for later purchase.
**Features:** Add to cart, Share wishlist, Price drop alerts.

---

## Quick Reference

### Common Admin Tasks

**Processing an Order:**
1. Go to Admin → Orders
2. Find pending order
3. Verify payment received
4. Create shipping label
5. Print packing slip
6. Update status to "Shipped"
7. Customer gets tracking email

**Running a Sale:**
1. Admin → Promotions
2. Create "Percentage Off" promotion
3. Set 20% discount
4. Choose products/categories
5. Set date range
6. Activate promotion
7. Updates prices site-wide

**Handling Low Stock:**
1. Check dashboard alerts
2. Click product link
3. Update stock quantity
4. Set reorder point
5. Save changes

**Customer Service:**
1. Find order/customer
2. View order details
3. Check shipping status
4. Issue refund if needed
5. Add internal note
6. Send follow-up email

---

## Keyboard Shortcuts (Admin)

- `⌘ + K` - Quick search
- `⌘ + N` - New product/order
- `⌘ + S` - Save current form
- `ESC` - Close modal/dialog
- `⌘ + /` - Show shortcuts

---

## Tips & Best Practices

1. **Daily Routine:**
   - Check dashboard metrics
   - Process new orders
   - Review low stock alerts
   - Respond to customer inquiries

2. **Weekly Tasks:**
   - Review sales reports
   - Update featured products
   - Plan promotions
   - Check Mailchimp campaigns

3. **Monthly Tasks:**
   - Inventory reconciliation
   - Performance analysis
   - SEO optimization
   - Customer segment review

4. **Data Management:**
   - Regular backups
   - Clean old data
   - Optimize images
   - Update product info

5. **Customer Experience:**
   - Fast order processing
   - Clear communication
   - Accurate inventory
   - Quick issue resolution

---

*Last Updated: January 2025*
*Version: 1.0*