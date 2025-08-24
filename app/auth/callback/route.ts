import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!authError && user) {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // If user doesn't exist, create them with appropriate admin status
      if (!existingUser) {
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
        const isAdmin = adminEmails.includes(user.email || '');
        
        await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            is_admin: isAdmin
          });
      }
      
      // Redirect to the next URL or homepage
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Return to auth error page if no code or error occurred
  return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
}