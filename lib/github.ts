import { notFound } from 'next/navigation'
import { getStoredGithubToken } from './tokenStorage'

export type Repo = {
  id: number
  full_name: string
  owner: { login: string; avatar_url: string }
  description?: string
} & Record<string, unknown>

export type Release = {
  id: number
  tag_name: string
  body: string
  isSelected: boolean
  created_at: string
  published_at: string
  prerelease: boolean
}

export type Tag = {
  name: string
}

export const MAX_ITEMS_PER_PAGE = 30

const GITHUB_API_URL = 'https://api.github.com'

const RATE_LIMIT_ERR_MSG = 'GitHub API rate limit exceeded'

export function isRateLimitError(error: unknown) {
  return error instanceof Error && error.message === RATE_LIMIT_ERR_MSG
}

async function fetchGitHub<T extends object>(endpoint: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  }

  const token = getStoredGithubToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    headers,
  })

  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    const text = await response.text()
    console.error('Non-JSON response:', text)
    throw new Error('GitHub API did not return JSON')
  }

  const result = (await response.json()) as T

  if (!response.ok) {
    if (response.status === 404) {
      notFound()
    }
    if (response.status === 403) {
      throw new Error(RATE_LIMIT_ERR_MSG)
    }
    throw new Error(
      `GitHub API error: ${
        'message' in result ? result.message : 'unknown error'
      } (${response.status})`,
    )
  }
  return result
}

export async function searchRepos(query: string): Promise<Repo[]> {
  const data: { items: Repo[] } = await fetchGitHub(
    `/search/repositories?q=${encodeURIComponent(query)}`,
  )
  return data.items.map((item) => ({
    id: item.id,
    full_name: item.full_name,
    owner: { login: item.owner.login, avatar_url: item.owner.avatar_url },
    description: item.description,
  }))
}

export async function getTags(repo: string, page = 1): Promise<Tag[]> {
  const data: Tag[] = await fetchGitHub(`/repos/${repo}/tags?page=${page}`)
  return data
}

export async function getRelease(repo: string, tag?: string): Promise<Release> {
  const endpoint = tag
    ? `/repos/${repo}/releases/tags/${tag}`
    : `/repos/${repo}/releases/latest`
  const data: Release = await fetchGitHub(endpoint)
  return {
    id: data.id,
    tag_name: data.tag_name,
    body: data.body,
    isSelected: false,
    created_at: data.created_at,
    published_at: data.published_at,
    prerelease: data.prerelease,
  }
}

export async function getRepo(repo: string): Promise<Repo> {
  const data: Repo = await fetchGitHub(`/repos/${repo}`)
  return data
}
