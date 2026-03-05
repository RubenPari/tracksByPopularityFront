import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import { useApiStore } from '@/stores/api'

// Define the base URL from Vite env variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5246'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Setup interceptors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    const apiStore = useApiStore()

    if (error.response) {
      const status = error.response.status

      // Handle known status codes
      if (status === 401 || status === 403) {
        apiStore.error = 'Autenticazione richiesta o sessione scaduta. Reindirizzamento...'
        window.location.href = `${API_BASE_URL}/login`
      } else if (status === 500) {
        apiStore.error = 'Errore interno del server. Riprova più tardi.'
      } else {
        const data = error.response.data as { error?: string; message?: string } | undefined
        apiStore.error = data?.error || data?.message || 'Si è verificato un errore.'
      }
    } else if (error.request) {
      apiStore.error = 'Impossibile connettersi al server. Controlla la tua connessione.'
    } else {
      apiStore.error = 'Si è verificato un errore imprevisto.'
    }

    return Promise.reject(error)
  },
)
