type TokenPersistMode = 'session' | 'local'

type StoreTokenOptions = {
  persist?: TokenPersistMode
}

/**
 * Check if the user is authenticated with a GitHub token.
 * Returns `true` if the non-HttpOnly cookie 'gh_auth' is present, `false` otherwise.
 */
export function isGithubTokenPresent(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // We can't read the actual token (HttpOnly),
  // but we can check the 'gh_auth' cookie to see if we are authenticated.
  const cookies = document.cookie.split('; ')
  const authCookie = cookies.find((c) => c.startsWith('gh_auth='))

  return !!authCookie
}

/**
 * Save a GitHub token by calling the backend API.
 */
export async function setStoredGithubToken(
  token: string | null,
  { persist = 'session' }: StoreTokenOptions = {},
) {
  if (typeof window === 'undefined') {
    return
  }

  if (!token) {
    const response = await fetch('/api/auth/token', { method: 'DELETE' })
    if (!response.ok) {
      throw new Error('Failed to delete token')
    }
    return
  }

  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, persist }),
  })
  if (!response.ok) {
    throw new Error('Failed to store token')
  }
}

/**
 * Clear the GitHub token by calling the backend API.
 */
export async function clearStoredGithubToken() {
  await setStoredGithubToken(null)
}
