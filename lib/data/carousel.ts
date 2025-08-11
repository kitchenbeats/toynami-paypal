import { createClient } from '../supabase/server'

export interface CarouselSlide {
  id: string
  heading: string | null
  text: string | null
  button_text: string | null
  link: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CarouselSettings {
  id: string
  swap_interval: number
  is_autoplay: boolean
  created_at: string
  updated_at: string
}

// Get all carousel slides
export async function getCarouselSlides(includeInactive = false) {
  const supabase = await createClient()
  
  let query = supabase
    .from('carousel_slides')
    .select('*')
    .order('display_order', { ascending: true })
  
  if (!includeInactive) {
    query = query.eq('is_active', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching carousel slides:', error)
    return []
  }
  
  return data as CarouselSlide[]
}

// Get carousel settings
export async function getCarouselSettings() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('carousel_settings')
    .select('*')
    .single()
  
  if (error) {
    console.error('Error fetching carousel settings:', error)
    return {
      id: '',
      swap_interval: 5000,
      is_autoplay: true,
      created_at: '',
      updated_at: ''
    } as CarouselSettings
  }
  
  return data as CarouselSettings
}

// Update carousel slides (admin only)
export async function updateCarouselSlides(slides: Partial<CarouselSlide>[]) {
  const supabase = await createClient()
  
  // Delete all existing slides
  const { error: deleteError } = await supabase
    .from('carousel_slides')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
  
  if (deleteError && deleteError.code !== 'PGRST116') { // Ignore "no rows" error
    console.error('Error deleting carousel slides:', deleteError)
    return { success: false, error: deleteError.message }
  }
  
  // Insert new slides if any
  if (slides.length > 0) {
    const { error: insertError } = await supabase
      .from('carousel_slides')
      .insert(slides.map((slide, index) => ({
        ...slide,
        display_order: index
      })))
    
    if (insertError) {
      console.error('Error inserting carousel slides:', insertError)
      return { success: false, error: insertError.message }
    }
  }
  
  return { success: true }
}

// Update carousel settings (admin only)
export async function updateCarouselSettings(settings: Partial<CarouselSettings>) {
  const supabase = await createClient()
  
  // Get existing settings first
  const { data: existing } = await supabase
    .from('carousel_settings')
    .select('id')
    .single()
  
  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('carousel_settings')
      .update(settings)
      .eq('id', existing.id)
    
    if (error) {
      console.error('Error updating carousel settings:', error)
      return { success: false, error: error.message }
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('carousel_settings')
      .insert([settings])
    
    if (error) {
      console.error('Error inserting carousel settings:', error)
      return { success: false, error: error.message }
    }
  }
  
  return { success: true }
}