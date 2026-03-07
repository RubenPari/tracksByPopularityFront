import { httpClient } from './httpClient'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse } from '@/types/api'
import { createLogger } from '@/utils/logger'

const logger = createLogger('audioFeaturesApi')

/**
 * Service for audio features API calls
 */
export const audioFeaturesApiService = {
  /**
   * Triggers the backend to generate mood-based playlists (High Energy, Chill, etc.)
   */
  async generateMoodPlaylists(): Promise<ApiResponse<null>> {
    logger.debug('Generating mood playlists based on audio features')
    return httpClient.post<null>(API_ENDPOINTS.AUDIO_FEATURES.GENERATE_MOODS)
  },
}
