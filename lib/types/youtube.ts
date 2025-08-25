// YouTube IFrame API Types
export interface YouTubePlayer {
  cuePlaylist: (options: {
    list: string
    index?: number
    startSeconds?: number
  }) => void
  loadPlaylist: (options: {
    list: string
    index?: number
    startSeconds?: number
  }) => void
  playVideo: () => void
  pauseVideo: () => void
  stopVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  destroy: () => void
}

export interface YouTubePlayerEvent {
  target: YouTubePlayer
  data?: number
}

export interface YouTubePlayerOptions {
  height?: string | number
  width?: string | number
  videoId?: string
  playerVars?: {
    autoplay?: 0 | 1
    controls?: 0 | 1
    rel?: 0 | 1
    showinfo?: 0 | 1
    modestbranding?: 0 | 1
    loop?: 0 | 1
    fs?: 0 | 1
    cc_load_policy?: 0 | 1
    iv_load_policy?: 1 | 3
    autohide?: 0 | 1 | 2
    playsinline?: 0 | 1
  }
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void
    onStateChange?: (event: YouTubePlayerEvent) => void
    onPlaybackQualityChange?: (event: YouTubePlayerEvent) => void
    onPlaybackRateChange?: (event: YouTubePlayerEvent) => void
    onError?: (event: YouTubePlayerEvent) => void
    onApiChange?: (event: YouTubePlayerEvent) => void
  }
}

export interface YouTubeIframeAPI {
  Player: new (elementId: string, options: YouTubePlayerOptions) => YouTubePlayer
}

declare global {
  interface Window {
    YT?: YouTubeIframeAPI
    onYouTubeIframeAPIReady?: () => void
  }
}