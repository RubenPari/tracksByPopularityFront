import type { ApiResponse } from '@/types/api'
import { getApiUrl } from '@/config/env'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/utils/constants'
import { createLogger } from '@/utils/logger'

const logger = createLogger('HttpClient')

/**
 * HTTP status code to error message mapping
 */
const getErrorMessage = (status: number, data: string): string => {
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED
    case HTTP_STATUS.BAD_REQUEST:
      try {
        const errorData = JSON.parse(data)
        return errorData.error || errorData.message || ERROR_MESSAGES.BAD_REQUEST
      } catch {
        return data || ERROR_MESSAGES.BAD_REQUEST
      }
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return ERROR_MESSAGES.SERVER_ERROR
    default:
      return `Errore ${status}: ${data || ERROR_MESSAGES.UNKNOWN_ERROR}`
  }
}

/**
 * Base HTTP client for making API requests
 * Provides typed API calls with error handling and logging
 */
export class HttpClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getApiUrl('')
  }

  /**
   * Makes an HTTP request and returns a typed response
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const method = options.method || 'GET'
    
    logger.debug(`Making ${method} request to ${url}`, { options })

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await response.text()

      if (!response.ok) {
        const errorMessage = getErrorMessage(response.status, data)
        logger.warn(`Request failed: ${method} ${url}`, {
          status: response.status,
          error: errorMessage,
        })
        
        try {
          const errorData = JSON.parse(data)
          return {
            success: false,
            error: errorData.error || errorMessage,
            errorCode: errorData.errorCode || response.status,
          }
        } catch {
          return {
            success: false,
            error: errorMessage,
            errorCode: response.status,
          }
        }
      }

      // Try to parse JSON response
      try {
        const jsonData = JSON.parse(data)
        logger.debug(`Request successful: ${method} ${url}`, { data: jsonData })
        return {
          success: true,
          data: jsonData as T,
          message: jsonData.message,
        }
      } catch {
        // If not JSON, return as string message
        logger.debug(`Request successful (non-JSON): ${method} ${url}`)
        return {
          success: true,
          data: data as T,
          message: data,
        }
      }
    } catch (error) {
      let errorMessage: string = ERROR_MESSAGES.CONNECTION_ERROR
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = `${ERROR_MESSAGES.CONNECTION_ERROR} (${this.baseUrl})`
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      logger.error(`Request error: ${method} ${url}`, error)
      
      return {
        success: false,
        error: errorMessage,
        errorCode: 0,
      }
    }
  }

  /**
   * Makes a GET request
   */
  async get<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  /**
   * Makes a POST request
   */
  async post<T = unknown>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * Makes a PUT request
   */
  async put<T = unknown>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  /**
   * Makes a DELETE request
   */
  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const httpClient = new HttpClient()

