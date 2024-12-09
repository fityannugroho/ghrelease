'use client'

import { MAX_ITEMS_PER_PAGE, type Tag, getTags } from '@/lib/github'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useInfiniteQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

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
          !tagsQuery.isFetchingNextPage
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
  }, [fetchNextPage, tagsQuery.hasNextPage, tagsQuery.isFetchingNextPage])

  return (
    <div className="border p-4 rounded">
      <p className="text-lg font-semibold mb-4">Tags ({tags.length})</p>

      {/* Filter tags */}
      <Input
        type="text"
        placeholder="Filter tags"
        value={filter}
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
        className="w-full p-2 border rounded my-4"
      />

      <ScrollArea className="mt-2 max-h-[10rem] lg:max-h-[16rem] overflow-y-auto">
        <ul className="space-y-2">
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
          {tagsQuery.hasNextPage && (
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

      {tagsQuery.isPending && (
        <p className="text-center text-sm mt-2">Loading tags...</p>
      )}

      {tagsQuery.isError && (
        <p className="text-destructive text-center text-sm mt-2">
          {tagsQuery.error.message}
        </p>
      )}

      {tagsQuery.isSuccess &&
        !tagsQuery.hasNextPage &&
        filteredTags.length < 1 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
            No tags found. Try a different filter.
          </p>
        )}
    </div>
  )
}
