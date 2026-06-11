import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Types
export interface AdBanner {
  id: string
  image_url: string
  link_url: string | null
  order_index: number
  is_active: boolean
  title: string | null
  created_at: string
}

// Fetch active banners ordered by index
export async function getAdBanners(): Promise<AdBanner[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('ad_banners')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  
  if (error) throw error
  return data || []
}

// Add new banner
export async function addAdBanner(banner: {
  image_url: string
  link_url?: string
  title?: string
  order_index?: number
}) {
  if (!supabase) throw new Error('Supabase not initialized')
  const { data, error } = await supabase
    .from('ad_banners')
    .insert([banner])
    .select()
  
  if (error) throw error
  return data
}

// Update banner
export async function updateAdBanner(id: string, updates: Partial<AdBanner>) {
  if (!supabase) throw new Error('Supabase not initialized')
  const { data, error } = await supabase
    .from('ad_banners')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data
}

// Delete banner
export async function deleteAdBanner(id: string) {
  if (!supabase) throw new Error('Supabase not initialized')
  const { error } = await supabase
    .from('ad_banners')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}