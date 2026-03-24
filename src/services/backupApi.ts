import { httpClient } from './httpClient'
import type { ApiResponse, PlaylistSnapshot, TrackResponse } from '@/types/api'

export class BackupApiService {
  async getSnapshots(): Promise<ApiResponse<PlaylistSnapshot[]>> {
    return httpClient.get<PlaylistSnapshot[]>('/api/backup/list')
  }

  async restoreSnapshot(snapshotId: string): Promise<ApiResponse<TrackResponse>> {
    return httpClient.post<TrackResponse>(`/api/backup/restore/${snapshotId}`)
  }
}

export const backupApiService = new BackupApiService()
