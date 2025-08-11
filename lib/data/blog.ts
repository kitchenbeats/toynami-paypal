import { createClient } from "../supabase/server";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;  // Main hero/banner image
  thumbnail_url: string | null;   // Smaller preview for cards (falls back to featured_image)
  author_id: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export async function getRecentBlogPosts(limit: number = 4) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data as BlogPost[];
}

export async function getFeaturedBlogPosts(limit: number = 3) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured blog posts:", error);
    return [];
  }

  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }

  // Increment view count
  await supabase
    .from("blog_posts")
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq("id", data.id);

  return data as BlogPost;
}

/**
 * Get paginated blog posts for announcements page
 */
export async function getBlogPosts({
  page = 1,
  pageSize = 12,
  featured = false
}: {
  page?: number;
  pageSize?: number;
  featured?: boolean;
} = {}): Promise<BlogPostsResponse> {
  const supabase = await createClient();
  
  // Calculate offset
  const offset = (page - 1) * pageSize;
  
  // Build query
  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  
  // Add featured filter if needed
  if (featured) {
    query = query.eq('featured', true);
  }
  
  // Add pagination
  query = query.range(offset, offset + pageSize - 1);
  
  const { data: posts, error, count } = await query;
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    return {
      posts: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      pageSize
    };
  }
  
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    posts: posts || [],
    totalCount,
    currentPage: page,
    totalPages,
    pageSize
  };
}

/**
 * Get related blog posts
 */
export async function getRelatedBlogPosts(
  currentPostId: string,
  tags: string[] | null,
  limit: number = 3
): Promise<BlogPost[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .neq('id', currentPostId)
    .order('published_at', { ascending: false })
    .limit(limit);
  
  // If there are tags, try to find posts with similar tags
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }
  
  const { data: posts, error } = await query;
  
  if (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
  
  return posts || [];
}
