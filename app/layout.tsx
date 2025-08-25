import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: '%s | Toynami Store',
    default: 'Toynami Store - Premium Collectibles, Toys & Action Figures'
  },
  description: "Shop premium collectibles, toys, action figures, and exclusive merchandise at Toynami Store. Authentic anime figures, gaming collectibles, limited editions & pop culture items with fast shipping.",
  keywords: [
    "collectibles", "toys", "action figures", "anime figures", "gaming collectibles", 
    "pop culture", "merchandise", "limited edition", "exclusive items", "toynami",
    "figurines", "statues", "model kits", "plushies", "vinyl figures"
  ],
  authors: [{ name: "Toynami Store" }],
  creator: "Toynami Store",
  publisher: "Toynami Store",
  applicationName: "Toynami Store",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: defaultUrl,
    siteName: 'Toynami Store',
    title: 'Toynami Store - Premium Collectibles, Toys & Action Figures',
    description: 'Shop premium collectibles, toys, action figures, and exclusive merchandise. Authentic anime figures, gaming collectibles & limited editions.',
    images: [{
      url: '/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'Toynami Store - Premium Collectibles, Toys & Action Figures',
      type: 'image/png'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@toynami',
    creator: '@toynami',
    title: 'Toynami Store - Premium Collectibles, Toys & Action Figures',
    description: 'Shop premium collectibles, toys, action figures, and exclusive merchandise.',
    images: [{
      url: '/twitter-image.png',
      alt: 'Toynami Store - Premium Collectibles'
    }]
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
    }
  },
  alternates: {
    canonical: defaultUrl,
    languages: {
      'en-US': defaultUrl,
    }
  },
  category: 'shopping',
  classification: 'e-commerce',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Toynami Store',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  }
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global SEO Structured Data */}
          <StructuredData type="organization" />
          <StructuredData type="website" />
          {children}
          <Toaster position="bottom-left" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
