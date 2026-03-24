import { ref } from 'vue'
import type { PlaylistSnapshot } from '@/types/api'
import { backupApiService } from '@/services/backupApi'

export function useBackup() {
  const snapshots = ref<PlaylistSnapshot[]>([])
  const loadingSnapshots = ref(false)
  const restoringId = ref<string | null>(null)

  const fetchSnapshots = async () => {
    loadingSnapshots.value = true
    try {
      const response = await backupApiService.getSnapshots()
      if (response.success && response.data) {
        snapshots.value = response.data
      }
    } finally {
      loadingSnapshots.value = false
    }
  }

  const restoreSnapshot = async (snapshotId: string): Promise<boolean> => {
    restoringId.value = snapshotId
    try {
      const response = await backupApiService.restoreSnapshot(snapshotId)
      if (response.success) {
        await fetchSnapshots()
        return true
      }
      return false
    } finally {
      restoringId.value = null
    }
  }

  return {
    snapshots,
    loadingSnapshots,
    restoringId,
    fetchSnapshots,
    restoreSnapshot,
  }
}
