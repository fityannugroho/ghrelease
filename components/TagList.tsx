'use client'

import { MAX_ITEMS_PER_PAGE, type Tag, getTags } from '@/lib/github'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
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

  const tags = tagsQuery.data?.pages.flat() ?? []
  const filteredTags = tags.filter((tag) => tag.name.includes(filter))

  return (
    <div className="border p-4 rounded">
      <p className="text-lg font-semibold mb-4">Tags ({tags.length})</p>

      {tagsQuery.status === 'pending' && <p>Loading tags...</p>}

      {tagsQuery.status === 'error' && (
        <p className="text-destructive">{tagsQuery.error.message}</p>
      )}

      {tagsQuery.status === 'success' && (
        <>
          {/* Filter tags */}
          <Input
            type="text"
            placeholder="Filter tags"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 border rounded my-4"
          />

          <ScrollArea className="mt-2 max-h-[10rem] lg:max-h-[60vh] overflow-y-auto">
            {filteredTags.length > 0 ? (
              <ul className="space-y-2">
                {filteredTags.map((tag) => (
                  <li key={tag.name}>
                    <Button
                      variant={tag === selectedTag ? 'default' : 'outline'}
                      onClick={() => {
                        onTagSelect?.(tag)
                      }}
                      className="w-full"
                    >
                      {tag.name}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center my-2 text-gray-500">
                No tags found. Try a different filter or load more.
              </p>
            )}

            {/* Load more */}
            {tagsQuery.hasNextPage && (
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                className="w-full mt-2"
                disabled={tagsQuery.isFetchingNextPage}
              >
                {tagsQuery.isFetchingNextPage ? 'Loading...' : 'Load more'}
              </Button>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  )
}
