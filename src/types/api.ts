/**
 * Base API response structure matching the backend ApiResponse
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errorCode?: number
}

/**
 * Track-related API responses
 */
export interface TrackResponse {
  message: string
}

/**
 * Playlist-related API responses
 */
export interface PlaylistResponse {
  message: string
}

/**
 * Auth-related API responses
 */
export interface AuthStatusResponse {
  authenticated: boolean
}

export interface LoginResponse {
  loginUrl: string
}

export interface CallbackResponse {
  message: string
  userId: string
}

/**
 * Health check responses
 */
export interface HealthResponse {
  status: string
  timestamp: string
}

export interface DetailedHealthResponse {
  status: string
  timestamp: string
  dependencies: {
    redis: {
      status: string
      message: string
    }
    spotify: {
      status: string
      message: string
    }
  }
}

/**
 * Playlist information from Spotify
 */
export interface PlaylistInfo {
  id: string
  name: string
  description?: string
  totalTracks: number
  uri?: string
}

/**
 * Request to add tracks by popularity
 */
export interface AddTracksByPopularityRequest {
  playlistId: string
}

