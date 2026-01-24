const STORAGE_KEY = 'ghrelease.githubToken'

let cachedToken: string | null = null
let hasLoadedSession = false

type TokenPersistMode = 'session' | 'local'

type StoreTokenOptions = {
  persist?: TokenPersistMode
}

export function getStoredGithubToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  if (!hasLoadedSession) {
    hasLoadedSession = true
    try {
      const sessionValue = window.sessionStorage.getItem(STORAGE_KEY)
      if (sessionValue) {
        cachedToken = sessionValue
      } else {
        const localValue = window.localStorage.getItem(STORAGE_KEY)
        cachedToken = localValue || null
      }
    } catch (error) {
      console.error('Failed to read GitHub token from storage', error)
    }
  }

  return cachedToken
}

export function setStoredGithubToken(
  token: string | null,
  { persist = 'session' }: StoreTokenOptions = {},
) {
  if (typeof window === 'undefined') {
    return
  }

  cachedToken = token
  hasLoadedSession = true

  try {
    if (!token) {
      window.sessionStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    if (persist === 'local') {
      window.localStorage.setItem(STORAGE_KEY, token)
      window.sessionStorage.removeItem(STORAGE_KEY)
      return
    }

    window.sessionStorage.setItem(STORAGE_KEY, token)
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to persist GitHub token', error)
  }
}
