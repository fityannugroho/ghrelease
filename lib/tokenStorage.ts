const STORAGE_KEY = 'ghrelease.githubToken'
const TOKEN_EXPIRY_DAYS = 7
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000

let cachedTokenData: { token: string; expiresAt?: number } | null = null
let hasLoadedSession = false

type StoredTokenData = {
  token: string
  expiresAt: number
}

type TokenPersistMode = 'session' | 'local'

type StoreTokenOptions = {
  persist?: TokenPersistMode
}

function isTokenExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt
}

function isValidGitHubToken(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    (value.startsWith('github_pat_') || value.startsWith('ghp_'))
  )
}

export function getStoredGithubToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  // Check cache expiry even if already loaded
  if (hasLoadedSession && cachedTokenData) {
    if (
      cachedTokenData.expiresAt &&
      isTokenExpired(cachedTokenData.expiresAt)
    ) {
      // Expired in cache - clear it
      cachedTokenData = null
      window.localStorage.removeItem(STORAGE_KEY)
      window.sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return cachedTokenData.token
  }

  if (hasLoadedSession) {
    return cachedTokenData?.token ?? null
  }

  hasLoadedSession = true

  try {
    // Priority 1: sessionStorage (plain string)
    const sessionValue = window.sessionStorage.getItem(STORAGE_KEY)
    if (sessionValue) {
      cachedTokenData = { token: sessionValue }
      return sessionValue
    }

    // Priority 2: localStorage (JSON with expiry)
    const localValue = window.localStorage.getItem(STORAGE_KEY)
    if (!localValue) {
      cachedTokenData = null
      return null
    }

    // Try parse as JSON (new format)
    try {
      const parsed = JSON.parse(localValue)

      // Validate structure
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid token format')
      }

      if (typeof parsed.token !== 'string' || !parsed.token) {
        throw new Error('Invalid token in storage')
      }

      // Check if has expiresAt field
      if ('expiresAt' in parsed && typeof parsed.expiresAt === 'number') {
        // New format with expiry
        if (isTokenExpired(parsed.expiresAt)) {
          // Token expired - remove and return null
          window.localStorage.removeItem(STORAGE_KEY)
          cachedTokenData = null
          return null
        }

        // Token valid
        cachedTokenData = { token: parsed.token, expiresAt: parsed.expiresAt }
        return parsed.token
      }

      // Has token but no expiresAt - validate and add expiry
      if (!isValidGitHubToken(parsed.token)) {
        throw new Error('Invalid token format')
      }

      const expiresAt = Date.now() + TOKEN_EXPIRY_MS
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: parsed.token, expiresAt }),
      )
      cachedTokenData = { token: parsed.token, expiresAt }
      return parsed.token
    } catch {
      // Not JSON - could be old format (plain string) or corrupt data
      // Validate it looks like a GitHub token before migrating
      if (!isValidGitHubToken(localValue)) {
        // Corrupt or invalid data - clear it
        window.localStorage.removeItem(STORAGE_KEY)
        cachedTokenData = null
        return null
      }

      // Valid old format - migrate
      const expiresAt = Date.now() + TOKEN_EXPIRY_MS
      const data: StoredTokenData = {
        token: localValue,
        expiresAt,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      cachedTokenData = { token: localValue, expiresAt }
      return localValue
    }
  } catch (error) {
    console.error('Failed to read GitHub token from storage', error)
    cachedTokenData = null
    return null
  }
}

export function setStoredGithubToken(
  token: string | null,
  { persist = 'session' }: StoreTokenOptions = {},
) {
  if (typeof window === 'undefined') {
    return
  }

  cachedTokenData = token ? { token } : null
  hasLoadedSession = true

  try {
    if (!token) {
      window.sessionStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    if (persist === 'local') {
      // Save to localStorage with expiry
      const expiresAt = Date.now() + TOKEN_EXPIRY_MS
      const data: StoredTokenData = { token, expiresAt }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      cachedTokenData = { token, expiresAt }

      // Remove from sessionStorage
      window.sessionStorage.removeItem(STORAGE_KEY)
      return
    }

    // persist === 'session'
    // Save plain string to sessionStorage
    window.sessionStorage.setItem(STORAGE_KEY, token)

    // Remove from localStorage
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to persist GitHub token', error)
  }
}
