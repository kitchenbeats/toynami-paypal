export interface DocSection {
  id: string
  title: string
  icon?: string
  content: string
  subsections?: {
    id: string
    title: string
    content: string
  }[]
}

export interface DocCategory {
  id: string
  title: string
  description: string
  icon: string
  sections: DocSection[]
}

export const adminDocs: DocCategory[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Understanding your admin dashboard',
    icon: 'LayoutDashboard',
    sections: [
      {
        id: 'overview',
        title: 'Dashboard Overview',
        content: `
The admin dashboard is your central hub for store management with real-time metrics and quick actions.

**Key Metrics:**
- Total Revenue (current month)
- Active Orders count
- Total Products count
- Active Customers count

**Main Sections:**
- Recent Orders with status badges
- Low Stock Products (quantity ≤ 10)
- Recent Activity timeline
        `
      },
      {
        id: 'daily-routine',
        title: 'Daily Routine',
        content: `
**Recommended daily workflow:**
1. Review dashboard metrics
2. Check recent orders for processing
3. Monitor low stock alerts
4. Respond to customer inquiries
5. Update order statuses as needed
        `
      }
    ]
  },
  {
    id: 'orders',
    title: 'Order Management',
    description: 'Processing and managing customer orders',
    icon: 'ShoppingCart',
    sections: [
      {
        id: 'processing',
        title: 'Processing Orders',
        content: `
**Order Processing Flow:**

1. **Payment Verification**
   - Check PayPal payment status
   - Verify customer details
   - Check for fraud indicators

2. **Create Shipping Label**
   - Click "Create Label" button
   - Select carrier and service
   - Enter package dimensions
   - Generate and print label

3. **Update Status**
   - Mark as "Processing" when preparing
   - Mark as "Shipped" when sent
   - Tracking auto-updates

**Order Statuses:**
- Pending: Awaiting payment
- Processing: Preparing shipment
- Shipped: In transit
- Delivered: Confirmed delivery
- Cancelled: Order cancelled
- Refunded: Payment returned
        `
      },
      {
        id: 'refunds',
        title: 'Processing Refunds',
        content: `
**How to Issue a Refund:**

1. Navigate to order details
2. Click "Issue Refund" button
3. Select items to refund
4. Choose refund type:
   - Full refund
   - Partial refund
   - Store credit
5. Add refund reason
6. Process through PayPal
7. Email confirmation sent automatically

**Refund Guidelines:**
- Damaged/defective items: Full refund
- Within return period (30 days): Full refund minus shipping
- Outside return period: Case by case basis
        `
      },
      {
        id: 'bulk-operations',
        title: 'Bulk Operations',
        content: `
**Bulk Order Processing:**

1. Select multiple orders using checkboxes
2. Click "Bulk Actions" dropdown
3. Available actions:
   - Create shipping labels
   - Update status
   - Export to CSV
   - Print packing slips

**Bulk Shipping:**
- Process multiple labels at once
- Download as single PDF
- Print on label printer
- Automatic status updates
        `
      }
    ]
  },
  {
    id: 'products',
    title: 'Product Management',
    description: 'Managing your product catalog',
    icon: 'Package',
    sections: [
      {
        id: 'add-product',
        title: 'Adding Products',
        content: `
**Steps to Add a Product:**

1. Click "Add Product" button
2. Fill required fields:
   - Product name
   - SKU (unique identifier)
   - Price (regular & sale)
   - Stock quantity
3. Upload images:
   - Drag & drop supported
   - Multiple images allowed
   - First image is primary
4. Select categories and brand
5. Add product description
6. Configure variants (if applicable):
   - Size options
   - Color options
   - Custom attributes
7. Set SEO fields:
   - Meta title
   - Meta description
   - URL slug
8. Save as draft or publish

**Image Guidelines:**
- Recommended: 1000x1000px minimum
- Format: JPG or PNG
- Multiple angles recommended
- White background preferred
        `
      },
      {
        id: 'inventory',
        title: 'Inventory Management',
        content: `
**Stock Management:**

**Low Stock Monitoring:**
- Dashboard shows products ≤ 10 units
- Email alerts for critical stock
- Quick restock links

**Updating Stock:**
1. Find product in list
2. Click "Quick Edit"
3. Update quantity
4. Add note (optional)
5. Save changes

**Bulk Import:**
1. Download CSV template
2. Fill product data
3. Upload CSV file
4. Review import preview
5. Confirm import

**Stock Adjustments:**
- Returns: Add to stock
- Damage: Reduce stock with note
- Inventory count: Adjust to actual
        `
      },
      {
        id: 'variants',
        title: 'Product Variants',
        content: `
**Managing Variants:**

**Creating Variants:**
1. In product editor, go to "Variants" tab
2. Add variant type (Size, Color, etc.)
3. Add variant options
4. Set prices for each variant
5. Track inventory per variant

**Global Options:**
- Define reusable options
- Apply to multiple products
- Centralized management
- Price modifiers

**Best Practices:**
- Use consistent naming
- Set clear SKUs per variant
- Track inventory separately
- Update all variants together
        `
      },
      {
        id: 'global-options',
        title: 'Global Options',
        content: `
**Global Options System:**

Global options are reusable product variations (Size, Color, etc.) that can be applied to multiple products.

**Creating an Option Type:**
1. Go to Products → Global Options
2. Click "Create Option Type"
3. Enter display name (e.g., "Size")
4. Choose display type:
   - **Button Group:** Clickable buttons (best for 3-7 options)
   - **Dropdown:** Space-saving list (best for many options)
   - **Color Swatches:** Visual color picker
   - **Radio Buttons:** Traditional radio selection
   - **Grid Layout:** Visual grid of options
5. Set as required/optional
6. Save option type

**Adding Option Values:**
1. Click "Manage Values" on an option type
2. Click "Add Value"
3. Enter:
   - **Value:** Internal code (e.g., "xs")
   - **Display Name:** Customer-facing (e.g., "Extra Small")
   - **SKU Suffix:** Appended to product SKU (e.g., "-XS")
   - **Color:** For swatch display types
4. Save value

**Common Option Examples:**

*Size Options:*
- Values: xs, s, m, l, xl, 2xl, 3xl
- Display: Extra Small, Small, Medium, Large, etc.
- SKU: -XS, -S, -M, -L, -XL, -2XL, -3XL

*Color Options:*
- Values: red, blue, green, black, white
- Display: Red, Blue, Green, Black, White
- Hex: #FF0000, #0000FF, #00FF00, #000000, #FFFFFF

**Assigning to Products:**
1. Go to "Assign to Products" tab
2. Select a product
3. Click "Assign" on desired options
4. Option will appear on product page

**Pricing & Stock Per Option:**
1. Go to "Pricing & Stock" tab
2. Select product and option type
3. For each value, set:
   - **Price Adjustment:** +/- from base price
   - **Stock Override:** Specific inventory count
   - **Availability:** Enable/disable specific options

**Example Pricing:**
- Base product: $19.99
- XS: -$2.00 = $17.99 (20 in stock)
- S: $0.00 = $19.99 (15 in stock)
- M: $0.00 = $19.99 (25 in stock)
- L: $0.00 = $19.99 (18 in stock)
- XL: +$2.00 = $21.99 (10 in stock)
- 2XL: +$3.00 = $22.99 (8 in stock)

**SKU Generation:**
Final SKU = Product SKU + Option SKU Suffixes
Example: SHIRT-001 + -RED + -XL = SHIRT-001-RED-XL

**Best Practices:**
- Create options once, reuse everywhere
- Use consistent naming across products
- Set clear SKU patterns
- Monitor stock per variant
- Use appropriate display types
- Test pricing calculations
        `
      }
    ]
  },
  {
    id: 'shipping',
    title: 'Shipping & Fulfillment',
    description: 'Managing shipments with ShipStation',
    icon: 'Truck',
    sections: [
      {
        id: 'create-label',
        title: 'Creating Shipping Labels',
        content: `
**Generate Shipping Label:**

1. Open order details
2. Click "Create Label"
3. Select carrier:
   - USPS First Class (< 1 lb)
   - USPS Priority (1-3 days)
   - UPS Ground (heavy items)
   - FedEx (express shipping)
4. Enter package info:
   - Weight
   - Dimensions
   - Package type
5. Add insurance (orders > $100)
6. Generate label
7. Print and attach

**Cost Calculation:**
- Real-time rates from carriers
- Compare options
- Auto-select cheapest
- Add handling fees if needed
        `
      },
      {
        id: 'tracking',
        title: 'Tracking Shipments',
        content: `
**Shipment Tracking:**

**Automatic Updates:**
- Tracking syncs from ShipStation
- Customer emails sent
- Status updates in admin
- Delivery confirmation

**Tracking Statuses:**
- Label created
- In transit
- Out for delivery
- Delivered
- Exception (issue)

**Handling Exceptions:**
- Address issues
- Failed delivery attempts
- Weather delays
- Lost packages

**Customer Communication:**
- Auto tracking emails
- Proactive updates
- Resolution for issues
        `
      }
    ]
  },
  {
    id: 'customers',
    title: 'Customer Management',
    description: 'Managing customers and groups',
    icon: 'Users',
    sections: [
      {
        id: 'groups',
        title: 'Customer Groups',
        content: `
**Customer Groups:**

**Creating Groups:**
1. Click "Create Group"
2. Set group name
3. Configure benefits:
   - Discount percentage
   - Special pricing
   - Exclusive access
4. Set qualification:
   - Purchase amount
   - Order count
   - Manual assignment
5. Save group

**Use Cases:**
- VIP customers (10% off)
- Wholesale (B2B pricing)
- Employees (20% discount)
- Beta testers (early access)

**Managing Members:**
- View member list
- Add/remove manually
- Export for marketing
- Track performance
        `
      },
      {
        id: 'communication',
        title: 'Customer Communication',
        content: `
**Communication Channels:**

**Email (via Mailchimp):**
- Automated welcome series
- Order confirmations
- Shipping notifications
- Marketing campaigns

**Order Messages:**
- Add notes to orders
- Customer visible notes
- Internal notes
- Status updates

**Support Tickets:**
- Track issues
- Assign to team
- Resolution tracking
- Follow-up reminders
        `
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & Promotions',
    description: 'Running promotions and email campaigns',
    icon: 'Megaphone',
    sections: [
      {
        id: 'promotions',
        title: 'Creating Promotions',
        content: `
**Promotion Types:**

**Percentage Off:**
- Set discount % (5-100%)
- Apply to categories/products
- Minimum purchase option

**Fixed Amount Off:**
- Dollar discount
- Order minimum required
- Cannot exceed total

**BOGO Deals:**
- Buy X get Y
- Same or different products
- Quantity limits

**Free Shipping:**
- Remove shipping cost
- Set minimum order
- Region restrictions

**Creating a Promotion:**
1. Click "Create Promotion"
2. Select type
3. Set discount value
4. Choose products/categories
5. Set date range
6. Configure limits
7. Activate promotion
        `
      },
      {
        id: 'coupons',
        title: 'Coupon Management',
        content: `
**Coupon System:**

**Creating Coupons:**
1. Click "Generate Coupons"
2. Choose type:
   - Single code (SAVE20)
   - Bulk unique codes
   - Pattern-based
3. Set discount value
4. Configure:
   - Usage limits
   - Expiration date
   - Customer restrictions
5. Generate codes

**Distribution:**
- Email to customers
- Display on site
- Include in packages
- Social media

**Tracking:**
- Usage reports
- Customer analysis
- Revenue impact
- Conversion rates
        `
      },
      {
        id: 'email',
        title: 'Email Marketing',
        content: `
**Mailchimp Integration:**

**Automatic Syncing (No Cron!):**
- New signups → Welcome email
- Orders → Purchase confirmation
- Cart abandonment → Recovery email
- Profile updates → Data sync

**Campaign Types:**
- Welcome series
- Abandoned cart
- Post-purchase
- Re-engagement
- Promotional

**Segmentation:**
- Purchase history
- Customer groups
- Engagement level
- Geographic location

**Best Practices:**
- Test emails first
- Mobile-friendly design
- Clear CTAs
- Track performance
        `
      }
    ]
  },
  {
    id: 'settings',
    title: 'Store Settings',
    description: 'Configuring store settings',
    icon: 'Settings',
    sections: [
      {
        id: 'payment',
        title: 'Payment Settings',
        content: `
**PayPal Configuration:**

**Setup:**
1. Get PayPal API credentials
2. Enter Client ID (public)
3. Enter Secret (server-side)
4. Choose environment:
   - Sandbox for testing
   - Live for production
5. Test connection
6. Enable checkout

**Features:**
- Express checkout
- Pay Later options
- Multi-currency
- Refund processing
        `
      },
      {
        id: 'tax',
        title: 'Tax Configuration',
        content: `
**TaxCloud Setup:**

**Configuration:**
1. Register with TaxCloud
2. Get API credentials
3. Enter in settings:
   - API ID
   - API Key
   - Customer ID
4. Set origin address
5. Configure nexus states
6. Test calculation

**Tax Codes (TICs):**
- 00000: General goods
- 20010: Clothing
- 40030: Food
- 81100: Digital goods

**Compliance:**
- SST certified
- Auto-file option
- Exemption certificates
- Audit reports
        `
      },
      {
        id: 'shipping-settings',
        title: 'Shipping Configuration',
        content: `
**ShipStation Setup:**

**API Configuration:**
- V1 API: Order management
- V2 API: Rate calculation
- Webhook URL for updates

**Warehouse Address:**
- Company name
- Street address
- City, State, ZIP
- Phone number

**Carrier Settings:**
- Enable carriers
- Set default service
- Configure insurance
- Package presets

**Shipping Zones:**
- Domestic rates
- International rates
- Free shipping rules
- Handling fees
        `
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: 'AlertCircle',
    sections: [
      {
        id: 'common-issues',
        title: 'Common Issues',
        content: `
**Payment Issues:**

*Problem: Payment not capturing*
- Check PayPal API status
- Verify credentials
- Review order logs
- Manual capture if needed

*Problem: Refund failing*
- Check PayPal balance
- Verify refund amount
- Check transaction status
- Contact PayPal support

**Shipping Issues:**

*Problem: Label won't generate*
- Verify ShipStation connection
- Check address validity
- Try different carrier
- Review error message

*Problem: No rates showing*
- Check package dimensions
- Verify weight entered
- Confirm destination valid
- Test with different carrier

**Inventory Issues:**

*Problem: Stock levels wrong*
- Run inventory audit
- Check recent orders
- Review adjustments
- Recalculate from orders
        `
      },
      {
        id: 'integration-errors',
        title: 'Integration Errors',
        content: `
**Mailchimp Errors:**

*Connection Failed:*
- Verify API key
- Check server prefix
- Confirm list ID
- Test in Mailchimp

*Sync Not Working:*
- Check enabled status
- Review sync options
- Manual sync if needed
- Check error logs

**ShipStation Errors:**

*API Authentication:*
- Regenerate API keys
- Update credentials
- Check IP whitelist
- Verify account active

*Order Sync Failed:*
- Check order data
- Verify required fields
- Review API limits
- Retry sync

**TaxCloud Errors:**

*Calculation Failed:*
- Verify credentials
- Check address format
- Review TIC codes
- Test with sample
        `
      },
      {
        id: 'emergency',
        title: 'Emergency Procedures',
        content: `
**Site Down:**
1. Check Supabase status
2. Verify deployment
3. Review error logs
4. Check DNS
5. Contact hosting

**Payment Processing Down:**
1. Check PayPal status
2. Enable maintenance mode
3. Notify customers
4. Process manually
5. Document issues

**Data Issues:**
1. Stop operations
2. Identify scope
3. Check backups
4. Restore if needed
5. Verify integrity
6. Document incident

**Support Contacts:**
- Supabase: support@supabase.io
- PayPal: 1-888-221-1161
- ShipStation: support@shipstation.com
- TaxCloud: support@taxcloud.com
        `
      }
    ]
  }
]

export function getDocByPagePath(pagePath: string): DocCategory | null {
  const pathMap: Record<string, string> = {
    '/admin': 'dashboard',
    '/admin/orders': 'orders',
    '/admin/products': 'products',
    '/admin/shipments': 'shipping',
    '/admin/customers': 'customers',
    '/admin/customer-groups': 'customers',
    '/admin/promotions': 'marketing',
    '/admin/coupons': 'marketing',
    '/admin/email': 'marketing',
    '/admin/settings': 'settings',
    '/admin/tax-settings': 'settings',
    '/admin/options': 'products'
  }
  
  const docId = pathMap[pagePath]
  return docId ? adminDocs.find(doc => doc.id === docId) || null : null
}