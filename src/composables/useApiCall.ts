import { ref, type Ref } from 'vue'
import type { ApiResponse } from '@/types/api'

/**
 * Result of an API call
 */
export interface ApiCallResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Composable for handling API calls with loading and error states
 */
export function useApiCall<T = unknown>() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  /**
   * Executes an API call and manages loading/error states
   */
  const execute = async (
    apiCall: () => Promise<ApiResponse<T>>,
    successMessage?: string
  ): Promise<ApiCallResult<T>> => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const response = await apiCall()

      if (response.success) {
        success.value = successMessage || response.message || 'Operazione completata con successo'
        return {
          success: true,
          data: response.data,
        }
      } else {
        error.value = response.error || 'Operazione fallita'
        return {
          success: false,
          error: response.error,
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
      error.value = errorMessage
      return {
        success: false,
        error: errorMessage,
      }
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
    loading: loading as Readonly<Ref<boolean>>,
    error: error as Readonly<Ref<string | null>>,
    success: success as Readonly<Ref<string | null>>,
    execute,
    clearMessages,
  }
}

