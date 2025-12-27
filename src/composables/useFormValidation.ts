/**
 * Composable for form validation utilities
 */
export function useFormValidation() {
  /**
   * Validates a Spotify ID (artist, track, playlist, etc.)
   * Spotify IDs are exactly 22 alphanumeric characters
   */
  const validateSpotifyId = (id: string): boolean => {
    if (!id || typeof id !== 'string') {
      return false
    }
    const spotifyIdRegex = /^[a-zA-Z0-9]{22}$/
    return spotifyIdRegex.test(id.trim())
  }

  /**
   * Validates an artist ID specifically
   */
  const validateArtistId = (artistId: string): boolean => {
    return validateSpotifyId(artistId)
  }

  /**
   * Gets validation error message for Spotify ID
   */
  const getSpotifyIdErrorMessage = (): string => {
    return 'ID non valido. Deve essere esattamente 22 caratteri alfanumerici.'
  }

  return {
    validateSpotifyId,
    validateArtistId,
    getSpotifyIdErrorMessage,
  }
}

