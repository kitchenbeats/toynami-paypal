import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Eye, Tag } from "lucide-react";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/data/blog";
import { AnnouncementsGrid } from "@/components/toynami/announcements-grid";
import { getImageSrc } from "@/lib/utils/image-utils";
import { IMAGE_CONFIG } from "@/lib/config/images";
import { StructuredData } from "@/components/seo/structured-data";
import { generateBlogSEO, generateMetadata as generateSEOMetadata } from "@/lib/seo/utils";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params: p,
}: PageProps): Promise<Metadata> {
  const params = await p;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | Toynami",
      robots: { index: false, follow: false }
    };
  }

  // Use our SEO utility for consistent metadata generation
  const seoData = generateBlogSEO(post)
  seoData.url = `/announcements/${params.slug}`
  
  return generateSEOMetadata(seoData);
}

export default async function BlogPostPage({ params: p }: PageProps) {
  const params = await p;
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = await getRelatedBlogPosts(post.id, post.tags, 3);

  // Get the post image
  const getPostImage = () => {
    const imagePath = post.featured_image || post.thumbnail_url;
    if (!imagePath) return null;

    // If it's just a path like 'blog_images/robotech-blog-1', prepend the storage URL
    if (!imagePath.startsWith("http")) {
      return `${IMAGE_CONFIG.baseUrl}/${imagePath}`;
    }

    return getImageSrc(imagePath);
  };

  const imageUrl = getPostImage();

  return (
    <>
      {/* Blog Post Structured Data */}
      <StructuredData 
        type="blog" 
        data={post} 
        url={`/announcements/${params.slug}`}
      />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to Announcements */}
      <Link
        href="/announcements"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Announcements
      </Link>

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <time dateTime={post.published_at}>
              {format(new Date(post.published_at), "MMMM dd, yyyy")}
            </time>
          </div>

          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{post.view_count} views</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
              <Tag className="h-4 w-4" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Featured Image */}
        {imageUrl && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {/* Excerpt */}
        {post.excerpt && (
          <div className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </div>
        )}

        {/* Main Content */}
        <div
          className="post-content py-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t pt-12 mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Announcements</h2>
          <AnnouncementsGrid
            posts={relatedPosts}
            showViewAll={false}
            gridClassName="announcements-grid"
          />
        </section>
      )}
      </article>
    </>
  );
}
