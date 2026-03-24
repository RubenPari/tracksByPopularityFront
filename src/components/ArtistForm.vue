<template>
  <div class="artist-form">
    <h2 class="section-title">{{ t('artist.sectionTitle') }}</h2>
    <p class="section-description">
      {{ t('artist.sectionDescription') }}
    </p>

    <div class="search-wrapper">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="t('artist.searchPlaceholder')"
        :disabled="loadingArtists"
      />
    </div>

    <div v-if="loadingArtists" class="loading-state">
      <span class="spinner"></span>
      {{ t('artist.loadingArtists') }}
    </div>

    <div v-else-if="artists.length === 0" class="empty-state">
      {{ t('artist.noArtists') }}
    </div>

    <template v-else>
      <div v-if="filteredArtists.length === 0" class="empty-state">
        {{ t('artist.noResults') }}
      </div>

      <div v-else class="artist-grid-container">
        <div class="artist-grid">
          <button
            v-for="artist in filteredArtists"
            :key="artist.id"
            class="artist-card"
            :class="{ selected: selectedArtist?.id === artist.id }"
            @click="selectArtist(artist)"
            type="button"
          >
            <span class="artist-name">{{ artist.name }}</span>
            <span class="artist-count">{{ t('artist.trackCount', { count: artist.count }) }}</span>
          </button>
        </div>
      </div>
    </template>

    <div class="submit-section">
      <p v-if="!selectedArtist" class="select-prompt">{{ t('artist.selectPrompt') }}</p>
      <button
        class="submit-button"
        :disabled="!selectedArtist || loading"
        @click="handleSubmit"
      >
        <span v-if="!loading">{{ t('artist.submitButton') }}</span>
        <span v-else class="button-loading">
          <span class="spinner-small"></span>
          {{ t('common.loading') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiStore } from '@/stores/api'
import { useTrackActions } from '@/composables/useTrackActions'
import { useArtistSelection } from '@/composables/useArtistSelection'
import { SUCCESS_MESSAGES } from '@/utils/constants'

const { t } = useI18n()
const apiStore = useApiStore()
const { addTracksByArtist, loading } = useTrackActions()
const {
  artists,
  searchQuery,
  selectedArtist,
  loadingArtists,
  filteredArtists,
  fetchArtists,
  selectArtist,
} = useArtistSelection()

onMounted(() => {
  fetchArtists()
})

const handleSubmit = async () => {
  if (!selectedArtist.value) return

  await addTracksByArtist(selectedArtist.value.id)

  if (apiStore.success) {
    selectedArtist.value = null
  }
}
</script>

<style scoped>
.artist-form {
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

.search-wrapper {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.artist-grid-container {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding: 0.25rem;
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.artist-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: var(--color-text);
  font-family: inherit;
  font-size: inherit;
}

.artist-card:hover {
  border-color: var(--color-primary);
  background: var(--color-background-hover, var(--color-background-soft));
}

.artist-card.selected {
  border-color: var(--color-primary);
  background: rgba(100, 108, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.15);
}

.artist-name {
  font-weight: 600;
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist-count {
  font-size: 0.825rem;
  color: var(--color-text-secondary);
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.submit-section {
  margin-top: 1.5rem;
}

.select-prompt {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.submit-button {
  width: 100%;
  max-width: 400px;
  padding: 0.875rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-small {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .artist-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
