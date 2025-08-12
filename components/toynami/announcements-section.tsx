import { getFeaturedBlogPosts } from '@/lib/data/blog'
import { AnnouncementsGrid } from './announcements-grid'

export async function AnnouncementsSection({ limit = 4 }: { limit?: number } = {}) {
  // Fetch featured announcements from database
  const announcements = await getFeaturedBlogPosts(limit)
  
  return (
    <>
      <h2 className="figma-brands homepage-section-heading">
        ANNOUNCEMENTS
      </h2>
      
      {/* Use the original theme announcements grid */}
      <AnnouncementsGrid 
        posts={announcements}
        showViewAll={true}
        gridClassName="" // No extra class for home page (2 column layout)
      />
    </>
  )
}