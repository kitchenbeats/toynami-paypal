import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: '%s | Toynami Store',
    default: 'Toynami Store - Premium Collectibles & Toys'
  },
  description: "Discover premium collectibles, toys, and exclusive merchandise at Toynami Store. Shop authentic figures, limited editions, and pop culture items.",
  keywords: ["collectibles", "toys", "figures", "pop culture", "merchandise", "limited edition", "anime", "gaming"],
  authors: [{ name: "Toynami Store" }],
  creator: "Toynami Store",
  publisher: "Toynami Store",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
    title: 'Toynami Store - Premium Collectibles & Toys',
    description: 'Discover premium collectibles, toys, and exclusive merchandise at Toynami Store.',
    images: [{
      url: '/opengraph-image.png',
      width: 1200,
      height: 630,
      alt: 'Toynami Store - Premium Collectibles'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@toynami',
    creator: '@toynami',
    title: 'Toynami Store - Premium Collectibles & Toys',
    description: 'Discover premium collectibles, toys, and exclusive merchandise.',
    images: ['/twitter-image.png']
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: defaultUrl,
  },
  category: 'e-commerce',
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
          {/* Global Organization Structured Data */}
          <StructuredData type="organization" />
          {children}
          <Toaster position="bottom-left" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
