import { computed } from 'vue'
import { useApiStore } from '@/stores/api'
import { playlistApiService } from '@/services/playlistApi'
import { SUCCESS_MESSAGES } from '@/utils/constants'
import { createLogger } from '@/utils/logger'

const logger = createLogger('usePlaylistActions')

/**
 * Composable for playlist-related actions.
 * Separates business logic from presentation components, providing a clean API
 * for components to interact with playlist operations.
 *
 * @returns An object containing playlist action methods and loading state.
 * @example
 * ```vue
 * <script setup>
 * const { createPlaylistTrackMinor, loading } = usePlaylistActions()
 * </script>
 * ```
 */
export function usePlaylistActions() {
  const apiStore = useApiStore()

  /**
   * Creates or updates a "MinorSongs" playlist containing tracks from artists
   * that have 5 or fewer songs in the user's library.
   *
   * @returns A promise that resolves with the API call result.
   * @remarks
   * This playlist helps users discover tracks from lesser-known artists.
   * The playlist is automatically created if it doesn't exist.
   */
  const createPlaylistTrackMinor = async () => {
    logger.info('Creating minor songs playlist')
    return apiStore.executeApiCall(
      playlistApiService.createPlaylistTrackMinor,
      SUCCESS_MESSAGES.PLAYLIST_CREATED
    )
  }

  return {
    /** Creates or updates the MinorSongs playlist */
    createPlaylistTrackMinor,
    /** Reactive loading state indicating if any playlist operation is in progress */
    loading: computed(() => apiStore.loading),
  }
}
