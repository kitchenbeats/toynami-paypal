# ShipStation Integration Documentation

## Overview

ShipStation provides two distinct services that are often confused:

1. **ShipStation Platform** - Order fulfillment and shipping management
2. **ShipStation API (formerly ShipEngine)** - Direct API for shipping rates and labels

## Current Implementation Issues

Our current implementation attempts to use ShipStation API v2 for real-time checkout rates, but there are several fundamental issues:

### 1. Wrong Service for Checkout Rates

**Issue**: We're trying to use ShipStation API directly for checkout rates, but ShipStation actually provides checkout rates through their platform integration, not direct API calls.

**Reality**:
- **ShipStation Checkout Rates** is a platform feature for Shopify, BigCommerce, Magento, and Wix
- It's configured through the ShipStation dashboard, not API calls
- For custom platforms like Next.js, we need a different approach

### 2. API Purpose Mismatch

**ShipStation API v2 is designed for**:
- Creating shipping labels after an order is placed
- Managing orders and fulfillment
- Batch processing shipments
- Getting rates for already-placed orders

**It's NOT designed for**:
- Real-time checkout rate calculation for cart pages
- Customer-facing rate shopping during checkout

## Correct Implementation Options

### Option 1: Use ShipEngine API (Recommended)

ShipEngine (now part of ShipStation) is the correct API for real-time rates:

```javascript
// Correct endpoint for real-time rates
POST https://api.shipengine.com/v1/rates

// Authentication
API-Key: your-shipengine-api-key

// Request body
{
  "rate_options": {
    "carrier_ids": ["se-123456", "se-123457"]
  },
  "shipment": {
    "ship_to": {
      "address_line1": "525 S Winchester Blvd",
      "city_locality": "San Jose",
      "state_province": "CA",
      "postal_code": "95128",
      "country_code": "US"
    },
    "ship_from": {
      "address_line1": "123 Warehouse St",
      "city_locality": "Los Angeles",
      "state_province": "CA",
      "postal_code": "90210",
      "country_code": "US"
    },
    "packages": [
      {
        "weight": {
          "value": 1.0,
          "unit": "pound"
        }
      }
    ]
  }
}
```

### Option 2: Use Carrier APIs Directly

For real-time rates, consider using carrier APIs directly:
- USPS Web Tools API
- UPS Rating API
- FedEx Web Services
- DHL Express API

### Option 3: Use EasyPost or Shippo

These are purpose-built for real-time checkout rates:
- EasyPost API
- Shippo API

Both provide simple rate shopping endpoints designed for checkout integration.

## How ShipStation Actually Works

### For Order Fulfillment (After Purchase)

1. Customer places order on your site
2. Order syncs to ShipStation (via API or integration)
3. You process and ship the order in ShipStation
4. ShipStation creates labels and updates tracking

### For Checkout Rates (During Purchase)

ShipStation Checkout Rates works differently:
1. Configure rates in ShipStation dashboard
2. ShipStation provides rates to supported platforms (Shopify, etc.)
3. Platform displays rates at checkout

**For custom platforms like Next.js**:
- ShipStation doesn't provide direct checkout rate API
- You need ShipEngine, EasyPost, Shippo, or direct carrier APIs

## Recommended Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js   │────▶│  ShipEngine  │────▶│  Carriers   │
│   Checkout  │     │     API      │     │ (UPS, USPS) │
└─────────────┘     └──────────────┘     └─────────────┘
       │                                          
       ▼                                          
┌─────────────┐                                   
│   PayPal    │                                   
│   Payment   │                                   
└─────────────┘                                   
       │                                          
       ▼                                          
┌─────────────┐     ┌──────────────┐              
│    Order    │────▶│  ShipStation │              
│   Created   │     │   Platform   │              
└─────────────┘     └──────────────┘              
```

## Implementation Steps

### 1. For Checkout Rates
- Sign up for ShipEngine API (separate from ShipStation)
- Or use EasyPost/Shippo for simpler integration
- Implement rate shopping at checkout

### 2. For Order Fulfillment
- Keep ShipStation for order management
- Use ShipStation API v2 to create orders after payment
- Process shipping in ShipStation dashboard

## Environment Variables Needed

```bash
# For Checkout Rates (ShipEngine)
SHIPENGINE_API_KEY=your-shipengine-api-key
SHIPENGINE_CARRIER_IDS=se-123456,se-123457

# For Order Fulfillment (ShipStation)
SHIPSTATION_API_KEY=your-shipstation-api-key
SHIPSTATION_API_SECRET=your-shipstation-api-secret

# Alternative: EasyPost
EASYPOST_API_KEY=your-easypost-api-key

# Alternative: Shippo
SHIPPO_API_KEY=your-shippo-api-key
```

## Current Code Issues

1. **Wrong API**: Using ShipStation v2 for checkout rates
2. **Wrong Structure**: API structure matches ShipEngine, not ShipStation
3. **Missing Setup**: Need carrier accounts connected in ShipStation
4. **Wrong Use Case**: ShipStation API is for fulfillment, not checkout

## Next Steps

1. **Decision Required**: Choose between ShipEngine, EasyPost, or Shippo for checkout rates
2. **Keep ShipStation**: For order fulfillment after purchase
3. **Update Integration**: Implement the correct API for your chosen service
4. **Test with Real Data**: Get actual API keys and test with real addresses

## Resources

- [ShipEngine API Docs](https://www.shipengine.com/docs/)
- [EasyPost API Docs](https://www.easypost.com/docs/api)
- [Shippo API Docs](https://goshippo.com/docs/)
- [ShipStation Platform Docs](https://help.shipstation.com/)