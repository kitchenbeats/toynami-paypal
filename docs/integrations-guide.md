# 🔌 Integrations Guide

## Overview
This document covers all third-party integrations, their configuration, and troubleshooting.

---

## PayPal Integration

### Configuration
**Environment Variables:**
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_SANDBOX=false  # true for testing
```

### Key Features
- **Checkout Integration:** Embedded PayPal buttons
- **Order Management:** Capture, void, refund
- **Product Sync:** Catalog synchronization
- **Webhooks:** Real-time order updates

### API Endpoints
- `/api/paypal/create-order` - Initialize payment
- `/api/paypal/capture-order` - Complete payment
- `/api/paypal/products/sync` - Sync product catalog

### Common Tasks

#### Testing Payments
1. Set `PAYPAL_SANDBOX=true`
2. Use sandbox credentials
3. Test with sandbox buyer account
4. Verify order creation and capture

#### Handling Disputes
1. Check PayPal Resolution Center
2. Provide tracking information
3. Submit evidence
4. Update order status

#### Refund Process
```typescript
// In order details page
await fetch('/api/paypal/refund', {
  method: 'POST',
  body: JSON.stringify({
    orderId: 'ORDER-123',
    amount: 99.99,
    reason: 'Customer request'
  })
})
```

---

## ShipStation Integration

### Configuration
**Environment Variables:**
```env
# V1 API (Order Management)
SHIPSTATION_API_KEY_V1=your_v1_key
SHIPSTATION_API_SECRET_V1=your_v1_secret

# V2 API (Shipping Rates)
SHIPSTATION_API_KEY=your_v2_key

# Warehouse Address
SHIPSTATION_FROM_NAME="Your Company"
SHIPSTATION_FROM_COMPANY="Company LLC"
SHIPSTATION_FROM_STREET1="123 Main St"
SHIPSTATION_FROM_CITY="Los Angeles"
SHIPSTATION_FROM_STATE="CA"
SHIPSTATION_FROM_POSTAL_CODE="90001"
SHIPSTATION_FROM_COUNTRY="US"
SHIPSTATION_FROM_PHONE="555-0100"
```

### Features

#### V1 API (Orders)
- Create/update orders
- Generate shipping labels
- Track shipments
- Manage stores
- Webhook notifications

#### V2 API (Rates)
- Real-time rate calculation
- Multi-carrier comparison
- Address validation
- Service availability

### Workflows

#### Order Sync
1. Order placed → Auto-sync to ShipStation
2. Status: "Awaiting Shipment"
3. Generate label in ShipStation
4. Print and ship
5. Tracking auto-updates

#### Manual Label Creation
```typescript
// From order details
const label = await shipstation.createLabel({
  orderId: order.id,
  carrier: 'USPS',
  service: 'priority',
  weight: { value: 2, units: 'pounds' },
  dimensions: { length: 10, width: 8, height: 4 }
})
```

#### Bulk Shipping
1. Select orders in admin
2. Choose "Bulk Create Labels"
3. Apply shipping defaults
4. Generate all labels
5. Print batch

### Carrier Settings

**USPS:**
- First Class: < 1 lb
- Priority: 1-3 days
- Express: Overnight
- Media Mail: Books/media

**UPS:**
- Ground: 1-5 days
- 3 Day Select
- 2nd Day Air
- Next Day Air

**FedEx:**
- Ground: 1-5 days
- Express Saver: 3 days
- 2Day
- Priority Overnight

### Troubleshooting

**Error: "Invalid API credentials"**
- Verify API key and secret
- Check V1 vs V2 credentials
- Ensure not expired

**Error: "Address validation failed"**
- Check address format
- Verify ZIP+4
- Try address correction tool

**Error: "No rates returned"**
- Check package dimensions
- Verify weight
- Ensure service available for route

---

## Mailchimp Integration

### Configuration
**Admin Panel Setup:**
1. Admin → Email Marketing
2. Enter API key (get from Mailchimp → Account → API keys)
3. Enter server prefix (e.g., us14)
4. Enter List/Audience ID
5. Test connection
6. Enable sync options

### Event-Driven Sync (No Cron!)

**Automatic Triggers:**
| Event | Trigger Location | Mailchimp Action |
|-------|-----------------|------------------|
| User signup | `/api/auth/signup` | Add to list, tag "new_customer" |
| Order complete | `/api/paypal/capture-order` | Record purchase, tag "purchaser" |
| Cart update | `/api/cart/update` | Update cart for abandoned cart emails |
| Profile update | `/api/profile/update` | Sync customer data |
| Unsubscribe | `/api/unsubscribe` | Tag "unsubscribed" |

### Implementation Example
```typescript
// In your API route
import { onUserSignup } from '@/lib/mailchimp/events'

// After user creation
await onUserSignup({
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  phone: user.phone
})
```

### Campaign Types

#### Welcome Series
- Trigger: New signup
- Delay: Immediate
- Content: Welcome + coupon

#### Abandoned Cart
- Trigger: Cart inactive 30min
- Delay: 1 hour
- Content: Cart reminder + incentive

#### Post-Purchase
- Trigger: Order completed
- Delay: 1 day
- Content: Thank you + review request

#### Re-engagement
- Trigger: No activity 60 days
- Content: Special offer

### Segmentation

**Built-in Tags:**
- `new_customer` - Just signed up
- `purchaser` - Has bought
- `abandoned_cart` - Left items
- `vip` - High value customer
- `group_[id]` - Customer group member

### Manual Sync Tools
- **Sync All Customers:** Initial setup
- **Sync Products:** E-commerce features
- **View Status:** Check sync health

---

## TaxCloud Integration

### Configuration
**Settings Location:** Admin → Tax Settings

**Required Fields:**
```env
TAXCLOUD_API_ID=your_api_id
TAXCLOUD_API_KEY=your_api_key
TAXCLOUD_CUSTOMER_ID=your_customer_id
```

### Setup Process
1. Register at [TaxCloud](https://taxcloud.com)
2. Get free API credentials
3. Configure origin address
4. Set up nexus states
5. Assign TICs (Taxability Information Codes)

### Tax Calculation Flow
```
Cart → Calculate Tax → Show at Checkout → Capture with Order → Report to TaxCloud
```

### Product Tax Codes (TICs)
- `00000` - General tangible goods
- `20010` - Clothing
- `40030` - Food/grocery
- `81100` - Digital goods
- `11000` - Services

### Testing
```typescript
// Test calculation
const tax = await calculateTax({
  from: { state: 'CA', zip: '90001' },
  to: { state: 'NY', zip: '10001' },
  items: [{ tic: '00000', amount: 100 }]
})
```

### Compliance
- Automatic nexus management
- SST certified
- Exemption certificates
- Filing reminders

---

## Supabase Configuration

### Database Setup
```sql
-- Run migrations
npx supabase db push

-- Check migration status
npx supabase migration list
```

### Row Level Security (RLS)
All tables have RLS policies:
- Public read for products, categories
- Authenticated write for carts, orders
- Admin only for settings

### Realtime Subscriptions
```typescript
// Subscribe to order updates
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders'
  }, handleOrderUpdate)
  .subscribe()
```

### Auth Configuration
- Email/password authentication
- OAuth providers (optional)
- Session management
- Role-based access

### Storage Buckets
- `products` - Product images
- `brands` - Brand logos
- `banners` - Promotional images
- `blog` - Blog post images

---

## Environment Variables Summary

### Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=
```

### ShipStation (Required for Shipping)
```env
SHIPSTATION_API_KEY=
SHIPSTATION_API_KEY_V1=
SHIPSTATION_API_SECRET_V1=
SHIPSTATION_FROM_NAME=
SHIPSTATION_FROM_COMPANY=
SHIPSTATION_FROM_STREET1=
SHIPSTATION_FROM_CITY=
SHIPSTATION_FROM_STATE=
SHIPSTATION_FROM_POSTAL_CODE=
SHIPSTATION_FROM_COUNTRY=
SHIPSTATION_FROM_PHONE=
```

### Optional
```env
# PayPal
PAYPAL_SANDBOX=false

# TaxCloud (or configure in admin)
TAXCLOUD_API_ID=
TAXCLOUD_API_KEY=
TAXCLOUD_CUSTOMER_ID=

# ShipStation
SHIPSTATION_SERVICE_CODES=
```

---

## API Rate Limits

### PayPal
- No strict limits
- Respect 429 responses
- Implement exponential backoff

### ShipStation
- V1: 40 requests/minute
- V2: 40 requests/minute
- Batch operations when possible

### Mailchimp
- 10 concurrent connections
- 10,000 requests/day (free)
- Batch operations recommended

### TaxCloud
- 1,000 requests/hour
- Cache calculations when possible

---

## Monitoring & Logs

### Application Logs
- Vercel Functions logs
- Supabase logs
- Browser console

### Integration Logs
- PayPal: Dashboard → Activity
- ShipStation: Account → API logs
- Mailchimp: Reports → API calls
- TaxCloud: Dashboard → Logs

### Error Tracking
1. Set up error boundary
2. Log to service (Sentry, etc.)
3. Monitor failed webhooks
4. Alert on critical errors

---

## Webhook Configuration

### PayPal Webhooks
URL: `https://yoursite.com/api/webhooks/paypal`
Events:
- CHECKOUT.ORDER.APPROVED
- PAYMENT.CAPTURE.COMPLETED
- PAYMENT.CAPTURE.REFUNDED

### ShipStation Webhooks
URL: `https://yoursite.com/api/webhooks/shipstation`
Events:
- ORDER_SHIPPED
- TRACKING_UPDATED
- DELIVERY_CONFIRMED

### Security
- Verify webhook signatures
- Use HTTPS only
- Implement idempotency
- Log all webhook events

---

## Testing Checklist

### Pre-Launch
- [ ] Test checkout flow
- [ ] Verify tax calculation
- [ ] Test shipping rates
- [ ] Process test order
- [ ] Generate shipping label
- [ ] Test email sync
- [ ] Verify refund process
- [ ] Test customer registration
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate

### Post-Launch
- [ ] Monitor first orders
- [ ] Check email delivery
- [ ] Verify tracking updates
- [ ] Review tax reports
- [ ] Check sync status
- [ ] Monitor error logs
- [ ] Test customer support flow

---

*For additional support, consult the respective service documentation or contact their support teams.*