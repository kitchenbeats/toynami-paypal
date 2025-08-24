# ShipStation V1 Integration Guide

## Overview

This integration connects your e-commerce platform with ShipStation for order fulfillment and shipping management using ShipStation's V1 API (for order management) and V2 API (for shipping rates).

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │───▶│   PayPal Order   │───▶│  Order Created  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ ShipStation V1  │◀───│   Order Sync     │◀───│  Supabase DB    │
│ Order Created   │    │   API Endpoint   │    │  Order Stored   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Order Fulfilled │───▶│   ShipStation    │───▶│   Webhook       │
│ in ShipStation  │    │   Webhook        │    │   Handler       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │   Order Status  │
                                                │   Updated       │
                                                └─────────────────┘
```

## Setup Instructions

### 1. ShipStation Account Setup

1. **Login to ShipStation**: Go to [ShipStation Dashboard](https://ship.shipstation.com/)
2. **Navigate to Settings**: Go to Settings > API Keys
3. **Generate API Keys**:
   - Create a new API key pair
   - Copy both the **API Key** and **API Secret**
   - These will be used for the V1 API (order management)

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# ShipStation V1 API for Order Management
SHIPSTATION_API_KEY_V1=your-shipstation-v1-api-key
SHIPSTATION_API_SECRET_V1=your-shipstation-v1-api-secret

# ShipStation V2 API for Shipping Rates (if using)
SHIPSTATION_API_KEY=your-shipstation-v2-api-key

# Warehouse/Fulfillment Address
SHIPSTATION_FROM_ADDRESS=123 Your Warehouse St
SHIPSTATION_FROM_CITY=Your City
SHIPSTATION_FROM_STATE=CA
SHIPSTATION_FROM_ZIP=12345
```

### 3. Webhook Configuration

1. **In ShipStation Dashboard**:
   - Go to Settings > Webhooks
   - Add a new webhook with URL: `https://yourdomain.com/api/webhooks/shipstation`
   - Select events you want to receive:
     - `ITEM_ORDER_NOTIFY` - Order updates
     - `ITEM_SHIP_NOTIFY` - Order shipped
     - `ITEM_DELIVERY_NOTIFY` - Order delivered

2. **Webhook Events Handled**:
   - **Order Shipped**: Updates order status to "shipped", adds tracking number
   - **Order Delivered**: Updates order status to "delivered", records delivery date
   - **Order Updated**: Syncs general order status changes

### 4. Test the Integration

#### Test Connection
```bash
curl GET https://yourdomain.com/api/shipstation/test
```

Expected response:
```json
{
  "success": true,
  "message": "ShipStation connection successful",
  "rateLimitRemaining": 39,
  "carriers": [
    {
      "code": "usps",
      "name": "USPS",
      "accountNumber": "***1234",
      "requiresFundedAccount": false,
      "primary": true
    }
  ]
}
```

#### Test Order Creation
```bash
curl -X POST https://yourdomain.com/api/shipstation/test \
  -H "Content-Type: application/json" \
  -d '{"createTestOrder": true}'
```

## Integration Flow

### 1. Order Creation (Automatic)

When a customer completes checkout:

1. **PayPal Payment Captured** → Order saved to database
2. **Order Sync Triggered** → `/api/shipping/orders` endpoint called
3. **ShipStation Order Created** → Order appears in ShipStation dashboard
4. **Database Updated** → `shipstation_order_id` stored for reference

### 2. Order Fulfillment (Manual in ShipStation)

In your ShipStation dashboard:

1. **Process Orders** → Review and approve orders
2. **Create Shipping Labels** → Generate labels and get tracking numbers
3. **Mark as Shipped** → This triggers webhook notifications

### 3. Status Updates (Automatic via Webhooks)

When orders are shipped or delivered:

1. **ShipStation Webhook** → Sent to `/api/webhooks/shipstation`
2. **Order Status Updated** → Database updated with tracking info
3. **Customer Notification** → (Optional) Email customer with tracking

## Database Schema

Orders are tracked with these additional fields:

```sql
-- ShipStation Integration Fields
shipstation_order_id TEXT,        -- ShipStation V1 order ID
shipstation_shipment_id TEXT,     -- ShipStation reference number
shipping_carrier TEXT,            -- Carrier (USPS, FedEx, UPS)
shipping_service TEXT,            -- Service name (Priority Mail)
shipping_service_code TEXT,       -- Service code for API
tracking_number TEXT,             -- Tracking number when shipped
shipped_at TIMESTAMPTZ,           -- When order was shipped
delivered_at TIMESTAMPTZ          -- When order was delivered
```

## API Reference

### Order Sync Endpoint
- **URL**: `POST /api/shipping/orders`
- **Purpose**: Creates order in ShipStation after payment
- **Called by**: PayPal capture flow (automatic)

### Webhook Endpoint
- **URL**: `POST /api/webhooks/shipstation`
- **Purpose**: Receives shipping status updates
- **Called by**: ShipStation (automatic)

### Test Endpoints
- **Connection Test**: `GET /api/shipstation/test`
- **Order Test**: `POST /api/shipstation/test`

## Rate Limiting

ShipStation V1 API has a limit of **40 requests per minute**. The client:
- Tracks rate limit headers automatically
- Throws errors when limit approached
- Includes rate limit info in responses

## Error Handling

The integration is designed to be **fault-tolerant**:

1. **ShipStation Down**: Orders still process, sync can be retried later
2. **API Errors**: Logged but don't fail the customer checkout
3. **Webhook Failures**: Can be replayed or orders manually synced
4. **Rate Limiting**: Client throws descriptive errors with retry timing

## Best Practices

### 1. Order Status Mapping
```javascript
// ShipStation → Internal Status
const statusMap = {
  'awaiting_payment': 'pending',
  'awaiting_shipment': 'paid', 
  'shipped': 'shipped',
  'on_hold': 'on_hold',
  'cancelled': 'cancelled'
}
```

### 2. Address Formatting
- Always provide complete addresses (name, street, city, state, zip)
- Default to residential delivery indicator
- Include phone numbers when available

### 3. Item Information
- Provide SKUs for inventory tracking
- Include item weights for accurate shipping costs
- Use descriptive product names

### 4. Monitoring
- Monitor webhook failures
- Set up alerts for ShipStation API errors
- Track order sync success rates

## Troubleshooting

### Common Issues

1. **"Unauthorized" Errors**
   - Verify API credentials in environment variables
   - Check that credentials are for V1 API (not V2)
   - Ensure credentials have proper permissions

2. **Orders Not Appearing in ShipStation**
   - Check API response for errors
   - Verify address format (all required fields)
   - Ensure order total > $0

3. **Webhook Not Receiving Updates**
   - Verify webhook URL is publicly accessible
   - Check ShipStation webhook configuration
   - Look for webhook delivery failures in ShipStation

4. **Rate Limit Errors**
   - Monitor API usage patterns
   - Implement exponential backoff for retries
   - Consider batching operations during high-volume periods

### Debug Steps

1. **Test Connection**: Use `/api/shipstation/test` endpoint
2. **Check Logs**: Review server logs for API responses
3. **Manual Sync**: Use ShipStation dashboard to manually create test orders
4. **Webhook Testing**: Use ngrok for local webhook testing

## Support Resources

- [ShipStation API Documentation](https://www.shipstation.com/docs/api/)
- [ShipStation Help Center](https://help.shipstation.com/)
- [ShipStation Status Page](https://status.shipstation.com/)

## Implementation Files

- **Client**: `/lib/shipstation/v1-client.ts`
- **Order Sync**: `/app/api/shipping/orders/route.ts`
- **Webhook Handler**: `/app/api/webhooks/shipstation/route.ts`
- **Test Endpoint**: `/app/api/shipstation/test/route.ts`
- **Database Migration**: `/supabase/migrations/20250116000000_add_shipstation_tracking.sql`