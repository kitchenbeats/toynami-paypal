'use client'

import React, { useEffect, useState, useRef } from 'react'

interface YouTubePlayer {
  cuePlaylist: (params: { list: string; index: number }) => void
  destroy: () => void
}

interface YouTubeEvent {
  target: YouTubePlayer
}

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, config: {
        height: string
        width: string
        playerVars: Record<string, number>
        events: {
          onReady: (event: YouTubeEvent) => void
        }
      }) => YouTubePlayer
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export function YouTubeSection() {
  const PLAYLIST_ID = "PLlBZs1tmA78eFI-cPYS-WCOqP7PUfNNf2"
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const playersRef = useRef<YouTubePlayer[]>([])
  
  useEffect(() => {
    // Set up Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    if (!isVisible) return
    
    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayers()
      return
    }
    
    // Load YouTube IFrame API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    
    // Setup YouTube players when API is ready
    window.onYouTubeIframeAPIReady = function() {
      initializePlayers()
    }
    
    function initializePlayers() {
      const YT = window.YT
      if (!YT || !YT.Player) return
      
      // Create 3 players
      try {
        playersRef.current[0] = new YT.Player('youtube-player-1', {
          height: '100%',
          width: '100%',
          playerVars: {
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: function(event: YouTubeEvent) {
              event.target.cuePlaylist({
                list: PLAYLIST_ID,
                index: 0,
              })
              setIsLoaded(true)
            },
          },
        })
        
        playersRef.current[1] = new YT.Player('youtube-player-2', {
          height: '100%',
          width: '100%',
          playerVars: {
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: function(event: YouTubeEvent) {
              event.target.cuePlaylist({
                list: PLAYLIST_ID,
                index: 1,
              })
            },
          },
        })
        
        playersRef.current[2] = new YT.Player('youtube-player-3', {
          height: '100%',
          width: '100%',
          playerVars: {
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: function(event: YouTubeEvent) {
              event.target.cuePlaylist({
                list: PLAYLIST_ID,
                index: 2,
              })
            },
          },
        })
      } catch (error) {
        console.error('Error initializing YouTube players:', error)
      }
    }
    
    // Cleanup
    return () => {
      playersRef.current.forEach(player => {
        try {
          if (player && player.destroy) {
            player.destroy()
          }
        } catch {
          // Ignore cleanup errors
        }
      })
      playersRef.current = []
    }
  }, [isVisible])
  
  return (
    <div className="section-spacing" ref={sectionRef}>
      <div className="check-out-our-youtube-channel-parent container">
        <h2 className="check-out-our-container homepage-section-heading">
          <span>Check out our </span>
          <span className="youtube-channel">YouTube Channel</span>
        </h2>
        
        {/* 3 Videos in a row */}
        <div className="youtube-videos-grid">
          <div className="youtube-video-iframe relative">
            {!isLoaded && isVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">Loading video...</div>
              </div>
            )}
            <div 
              id="youtube-player-1"
              className="w-full h-full"
              title="VOLTRON – DEFENDER OF THE UNIVERSE 40th Anniversary Collector's Set by Toynami"
            />
          </div>
          <div className="youtube-video-iframe relative">
            {!isLoaded && isVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">Loading video...</div>
              </div>
            )}
            <div 
              id="youtube-player-2"
              className="w-full h-full"
              title="POSE＋METAL HEAT series GETTER LIGER (GETTER ROBO ARMAGEDDON ver.)"
            />
          </div>
          <div className="youtube-video-iframe relative">
            {!isLoaded && isVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">Loading video...</div>
              </div>
            )}
            <div 
              id="youtube-player-3"
              className="w-full h-full"
              title="Robotech The New Generation YR-052F Cyclone"
            />
          </div>
        </div>
      </div>
    </div>
  )
}