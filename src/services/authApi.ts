import { httpClient } from './httpClient'
import type {
  ApiResponse,
  AuthStatusResponse,
  LoginResponse,
  CallbackResponse,
} from '@/types/api'

/**
 * API service for authentication-related operations
 */
export class AuthApiService {
  /**
   * Checks if the user is authenticated
   */
  async checkAuth(): Promise<ApiResponse<AuthStatusResponse>> {
    return httpClient.get<AuthStatusResponse>('/auth/is-auth')
  }

  /**
   * Gets the Spotify login URL
   */
  async getLoginUrl(): Promise<ApiResponse<LoginResponse>> {
    return httpClient.get<LoginResponse>('/auth/login')
  }

  /**
   * Handles the OAuth callback
   */
  async handleCallback(code: string): Promise<ApiResponse<CallbackResponse>> {
    return httpClient.get<CallbackResponse>(`/auth/callback?code=${encodeURIComponent(code)}`)
  }
}

export const authApiService = new AuthApiService()

