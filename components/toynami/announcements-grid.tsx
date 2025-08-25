'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getImageSrc } from '@/lib/utils/image-utils'
import { IMAGE_CONFIG } from '@/lib/config/images'
import { format } from 'date-fns'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image: string | null
  thumbnail_url?: string | null
  published_at: string
  tags?: string[]
}

interface AnnouncementsGridProps {
  posts: BlogPost[]
  showViewAll?: boolean
  gridClassName?: string
}

export function AnnouncementsGrid({ 
  posts, 
  showViewAll = true,
  gridClassName = ''
}: AnnouncementsGridProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy')
  }

  const getPostImage = (post: BlogPost) => {
    const imagePath = post.featured_image || post.thumbnail_url
    if (!imagePath) return null
    
    // If it's just a path like 'blog_images/robotech-blog-1', prepend the storage URL
    if (!imagePath.startsWith('http')) {
      return `${IMAGE_CONFIG.baseUrl}/${imagePath}`
    }
    
    return getImageSrc(imagePath)
  }

  return (
    <div className="figma-announcements-section container">
      <div className="figma-announcements-parent">
        
        {posts.length > 0 ? (
          <div className={`figma-large-news-item-parent ${gridClassName}`}>
            {posts.map((post) => {
              const imageUrl = getPostImage(post)
              
              return (
                <div key={post.id} className="figma-large-news-item">
                  <Link href={`/announcements/${post.slug}`} className="figma-news-image-link">
                    {imageUrl ? (
                      <div className="figma-large-news-item-child">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          width={540}
                          height={320}
                          className="figma-news-image"
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      </div>
                    ) : (
                      <div className="figma-image-placeholder" />
                    )}
                    <div className="figma-news-date">{formatDate(post.published_at)}</div>
                  </Link>

                  <div className="figma-frame-parent12">
                    <div className="figma-news-title-wrapper">
                      <Link href={`/announcements/${post.slug}`} className="figma-news-title">
                        {post.title}
                      </Link>
                    </div>
                    <div className="figma-frame-parent13">
                      <div className="figma-news-summary-wrapper">
                        <div className="figma-news-summary">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </div>
                      </div>
                      <Link href={`/announcements/${post.slug}`} className="figma-news-arrow">
                        <svg
                          className="figma-frame-child3"
                          width="45"
                          height="24"
                          viewBox="0 0 45 24"
                        >
                          <path fill="currentColor" d="M33 12l-8-8v6H0v4h25v6l8-8z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="figma-no-announcements">
            <p className="figma-no-announcements-text">No current announcements</p>
          </div>
        )}

        {showViewAll && (
          <div className="figma-view-all-announcements-parent">
            <Link href="/announcements" className="figma-view-all-link">
              <b className="figma-view-all-text">VIEW ALL ANNOUNCEMENTS</b>
              <svg
                className="figma-layer-1-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}