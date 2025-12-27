import type { ApiResponse } from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

/**
 * HTTP status code to error message mapping
 */
const getErrorMessage = (status: number, data: string): string => {
  switch (status) {
    case 401:
      return 'Non autorizzato. Verifica le credenziali Spotify.'
    case 400:
      try {
        const errorData = JSON.parse(data)
        return errorData.error || errorData.message || 'Richiesta non valida'
      } catch {
        return data || 'Richiesta non valida'
      }
    case 404:
      return 'Risorsa non trovata'
    case 500:
    case 502:
    case 503:
      return 'Errore del server. Riprova più tardi.'
    default:
      return `Errore ${status}: ${data || 'Errore sconosciuto'}`
  }
}

/**
 * Base HTTP client for making API requests
 */
export class HttpClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Makes an HTTP request and returns a typed response
   */
  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await response.text()

      if (!response.ok) {
        const errorMessage = getErrorMessage(response.status, data)
        
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
        return {
          success: true,
          data: jsonData as T,
          message: jsonData.message,
        }
      } catch {
        // If not JSON, return as string message
        return {
          success: true,
          data: data as T,
          message: data,
        }
      }
    } catch (error) {
      let errorMessage = 'Errore di connessione'
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = `Impossibile connettersi al backend. Assicurati che il server ASP.NET sia in esecuzione su ${this.baseUrl}`
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
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

