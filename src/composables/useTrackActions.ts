import { computed } from 'vue'
import { useApiStore } from '@/stores/api'
import { trackApiService } from '@/services/trackApi'

/**
 * Composable for track-related actions
 * Separates business logic from presentation components
 */
export function useTrackActions() {
  const apiStore = useApiStore()

  const addTracksLess = async () => {
    return apiStore.executeApiCall(
      trackApiService.addTracksLess,
      'Tracce aggiunte alla playlist (popolarità bassa)'
    )
  }

  const addTracksLessMedium = async () => {
    return apiStore.executeApiCall(
      trackApiService.addTracksLessMedium,
      'Tracce aggiunte alla playlist (popolarità medio-bassa)'
    )
  }

  const addTracksMedium = async () => {
    return apiStore.executeApiCall(
      trackApiService.addTracksMedium,
      'Tracce aggiunte alla playlist (popolarità media)'
    )
  }

  const addTracksMoreMedium = async () => {
    return apiStore.executeApiCall(
      trackApiService.addTracksMoreMedium,
      'Tracce aggiunte alla playlist (popolarità medio-alta)'
    )
  }

  const addTracksMore = async () => {
    return apiStore.executeApiCall(
      trackApiService.addTracksMore,
      'Tracce aggiunte alla playlist (popolarità alta)'
    )
  }

  const addTracksByArtist = async (artistId: string) => {
    return apiStore.executeApiCall(
      () => trackApiService.addTracksByArtist(artistId),
      'Tracce dell\'artista aggiunte alle playlist'
    )
  }

  return {
    addTracksLess,
    addTracksLessMedium,
    addTracksMedium,
    addTracksMoreMedium,
    addTracksMore,
    addTracksByArtist,
    loading: computed(() => apiStore.loading),
  }
}

