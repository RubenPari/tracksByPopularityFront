<template>
  <div class="track-actions">
    <h2 class="section-title">Gestione Tracce per Popolarità</h2>
    <p class="section-description">
      Aggiungi le tue tracce alle playlist in base alla loro popolarità su Spotify.
      Seleziona una playlist per ogni categoria di popolarità.
    </p>

    <div class="playlist-selection-section">
      <PlaylistSelector
        v-model="selectedPlaylistLess"
        label="Playlist per Popolarità Bassa"
        placeholder="Seleziona playlist per popolarità bassa..."
        :required="true"
        :show-refresh="true"
      />
      <PlaylistSelector
        v-model="selectedPlaylistLessMedium"
        label="Playlist per Popolarità Medio-Bassa"
        placeholder="Seleziona playlist per popolarità medio-bassa..."
        :required="true"
        :show-refresh="false"
      />
      <PlaylistSelector
        v-model="selectedPlaylistMedium"
        label="Playlist per Popolarità Media"
        placeholder="Seleziona playlist per popolarità media..."
        :required="true"
        :show-refresh="false"
      />
      <PlaylistSelector
        v-model="selectedPlaylistMoreMedium"
        label="Playlist per Popolarità Medio-Alta"
        placeholder="Seleziona playlist per popolarità medio-alta..."
        :required="true"
        :show-refresh="false"
      />
      <PlaylistSelector
        v-model="selectedPlaylistMore"
        label="Playlist per Popolarità Alta"
        placeholder="Seleziona playlist per popolarità alta..."
        :required="true"
        :show-refresh="false"
      />
    </div>

    <div class="actions-grid">
      <ActionButton
        :loading="loading"
        :disabled="loading || !selectedPlaylistLess"
        @click="handleAddTracksLess"
      >
        <template #icon>📉</template>
        <template #title>Popolarità Bassa</template>
        <template #description>Aggiungi tracce con popolarità bassa</template>
      </ActionButton>

      <ActionButton
        :loading="loading"
        :disabled="loading || !selectedPlaylistLessMedium"
        @click="handleAddTracksLessMedium"
      >
        <template #icon>📊</template>
        <template #title>Popolarità Medio-Bassa</template>
        <template #description>Aggiungi tracce con popolarità medio-bassa</template>
      </ActionButton>

      <ActionButton
        :loading="loading"
        :disabled="loading || !selectedPlaylistMedium"
        @click="handleAddTracksMedium"
      >
        <template #icon>📈</template>
        <template #title>Popolarità Media</template>
        <template #description>Aggiungi tracce con popolarità media</template>
      </ActionButton>

      <ActionButton
        :loading="loading"
        :disabled="loading || !selectedPlaylistMoreMedium"
        @click="handleAddTracksMoreMedium"
      >
        <template #icon>🔥</template>
        <template #title>Popolarità Medio-Alta</template>
        <template #description>Aggiungi tracce con popolarità medio-alta</template>
      </ActionButton>

      <ActionButton
        :loading="loading"
        :disabled="loading || !selectedPlaylistMore"
        @click="handleAddTracksMore"
      >
        <template #icon>⭐</template>
        <template #title>Popolarità Alta</template>
        <template #description>Aggiungi tracce con popolarità alta</template>
      </ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTrackActions } from '@/composables/useTrackActions'
import { useApiStore } from '@/stores/api'
import ActionButton from './ActionButton.vue'
import PlaylistSelector from './PlaylistSelector.vue'

const { addTracksLess, addTracksLessMedium, addTracksMedium, addTracksMoreMedium, addTracksMore, loading } = useTrackActions()
const apiStore = useApiStore()

const STORAGE_KEYS = {
  PLAYLIST_LESS: 'selectedPlaylistLess',
  PLAYLIST_LESS_MEDIUM: 'selectedPlaylistLessMedium',
  PLAYLIST_MEDIUM: 'selectedPlaylistMedium',
  PLAYLIST_MORE_MEDIUM: 'selectedPlaylistMoreMedium',
  PLAYLIST_MORE: 'selectedPlaylistMore',
} as const

const selectedPlaylistLess = ref('')
const selectedPlaylistLessMedium = ref('')
const selectedPlaylistMedium = ref('')
const selectedPlaylistMoreMedium = ref('')
const selectedPlaylistMore = ref('')

// Load saved selections from localStorage
onMounted(() => {
  selectedPlaylistLess.value = localStorage.getItem(STORAGE_KEYS.PLAYLIST_LESS) || ''
  selectedPlaylistLessMedium.value = localStorage.getItem(STORAGE_KEYS.PLAYLIST_LESS_MEDIUM) || ''
  selectedPlaylistMedium.value = localStorage.getItem(STORAGE_KEYS.PLAYLIST_MEDIUM) || ''
  selectedPlaylistMoreMedium.value = localStorage.getItem(STORAGE_KEYS.PLAYLIST_MORE_MEDIUM) || ''
  selectedPlaylistMore.value = localStorage.getItem(STORAGE_KEYS.PLAYLIST_MORE) || ''
})

// Save selections to localStorage when they change
watch(selectedPlaylistLess, (value) => {
  if (value) localStorage.setItem(STORAGE_KEYS.PLAYLIST_LESS, value)
})
watch(selectedPlaylistLessMedium, (value) => {
  if (value) localStorage.setItem(STORAGE_KEYS.PLAYLIST_LESS_MEDIUM, value)
})
watch(selectedPlaylistMedium, (value) => {
  if (value) localStorage.setItem(STORAGE_KEYS.PLAYLIST_MEDIUM, value)
})
watch(selectedPlaylistMoreMedium, (value) => {
  if (value) localStorage.setItem(STORAGE_KEYS.PLAYLIST_MORE_MEDIUM, value)
})
watch(selectedPlaylistMore, (value) => {
  if (value) localStorage.setItem(STORAGE_KEYS.PLAYLIST_MORE, value)
})

const handleAddTracksLess = async () => {
  if (!selectedPlaylistLess.value) {
    apiStore.error = 'Seleziona una playlist per popolarità bassa'
    return
  }
  await addTracksLess(selectedPlaylistLess.value)
}

const handleAddTracksLessMedium = async () => {
  if (!selectedPlaylistLessMedium.value) {
    apiStore.error = 'Seleziona una playlist per popolarità medio-bassa'
    return
  }
  await addTracksLessMedium(selectedPlaylistLessMedium.value)
}

const handleAddTracksMedium = async () => {
  if (!selectedPlaylistMedium.value) {
    apiStore.error = 'Seleziona una playlist per popolarità media'
    return
  }
  await addTracksMedium(selectedPlaylistMedium.value)
}

const handleAddTracksMoreMedium = async () => {
  if (!selectedPlaylistMoreMedium.value) {
    apiStore.error = 'Seleziona una playlist per popolarità medio-alta'
    return
  }
  await addTracksMoreMedium(selectedPlaylistMoreMedium.value)
}

const handleAddTracksMore = async () => {
  if (!selectedPlaylistMore.value) {
    apiStore.error = 'Seleziona una playlist per popolarità alta'
    return
  }
  await addTracksMore(selectedPlaylistMore.value)
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
