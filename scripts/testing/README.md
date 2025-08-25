# Testing Scripts

⚠️ **WARNING: These scripts create REAL orders and data!**

These scripts have been moved here from the root directory for safety.
They should NEVER be deployed to production.

## Scripts:
- `test-shipstation.js` - Creates test orders in ShipStation
- `test-store-order.js` - Creates test orders in the database
- `check-stores.js` - Checks ShipStation store configuration

## Usage (Development Only):
```bash
# Run from project root
node scripts/testing/test-shipstation.js
```

**DO NOT** commit any changes that move these back to the root directory.