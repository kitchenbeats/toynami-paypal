import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/lib/hooks/use-cart";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterNew } from "@/components/site-footer-new";
import { Toaster } from "sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Toynami Store - Collectibles & Toys",
  description: "Premium collectibles, toys, and exclusive merchandise",
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
          <CartProvider>
            <SiteHeader />
            <main className="min-h-screen">
              {children}
            </main>
            <SiteFooterNew />
            <Toaster position="top-right" richColors />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
