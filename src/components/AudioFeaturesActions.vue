<template>
  <div class="audio-features-actions">
    <h2 class="section-title">BPM & Mood Organizer</h2>
    <p class="section-description">
      Genera playlist personalizzate analizzando automaticamente le caratteristiche audio (energia e positività) di tutti i brani nella tua libreria.
    </p>

    <div class="actions-grid">
      <button 
        class="action-button gradient-btn" 
        @click="generateMoodPlaylists" 
        :disabled="loading"
      >
        <span v-if="!loading">
          <span class="btn-icon">✨</span> Genera Playlist per Mood
        </span>
        <span v-else class="button-loading">
          <span class="spinner-small"></span> Elaborazione audio in corso...
        </span>
      </button>
    </div>

    <div class="features-info">
      <div class="info-card">
        <h4>☀️ Happy & Upbeat</h4>
        <p>Alta energia e positività per metterti di buon umore.</p>
      </div>
      <div class="info-card">
        <h4>⚡ High Energy Workout</h4>
        <p>Bassi potenti e intensità elevata per l'allenamento.</p>
      </div>
      <div class="info-card">
        <h4>🍃 Chill & Relaxing</h4>
        <p>Ritmi acustici e atmosfere rilassanti per studiare o riposare.</p>
      </div>
      <div class="info-card">
        <h4>🌧️ Deep & Melancholic</h4>
        <p>Sonorità lente e riflessive, perfette per i giorni piovosi.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAudioFeatures } from '@/composables/useAudioFeatures'

const { generateMoodPlaylists, loading } = useAudioFeatures()
</script>

<style scoped>
.audio-features-actions {
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
  display: flex;
  margin-bottom: 2rem;
}

.action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 400px;
}

.gradient-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
  background-size: 200% 200%;
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  animation: gradient 5s ease infinite;
}

.gradient-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.action-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  animation: none;
}

.btn-icon {
  margin-right: 0.5rem;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.spinner-small {
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.features-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.info-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.2s;
}

.info-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.info-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--color-text);
}

.info-card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 768px) {
  .features-info {
    grid-template-columns: 1fr;
  }
  .action-button {
    max-width: 100%;
  }
}
</style>
