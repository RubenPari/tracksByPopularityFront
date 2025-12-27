import { httpClient } from './httpClient'
import type { ApiResponse, TrackResponse } from '@/types/api'
import { API_ENDPOINTS } from '@/utils/constants'

/**
 * API service for track-related operations
 * Provides methods to interact with track endpoints
 */
export class TrackApiService {
  /**
   * Adds tracks with low popularity to playlist
   */
  async addTracksLess(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(API_ENDPOINTS.TRACK.LESS)
  }

  /**
   * Adds tracks with low-medium popularity to playlist
   */
  async addTracksLessMedium(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(API_ENDPOINTS.TRACK.LESS_MEDIUM)
  }

  /**
   * Adds tracks with medium popularity to playlist
   */
  async addTracksMedium(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(API_ENDPOINTS.TRACK.MEDIUM)
  }

  /**
   * Adds tracks with medium-high popularity to playlist
   */
  async addTracksMoreMedium(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(API_ENDPOINTS.TRACK.MORE_MEDIUM)
  }

  /**
   * Adds tracks with high popularity to playlist
   */
  async addTracksMore(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(API_ENDPOINTS.TRACK.MORE)
  }

  /**
   * Adds tracks by a specific artist to playlists based on popularity
   * @param artistId - The Spotify artist ID (22 alphanumeric characters)
   */
  async addTracksByArtist(artistId: string): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(
      `${API_ENDPOINTS.TRACK.ARTIST}?artistId=${encodeURIComponent(artistId)}`
    )
  }
}

export const trackApiService = new TrackApiService()

