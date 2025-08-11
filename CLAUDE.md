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
- **Styling**: Tailwind CSS with shadcn/ui components
- **Payments**: PayPal integration (checkout-server-sdk and react-paypal-js)
- **Language**: TypeScript

### Project Structure

#### Core Application (`/app`)
The app uses Next.js App Router with the following key routes:
- **Authentication** (`/auth/*`): Login, signup, password recovery flows
- **Admin Panel** (`/admin/*`): Product management, banners, blog, brands, categories, customer groups, global options
- **E-commerce** (`/products/*`, `/cart`): Product catalog with detail pages, shopping cart
- **User Account** (`/account`): Customer dashboard
- **Protected Routes** (`/(protected)/*`): Authenticated-only areas

#### Data Layer (`/lib`)
- **Supabase Clients**: Server (`server.ts`), Client (`client.ts`), and Middleware (`middleware.ts`) implementations
- **Data Access** (`/lib/data/*`): Type-safe database queries for products, brands, categories, banners, blog posts, customer groups
- **Hooks** (`/lib/hooks/*`): React hooks including cart management (`use-cart.tsx`)
- **Utilities** (`/lib/utils/*`): Image processing and general utilities

#### Components (`/components`)
- **UI Components** (`/ui/*`): Reusable shadcn/ui components (buttons, cards, forms, etc.)
- **Feature Components**: Product grids, filters, detail views, cart management
- **Admin Components**: Dashboard and management interfaces
- **Toynami-specific**: Custom e-commerce components (hero carousel, featured products, wishlist)

### Database Schema
The Supabase database includes:
- **Core Commerce**: Products, variants, categories, brands with soft-delete support
- **Dynamic Content**: Banners, blog posts, announcements
- **Customer System**: User profiles, customer groups with tier-based access
- **Order Management**: Shopping carts, orders, payment tracking
- **PayPal Sync**: Product synchronization with PayPal catalog
- **Global Options**: Configurable product options system

Key migrations in `/supabase/migrations/`:
- Initial schema with RLS policies
- Dynamic content system
- Customer groups and loyalty tiers
- PayPal integration tables
- Global product options
- Featured flags for products/categories

### Authentication & Security
- Supabase Auth with cookie-based sessions for SSR
- Middleware protection for authenticated routes (`/account`, `/admin`, `/profile`, `/orders`, `/wishlist`)
- Row Level Security (RLS) policies on all database tables
- Admin role checking via `is_admin` flag on users table

### PayPal Integration
- Server-side API routes in `/app/api/paypal/*`
- Product catalog sync endpoint (`/api/paypal/products/sync`)
- Order creation and capture flows
- Client-side PayPal provider wrapper

### Environment Configuration
Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: PayPal client ID
- `PAYPAL_CLIENT_SECRET`: PayPal secret (server-side only)
- `PAYPAL_SANDBOX`: PayPal environment flag
- `NEXT_PUBLIC_SITE_URL`: Site URL for callbacks

### Image Handling
- Supports multiple CDN sources (BigCommerce, Toynami legacy, Supabase storage)
- Image migration script for legacy content
- Configured remote patterns in `next.config.ts`