'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function uploadBrandImage(
  brandId: string,
  imageType: 'logo' | 'banner_1' | 'banner_2',
  file: FormData
) {
  // First verify admin access with regular client
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await authClient
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  if (!userData?.is_admin) throw new Error('Unauthorized')
  
  // Use service role client for storage operations
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const fileData = file.get('file') as File
  if (!fileData) throw new Error('No file provided')
  
  // Generate path based on image type
  const fileExt = fileData.name.split('.').pop()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  
  let folder = ''
  switch(imageType) {
    case 'logo':
      folder = 'brand_images/logos'
      break
    case 'banner_1':
    case 'banner_2':
      folder = 'brand_images/banners'
      break
  }
  
  const fileName = `${brandId}-${imageType}-${timestamp}-${random}.${fileExt}`
  const filePath = `${folder}/${fileName}`
  
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
  
  // Store just the path, not the full URL (for CDN flexibility)
  const storagePath = filePath
  
  // Update brand with new image path
  const updateField = imageType === 'logo' ? 'logo_url' : 
                     imageType === 'banner_1' ? 'banner_url_1' : 'banner_url_2'
  
  // Get the old image URL to delete it
  const { data: brand } = await supabase
    .from('brands')
    .select(updateField)
    .eq('id', brandId)
    .single()
  
  // Delete old image if it exists and is in our bucket
  if (brand && brand[updateField]) {
    const oldPath = brand[updateField]
    
    // Only delete if it's a path in our bucket (not external URL)
    if (!oldPath.startsWith('http')) {
      await supabase.storage
        .from('products')
        .remove([oldPath])
    }
  }
  
  // Update brand with new path
  const { error: updateError } = await supabase
    .from('brands')
    .update({ [updateField]: storagePath })
    .eq('id', brandId)
  
  if (updateError) {
    // Try to delete uploaded file
    await supabase.storage.from('products').remove([filePath])
    throw updateError
  }
  
  // Get brand slug for cache revalidation
  const { data: brandData } = await supabase
    .from('brands')
    .select('slug')
    .eq('id', brandId)
    .single()
  
  if (brandData?.slug) {
    // Revalidate the brand page
    revalidatePath(`/brands/${brandData.slug}`)
    // Revalidate the brands listing page
    revalidatePath('/brands')
    // Revalidate admin page
    revalidatePath('/admin/brands')
    // Revalidate home page if it shows brand banners
    if (imageType === 'banner_1') {
      revalidatePath('/')
    }
  }
  
  // Also revalidate by tag for more granular control
  revalidateTag(`brand-${brandId}`)
  
  return storagePath
}

export async function deleteBrandImage(
  brandId: string,
  imageType: 'logo' | 'banner_1' | 'banner_2'
) {
  // First verify admin access with regular client
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: userData } = await authClient
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
    
  if (!userData?.is_admin) throw new Error('Unauthorized')
  
  // Use service role client for storage operations
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const updateField = imageType === 'logo' ? 'logo_url' : 
                     imageType === 'banner_1' ? 'banner_url_1' : 'banner_url_2'
  
  // Get the current image URL
  const { data: brand } = await supabase
    .from('brands')
    .select(updateField)
    .eq('id', brandId)
    .single()
  
  if (!brand || !brand[updateField]) {
    throw new Error('No image to delete')
  }
  
  // Delete from storage if it's a path in our bucket
  const imagePath = brand[updateField]
  if (!imagePath.startsWith('http')) {
    await supabase.storage
      .from('products')
      .remove([imagePath])
  }
  
  // Clear the URL in database
  const { error } = await supabase
    .from('brands')
    .update({ [updateField]: null })
    .eq('id', brandId)
  
  if (error) throw error
  
  // Get brand slug for cache revalidation
  const { data: brandData } = await supabase
    .from('brands')
    .select('slug')
    .eq('id', brandId)
    .single()
  
  if (brandData?.slug) {
    // Revalidate the brand page
    revalidatePath(`/brands/${brandData.slug}`)
    // Revalidate the brands listing page
    revalidatePath('/brands')
    // Revalidate admin page
    revalidatePath('/admin/brands')
    // Revalidate home page if it shows brand banners
    if (imageType === 'banner_1') {
      revalidatePath('/')
    }
  }
  
  // Also revalidate by tag
  revalidateTag(`brand-${brandId}`)
  
  return { success: true }
}