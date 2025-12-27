<template>
  <div class="playlist-actions">
    <h2 class="section-title">Gestione Playlist</h2>
    <p class="section-description">
      Crea e gestisci playlist personalizzate
    </p>

    <div class="actions-grid">
      <ActionButton
        :loading="loading"
        :disabled="loading"
        @click="handleAction(playlistApiService.createPlaylistTrackMinor, 'Playlist creata con successo')"
      >
        <template #icon>🎵</template>
        <template #title>Crea Playlist Tracce Minori</template>
        <template #description>Crea una playlist con tutte le tracce minori</template>
      </ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useApiStore } from '@/stores/api'
import { playlistApiService } from '@/services/playlistApi'
import type { ApiResponse } from '@/types/api'
import ActionButton from './ActionButton.vue'

const apiStore = useApiStore()
const loading = computed(() => apiStore.loading)

const handleAction = async (
  apiCall: () => Promise<ApiResponse<unknown>>,
  successMessage: string
) => {
  await apiStore.executeApiCall(apiCall, successMessage)
}
</script>

<style scoped>
.playlist-actions {
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

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
