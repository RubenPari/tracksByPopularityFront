<template>
  <div class="artist-form">
    <h2 class="section-title">Gestione Tracce per Artista</h2>
    <p class="section-description">
      Aggiungi le tracce di un artista specifico alle playlist in base alla popolarità
    </p>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="artistId" class="label">ID Artista Spotify</label>
        <input
          id="artistId"
          v-model="artistId"
          type="text"
          class="input"
          :class="{ 'input-error': hasError }"
          placeholder="Inserisci l'ID dell'artista (es: 4Z8W4fKeB5YxbusRsdQVPb)"
          required
          :disabled="loading"
          pattern="[a-zA-Z0-9]{22}"
          title="L'ID artista Spotify deve essere esattamente 22 caratteri alfanumerici"
        />
        <p class="help-text">
          Puoi trovare l'ID dell'artista nell'URL della sua pagina Spotify
        </p>
      </div>

      <button type="submit" class="submit-button" :disabled="loading || !artistId.trim()">
        <span v-if="!loading">Aggiungi Tracce</span>
        <span v-else class="button-loading">
          <span class="spinner-small"></span>
          Elaborazione...
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiStore } from '@/stores/api'
import { trackApiService } from '@/services/trackApi'
import { useFormValidation } from '@/composables/useFormValidation'

const apiStore = useApiStore()
const { validateArtistId, getSpotifyIdErrorMessage } = useFormValidation()

const artistId = ref('')
const loading = computed(() => apiStore.loading)
const hasError = ref(false)

const handleSubmit = async () => {
  const trimmedId = artistId.value.trim()
  
  if (!trimmedId) {
    hasError.value = true
    return
  }

  if (!validateArtistId(trimmedId)) {
    hasError.value = true
    apiStore.error = getSpotifyIdErrorMessage()
    return
  }

  hasError.value = false

  await apiStore.executeApiCall(
    () => trackApiService.addTracksByArtist(trimmedId),
    'Tracce dell\'artista aggiunte alle playlist'
  )

  if (apiStore.success) {
    artistId.value = ''
    hasError.value = false
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

.form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-error {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.help-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.submit-button {
  width: 100%;
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
</style>
