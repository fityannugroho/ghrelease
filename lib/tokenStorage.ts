const STORAGE_KEY = 'ghrelease.githubToken'

export function getStoredGithubToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value || null
  } catch (error) {
    console.error('Failed to read GitHub token from storage', error)
    return null
  }
}

export function setStoredGithubToken(token: string | null) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (!token) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    window.localStorage.setItem(STORAGE_KEY, token)
  } catch (error) {
    console.error('Failed to persist GitHub token', error)
  }
}
