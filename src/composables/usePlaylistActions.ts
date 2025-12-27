import { computed } from 'vue'
import { useApiStore } from '@/stores/api'
import { playlistApiService } from '@/services/playlistApi'

/**
 * Composable for playlist-related actions
 * Separates business logic from presentation components
 */
export function usePlaylistActions() {
  const apiStore = useApiStore()

  const createPlaylistTrackMinor = async () => {
    return apiStore.executeApiCall(
      playlistApiService.createPlaylistTrackMinor,
      'Playlist creata con successo'
    )
  }

  return {
    createPlaylistTrackMinor,
    loading: computed(() => apiStore.loading),
  }
}

