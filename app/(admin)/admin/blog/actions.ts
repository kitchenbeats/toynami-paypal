'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function uploadBlogImage(
  imageType: 'featured_image' | 'thumbnail_url',
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
  
  const folder = imageType === 'featured_image' ? 'blog/featured' : 'blog/thumbnails'
  const fileName = `${imageType}-${timestamp}-${random}.${fileExt}`
  const filePath = `${folder}/${fileName}`
  
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
  
  // Return just the path for storage in database
  return filePath
}

export async function deleteBlogImage(imagePath: string) {
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
  
  // Delete from storage if it's a path in our bucket
  if (!imagePath.startsWith('http')) {
    const { error } = await supabase.storage
      .from('products')
      .remove([imagePath])
    
    if (error) throw error
  }
  
  return { success: true }
}