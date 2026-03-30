import { ref, type Ref } from 'vue'
import { deduplicatedRequest, createCacheKey } from './useRequestDeduplication'

/**
 * Options for the useCachedApi composable
 */
export interface UseCachedApiOptions<T> {
  /** Key for localStorage cache */
  storageKey?: string
  /** Time in ms before cache is considered stale */
  staleTime?: number
  /** Whether to revalidate on window focus */
  revalidateOnFocus?: boolean
  /** Whether to revalidate on network reconnect */
  revalidateOnReconnect?: boolean
  /** Callback when data is being refreshed in background */
  onRevalidating?: (isRevalidating: boolean) => void
  /** Transform function for cached data */
  transform?: (data: T) => T
}

/**
 * Result from the useCachedApi composable
 */
export interface UseCachedApiResult<T> {
  /** The current data (from cache or fresh) */
  data: Ref<T | null>
  /** Loading state for initial fetch */
  loading: Ref<boolean>
  /** Error state */
  error: Ref<Error | null>
  /** Whether data is being refreshed in background */
  isRevalidating: Ref<boolean>
  /** Timestamp of last successful fetch */
  lastUpdated: Ref<number | null>
  /** Force a refresh */
  refresh: () => Promise<void>
  /** Clear local cache */
  clearCache: () => void
}

/**
 * Default stale time: 5 minutes
 */
const DEFAULT_STALE_TIME = 5 * 60 * 1000

/**
 * Composable implementing SWR (Stale-While-Revalidate) pattern
 * Shows cached data immediately while refreshing in background
 * 
 * @param fetcher - Async function to fetch data
 * @param storageKey - Optional key for localStorage caching
 * @param options - Configuration options
 * 
 * @example
 * ```ts
 * const { data, loading, refresh } = useCachedApi(
 *   () => trackApiService.getLibraryArtists(),
 *   'artists-cache',
 *   { staleTime: 60000 }
 * )
 * ```
 */
export function useCachedApi<T>(
  fetcher: () => Promise<T>,
  storageKey?: string,
  options: UseCachedApiOptions<T> = {}
): UseCachedApiResult<T> {
  const {
    storageKey: configStorageKey,
    staleTime = DEFAULT_STALE_TIME,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    onRevalidating,
    transform
  } = options

  const finalStorageKey = storageKey || configStorageKey

  // State
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const isRevalidating = ref(false)
  const lastUpdated = ref<number | null>(null)

  /**
   * Check if cached data is still valid
   */
  const isCacheValid = (): boolean => {
    if (!lastUpdated.value) return false
    return Date.now() - lastUpdated.value < staleTime
  }

  /**
   * Load data from localStorage cache
   */
  const loadFromStorage = (): T | null => {
    if (!finalStorageKey) return null
    
    try {
      const cached = localStorage.getItem(finalStorageKey)
      if (!cached) return null
      
      const parsed = JSON.parse(cached) as { data: T; timestamp: number }
      
      // Check if cache is expired
      if (Date.now() - parsed.timestamp > staleTime) {
        localStorage.removeItem(finalStorageKey)
        return null
      }
      
      return transform ? transform(parsed.data) : parsed.data
    } catch {
      return null
    }
  }

  /**
   * Save data to localStorage cache
   */
  const saveToStorage = (newData: T): void => {
    if (!finalStorageKey) return
    
    try {
      const toCache = {
        data: newData,
        timestamp: Date.now()
      }
      localStorage.setItem(finalStorageKey, JSON.stringify(toCache))
    } catch {
      // localStorage might be full or unavailable
    }
  }

  /**
   * Clear localStorage cache
   */
  const clearCache = (): void => {
    if (finalStorageKey) {
      localStorage.removeItem(finalStorageKey)
    }
  }

  /**
   * Fetch data and update cache
   */
  const fetchData = async (isBackgroundRefresh = false): Promise<void> => {
    if (!isBackgroundRefresh) {
      loading.value = true
    }
    error.value = null

    try {
      // Use deduplicated request if storage key is provided
      let freshData: T
      if (finalStorageKey) {
        const cacheKey = createCacheKey('api', finalStorageKey)
        freshData = await deduplicatedRequest(cacheKey, fetcher)
      } else {
        freshData = await fetcher()
      }
      
      data.value = freshData
      lastUpdated.value = Date.now()
      saveToStorage(freshData)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
      
      // If background refresh fails, don't clear current data
      if (!isBackgroundRefresh) {
        throw err
      }
    } finally {
      loading.value = false
      isRevalidating.value = false
      onRevalidating?.(false)
    }
  }

  /**
   * Revalidate data (background refresh)
   * Shows stale data while fetching fresh data
   */
  const revalidate = async (): Promise<void> => {
    // Don't revalidate if already revalidating
    if (isRevalidating.value) return
    
    // If data is stale, refresh immediately
    if (!isCacheValid()) {
      await refresh()
      return
    }

    // Otherwise, do background refresh
    isRevalidating.value = true
    onRevalidating?.(true)
    
    // Don't await - let it run in background
    fetchData(true).catch(() => {
      // Background refresh failed, keep showing stale data
    })
  }

  /**
   * Force a refresh (wait for result)
   */
  const refresh = async (): Promise<void> => {
    isRevalidating.value = true
    onRevalidating?.(true)
    await fetchData(false)
  }

  /**
   * Initialize - load from cache first, then revalidate
   */
  const init = async (): Promise<void> => {
    // Load from localStorage first for instant display
    const cachedData = loadFromStorage()
    if (cachedData) {
      data.value = cachedData
      lastUpdated.value = Date.now()
      
      // Revalidate in background
      if (isCacheValid()) {
        revalidate()
      } else {
        await fetchData(false)
      }
    } else {
      // No cache, fetch from API
      await fetchData(false)
    }
  }

  // Set up focus revalidation
  if (revalidateOnFocus && typeof window !== 'undefined') {
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible' && data.value) {
        revalidate()
      }
    }

    const handleFocus = (): void => {
      if (data.value) {
        revalidate()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    // Cleanup is handled by Vue's onUnmounted if used in component
  }

  // Set up reconnect revalidation
  if (revalidateOnReconnect && typeof window !== 'undefined') {
    const handleOnline = (): void => {
      if (data.value) {
        revalidate()
      }
    }

    window.addEventListener('online', handleOnline)
  }

  // Initialize
  init()

  return {
    data,
    loading,
    error,
    isRevalidating,
    lastUpdated,
    refresh,
    clearCache
  }
}

/**
 * Version key for cache schema
 */
const CACHE_VERSION_KEY = 'cache_version'
const CURRENT_CACHE_VERSION = 1

/**
 * Clear all app caches
 */
export function clearAllCaches(): void {
  // Update cache version to invalidate all old caches
  localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION.toString())
  
  // Clear all caches with old version
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.endsWith('-cache')) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
}

/**
 * Initialize cache versioning
 */
export function initCacheVersioning(): void {
  const storedVersion = localStorage.getItem(CACHE_VERSION_KEY)
  if (!storedVersion || parseInt(storedVersion, 10) < CURRENT_CACHE_VERSION) {
    clearAllCaches()
    localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION.toString())
  }
}
