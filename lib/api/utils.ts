import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { createClient } from '@/lib/supabase/server'

/**
 * Standard API error response
 */
export function apiError(message: string, status: number = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
    },
    { status }
  )
}

/**
 * Standard API success response
 */
export function apiSuccess<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    ...(message && { message }),
    data,
  })
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError) {
  const errors = error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }))
  
  return apiError('Validation failed', 400, { errors })
}

/**
 * Validate request body with Zod schema
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { data }
  } catch (error) {
      console.error('Error in catch block:', error)
    if (error instanceof ZodError) {
      return { error: handleValidationError(error) }
    }
    return { error: apiError('Invalid request body', 400) }
  }
}

/**
 * Validate query parameters with Zod schema
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams | { [key: string]: string | string[] | undefined },
  schema: z.ZodSchema<T>
): { data: T; error?: never } | { data?: never; error: NextResponse } {
  try {
    // Convert URLSearchParams to plain object if needed
    const params = searchParams instanceof URLSearchParams 
      ? Object.fromEntries(searchParams.entries())
      : searchParams
    
    const data = schema.parse(params)
    return { data }
  } catch (error) {
      console.error('Error in catch block:', error)
    if (error instanceof ZodError) {
      return { error: handleValidationError(error) }
    }
    return { error: apiError('Invalid query parameters', 400) }
  }
}

/**
 * Check if the current user is authenticated
 */
export async function requireAuth() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { user: null, error: apiError('Authentication required', 401) }
  }
  
  return { user, error: null }
}

/**
 * Check if the current user is an admin
 */
export async function requireAdmin() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return { user: null, isAdmin: false, error: apiError('Authentication required', 401) }
  }
  
  // Check admin status
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (userError || !userData?.is_admin) {
    return { user, isAdmin: false, error: apiError('Admin access required', 403) }
  }
  
  return { user, isAdmin: true, error: null }
}

/**
 * Wrapper for API route handlers with error handling
 */
export function apiHandler<T = unknown>(
  handler: (request: NextRequest, context?: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: T) => {
    try {
      return await handler(request, context)
    } catch (error) {
      console.error('API Handler Error:', error)
      
      if (error instanceof ZodError) {
        return handleValidationError(error)
      }
      
      if (error instanceof Error) {
        // Don't expose internal error messages in production
        const message = process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Internal server error'
        return apiError(message, 500)
      }
      
      return apiError('Internal server error', 500)
    }
  }
}

/**
 * Parse JSON body safely
 */
export async function parseJsonBody<T = unknown>(request: NextRequest): Promise<T | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}