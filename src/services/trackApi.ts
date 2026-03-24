import { httpClient } from './httpClient'
import type { ApiResponse, TrackResponse, AddTracksByPopularityRequest, ArtistSummary } from '@/types/api'
import { API_ENDPOINTS } from '@/utils/constants'

/**
 * API service for track-related operations
 * Provides methods to interact with track endpoints
 */
export class TrackApiService {
  /**
   * Adds tracks to the designated playlist based on the specified popularity range
   * @param playlistId - The Spotify playlist ID to add tracks to
   * @param range - The popularity range ('less', 'less-medium', 'medium', 'more-medium', 'more')
   */
  async addTracksByPopularity(playlistId: string, range: string): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(`/api/track/popularity/${range}`, { playlistId } as AddTracksByPopularityRequest)
  }

  /**
   * Adds tracks by a specific artist to playlists based on popularity
   * @param artistId - The Spotify artist ID (22 alphanumeric characters)
   */
  async getLibraryArtists(): Promise<ApiResponse<ArtistSummary[]>> {
    return httpClient.get<ArtistSummary[]>('/api/track/artists')
  }

  async addTracksByArtist(artistId: string): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(
      `${API_ENDPOINTS.TRACK.ARTIST}?artistId=${encodeURIComponent(artistId)}`
    )
  }
}

export const trackApiService = new TrackApiService()
