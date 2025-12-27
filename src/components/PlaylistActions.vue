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
        @click="createPlaylistTrackMinor"
      >
        <template #icon>🎵</template>
        <template #title>Crea Playlist Tracce Minori</template>
        <template #description>Crea una playlist con tutte le tracce minori</template>
      </ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlaylistActions } from '@/composables/usePlaylistActions'
import ActionButton from './ActionButton.vue'

const { createPlaylistTrackMinor, loading } = usePlaylistActions()
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
