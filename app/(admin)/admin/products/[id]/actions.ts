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
  const { error: uploadError } = await supabase.storage
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
  
  // Get current media usage count for field naming
  const { count } = await supabase
    .from('media_usage')
    .select('*', { count: 'exact', head: true })
    .eq('entity_type', 'product')
    .eq('entity_id', productId.toString())
  
  // Determine field name
  const fieldName = count === 0 ? 'primary_image' : `gallery_image_${count}`
  
  // Insert into media library
  const { data: mediaData, error: mediaError } = await supabase
    .from('media_library')
    .insert({
      filename: fileName,
      original_name: fileData.name,
      file_path: filePath,
      file_url: publicUrl,
      file_size: buffer.length,
      mime_type: fileData.type,
      file_extension: fileExt,
      alt_text: fileData.name.split('.')[0],
      folder: 'products',
      uploaded_by: user.id
    })
    .select()
    .single()
  
  if (mediaError) {
    // Try to delete uploaded file
    await supabase.storage.from('products').remove([filePath])
    throw mediaError
  }
  
  // Create media usage link
  const { error: usageError } = await supabase
    .from('media_usage')
    .insert({
      media_id: mediaData.id,
      entity_type: 'product',
      entity_id: productId.toString(),
      field_name: fieldName
    })
  
  if (usageError) {
    // Clean up media library entry and file
    await supabase.from('media_library').delete().eq('id', mediaData.id)
    await supabase.storage.from('products').remove([filePath])
    throw usageError
  }
  
  return {
    ...mediaData,
    is_primary: fieldName === 'primary_image'
  }
}

export async function deleteProductImage(mediaId: string, productId: number) {
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
  
  // Get media details
  const { data: media } = await supabase
    .from('media_library')
    .select('file_path')
    .eq('id', mediaId)
    .single()
  
  // Delete media usage link
  const { error: usageError } = await supabase
    .from('media_usage')
    .delete()
    .eq('media_id', mediaId)
    .eq('entity_type', 'product')
    .eq('entity_id', productId.toString())
  
  if (usageError) throw usageError
  
  // Check if media is used elsewhere
  const { count } = await supabase
    .from('media_usage')
    .select('*', { count: 'exact', head: true })
    .eq('media_id', mediaId)
  
  // If not used elsewhere, delete from media library and storage
  if (count === 0) {
    // Delete from media library (will cascade delete from media_usage)
    const { error: mediaError } = await supabase
      .from('media_library')
      .delete()
      .eq('id', mediaId)
    
    if (mediaError) throw mediaError
    
    // Delete from storage if path exists
    if (media?.file_path) {
      await supabase.storage
        .from('products')
        .remove([media.file_path])
    }
  }
  
  return { success: true }
}

export async function updateImagePosition(mediaId: string, productId: number, fieldName: string) {
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
  
  // Update the field name in media_usage
  const { error } = await supabase
    .from('media_usage')
    .update({ field_name: fieldName })
    .eq('media_id', mediaId)
    .eq('entity_type', 'product')
    .eq('entity_id', productId.toString())
  
  if (error) throw error
  
  return { success: true }
}

export async function setAsPrimaryImage(mediaId: string, productId: number) {
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
  
  // Get all current images for this product
  const { data: currentImages } = await supabase
    .from('media_usage')
    .select('media_id, field_name')
    .eq('entity_type', 'product')
    .eq('entity_id', productId.toString())
  
  if (!currentImages) throw new Error('No images found')
  
  // Find current primary
  const currentPrimary = currentImages.find(img => img.field_name === 'primary_image')
  const newPrimary = currentImages.find(img => img.media_id === mediaId)
  
  if (!newPrimary) throw new Error('Image not found')
  
  // Swap field names
  if (currentPrimary && currentPrimary.media_id !== mediaId) {
    // Update current primary to gallery image
    await supabase
      .from('media_usage')
      .update({ field_name: newPrimary.field_name })
      .eq('media_id', currentPrimary.media_id)
      .eq('entity_type', 'product')
      .eq('entity_id', productId.toString())
  }
  
  // Update new primary
  const { error } = await supabase
    .from('media_usage')
    .update({ field_name: 'primary_image' })
    .eq('media_id', mediaId)
    .eq('entity_type', 'product')
    .eq('entity_id', productId.toString())
  
  if (error) throw error
  
  return { success: true }
}

export async function linkExistingMedia(productId: number, mediaId: string) {
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
  
  // Get current media usage count for field naming
  const { count } = await supabase
    .from('media_usage')
    .select('*', { count: 'exact', head: true })
    .eq('entity_type', 'product')
    .eq('entity_id', productId.toString())
  
  // Determine field name
  const fieldName = count === 0 ? 'primary_image' : `gallery_image_${count}`
  
  // Create media usage link
  const { error } = await supabase
    .from('media_usage')
    .insert({
      media_id: mediaId,
      entity_type: 'product',
      entity_id: productId.toString(),
      field_name: fieldName
    })
  
  if (error) throw error
  
  return { success: true }
}