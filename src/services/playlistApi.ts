import { httpClient } from './httpClient'
import type { ApiResponse, PlaylistResponse, PlaylistInfo } from '@/types/api'
import { API_ENDPOINTS } from '@/utils/constants'

/**
 * API service for playlist-related operations
 * Provides methods to interact with playlist endpoints
 */
export class PlaylistApiService {
  /**
   * Retrieves all playlists owned by the current user
   */
  async getAllPlaylists(): Promise<ApiResponse<PlaylistInfo[]>> {
    return httpClient.get<PlaylistInfo[]>(API_ENDPOINTS.PLAYLIST.ALL)
  }

  /**
   * Creates a playlist with tracks from artists that have 5 or fewer songs
   */
  async createPlaylistTrackMinor(): Promise<ApiResponse<PlaylistResponse>> {
    return httpClient.post<PlaylistResponse>(API_ENDPOINTS.PLAYLIST.CREATE_MINOR)
  }
}

export const playlistApiService = new PlaylistApiService()

