import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse } from '@/types/api'
import { createLogger } from '@/utils/logger'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/utils/constants'

const logger = createLogger('ApiStore')

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
      logger.debug('Executing API call')
      const response = await apiCall()

      if (response.success) {
        const message = successMessage || response.message || SUCCESS_MESSAGES.OPERATION_SUCCESS
        success.value = message
        logger.info('API call succeeded', { message })
        return { success: true, data: response.data, message: response.message }
      } else {
        const errorMsg = response.error || ERROR_MESSAGES.UNKNOWN_ERROR
        error.value = errorMsg
        logger.warn('API call failed', { error: errorMsg, errorCode: response.errorCode })
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR
      error.value = errorMessage
      logger.error('API call exception', err)
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
