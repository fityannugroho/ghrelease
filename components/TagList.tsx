'use client'

import {
  MAX_ITEMS_PER_PAGE,
  type Tag,
  getTags,
  isRateLimitError,
} from '@/lib/github'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useInfiniteQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [filter, setFilter] = useState<string>('')
  const [idleCount, setIdleCount] = useState(0)

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
    enabled: idleCount === 0,
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
          idleCount === 0
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
  ])

  const triggerIdle = useCallback(() => {
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
      triggerIdle()
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

      <ScrollArea className="max-h-[10rem] lg:max-h-[20rem] overflow-y-auto">
        <ul className="space-y-2">
          {tagsQuery.isPending &&
            Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: This is a skeleton list
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
          {tagsQuery.hasNextPage && idleCount === 0 && (
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

      {idleCount > 0 && (
        <p className="text-destructive text-center text-sm">
          GitHub API Rate limit exceeded. Retrying in {idleCount} seconds.
        </p>
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
