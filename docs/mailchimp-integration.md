# 📧 Mailchimp Integration Documentation

## Overview

This is a **real-time, event-driven** Mailchimp integration with **NO cron jobs or scheduled tasks**. Everything syncs automatically when events happen in your app.

## 🚀 Quick Start

### 1. Get Your Mailchimp Credentials

1. Log into [Mailchimp](https://mailchimp.com)
2. Go to **Account → Extras → API keys**
3. Create a new API key (looks like: `abc123def456-us14`)
4. Note the server prefix (the part after the dash, e.g., `us14`)
5. Go to **Audience → Settings → Audience name and defaults**
6. Copy your Audience ID (looks like: `a1b2c3d4e5`)

### 2. Configure in Admin Panel

1. Go to **Admin → Email Marketing** in your app
2. Enter your:
   - API Key
   - Server Prefix 
   - Audience/List ID
   - Store ID (optional, for e-commerce features)
3. Click **Test Connection**
4. Enable the integration
5. Choose what to sync (customers, orders, carts)
6. Save settings

### 3. Initial Data Sync (Optional)

If you have existing customers:
1. Go to the **Manual Tools** tab
2. Click **Sync All Customers** to push existing users to Mailchimp
3. Click **Sync All Products** if using e-commerce features

## 🎯 How It Works

### Event-Driven Architecture (No Cron Jobs!)

Everything happens automatically when events occur:

| Event | What Happens | Where It's Triggered |
|-------|-------------|---------------------|
| **User Signs Up** | → Added to Mailchimp list | `/api/auth/signup` |
| **Order Completed** | → Purchase recorded, cart deleted | `/api/paypal/capture-order` |
| **Cart Updated** | → Synced for abandoned cart tracking | `/api/cart/update` |
| **Profile Updated** | → Customer data synced | `/api/profile/update` |
| **User Unsubscribes** | → Tagged in Mailchimp | `/api/unsubscribe` |

### No Background Jobs Required

- ✅ **No cron jobs** - Everything is event-driven
- ✅ **No workers** - Runs in your existing API routes
- ✅ **No schedulers** - Real-time syncing
- ✅ **No monitoring** - Fire and forget
- ✅ **Serverless ready** - Works on Vercel/Netlify

## 📁 File Structure

```
/lib/mailchimp/
├── client.ts          # Main Mailchimp client class
└── events.ts          # Event trigger functions

/app/api/admin/mailchimp/
├── test/              # Test connection endpoint
├── sync-customers/    # Manual customer sync
└── sync-products/     # Manual product sync

/app/(admin)/admin/email/
├── page.tsx           # Email marketing page
└── mailchimp-manager.tsx  # Settings UI component

/supabase/migrations/
└── 20250119000000_mailchimp_integration.sql  # Database schema
```

## 🔧 Integration Points

### Adding to Existing Routes

To sync data when events happen, import and call the event functions:

```typescript
// In your signup route
import { onUserSignup } from '@/lib/mailchimp/events'

// After user is created
await onUserSignup({
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  phone: user.phone
})
```

```typescript
// In your order completion route
import { onOrderCompleted } from '@/lib/mailchimp/events'

// After payment is captured
await onOrderCompleted({
  id: order.id,
  user_id: order.user_id,
  email: order.email,
  total_cents: order.total_cents,
  items: orderItems,
  cart_id: order.cart_id
})
```

### Error Handling

The integration is designed to **never break your app**:
- All Mailchimp calls are wrapped in try/catch
- Errors are logged but don't throw
- Your checkout/signup will work even if Mailchimp is down

## 📊 Database Schema

### Tables Created

1. **mailchimp_settings** - Stores API credentials and sync preferences
2. **mailchimp_sync_status** - Tracks sync status per customer
3. **mailchimp_sync_log** - Logs all sync events for debugging

### Security

- Only admins can access Mailchimp settings
- API keys are stored server-side only
- Row-level security policies protect all tables

## 🎨 Features

### What's Synced

✅ **Customer Data**
- Email, name, phone
- Custom tags and segments
- Address information
- Group memberships

✅ **E-Commerce Data** 
- Orders and purchase history
- Cart contents for abandoned cart emails
- Product catalog (optional)
- Customer lifetime value

✅ **Events**
- New signups
- Purchases
- Cart abandonment
- Profile updates
- Unsubscribes

### What Happens in Mailchimp

When data syncs, Mailchimp can:
- Send welcome emails to new signups
- Trigger abandoned cart reminders
- Create segments based on purchase history
- Send targeted campaigns based on behavior
- Track ROI from email campaigns

## 🛠 Troubleshooting

### Connection Test Fails

1. Check your API key is correct
2. Verify server prefix matches your API key
3. Ensure List/Audience ID is correct
4. Check Mailchimp account is active

### Data Not Syncing

1. Verify integration is enabled in settings
2. Check specific sync options are turned on
3. Look at sync logs in the database
4. Use manual sync tools to force sync

### Common Issues

| Issue | Solution |
|-------|----------|
| 401 Error | Invalid API key |
| 404 Error | Wrong list ID or server prefix |
| Rate Limit | Too many requests (unlikely with event-driven) |
| No data in Mailchimp | Check sync settings are enabled |

## 🔒 Security Notes

- API keys are never exposed to the frontend
- All admin routes check authentication
- Sync happens server-side only
- Customer data is hashed (MD5) for Mailchimp API

## 📈 Best Practices

1. **Start with manual sync** - Sync existing customers first
2. **Test with a few users** - Before enabling for all
3. **Monitor sync logs** - Check for any failures
4. **Use tags wisely** - For segmentation in Mailchimp
5. **Keep it simple** - Let Mailchimp handle complex automations

## 🚦 Status Indicators

In the admin panel:
- 🟢 **Active** - Integration is running
- 🟡 **Pending** - Customers waiting to sync
- 🔴 **Failed** - Sync errors (check logs)
- ⚡ **Real-time** - No delays, instant sync

## 💡 Pro Tips

1. **Use Mailchimp for campaigns** - Don't build an email builder
2. **Let automations run there** - Mailchimp's UI is better
3. **Sync what matters** - Don't over-sync unnecessary data
4. **Manual sync sparingly** - Only for initial setup or fixes
5. **Check the logs** - If something seems off

## 🔗 Useful Links

- [Mailchimp API Docs](https://mailchimp.com/developer/marketing/)
- [Find Your API Key](https://us1.admin.mailchimp.com/account/api/)
- [Audience Settings](https://us1.admin.mailchimp.com/lists/)
- [E-commerce Features](https://mailchimp.com/developer/marketing/docs/e-commerce/)

---

**Remember**: This integration is event-driven. No cron jobs, no background workers, no scheduled tasks. Everything happens in real-time as users interact with your app! 🚀