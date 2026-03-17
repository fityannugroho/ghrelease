type TokenPersistMode = 'session' | 'local'

type StoreTokenOptions = {
  persist?: TokenPersistMode
}

/**
 * Check if the user is authenticated with a GitHub token.
 * This checks for a non-HttpOnly cookie 'gh_auth'.
 */
export function getStoredGithubToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  // We can't read the actual token (HttpOnly),
  // but we can check the 'gh_auth' cookie to see if we are authenticated.
  const cookies = document.cookie.split('; ')
  const authCookie = cookies.find((c) => c.startsWith('gh_auth='))

  return authCookie ? 'present' : null
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
    await fetch('/api/auth/token', { method: 'DELETE' })
    return
  }

  await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, persist }),
  })
}

/**
 * Clear the GitHub token by calling the backend API.
 */
export async function clearStoredGithubToken() {
  await setStoredGithubToken(null)
}
