<template>
  <div class="track-actions">
    <h2 class="section-title">Gestione Tracce per Popolarità</h2>
    <p class="section-description">
      Aggiungi le tue tracce alle playlist in base alla loro popolarità su Spotify
    </p>

    <div class="actions-grid">
      <ActionButton
        :loading="loading"
        :disabled="loading"
        @click="handleAction(trackApiService.addTracksLess, 'Tracce aggiunte alla playlist (popolarità bassa)')"
      >
        <template #icon>📉</template>
        <template #title>Popolarità Bassa</template>
        <template #description>Aggiungi tracce con popolarità bassa</template>
      </ActionButton>

      <ActionButton
        :loading="loading"
        :disabled="loading"
        @click="handleAction(trackApiService.addTracksLessMedium, 'Tracce aggiunte alla playlist (popolarità medio-bassa)')"
      >
        <template #icon>📊</template>
        <template #title>Popolarità Medio-Bassa</template>
        <template #description>Aggiungi tracce con popolarità medio-bassa</template>
      </ActionButton>

      <ActionButton
        :loading="loading"
        :disabled="loading"
        @click="handleAction(trackApiService.addTracksMedium, 'Tracce aggiunte alla playlist (popolarità media)')"
      >
        <template #icon>📈</template>
        <template #title>Popolarità Media</template>
        <template #description>Aggiungi tracce con popolarità media</template>
      </ActionButton>

      <ActionButton
        :loading="loading"
        :disabled="loading"
        @click="handleAction(trackApiService.addTracksMoreMedium, 'Tracce aggiunte alla playlist (popolarità medio-alta)')"
      >
        <template #icon>🔥</template>
        <template #title>Popolarità Medio-Alta</template>
        <template #description>Aggiungi tracce con popolarità medio-alta</template>
      </ActionButton>

      <ActionButton
        :loading="loading"
        :disabled="loading"
        @click="handleAction(trackApiService.addTracksMore, 'Tracce aggiunte alla playlist (popolarità alta)')"
      >
        <template #icon>⭐</template>
        <template #title>Popolarità Alta</template>
        <template #description>Aggiungi tracce con popolarità alta</template>
      </ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useApiStore } from '@/stores/api'
import { trackApiService } from '@/services/trackApi'
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
