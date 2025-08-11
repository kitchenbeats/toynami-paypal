import { createClient } from "../supabase/server";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
  banner_url?: string;
  banner_url_2?: string;
  description?: string;
  featured: boolean;
  display_order: number;
  search_keywords?: string;
}

export async function getFeaturedBrands(limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching featured brands:", error);
    return [];
  }

  return data as Brand[];
}

export async function getAllBrands() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  return data as Brand[];
}

export async function getBrandBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching brand:", error);
    return null;
  }

  return data as Brand;
}
