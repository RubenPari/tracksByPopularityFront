import { httpClient } from './httpClient'
import type { ApiResponse, PlaylistResponse } from '@/types/api'

/**
 * API service for playlist-related operations
 */
export class PlaylistApiService {
  /**
   * Creates a playlist with tracks from artists that have 5 or fewer songs
   */
  async createPlaylistTrackMinor(): Promise<ApiResponse<PlaylistResponse>> {
    return httpClient.post<PlaylistResponse>('/playlist/create-playlist-track-minor')
  }
}

export const playlistApiService = new PlaylistApiService()

