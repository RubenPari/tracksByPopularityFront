<template>
  <div class="backup-panel">
    <button class="toggle-header" @click="isOpen = !isOpen" type="button">
      <h2 class="section-title">
        🔄 {{ t('backup.sectionTitle') }}
        <span v-if="snapshots.length > 0" class="badge">{{ snapshots.length }}</span>
      </h2>
      <span class="toggle-icon" :class="{ open: isOpen }">▸</span>
    </button>

    <Transition name="collapse">
      <div v-if="isOpen" class="panel-content">
        <div v-if="loadingSnapshots" class="loading-state">
          <span class="spinner"></span>
          {{ t('backup.loading') }}
        </div>

        <div v-else-if="snapshots.length === 0" class="empty-state">
          {{ t('backup.noSnapshots') }}
        </div>

        <div v-else class="snapshot-list">
          <div
            v-for="snapshot in snapshots"
            :key="snapshot.id"
            class="snapshot-item"
          >
            <div class="snapshot-info">
              <span class="snapshot-name">{{ snapshot.playlistName }}</span>
              <div class="snapshot-meta">
                <span class="snapshot-type">
                  {{ snapshot.operationType === 'popularity' ? t('backup.operationPopularity') : t('backup.operationArtist') }}
                </span>
                <span class="snapshot-separator">·</span>
                <span class="snapshot-tracks">{{ t('backup.trackCount', { count: snapshot.trackCount }) }}</span>
                <span class="snapshot-separator">·</span>
                <span class="snapshot-date">{{ formatDate(snapshot.createdAt) }}</span>
              </div>
            </div>
            <button
              class="restore-button"
              :disabled="restoringId !== null"
              @click="handleRestore(snapshot)"
            >
              <span v-if="restoringId === snapshot.id" class="spinner-small"></span>
              <span v-else>{{ t('backup.restore') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="showConfirm" class="confirm-overlay" @click.self="showConfirm = false">
      <div class="confirm-dialog">
        <p>{{ t('backup.restoreConfirm', { name: confirmSnapshot?.playlistName }) }}</p>
        <div class="confirm-actions">
          <button class="confirm-cancel" @click="showConfirm = false">{{ t('common.close') }}</button>
          <button class="confirm-restore" @click="confirmRestore">{{ t('backup.restore') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiStore } from '@/stores/api'
import { useBackup } from '@/composables/useBackup'
import type { PlaylistSnapshot } from '@/types/api'

const { t } = useI18n()
const apiStore = useApiStore()
const { snapshots, loadingSnapshots, restoringId, fetchSnapshots, restoreSnapshot } = useBackup()

const isOpen = ref(false)
const showConfirm = ref(false)
const confirmSnapshot = ref<PlaylistSnapshot | null>(null)

onMounted(() => {
  fetchSnapshots()
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString()
}

const handleRestore = (snapshot: PlaylistSnapshot) => {
  confirmSnapshot.value = snapshot
  showConfirm.value = true
}

const confirmRestore = async () => {
  if (!confirmSnapshot.value) return
  showConfirm.value = false
  const success = await restoreSnapshot(confirmSnapshot.value.id)
  if (success) {
    apiStore.success = t('backup.restoreSuccess')
  } else {
    apiStore.error = t('errors.genericError')
  }
  confirmSnapshot.value = null
}
</script>

<style scoped>
.backup-panel {
  width: 100%;
}

.toggle-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: inherit;
  font-family: inherit;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  background: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
}

.toggle-icon {
  font-size: 1.25rem;
  transition: transform 0.2s ease;
  color: var(--color-text-secondary);
}

.toggle-icon.open {
  transform: rotate(90deg);
}

.panel-content {
  margin-top: 1rem;
}

.snapshot-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.snapshot-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  gap: 1rem;
}

.snapshot-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.snapshot-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.snapshot-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  flex-wrap: wrap;
}

.snapshot-separator {
  opacity: 0.5;
}

.snapshot-type {
  background: rgba(100, 108, 255, 0.1);
  color: var(--color-primary);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-weight: 500;
}

.restore-button {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.restore-button:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.restore-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  justify-content: center;
  color: var(--color-text-secondary);
}

.empty-state {
  padding: 1.5rem;
  text-align: center;
  color: var(--color-text-secondary);
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
}

.confirm-dialog p {
  margin: 0 0 1.5rem;
  color: var(--color-text);
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.confirm-cancel {
  padding: 0.5rem 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  cursor: pointer;
  font-weight: 500;
}

.confirm-restore {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
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
  to { transform: rotate(360deg); }
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 1000px;
}

@media (max-width: 768px) {
  .snapshot-item {
    flex-direction: column;
    align-items: stretch;
  }

  .restore-button {
    width: 100%;
  }
}
</style>
