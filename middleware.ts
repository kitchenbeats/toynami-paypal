import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Handle image redirects for SEO preservation
  // When domain transfers, old image URLs will redirect to Supabase Storage
  if (request.nextUrl.pathname.startsWith('/product_images/')) {
    // Extract the path after /product_images/
    const imagePath = request.nextUrl.pathname.replace('/product_images/', '')
    
    // Redirect to Supabase Storage URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl) {
      const storageUrl = `${supabaseUrl}/storage/v1/object/public/products/product_images/${imagePath}`
      return NextResponse.redirect(storageUrl, { status: 301 }) // 301 for permanent redirect (SEO friendly)
    }
  }

  // Continue with normal session update
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
