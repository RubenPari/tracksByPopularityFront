<template>
  <div class="track-actions">
    <h2 class="section-title">{{ t('tracks.sectionTitle') }}</h2>
    <p class="section-description">
      {{ t('tracks.sectionDescription') }}
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
        :tier="config.id"
        :loading="loading"
        :disabled="loading || !selections[config.id]"
        @click="handleAddTracks(config.id)"
      >
        <template #icon>{{ config.icon }}</template>
        <template #title>
          <span :class="['tier-label', `tier-label-${config.id}`]">{{ config.title }}</span>
        </template>
        <template #description>{{ config.description }}</template>
      </ActionButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTrackActions } from '@/composables/useTrackActions'
import { useApiStore } from '@/stores/api'
import { SUCCESS_MESSAGES } from '@/utils/constants'
import ActionButton from './ActionButton.vue'
import PlaylistSelector from './PlaylistSelector.vue'

const { t } = useI18n()
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
  successMessageKey: string
}

const popularityConfigs = computed<PopularityConfig[]>(() => [
  {
    id: 'less',
    label: t('tracks.popularity.less.label'),
    placeholder: t('tracks.popularity.less.placeholder'),
    icon: '📉',
    title: t('tracks.popularity.less.title'),
    description: t('tracks.popularity.less.description'),
    successMessageKey: SUCCESS_MESSAGES.TRACKS_ADDED_LESS
  },
  {
    id: 'less-medium',
    label: t('tracks.popularity.lessMedium.label'),
    placeholder: t('tracks.popularity.lessMedium.placeholder'),
    icon: '📊',
    title: t('tracks.popularity.lessMedium.title'),
    description: t('tracks.popularity.lessMedium.description'),
    successMessageKey: SUCCESS_MESSAGES.TRACKS_ADDED_LESS_MEDIUM
  },
  {
    id: 'medium',
    label: t('tracks.popularity.medium.label'),
    placeholder: t('tracks.popularity.medium.placeholder'),
    icon: '📈',
    title: t('tracks.popularity.medium.title'),
    description: t('tracks.popularity.medium.description'),
    successMessageKey: SUCCESS_MESSAGES.TRACKS_ADDED_MEDIUM
  },
  {
    id: 'more-medium',
    label: t('tracks.popularity.moreMedium.label'),
    placeholder: t('tracks.popularity.moreMedium.placeholder'),
    icon: '🔥',
    title: t('tracks.popularity.moreMedium.title'),
    description: t('tracks.popularity.moreMedium.description'),
    successMessageKey: SUCCESS_MESSAGES.TRACKS_ADDED_MORE_MEDIUM
  },
  {
    id: 'more',
    label: t('tracks.popularity.more.label'),
    placeholder: t('tracks.popularity.more.placeholder'),
    icon: '⭐',
    title: t('tracks.popularity.more.title'),
    description: t('tracks.popularity.more.description'),
    successMessageKey: SUCCESS_MESSAGES.TRACKS_ADDED_MORE
  }
])

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
  popularityConfigs.value.forEach(config => {
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
  const config = popularityConfigs.value.find(c => c.id === id)

  if (!playlistId || !config) {
    apiStore.error = t('tracks.selectPlaylistError', { category: config?.title || id })
    return
  }

  await addTracksByPopularity(playlistId, id, config.successMessageKey)
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

.tier-label {
  font-weight: 700;
}

.tier-label-less {
  color: var(--color-tier-less);
}

.tier-label-less-medium {
  color: var(--color-tier-less-medium);
}

.tier-label-medium {
  color: var(--color-tier-medium);
}

.tier-label-more-medium {
  color: var(--color-tier-more-medium);
}

.tier-label-more {
  color: var(--color-tier-more);
}
</style>
