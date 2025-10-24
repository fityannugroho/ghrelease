'use client'

import { TriangleAlertIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
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

  return (
    <div className="flex flex-col items-center justify-center py-[10em] p-4">
      <div className="flex gap-2 items-center mb-2 text-warning">
        <TriangleAlertIcon className="h-5 w-5" />
        <span className="text-2xl font-bold">Error!</span>
      </div>

      <div className="text-center text-pretty font-medium mb-6">
        {isRateLimitError(error) ? (
          <p>
            <b>You have reached the rate limit of the GitHub API.</b> Please try
            again later.
          </p>
        ) : (
          <p>
            Something went wrong. Please try again later or contact support.
          </p>
        )}
      </div>

      <div className="flex justify-center mb-4 gap-2">
        <Button asChild variant="outline">
          <Link href="/">Go to Main Page</Link>
        </Button>
        <Button variant="secondary" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
