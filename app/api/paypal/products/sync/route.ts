import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * PayPal Catalog Products API Integration
 * Syncs products between PayPal and our database
 * 
 * PayPal Product Structure:
 * - id: Product ID in PayPal
 * - name: Product name
 * - description: Product description  
 * - type: PHYSICAL, DIGITAL, or SERVICE
 * - category: Product category
 * - image_url: Product image
 * - home_url: Product URL
 */

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com'

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

// Create product in PayPal
export async function createPayPalProduct(product: {
  id?: string;
  sku?: string;
  slug: string;
  name: string;
  description?: string;
  brand?: { name: string };
  images?: Array<{ image_filename: string }>;
}) {
  const accessToken = await getPayPalAccessToken()

  const paypalProduct = {
    id: product.sku || product.slug, // Use SKU as PayPal product ID
    name: product.name,
    description: product.description,
    type: product.is_digital ? 'DIGITAL' : 'PHYSICAL',
    category: 'COLLECTIBLES',
    image_url: product.images?.[0]?.image_url,
    home_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
  }

  const response = await fetch(`${PAYPAL_API_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `product-${product.id}`, // Idempotency key
    },
    body: JSON.stringify(paypalProduct),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`PayPal API error: ${error}`)
  }

  return await response.json()
}

// Update product in PayPal
export async function updatePayPalProduct(paypalProductId: string, updates: {
  name?: string;
  description?: string;
  category?: string;
  image_url?: string;
  home_url?: string;
}) {
  const accessToken = await getPayPalAccessToken()

  const patchOperations = []
  
  if (updates.name) {
    patchOperations.push({
      op: 'replace',
      path: '/name',
      value: updates.name,
    })
  }
  
  if (updates.description) {
    patchOperations.push({
      op: 'replace',
      path: '/description',
      value: updates.description,
    })
  }

  if (updates.image_url) {
    patchOperations.push({
      op: 'replace',
      path: '/image_url',
      value: updates.image_url,
    })
  }

  const response = await fetch(
    `${PAYPAL_API_URL}/v1/catalogs/products/${paypalProductId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patchOperations),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`PayPal API error: ${error}`)
  }

  return response.status === 204
}

// Sync all products from PayPal to database
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check admin permission
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get products from PayPal
    const accessToken = await getPayPalAccessToken()
    const response = await fetch(
      `${PAYPAL_API_URL}/v1/catalogs/products?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch PayPal products')
    }

    const paypalData = await response.json()
    const paypalProducts = paypalData.products || []

    // Sync to database
    const syncResults = {
      created: 0,
      updated: 0,
      errors: [],
    }

    for (const ppProduct of paypalProducts) {
      try {
        // Check if product exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('paypal_product_id', ppProduct.id)
          .single()

        if (existingProduct) {
          // Update existing product
          await supabase
            .from('products')
            .update({
              name: ppProduct.name,
              description: ppProduct.description,
              is_digital: ppProduct.type === 'DIGITAL',
              updated_at: new Date().toISOString(),
            })
            .eq('paypal_product_id', ppProduct.id)
          
          syncResults.updated++
        } else {
          // Create new product
          await supabase
            .from('products')
            .insert({
              paypal_product_id: ppProduct.id,
              slug: ppProduct.id.toLowerCase(),
              name: ppProduct.name,
              description: ppProduct.description,
              is_digital: ppProduct.type === 'DIGITAL',
              status: 'active',
              is_visible: true,
              allow_purchases: true,
            })
          
          syncResults.created++
        }
      } catch (error) {
          console.error('Database operation failed:', error)
        syncResults.errors.push({
          product: ppProduct.id,
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      results: syncResults,
      total: paypalProducts.length,
    })
  } catch (error) {
      console.error('Database operation failed:', error)
    console.error('PayPal sync error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Create or update a single product
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    // Check admin permission
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create product in database first
    const { data: product, error: dbError } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()

    if (dbError) {
      throw dbError
    }

    // Then create in PayPal
    try {
      const paypalProduct = await createPayPalProduct(product)
      
      // Update product with PayPal ID
      await supabase
        .from('products')
        .update({ paypal_product_id: paypalProduct.id })
        .eq('id', product.id)

      return NextResponse.json({
        success: true,
        product,
        paypal: paypalProduct,
      })
    } catch (paypalError) {
      // If PayPal fails, mark product as needs_sync
      await supabase
        .from('products')
        .update({ sync_status: 'pending' })
        .eq('id', product.id)

      return NextResponse.json({
        success: true,
        product,
        warning: 'Product created locally but PayPal sync failed',
        error: paypalError.message,
      })
    }
  } catch (error) {
      console.error('Database operation failed:', error)
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}