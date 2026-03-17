import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const GITHUB_API_URL = 'https://api.github.com'
const TOKEN_COOKIE_NAME = 'gh_token'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxy(request, await params)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxy(request, await params)
}

async function handleProxy(request: Request, { path }: { path: string[] }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value

  const { searchParams } = new URL(request.url)
  const targetPath = path.join('/')
  const queryString = searchParams.toString()
  const url = `${GITHUB_API_URL}/${targetPath}${queryString ? `?${queryString}` : ''}`

  const headers = new Headers(request.headers)
  headers.set('Accept', 'application/vnd.github+json')
  headers.delete('host')
  headers.delete('cookie') // Don't forward our cookies to GitHub

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body:
        request.method !== 'GET' && request.method !== 'HEAD'
          ? await request.blob()
          : undefined,
    })

    const data = await response.arrayBuffer()

    // Create new response with forwarded headers
    const forwardedHeaders = new Headers()
    const headersToForward = [
      'content-type',
      'x-ratelimit-limit',
      'x-ratelimit-remaining',
      'x-ratelimit-reset',
      'x-ratelimit-used',
      'x-ratelimit-resource',
      'link',
    ]

    for (const header of headersToForward) {
      const value = response.headers.get(header)
      if (value) {
        forwardedHeaders.set(header, value)
      }
    }

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: forwardedHeaders,
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request to GitHub' },
      { status: 500 },
    )
  }
}
