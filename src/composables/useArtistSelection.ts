import { ref, computed } from 'vue'
import type { ArtistSummary } from '@/types/api'
import { trackApiService } from '@/services/trackApi'

export function useArtistSelection() {
  const artists = ref<ArtistSummary[]>([])
  const searchQuery = ref('')
  const selectedArtist = ref<ArtistSummary | null>(null)
  const loadingArtists = ref(false)
  const fetchError = ref<string | null>(null)

  const filteredArtists = computed(() => {
    if (!searchQuery.value.trim()) return artists.value
    const query = searchQuery.value.toLowerCase()
    return artists.value.filter(a => a.name.toLowerCase().includes(query))
  })

  const fetchArtists = async () => {
    loadingArtists.value = true
    fetchError.value = null
    try {
      const response = await trackApiService.getLibraryArtists()
      if (response.success && response.data) {
        artists.value = response.data
      } else {
        fetchError.value = response.error || null
      }
    } catch {
      fetchError.value = 'Failed to load artists'
    } finally {
      loadingArtists.value = false
    }
  }

  const selectArtist = (artist: ArtistSummary) => {
    selectedArtist.value = selectedArtist.value?.id === artist.id ? null : artist
  }

  return {
    artists,
    searchQuery,
    selectedArtist,
    loadingArtists,
    fetchError,
    filteredArtists,
    fetchArtists,
    selectArtist,
  }
}
