import { computed, ref } from 'vue'
import { useApiStore } from '@/stores/api'
import { audioFeaturesApiService } from '@/services/audioFeaturesApi'
import { SUCCESS_MESSAGES } from '@/utils/constants'
import { createLogger } from '@/utils/logger'

const logger = createLogger('useAudioFeatures')

export function useAudioFeatures() {
  const apiStore = useApiStore()
  const isGeneratingMoods = ref(false)

  const generateMoodPlaylists = async () => {
    logger.info('Generating mood playlists')
    isGeneratingMoods.value = true
    try {
      await apiStore.executeApiCall(
        () => audioFeaturesApiService.generateMoodPlaylists(),
        SUCCESS_MESSAGES.MOOD_PLAYLISTS_GENERATED
      )
    } finally {
      isGeneratingMoods.value = false
    }
  }

  return {
    generateMoodPlaylists,
    loading: computed(() => isGeneratingMoods.value),
  }
}
