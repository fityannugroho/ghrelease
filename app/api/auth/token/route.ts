import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  AUTH_COOKIE_NAME,
  TOKEN_COOKIE_NAME,
  TOKEN_EXPIRY_DAYS,
} from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { token, persist } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    if (!token.startsWith('github_pat_') && !token.startsWith('ghp_')) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 },
      )
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

    cookieStore.set(AUTH_COOKIE_NAME, 'true', {
      ...commonOptions,
      httpOnly: false,
    })

    return NextResponse.json({ success: true })
  } catch (_error) {
    console.error(_error)
    return NextResponse.json({ error: 'Failed to set token' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_COOKIE_NAME)
  cookieStore.delete(AUTH_COOKIE_NAME)

  return NextResponse.json({ success: true })
}
