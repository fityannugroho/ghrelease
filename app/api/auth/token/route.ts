import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const TOKEN_COOKIE_NAME = 'gh_token'
const TOKEN_EXPIRY_DAYS = 7

export async function GET() {
  const cookieStore = await cookies()
  const hasToken = cookieStore.has(TOKEN_COOKIE_NAME)

  return NextResponse.json({ authenticated: hasToken })
}

export async function POST(request: Request) {
  try {
    const { token, persist } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const cookieStore = await cookies()

    const commonOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      ...(persist === 'local'
        ? { maxAge: TOKEN_EXPIRY_DAYS * 24 * 60 * 60 }
        : {}),
    }

    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      ...commonOptions,
      httpOnly: true,
    })

    cookieStore.set('gh_auth', 'true', {
      ...commonOptions,
      httpOnly: false,
    })

    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to set token' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE_NAME)
  cookieStore.delete('gh_auth')

  return NextResponse.json({ success: true })
}
