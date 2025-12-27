import { httpClient } from './httpClient'
import type { ApiResponse, TrackResponse } from '@/types/api'

/**
 * API service for track-related operations
 */
export class TrackApiService {
  /**
   * Adds tracks with low popularity to playlist
   */
  async addTracksLess(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>('/track/less')
  }

  /**
   * Adds tracks with low-medium popularity to playlist
   */
  async addTracksLessMedium(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>('/track/less-medium')
  }

  /**
   * Adds tracks with medium popularity to playlist
   */
  async addTracksMedium(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>('/track/medium')
  }

  /**
   * Adds tracks with medium-high popularity to playlist
   */
  async addTracksMoreMedium(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>('/track/more-medium')
  }

  /**
   * Adds tracks with high popularity to playlist
   */
  async addTracksMore(): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>('/track/more')
  }

  /**
   * Adds tracks by a specific artist to playlists based on popularity
   */
  async addTracksByArtist(artistId: string): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(
      `/track/artist?artistId=${encodeURIComponent(artistId)}`
    )
  }
}

export const trackApiService = new TrackApiService()

