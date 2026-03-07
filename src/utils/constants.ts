/**
 * Application-wide constants
 */

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  TRACK: {
    BASE: '/track',
    ARTIST: '/track/artist',
  },
  PLAYLIST: {
    ALL: '/playlist/all',
    CREATE_MINOR: '/playlist/create-playlist-track-minor',
  },
  AUTH: {
    STATUS: '/auth/is-auth',
    LOGIN: '/auth/login',
    CALLBACK: '/auth/callback',
  },
  HEALTH: {
    BASE: '/health',
    DETAILED: '/health/detailed',
  },
  CLEANUP: {
    DUPLICATES: '/cleanup/duplicates',
    TRACKS: '/cleanup/tracks',
  },
  AUDIO_FEATURES: {
    GENERATE_MOODS: '/audio-features/generate-mood-playlists',
  },
} as const

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Non autorizzato. Verifica le credenziali Spotify.',
  BAD_REQUEST: 'Richiesta non valida',
  NOT_FOUND: 'Risorsa non trovata',
  SERVER_ERROR: 'Errore del server. Riprova più tardi.',
  CONNECTION_ERROR: 'Impossibile connettersi al backend. Assicurati che il server sia in esecuzione.',
  UNKNOWN_ERROR: 'Errore sconosciuto',
  NETWORK_ERROR: 'Errore di rete. Controlla la connessione internet.',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  TRACKS_ADDED_LESS: 'Tracce aggiunte alla playlist (popolarità bassa)',
  TRACKS_ADDED_LESS_MEDIUM: 'Tracce aggiunte alla playlist (popolarità medio-bassa)',
  TRACKS_ADDED_MEDIUM: 'Tracce aggiunte alla playlist (popolarità media)',
  TRACKS_ADDED_MORE_MEDIUM: 'Tracce aggiunte alla playlist (popolarità medio-alta)',
  TRACKS_ADDED_MORE: 'Tracce aggiunte alla playlist (popolarità alta)',
  ARTIST_TRACKS_ADDED: 'Tracce dell\'artista aggiunte alle playlist',
  PLAYLIST_CREATED: 'Playlist creata con successo',
  OPERATION_SUCCESS: 'Operazione completata con successo',
  TRACKS_REMOVED: 'Tracce rimosse con successo dalla libreria',
  MOOD_PLAYLISTS_GENERATED: 'Playlist generate con successo in base ai mood',
} as const

/**
 * Validation constants
 */
export const VALIDATION = {
  SPOTIFY_ID_LENGTH: 22,
  SPOTIFY_ID_PATTERN: /^[a-zA-Z0-9]+$/,
} as const

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

/**
 * UI constants
 */
export const UI = {
  NOTIFICATION_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // 300ms
} as const

