# Full ShipStation Order Management Integration Plan

## Current Implementation (What's Done)
- ✅ V1 API Client with authentication
- ✅ Automatic order creation after PayPal capture
- ✅ Webhook handler for status updates
- ✅ Database fields for tracking info
- ✅ Test endpoints for verification

## Available API Operations We Can Add

### 1. Order Management Page (`/admin/orders`)
```typescript
// Operations we can implement:
- List all orders with filters (status, date range, customer)
- Search orders by number, customer, or tracking
- View ShipStation sync status
- Manual sync/retry failed orders
- Bulk status updates
- Cancel orders in ShipStation
```

### 2. Order Detail View
```typescript
// Per-order operations:
- View complete ShipStation order data
- Update shipping address
- Add/edit order notes
- Hold/unhold orders
- Split orders for partial fulfillment
- Assign to different warehouses
```

### 3. Label Creation & Printing
```typescript
// Shipping operations:
- Create shipping labels directly from admin
- Get live shipping rates
- Select carrier & service
- Print packing slips
- Void labels if needed
- Track label costs
```

### 4. Customer-Facing Features
```typescript
// Customer portal additions:
- Real-time tracking status
- Estimated delivery dates
- Carrier tracking links
- Delivery notifications
- Return label generation
```

### 5. Automation & Bulk Operations
```typescript
// Batch processing:
- Bulk order import/export
- Automated status sync (cron job)
- Batch label creation
- Mass order updates
- Custom order tags/filters
```

## Implementation Priority

### Phase 1: Admin Order Management (High Priority)
1. Create `/admin/orders` page with order listing
2. Add order detail view with ShipStation data
3. Implement manual sync for failed orders
4. Add order search and filters

### Phase 2: Label Creation (Medium Priority)
1. Add "Create Label" button to order details
2. Implement rate comparison tool
3. Add label void functionality
4. Store label costs in database

### Phase 3: Customer Features (Medium Priority)
1. Add tracking info to customer order page
2. Implement delivery notifications
3. Add return label generation
4. Create tracking timeline view

### Phase 4: Automation (Low Priority)
1. Set up hourly sync cron job
2. Add bulk operations UI
3. Implement custom automation rules
4. Add webhook retry mechanism

## Database Schema Additions Needed

```sql
-- Additional fields for orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS
  shipstation_status TEXT, -- ShipStation's order status
  shipstation_hold_until TIMESTAMPTZ, -- Order hold date
  shipstation_warehouse_id INTEGER, -- Assigned warehouse
  shipstation_tag_ids INTEGER[], -- Order tags
  label_cost DECIMAL(10,2), -- Shipping label cost
  label_voided_at TIMESTAMPTZ, -- If label was voided
  return_label_url TEXT, -- Return label if generated
  estimated_delivery_date DATE; -- Carrier's estimated delivery

-- New table for order sync logs
CREATE TABLE shipstation_sync_logs (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  action TEXT, -- 'create', 'update', 'cancel', etc.
  success BOOLEAN,
  error_message TEXT,
  request_data JSONB,
  response_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Methods to Add to V1 Client

```typescript
// Additional methods needed in v1-client.ts:
- updateOrder(orderId: string, updates: Partial<ShipStationOrder>)
- deleteOrder(orderId: string)
- holdOrder(orderId: string, holdUntilDate: string)
- unholdOrder(orderId: string)
- assignToWarehouse(orderId: string, warehouseId: number)
- createLabel(orderId: string, carrierCode: string, serviceCode: string)
- voidLabel(shipmentId: string)
- getShipmentRates(orderData: any)
- getOrdersByTag(tagId: number)
- addOrderTag(orderId: string, tagId: number)
- removeOrderTag(orderId: string, tagId: number)
- markAsShipped(orderId: string, trackingNumber: string)
- createReturnLabel(orderId: string)
```

## Environment Variables to Add

```bash
# Additional ShipStation configuration
SHIPSTATION_WAREHOUSE_ID=12345  # Default warehouse
SHIPSTATION_SYNC_ENABLED=true    # Enable automatic sync
SHIPSTATION_SYNC_INTERVAL=3600   # Sync interval in seconds
SHIPSTATION_EMAIL_NOTIFICATIONS=true  # Send tracking emails
SHIPSTATION_AUTO_CREATE_LABELS=false  # Auto-create labels on order
```

## Estimated Implementation Time

- Phase 1: 4-6 hours (Admin order management)
- Phase 2: 3-4 hours (Label creation)
- Phase 3: 3-4 hours (Customer features)
- Phase 4: 2-3 hours (Automation)

**Total: 12-17 hours for complete integration**

## Next Steps

1. Start with Phase 1 - Admin order management page
2. Add the missing API methods to v1-client.ts
3. Create the admin UI components
4. Test with real orders
5. Deploy and monitor for issues