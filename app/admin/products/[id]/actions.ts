'use server'

import { createClient } from '@/lib/supabase/server'

export async function uploadProductImage(
  productId: number,
  file: FormData
) {
  const supabase = await createClient()
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  if (!userData?.is_admin) throw new Error('Unauthorized')
  
  const fileData = file.get('file') as File
  if (!fileData) throw new Error('No file provided')
  
  // Generate path
  const fileExt = fileData.name.split('.').pop()
  const fileName = `${productId}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const firstLetter = productId.toString()[0] || '0'
  const filePath = `products/product_images/${firstLetter}/${productId}/${fileName}`
  
  // Convert File to ArrayBuffer
  const arrayBuffer = await fileData.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  // Upload to storage
  const { error: uploadError, data } = await supabase.storage
    .from('products')
    .upload(filePath, buffer, {
      contentType: fileData.type,
      cacheControl: '3600',
      upsert: false
    })
  
  if (uploadError) throw uploadError
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(filePath)
  
  // Get current images count for position
  const { count } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId)
  
  // Insert into database
  const { data: imageData, error: dbError } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_filename: publicUrl,
      alt_text: fileData.name.split('.')[0],
      position: count || 0,
      is_primary: count === 0 // First image is primary
    })
    .select()
    .single()
  
  if (dbError) {
    // Try to delete uploaded file
    await supabase.storage.from('products').remove([filePath])
    throw dbError
  }
  
  return imageData
}

export async function deleteProductImage(imageId: string, imageUrl: string) {
  const supabase = await createClient()
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  if (!userData?.is_admin) throw new Error('Unauthorized')
  
  // Delete from database
  const { error: dbError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)
  
  if (dbError) throw dbError
  
  // If stored in Supabase, delete from storage
  if (imageUrl.includes('supabase')) {
    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/products\/(.*)/)
    if (pathMatch && pathMatch[1]) {
      const fullPath = decodeURIComponent(pathMatch[1])
      await supabase.storage
        .from('products')
        .remove([fullPath])
    }
  }
  
  return { success: true }
}

export async function updateImagePosition(imageId: string, position: number) {
  const supabase = await createClient()
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  if (!userData?.is_admin) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('product_images')
    .update({ position })
    .eq('id', imageId)
  
  if (error) throw error
  
  return { success: true }
}

export async function updateImageAltText(imageId: string, altText: string) {
  const supabase = await createClient()
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  if (!userData?.is_admin) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('product_images')
    .update({ alt_text: altText })
    .eq('id', imageId)
  
  if (error) throw error
  
  return { success: true }
}

export async function setImageAsPrimary(productId: number, imageId: string) {
  const supabase = await createClient()
  
  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  if (!userData?.is_admin) throw new Error('Unauthorized')
  
  // Unset all as primary
  await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId)
  
  // Set selected as primary
  const { error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId)
  
  if (error) throw error
  
  return { success: true }
}