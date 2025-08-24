# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server with Turbopack
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Lint code
pnpm run lint

# Migrate images from legacy system
pnpm run migrate-images
```

## High-Level Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth with SSR cookie-based sessions
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Payments**: PayPal integration (paypal-server-sdk and react-paypal-js)
- **Shipping**: ShipStation V1 (order management) and V2 (shipping rates)
- **Tax**: TaxCloud integration for SST compliance
- **Email**: Mailchimp integration for marketing and transactional emails
- **Language**: TypeScript

### Application Routes Structure

The app uses Next.js App Router with route groups:

#### Shop Routes (`/app/(shop)`)
- **Homepage** (`/`): Main landing page with carousel, featured products
- **Product Catalog** (`/[slug]/[product]`): Category and product detail pages
- **Brands** (`/brands/*`): Brand listing and individual brand pages
- **Shopping Flow** (`/cart`, `/checkout`): Cart management and checkout
- **Announcements** (`/announcements/*`): News and updates

#### Admin Routes (`/app/(admin)`)
- **Dashboard** (`/admin`): Analytics and overview
- **Product Management** (`/admin/products/*`): CRUD operations, image management
- **Content Management**: Banners, blog, carousel, pages
- **Commerce Settings**: Brands, categories, options, promotions, coupons
- **Order Management** (`/admin/orders/*`, `/admin/shipments/*`): Order processing, ShipStation sync
- **Customer Management** (`/admin/customers`, `/admin/customer-groups`): User management, tier system
- **Integrations**: ShipStation, tax settings, email campaigns
- **Documentation** (`/admin/docs`): Built-in admin help

### API Routes (`/app/api`)

- **PayPal** (`/paypal/*`): Order creation, capture, product sync
- **Shipping** (`/shipping/*`): Rate calculation, address validation, carrier services
- **ShipStation** (`/shipstation/*`, `/webhooks/shipstation`): Store management, order sync, tracking webhooks
- **Tax** (`/tax/*`): TaxCloud SST-compliant tax calculation
- **Admin** (`/admin/*`): Order management, ShipStation sync operations
- **Coupons** (`/coupons/*`): Coupon validation and application
- **Webhooks** (`/webhooks/*`): External service integrations

### Data Layer (`/lib`)

- **Supabase Clients**: Server (`server.ts`), Client (`client.ts`), and Middleware (`middleware.ts`) implementations
- **Data Access** (`/lib/data/*`): Type-safe database queries for all entities
- **Hooks** (`/lib/hooks/*`): React hooks including cart management
- **ShipStation** (`/lib/shipstation/*`): V1 client for orders, V2 client for shipping rates
- **Mailchimp** (`/lib/mailchimp/*`): Client and event tracking
- **Utilities** (`/lib/utils/*`): Image processing and general utilities

### Database Schema

The Supabase database includes comprehensive e-commerce tables with RLS policies:

- **Core Commerce**: Products, variants, categories, brands with soft-delete support
- **Dynamic Content**: Banners (with page targeting), blog posts, announcements, carousel slides, pages, menus
- **Customer System**: User profiles, customer groups with tier-based access
- **Order Management**: Shopping carts, orders, payment tracking, shipping details
- **Integrations**: PayPal sync, ShipStation tracking, Mailchimp events
- **Promotions**: Coupons system, discount rules
- **Settings**: Global configuration, tax settings

### Key Integrations

#### PayPal Integration
- Server-side SDK implementation
- Product catalog synchronization
- Order creation and capture flows
- Client-side PayPal buttons with react-paypal-js

#### ShipStation Integration
- **V1 API**: Order creation, status updates, store management
- **V2 API**: Real-time shipping rate calculation
- **Webhooks**: Tracking updates, delivery notifications
- **Admin Dashboard**: Manual sync, label creation

#### TaxCloud Integration
- SST-compliant tax calculation for 24 states
- Admin-configurable settings
- Tax exemption support
- Origin-based calculation

#### Mailchimp Integration
- Customer list synchronization
- Order event tracking
- Campaign management
- Transactional email support

### Authentication & Security

- Supabase Auth with cookie-based sessions for SSR
- Middleware protection for authenticated routes
- Row Level Security (RLS) on all database tables
- Admin role checking via `is_admin` flag

### Environment Configuration

Required environment variables (see `.env.example`):

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **PayPal**: `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_SANDBOX`
- **ShipStation**: V1 and V2 API keys, warehouse address
- **TaxCloud**: API credentials (can be configured in admin panel)
- **Site**: `NEXT_PUBLIC_SITE_URL`

### Image Handling

- Supabase bucket storage for uploads
- Legacy image migration support
- Configured remote patterns in `next.config.ts` for CDN access

### Important Development Rules

- Use proper TypeScript typing, never use `any`
- Never use mock or fake data in production code
- Follow existing code patterns and conventions
- Use Zod for runtime validation
- Always prefer editing existing files over creating new ones
- Never create documentation files unless explicitly requested
- Check existing components before creating new ones