# 🔧 Admin Workflows & Procedures

## Table of Contents
1. [Order Fulfillment Workflow](#order-fulfillment-workflow)
2. [Inventory Management](#inventory-management)
3. [Customer Service Procedures](#customer-service-procedures)
4. [Marketing Campaign Setup](#marketing-campaign-setup)
5. [Financial Operations](#financial-operations)
6. [Troubleshooting Guide](#troubleshooting-guide)

---

## Order Fulfillment Workflow

### Complete Order Processing Flow

#### Step 1: Order Notification
- New order appears in dashboard
- Email notification sent to admin
- Order status: "Pending"

#### Step 2: Payment Verification
1. Navigate to **Admin → Orders**
2. Click on pending order
3. Verify PayPal payment status
4. Check for any fraud indicators
5. Confirm customer details

#### Step 3: Inventory Check
1. Review ordered items
2. Verify stock availability
3. If out of stock:
   - Contact customer for alternatives
   - Offer backorder option
   - Process partial shipment
   - Issue refund if needed

#### Step 4: Create Shipping Label
1. Click **"Create Label"** button
2. ShipStation opens with order details
3. Select shipping carrier:
   - **USPS First Class:** Items under 1 lb
   - **USPS Priority:** 1-3 day delivery
   - **UPS Ground:** Heavy items
   - **FedEx:** Express shipping
4. Enter package dimensions
5. Add insurance if order > $100
6. Generate and print label
7. Cost automatically calculated

#### Step 5: Pack Order
1. Print packing slip from order page
2. Gather products
3. Quality check each item
4. Include:
   - Packing slip
   - Return form
   - Marketing materials
   - Thank you note
5. Secure packaging
6. Attach shipping label

#### Step 6: Ship & Update
1. Drop off package or schedule pickup
2. Order automatically updates to "Shipped"
3. Tracking email sent to customer
4. Tracking updates sync in real-time

#### Step 7: Post-Shipping
1. Monitor delivery status
2. Handle delivery exceptions
3. Follow up on deliveries
4. Request customer feedback

### Bulk Order Processing

For multiple orders:
1. **Admin → Orders** → Select multiple
2. Click **"Bulk Actions"**
3. Choose **"Create Labels"**
4. Process all at once
5. Download labels as single PDF
6. Print on label printer

---

## Inventory Management

### Stock Level Monitoring

#### Daily Checks
1. Review dashboard low stock alerts
2. Check products with quantity ≤ 10
3. Note fast-moving items

#### Reordering Process
1. Navigate to **Admin → Products**
2. Filter by "Low Stock"
3. For each product:
   - Check sales velocity
   - Calculate reorder quantity
   - Note lead time
4. Export low stock report
5. Send purchase orders to suppliers

### Receiving Inventory

1. **Create Purchase Order:**
   - Document expected items
   - Note quantities and costs
   - Set expected delivery date

2. **Receive Shipment:**
   - Verify against PO
   - Check for damage
   - Count quantities

3. **Update System:**
   - Go to **Admin → Products**
   - Search product by SKU
   - Click **"Quick Edit"**
   - Add received quantity
   - Save changes

4. **Quality Control:**
   - Random sampling
   - Verify product details
   - Check packaging

### Stock Adjustments

**Reasons for Adjustment:**
- Damage/defects
- Returns processing
- Inventory counts
- Theft/loss

**How to Adjust:**
1. Find product in admin
2. Click edit
3. Modify quantity with note
4. Save with adjustment reason

---

## Customer Service Procedures

### Handling Returns

#### Return Request
1. Customer emails/calls
2. Verify order in system
3. Check return policy (30 days)
4. Issue RMA number

#### Processing Return
1. Receive returned item
2. Inspect condition
3. Update order notes
4. Process based on condition:
   - **Like New:** Restock
   - **Damaged:** Document and dispose
   - **Wrong Item:** Investigate and correct

#### Refund Process
1. Go to order details
2. Click **"Issue Refund"**
3. Select items to refund
4. Choose refund type:
   - Full refund
   - Partial refund
   - Store credit
5. Add refund reason
6. Process through PayPal
7. Email confirmation sent

### Handling Complaints

1. **Document Issue:**
   - Order number
   - Nature of complaint
   - Customer expectations
   - Timeline of events

2. **Investigate:**
   - Check order history
   - Review shipping tracking
   - Verify product details
   - Check for patterns

3. **Resolution Options:**
   - Replacement shipment
   - Partial/full refund
   - Discount on future order
   - Expedited shipping

4. **Follow Up:**
   - Confirm resolution
   - Request feedback
   - Update customer notes
   - Prevent recurrence

### Customer Communications

#### Order Status Inquiries
- Check order in admin
- Provide tracking information
- Explain current status
- Set expectations

#### Product Questions
- Review product details
- Check specifications
- Consult with team if needed
- Provide accurate information

#### Technical Support
- Understand issue
- Provide troubleshooting steps
- Escalate if needed
- Document solution

---

## Marketing Campaign Setup

### Email Campaign (via Mailchimp)

#### Campaign Planning
1. Define goal (sales, engagement, announcement)
2. Select target audience
3. Plan content and timing
4. Set success metrics

#### Audience Segmentation
1. Go to **Admin → Email Marketing**
2. Ensure Mailchimp connected
3. In Mailchimp:
   - Create segment
   - Use purchase history
   - Filter by engagement
   - Apply customer groups

#### Campaign Execution
1. Design email in Mailchimp
2. Include:
   - Clear CTA
   - Product recommendations
   - Discount codes
   - Social links
3. Test on multiple devices
4. Schedule or send

### Promotion Setup

#### Flash Sale Example
1. **Admin → Promotions**
2. Create new promotion
3. Type: "Percentage Off"
4. Settings:
   - Name: "48 Hour Flash Sale"
   - Discount: 25%
   - Start: Today 12:00 PM
   - End: +48 hours
   - Categories: All
5. Create banner for homepage
6. Send email announcement
7. Post on social media

#### Loyalty Rewards
1. **Admin → Customer Groups**
2. Create "VIP" group
3. Set qualification:
   - Min purchases: 5
   - Or total spent: $500
4. Apply 10% automatic discount
5. Tag in Mailchimp for exclusive emails

### Social Media Integration

1. **Product Promotion:**
   - Export product images
   - Create social posts
   - Include shop links
   - Track UTM parameters

2. **User Generated Content:**
   - Monitor tags/mentions
   - Request permission
   - Feature on site
   - Reward contributors

---

## Financial Operations

### Daily Reconciliation

1. **Check PayPal:**
   - Login to PayPal dashboard
   - Verify all captures
   - Note any holds/disputes
   - Check balance

2. **Match Orders:**
   - Export order report
   - Compare with PayPal
   - Investigate discrepancies
   - Update order notes

3. **Review Refunds:**
   - Check refund requests
   - Verify processing
   - Update accounting

### Monthly Reporting

1. **Sales Report:**
   - Total revenue
   - Orders by status
   - Average order value
   - Top products
   - Customer metrics

2. **Inventory Report:**
   - Stock levels
   - Turnover rate
   - Dead stock
   - Reorder points

3. **Customer Report:**
   - New vs returning
   - Lifetime value
   - Geographic distribution
   - Group performance

### Tax Compliance

1. **Quarterly:**
   - Review TaxCloud reports
   - Verify tax collected
   - File state returns
   - Update nexus settings

2. **Year-End:**
   - Generate annual report
   - Prepare 1099s
   - Update tax rates
   - Archive records

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Order Issues

**Problem: Payment captured but order stuck in pending**
- Solution: Check PayPal API logs
- Manually update order status
- Verify webhook configuration

**Problem: Shipping label won't generate**
- Solution: Verify ShipStation credentials
- Check address validation
- Try different carrier
- Contact ShipStation support

**Problem: Customer can't checkout**
- Solution: Test checkout flow
- Check PayPal integration
- Verify inventory levels
- Clear customer session

#### Inventory Issues

**Problem: Stock levels incorrect**
- Solution: Run inventory audit
- Check recent orders
- Review adjustment logs
- Recalculate from orders

**Problem: Products not showing on site**
- Solution: Check product status
- Verify categories assigned
- Check inventory > 0
- Clear cache

#### Integration Issues

**Problem: Mailchimp not syncing**
- Solution: Test connection
- Check API key
- Verify list ID
- Review sync logs
- Manual sync if needed

**Problem: ShipStation connection lost**
- Solution: Re-authenticate
- Update API keys
- Check IP whitelist
- Test with single order

**Problem: Tax calculation failing**
- Solution: Verify TaxCloud credentials
- Check origin address
- Test with sample cart
- Update tax codes

### Emergency Procedures

#### Site Down
1. Check Supabase status
2. Verify Vercel deployment
3. Check domain/DNS
4. Review error logs
5. Contact support if needed

#### Payment Processing Failed
1. Check PayPal status page
2. Verify API credentials
3. Test with sandbox
4. Enable backup payment method
5. Notify customers

#### Data Loss/Corruption
1. Stop all operations
2. Identify scope
3. Check backups
4. Restore from backup
5. Verify data integrity
6. Document incident

### Support Contacts

- **Supabase Support:** support@supabase.io
- **PayPal Merchant:** 1-888-221-1161
- **ShipStation:** support@shipstation.com
- **TaxCloud:** support@taxcloud.com
- **Mailchimp:** Via dashboard help

---

## Best Practices

### Daily Operations
- Start with dashboard review
- Process orders by cutoff time (2 PM)
- Respond to customer inquiries
- Update inventory as needed
- Check for system alerts

### Weekly Tasks
- Review sales performance
- Plan upcoming promotions
- Update featured products
- Clean up abandoned carts
- Review customer feedback

### Monthly Tasks
- Full inventory count
- Financial reconciliation
- Update product descriptions
- Review and optimize shipping rates
- Analyze customer segments

### Security Practices
- Never share API keys
- Use strong passwords
- Enable 2FA where available
- Regular permission audits
- Monitor admin access logs

---

## Quick Decision Trees

### Should I offer a refund?
```
Is item damaged/defective? → YES → Full refund
                          ↓
                          NO
                          ↓
Is it within return period? → NO → Decline politely
                           ↓
                           YES
                           ↓
Is item unopened/resellable? → YES → Full refund minus shipping
                             ↓
                             NO → Partial refund (50-70%)
```

### Which shipping method?
```
Order value > $100? → YES → Add insurance
                   ↓
                   NO
                   ↓
Weight < 1 lb? → YES → USPS First Class
              ↓
              NO
              ↓
Customer paid express? → YES → FedEx/UPS Express
                      ↓
                      NO → USPS Priority/UPS Ground
```

---

*This guide is a living document. Update as procedures change.*
*Last Updated: January 2025*