'use client'

import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  getTags,
  isRateLimitError,
  MAX_ITEMS_PER_PAGE,
  type Tag,
} from '@/lib/github'
import { getStoredGithubToken } from '@/lib/tokenStorage'
import AddGithubTokenDialog from './AddGithubTokenDialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'

type Props = {
  repo: string
  tag: Tag | null
  onTagSelect?: (tag: Tag) => void
}

export default function TagList({
  repo,
  tag: selectedTag,
  onTagSelect,
}: Props) {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<string>('')
  const [idleCount, setIdleCount] = useState(0)
  const [hasTokenWhenRateLimited, setHasTokenWhenRateLimited] = useState(true)

  const { fetchNextPage, ...tagsQuery } = useInfiniteQuery({
    queryKey: ['tags', repo],
    queryFn: ({ pageParam }) => getTags(repo, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < MAX_ITEMS_PER_PAGE) {
        return undefined
      }
      return lastPageParam + 1
    },
    enabled: idleCount === 0 && hasTokenWhenRateLimited,
  })

  const tags = useMemo(() => {
    return tagsQuery.data?.pages?.flat() ?? []
  }, [tagsQuery.data])

  const filteredTags = useMemo(() => {
    return tags.filter((tag) => tag.name.toLowerCase().includes(filter))
  }, [tags, filter])

  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          tagsQuery.hasNextPage &&
          !tagsQuery.isFetchingNextPage &&
          idleCount === 0 &&
          hasTokenWhenRateLimited
        ) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [
    fetchNextPage,
    tagsQuery.hasNextPage,
    tagsQuery.isFetchingNextPage,
    idleCount,
    hasTokenWhenRateLimited,
  ])

  const triggerIdle = useCallback(() => {
    // Check if user has token
    const hasToken = !!getStoredGithubToken()

    if (!hasToken) {
      // No token: disable fetching permanently
      setHasTokenWhenRateLimited(false)
      setIdleCount(0)
      return
    }

    // Has token: retry with countdown
    /** In seconds */
    const waitIdleTime = 10 * (tagsQuery.errorUpdateCount || 1)
    setIdleCount(waitIdleTime)

    const timer = setInterval(() => {
      setIdleCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1_000) // 1 second interval

    // Cleanup
    return () => clearInterval(timer)
  }, [tagsQuery.errorUpdateCount])

  // Trigger the idle when rate limit error occurs
  useEffect(() => {
    if (isRateLimitError(tagsQuery.error)) {
      return triggerIdle()
    }
  }, [tagsQuery.error, triggerIdle])

  return (
    <div className="border p-4 rounded lg:sticky lg:top-16 lg:z-20 flex flex-col gap-2">
      <p className="text-lg font-semibold mb-4">Tags ({tags.length})</p>

      {/* Filter tags */}
      <Input
        type="text"
        placeholder="Filter tags"
        value={filter}
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
        className="w-full border rounded mb-3"
      />

      <ScrollArea className="max-h-40 lg:max-h-80 overflow-y-auto">
        <ul className="space-y-2">
          {tagsQuery.isPending &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-8" />
            ))}

          {filteredTags.map((tag) => (
            <li key={tag.name}>
              <Button
                variant={tag.name === selectedTag?.name ? 'default' : 'outline'}
                onClick={() => {
                  onTagSelect?.(tag)
                }}
                className="w-full truncate"
              >
                {tag.name}
              </Button>
            </li>
          ))}

          {/* Load more */}
          {tagsQuery.hasNextPage &&
            idleCount === 0 &&
            hasTokenWhenRateLimited && (
              <div ref={observerTarget} className="h-6">
                {tagsQuery.isFetchingNextPage && (
                  <LoaderIcon className="animate-spin h-6 w-6 mx-auto">
                    <span className="sr-only">Loading...</span>
                  </LoaderIcon>
                )}
              </div>
            )}
        </ul>
      </ScrollArea>

      {/* Rate limit with token: show countdown */}
      {idleCount > 0 && hasTokenWhenRateLimited && (
        <p className="text-destructive text-center text-sm">
          GitHub API Rate limit exceeded. Retrying in {idleCount} seconds.
        </p>
      )}

      {/* Rate limit without token: show dialog */}
      {!hasTokenWhenRateLimited && isRateLimitError(tagsQuery.error) && (
        <div className="flex flex-col items-center gap-3 py-2">
          <p className="text-destructive text-center text-sm font-medium">
            GitHub API Rate limit exceeded.
          </p>
          <p className="text-muted-foreground text-center text-xs">
            Add a GitHub token to increase your rate limit and continue
            browsing.
          </p>

          <AddGithubTokenDialog
            onSuccess={async () => {
              await queryClient.invalidateQueries({
                queryKey: ['tags', repo],
                predicate: (query) => isRateLimitError(query.state.error),
              })
              toast.success('GitHub token saved successfully!')
              setHasTokenWhenRateLimited(true)
            }}
            onError={(error) => {
              toast.error('Failed to store GitHub token. Please try again.')
              console.error('Failed to store GitHub token', error)
            }}
          />
        </div>
      )}

      {tagsQuery.isError && !isRateLimitError(tagsQuery.error) && (
        <p className="text-destructive text-center text-sm">
          {tagsQuery.error.message}
        </p>
      )}

      {tagsQuery.isSuccess &&
        !tagsQuery.hasNextPage &&
        filteredTags.length < 1 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            No tags found. Try a different filter.
          </p>
        )}
    </div>
  )
}
