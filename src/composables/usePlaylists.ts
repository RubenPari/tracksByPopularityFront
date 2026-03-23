import { ref, computed } from 'vue'
import { playlistApiService } from '@/services/playlistApi'
import type { PlaylistInfo } from '@/types/api'
import { createLogger } from '@/utils/logger'

const logger = createLogger('usePlaylists')

let fetchPromise: Promise<void> | null = null

/**
 * Composable for managing user playlists.
 * Provides functionality to fetch and manage playlists from Spotify.
 */
export function usePlaylists() {
  const playlists = ref<PlaylistInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetches all playlists owned by the current user
   */
  const fetchPlaylists = async () => {
    if (playlists.value.length > 0) {
      return
    }

    if (fetchPromise) {
      return fetchPromise
    }

    loading.value = true
    error.value = null

    fetchPromise = (async () => {
      try {
        logger.info('Fetching user playlists')
        const response = await playlistApiService.getAllPlaylists()

        if (response.success && response.data) {
          playlists.value = response.data
          logger.info(`Fetched ${response.data.length} playlists`)
        } else {
          error.value = response.error || 'Failed to fetch playlists'
          logger.warn('Failed to fetch playlists', { error: error.value })
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        error.value = errorMessage
        logger.error('Error fetching playlists', err)
      } finally {
        loading.value = false
        fetchPromise = null
      }
    })()

    return fetchPromise
  }

  /**
   * Finds a playlist by its ID
   * @param playlistId - The playlist ID to search for
   * @returns The playlist if found, undefined otherwise
   */
  const getPlaylistById = (playlistId: string): PlaylistInfo | undefined => {
    return playlists.value.find(p => p.id === playlistId)
  }

  /**
   * Finds a playlist by its name
   * @param name - The playlist name to search for
   * @returns The playlist if found, undefined otherwise
   */
  const getPlaylistByName = (name: string): PlaylistInfo | undefined => {
    return playlists.value.find(p => p.name === name)
  }

  return {
    /** List of user playlists */
    playlists: computed(() => playlists.value),
    /** Loading state */
    loading: computed(() => loading.value),
    /** Error message if any */
    error: computed(() => error.value),
    /** Fetch all playlists */
    fetchPlaylists,
    /** Get playlist by ID */
    getPlaylistById,
    /** Get playlist by name */
    getPlaylistByName,
  }
}

