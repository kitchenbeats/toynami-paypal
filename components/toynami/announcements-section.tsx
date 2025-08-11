import { getFeaturedBlogPosts } from '@/lib/data/blog'
import { AnnouncementsGrid } from './announcements-grid'

export async function AnnouncementsSection() {
  // Fetch featured announcements from database (limit to 4 for home page)
  const announcements = await getFeaturedBlogPosts(4)
  
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