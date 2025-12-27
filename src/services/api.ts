/**
 * @deprecated This file is kept for backward compatibility.
 * Use the specific API services instead:
 * - trackApiService from '@/services/trackApi'
 * - playlistApiService from '@/services/playlistApi'
 * - authApiService from '@/services/authApi'
 */

import { trackApiService } from './trackApi'
import { playlistApiService } from './playlistApi'

/**
 * Legacy API service for backward compatibility
 * @deprecated Use trackApiService, playlistApiService, or authApiService instead
 */
class ApiService {
  addTracksLess = trackApiService.addTracksLess
  addTracksLessMedium = trackApiService.addTracksLessMedium
  addTracksMedium = trackApiService.addTracksMedium
  addTracksMoreMedium = trackApiService.addTracksMoreMedium
  addTracksMore = trackApiService.addTracksMore
  addTracksByArtist = trackApiService.addTracksByArtist
  createPlaylistTrackMinor = playlistApiService.createPlaylistTrackMinor
}

export const apiService = new ApiService()
