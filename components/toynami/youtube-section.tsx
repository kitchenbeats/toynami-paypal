'use client'

import React, { useEffect } from 'react'

export function YouTubeSection() {
  const PLAYLIST_ID = "PLlBZs1tmA78eFI-cPYS-WCOqP7PUfNNf2"
  
  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    
    // Setup YouTube players when API is ready
    ;(window as any).onYouTubeIframeAPIReady = function() {
      const YT = (window as any).YT
      
      // Create 3 players
      const players = []
      
      players[0] = new YT.Player('youtube-player-1', {
        height: '100%',
        width: '100%',
        events: {
          onReady: function(event: any) {
            // Cue playlist starting at index 0 (first video) - no autoplay
            event.target.cuePlaylist({
              list: PLAYLIST_ID,
              index: 0,
            })
          },
        },
      })
      
      players[1] = new YT.Player('youtube-player-2', {
        height: '100%',
        width: '100%',
        events: {
          onReady: function(event: any) {
            // Cue playlist starting at index 1 (second video) - no autoplay
            event.target.cuePlaylist({
              list: PLAYLIST_ID,
              index: 1,
            })
          },
        },
      })
      
      players[2] = new YT.Player('youtube-player-3', {
        height: '100%',
        width: '100%',
        events: {
          onReady: function(event: any) {
            // Cue playlist starting at index 2 (third video) - no autoplay
            event.target.cuePlaylist({
              list: PLAYLIST_ID,
              index: 2,
            })
          },
        },
      })
    }
    
    // Cleanup
    return () => {
      delete (window as any).onYouTubeIframeAPIReady
    }
  }, [])
  
  return (
    <div className="section-spacing">
      <div className="check-out-our-youtube-channel-parent container">
        <h2 className="check-out-our-container homepage-section-heading">
          <span>Check out our </span>
          <span className="youtube-channel">YouTube Channel</span>
        </h2>
        
        {/* 3 Videos in a row */}
        <div className="youtube-videos-grid">
          <div 
            id="youtube-player-1"
            className="youtube-video-iframe"
            title="VOLTRON – DEFENDER OF THE UNIVERSE 40th Anniversary Collector's Set by Toynami"
          />
          <div 
            id="youtube-player-2"
            className="youtube-video-iframe"
            title="POSE＋METAL HEAT series GETTER LIGER (GETTER ROBO ARMAGEDDON ver.)"
          />
          <div 
            id="youtube-player-3"
            className="youtube-video-iframe"
            title="Robotech The New Generation YR-052F Cyclone"
          />
        </div>
      </div>
    </div>
  )
}