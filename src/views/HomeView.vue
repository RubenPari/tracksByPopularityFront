<template>
  <div class="home-view">
    <header class="header">
      <h1 class="title">🎵 Tracks by Popularity</h1>
      <p class="subtitle">Gestisci le tue playlist Spotify in base alla popolarità delle tracce</p>
    </header>

    <main class="main-content">
      <TrackActions />
      
      <div class="divider"></div>
      
      <ArtistForm />
      
      <div class="divider"></div>
      
      <PlaylistActions />
    </main>

    <NotificationBanner
      v-if="apiStore.success"
      :message="apiStore.success"
      type="success"
      @close="apiStore.clearMessages"
    />
    <NotificationBanner
      v-if="apiStore.error"
      :message="apiStore.error"
      type="error"
      @close="apiStore.clearMessages"
    />
  </div>
</template>

<script setup lang="ts">
import { useApiStore } from '@/stores/api'
import TrackActions from '@/components/TrackActions.vue'
import ArtistForm from '@/components/ArtistForm.vue'
import PlaylistActions from '@/components/PlaylistActions.vue'
import NotificationBanner from '@/components/NotificationBanner.vue'

const apiStore = useApiStore()
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .home-view {
    padding: 1rem 0.5rem;
  }
}
</style>
