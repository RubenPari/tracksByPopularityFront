<template>
  <div class="track-actions">
    <h2 class="section-title">Gestione Tracce per Popolarità</h2>
    <p class="section-description">
      Aggiungi le tue tracce alle playlist in base alla loro popolarità su Spotify.
      Seleziona una playlist per ogni categoria di popolarità.
    </p>

    <div class="playlist-selection-section">
      <PlaylistSelector
        v-for="config in popularityConfigs"
        :key="config.id"
        v-model="selections[config.id]"
        :label="config.label"
        :placeholder="config.placeholder"
        :required="true"
        :show-refresh="config.id === 'less'"
      />
    </div>

    <div class="actions-grid">
      <ActionButton
        v-for="config in popularityConfigs"
        :key="config.id"
        :loading="loading"
        :disabled="loading || !selections[config.id]"
        @click="handleAddTracks(config.id)"
      >
        <template #icon>{{ config.icon }}</template>
        <template #title>{{ config.title }}</template>
        <template #description>{{ config.description }}</template>
      </ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTrackActions } from '@/composables/useTrackActions'
import { useApiStore } from '@/stores/api'
import { SUCCESS_MESSAGES } from '@/utils/constants'
import ActionButton from './ActionButton.vue'
import PlaylistSelector from './PlaylistSelector.vue'

const { addTracksByPopularity, loading } = useTrackActions()
const apiStore = useApiStore()

type PopularityCategoryId = 'less' | 'less-medium' | 'medium' | 'more-medium' | 'more'

interface PopularityConfig {
  id: PopularityCategoryId
  label: string
  placeholder: string
  icon: string
  title: string
  description: string
  successMessage: string
}

const popularityConfigs: PopularityConfig[] = [
  {
    id: 'less',
    label: 'Playlist per Popolarità Bassa',
    placeholder: 'Seleziona playlist per popolarità bassa...',
    icon: '📉',
    title: 'Popolarità Bassa',
    description: 'Aggiungi tracce con popolarità bassa (0-20)',
    successMessage: SUCCESS_MESSAGES.TRACKS_ADDED_LESS
  },
  {
    id: 'less-medium',
    label: 'Playlist per Popolarità Medio-Bassa',
    placeholder: 'Seleziona playlist per popolarità medio-bassa...',
    icon: '📊',
    title: 'Popolarità Medio-Bassa',
    description: 'Aggiungi tracce con popolarità medio-bassa (21-40)',
    successMessage: SUCCESS_MESSAGES.TRACKS_ADDED_LESS_MEDIUM
  },
  {
    id: 'medium',
    label: 'Playlist per Popolarità Media',
    placeholder: 'Seleziona playlist per popolarità media...',
    icon: '📈',
    title: 'Popolarità Media',
    description: 'Aggiungi tracce con popolarità media (41-60)',
    successMessage: SUCCESS_MESSAGES.TRACKS_ADDED_MEDIUM
  },
  {
    id: 'more-medium',
    label: 'Playlist per Popolarità Medio-Alta',
    placeholder: 'Seleziona playlist per popolarità medio-alta...',
    icon: '🔥',
    title: 'Popolarità Medio-Alta',
    description: 'Aggiungi tracce con popolarità medio-alta (61-80)',
    successMessage: SUCCESS_MESSAGES.TRACKS_ADDED_MORE_MEDIUM
  },
  {
    id: 'more',
    label: 'Playlist per Popolarità Alta',
    placeholder: 'Seleziona playlist per popolarità alta...',
    icon: '⭐',
    title: 'Popolarità Alta',
    description: 'Aggiungi tracce con popolarità alta (81-100)',
    successMessage: SUCCESS_MESSAGES.TRACKS_ADDED_MORE
  }
]

// Centralized state for selections
const selections = ref<Record<PopularityCategoryId, string>>({
  'less': '',
  'less-medium': '',
  'medium': '',
  'more-medium': '',
  'more': ''
})

// Initialize from localStorage
onMounted(() => {
  popularityConfigs.forEach(config => {
    const saved = localStorage.getItem(`playlist_${config.id}`)
    if (saved) {
      selections.value[config.id] = saved
    }
  })
})

// Save to localStorage deeply when selections change
watch(selections, (newSelections) => {
  Object.entries(newSelections).forEach(([id, value]) => {
    if (value) {
      localStorage.setItem(`playlist_${id}`, value)
    }
  })
}, { deep: true })

const handleAddTracks = async (id: PopularityCategoryId) => {
  const playlistId = selections.value[id]
  const config = popularityConfigs.find(c => c.id === id)

  if (!playlistId || !config) {
    apiStore.error = `Seleziona una playlist per: ${config?.title || id}`
    return
  }

  await addTracksByPopularity(playlistId, id, config.successMessage)
}
</script>

<style scoped>
.track-actions {
  width: 100%;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.section-description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.playlist-selection-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .playlist-selection-section {
    padding: 1rem;
  }
}
</style>
