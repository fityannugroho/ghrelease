'use client'

import { TriangleAlertIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import AddGithubTokenDialog from '@/components/AddGithubTokenDialog'
import { Button } from '@/components/ui/button'
import { isRateLimitError } from '@/lib/github'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const rateLimitError = isRateLimitError(error)

  return (
    <div className="flex flex-col items-center justify-center py-[10em] p-4">
      <div className="flex gap-2 items-center mb-2 text-warning">
        <TriangleAlertIcon className="h-5 w-5" />
        <span className="text-2xl font-bold">Error!</span>
      </div>

      <p className="text-center text-pretty font-medium mb-6 max-w-xl">
        {rateLimitError ? (
          <>
            <b>You have reached the rate limit of the GitHub API.</b> Add a
            personal access token to continue without waiting, or try again
            later.
          </>
        ) : (
          <>
            Something went wrong. Please check your connection and try again. If
            error persists, contact support.
          </>
        )}
      </p>

      <div className="flex justify-center mb-4 gap-2">
        <Button asChild variant="outline">
          <Link href="/">Go to Main Page</Link>
        </Button>
        {rateLimitError ? (
          <AddGithubTokenDialog onSuccess={reset} />
        ) : (
          <Button variant="secondary" onClick={reset}>
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
