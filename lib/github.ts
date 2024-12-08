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
}

export type Tag = {
  name: string
}

const GITHUB_API_URL = 'https://api.github.com'

async function fetchGitHub(endpoint: string) {
  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
    next: { revalidate: 60 }, // Revalidate cache every 60 seconds
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(`GitHub API error: ${result.message} (${response.status})`)
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
  }
}

export async function getRepo(repo: string): Promise<Repo> {
  const data: Repo = await fetchGitHub(`/repos/${repo}`)
  return data
}
