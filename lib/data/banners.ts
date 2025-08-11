import { createClient } from "../supabase/server";

export interface Banner {
  id: string;
  name: string;
  position: "upper" | "middle" | "lower" | "hero";
  slot_number: number;
  image_url?: string;
  image_alt?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
  text_alignment?: "left" | "center" | "right";
  background_color?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  overlay_opacity?: number;
  column_span: number;
  display_order: number;
}

export async function getBannersByPosition(
  position: "upper" | "middle" | "lower" | "hero"
) {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("position", position)
    .eq("is_active", true)
    .order("slot_number", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }

  // Filter by dates on the application side
  const activeBanners = (data || []).filter((banner) => {
    if (banner.start_date && new Date(banner.start_date) > new Date(now))
      return false;
    if (banner.end_date && new Date(banner.end_date) < new Date(now))
      return false;
    return true;
  });

  return activeBanners as Banner[];
}

export async function getBannerConfig() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "banner_config")
    .single();

  if (error) {
    console.error("Error fetching banner config:", error);
    return { upper_columns: 2, middle_columns: 3, lower_columns: 1 };
  }

  return data?.value as {
    upper_columns: number;
    middle_columns: number;
    lower_columns: number;
  };
}
