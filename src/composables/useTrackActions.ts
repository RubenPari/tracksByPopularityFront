import { computed } from 'vue'
import { useApiStore } from '@/stores/api'
import { trackApiService } from '@/services/trackApi'
import { SUCCESS_MESSAGES } from '@/utils/constants'
import { createLogger } from '@/utils/logger'

const logger = createLogger('useTrackActions')

/**
 * Composable for track-related actions.
 * Separates business logic from presentation components, providing a clean API
 * for components to interact with track operations.
 *
 * @returns An object containing track action methods and loading state.
 * @example
 * ```vue
 * <script setup>
 * const { addTracksLess, loading } = useTrackActions()
 * </script>
 * ```
 */
export function useTrackActions() {
  const apiStore = useApiStore()

  /**
   * Adds tracks with low popularity (≤20) to the designated playlist.
   * @param playlistId - The Spotify playlist ID to add tracks to
   * @returns A promise that resolves with the API call result.
   */
  const addTracksLess = async (playlistId: string) => {
    logger.info('Adding tracks with low popularity', { playlistId })
    return apiStore.executeApiCall(
      () => trackApiService.addTracksLess(playlistId),
      SUCCESS_MESSAGES.TRACKS_ADDED_LESS
    )
  }

  /**
   * Adds tracks with low-medium popularity (21-40) to the designated playlist.
   * @param playlistId - The Spotify playlist ID to add tracks to
   * @returns A promise that resolves with the API call result.
   */
  const addTracksLessMedium = async (playlistId: string) => {
    logger.info('Adding tracks with low-medium popularity', { playlistId })
    return apiStore.executeApiCall(
      () => trackApiService.addTracksLessMedium(playlistId),
      SUCCESS_MESSAGES.TRACKS_ADDED_LESS_MEDIUM
    )
  }

  /**
   * Adds tracks with medium popularity (41-60) to the designated playlist.
   * @param playlistId - The Spotify playlist ID to add tracks to
   * @returns A promise that resolves with the API call result.
   */
  const addTracksMedium = async (playlistId: string) => {
    logger.info('Adding tracks with medium popularity', { playlistId })
    return apiStore.executeApiCall(
      () => trackApiService.addTracksMedium(playlistId),
      SUCCESS_MESSAGES.TRACKS_ADDED_MEDIUM
    )
  }

  /**
   * Adds tracks with medium-high popularity (41-80) to the designated playlist.
   * @param playlistId - The Spotify playlist ID to add tracks to
   * @returns A promise that resolves with the API call result.
   */
  const addTracksMoreMedium = async (playlistId: string) => {
    logger.info('Adding tracks with medium-high popularity', { playlistId })
    return apiStore.executeApiCall(
      () => trackApiService.addTracksMoreMedium(playlistId),
      SUCCESS_MESSAGES.TRACKS_ADDED_MORE_MEDIUM
    )
  }

  /**
   * Adds tracks with high popularity (>80) to the designated playlist.
   * @param playlistId - The Spotify playlist ID to add tracks to
   * @returns A promise that resolves with the API call result.
   */
  const addTracksMore = async (playlistId: string) => {
    logger.info('Adding tracks with high popularity', { playlistId })
    return apiStore.executeApiCall(
      () => trackApiService.addTracksMore(playlistId),
      SUCCESS_MESSAGES.TRACKS_ADDED_MORE
    )
  }

  /**
   * Organizes tracks from a specific artist into three playlists based on popularity.
   * Creates playlists named "{artistName} less", "{artistName} medium", and "{artistName} more".
   *
   * @param artistId - The unique identifier of the artist (22 alphanumeric characters).
   * @returns A promise that resolves with the API call result.
   * @throws {Error} If the artist ID is invalid or the API call fails.
   */
  const addTracksByArtist = async (artistId: string) => {
    logger.info('Adding tracks by artist', { artistId })
    return apiStore.executeApiCall(
      () => trackApiService.addTracksByArtist(artistId),
      SUCCESS_MESSAGES.ARTIST_TRACKS_ADDED
    )
  }

  return {
    /** Adds tracks with low popularity to playlist */
    addTracksLess,
    /** Adds tracks with low-medium popularity to playlist */
    addTracksLessMedium,
    /** Adds tracks with medium popularity to playlist */
    addTracksMedium,
    /** Adds tracks with medium-high popularity to playlist */
    addTracksMoreMedium,
    /** Adds tracks with high popularity to playlist */
    addTracksMore,
    /** Organizes artist tracks into popularity-based playlists */
    addTracksByArtist,
    /** Reactive loading state indicating if any track operation is in progress */
    loading: computed(() => apiStore.loading),
  }
}

