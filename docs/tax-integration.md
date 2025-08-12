# Tax Calculation Integration Guide

## Overview

This document outlines the tax calculation options for the Toynami e-commerce platform.

## Recommended Solution: TaxCloud

### Why TaxCloud?
- **FREE** in 24 Streamlined Sales Tax (SST) states
- **$19/month** for Premium features
- **No sales calls** required
- **Transparent pricing**
- **Simple API** integration

### Getting Started with TaxCloud

1. **Sign up** at https://taxcloud.com
2. **Get API credentials**:
   - API Key
   - API Login ID
3. **Register with USPS** for address verification (free):
   - https://www.usps.com/business/web-tools-apis/
4. **Add to .env.local**:
```bash
TAX_PROVIDER=taxcloud
TAXCLOUD_API_KEY=your_api_key
TAXCLOUD_API_LOGIN_ID=your_login_id
TAXCLOUD_USPS_USER_ID=your_usps_id
```

### Free SST States (No charge for TaxCloud):
- Arkansas, Georgia, Indiana, Iowa, Kansas, Kentucky, Michigan, Minnesota, Nebraska, Nevada, New Jersey, North Carolina, North Dakota, Ohio, Oklahoma, Rhode Island, South Dakota, Tennessee, Utah, Vermont, Washington, West Virginia, Wisconsin, Wyoming

## Alternative: Avalara AvaTax

### When to Use Avalara:
- Enterprise requirements (>$10M revenue)
- International tax compliance needed
- Complex tax scenarios (exemptions, multiple nexus)
- Budget >$5,000/year

### Avalara Setup:
1. **Contact sales** for pricing (no public pricing)
2. **Get sandbox access** (2-month free trial)
3. **Configure in .env.local**:
```bash
TAX_PROVIDER=avalara
AVALARA_ACCOUNT_ID=your_account_id
AVALARA_LICENSE_KEY=your_license_key
AVALARA_COMPANY_CODE=your_company_code
AVALARA_SANDBOX=true # Set to false for production
```

## Fallback: Simple Tax Calculation

For development/testing, a simple state-based calculation is included:
```bash
TAX_PROVIDER=simple
# No additional configuration needed
```

## API Usage

### Calculate Tax
```typescript
const response = await fetch('/api/tax/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [
      {
        id: 'PROD001',
        name: 'Product Name',
        price: 99.99,
        quantity: 1,
        taxCode: '00000' // Optional tax code
      }
    ],
    shippingAddress: {
      address: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    shippingAmount: 10.00 // Optional
  })
})

const result = await response.json()
// {
//   success: true,
//   provider: 'taxcloud',
//   totalTax: 7.27,
//   taxRate: 0.0725,
//   breakdown: [...]
// }
```

## Cost Comparison

| Provider | Free Tier | Paid Tier | Notes |
|----------|-----------|-----------|-------|
| **TaxCloud** | ✅ Free in 24 states | $19-199/month | Best value for SMB |
| **Avalara** | ❌ No free tier | $5,000+/year | Enterprise focused |
| **Simple** | ✅ Always free | N/A | Development only |

## Recommendations by Business Size

### Startup/Small Business (<$1M revenue)
1. **Use TaxCloud** (free or $19/month)
2. Start with simple calculation if needed
3. Upgrade as you grow

### Medium Business ($1M-$10M revenue)
1. **TaxCloud Premium** ($99-199/month)
2. Consider Avalara if complex requirements

### Enterprise (>$10M revenue)
1. **Avalara AvaTax** for full compliance
2. Custom enterprise agreement

## Integration Checklist

- [ ] Choose tax provider based on budget/requirements
- [ ] Sign up and get API credentials
- [ ] Add credentials to .env.local
- [ ] Test with sandbox/development mode
- [ ] Implement tax calculation in checkout flow
- [ ] Add tax display to cart/checkout UI
- [ ] Test with various addresses
- [ ] Handle tax-exempt customers (if applicable)
- [ ] Set up tax reporting/remittance process

## Support Resources

### TaxCloud
- Documentation: https://taxcloud.com/support/
- API Reference: https://api.taxcloud.net/
- Support: support@taxcloud.com

### Avalara
- Developer Portal: https://developer.avalara.com/
- API Reference: https://developer.avalara.com/api-reference/avatax/rest/v2/
- Support: https://help.avalara.com/

## Next Steps

1. **Immediate**: Implement TaxCloud for free tax calculation
2. **Short-term**: Test integration thoroughly
3. **Long-term**: Evaluate upgrade needs based on growth