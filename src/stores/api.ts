import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse } from '@/types/api'

/**
 * Global API store for managing loading, error, and success states
 */
export const useApiStore = defineStore('api', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  /**
   * Executes an API call and manages global state
   */
  const executeApiCall = async <T = unknown>(
    apiCall: () => Promise<ApiResponse<T>>,
    successMessage?: string
  ) => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const response = await apiCall()

      if (response.success) {
        success.value = successMessage || response.message || 'Operazione completata con successo'
        return { success: true, data: response.data, message: response.message }
      } else {
        error.value = response.error || 'Operazione fallita'
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Errore sconosciuto'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Clears all messages
   */
  const clearMessages = () => {
    error.value = null
    success.value = null
  }

  return {
    loading,
    error,
    success,
    executeApiCall,
    clearMessages,
  }
})
