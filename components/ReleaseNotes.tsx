'use client'

import { type Tag, getRelease, getTags } from '@/lib/github'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

const MAX_ITEMS_PER_PAGE = 30

type Props = {
  repo: string
}

export default function ReleaseNotes({ repo }: Props) {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const [filter, setFilter] = useState<string>('')

  const releaseQuery = useQuery({
    queryKey: ['release', repo, selectedTag?.name],
    queryFn: () => getRelease(repo, selectedTag?.name),
  })

  const { fetchNextPage, ...tagsQuery } = useInfiniteQuery({
    queryKey: ['tags', repo],
    queryFn: ({ pageParam }) => getTags(repo, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < MAX_ITEMS_PER_PAGE) {
        return undefined
      }
      return lastPageParam + 1
    },
  })

  const tags = tagsQuery.data?.pages.flat() ?? []
  const filteredTags = tags.filter((tag) => tag.name.includes(filter))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* First column */}
      <div className="lg:col-span-1">
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
                          variant={
                            tag === selectedTag ||
                            tag.name === releaseQuery.data?.tag_name
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => {
                            setSelectedTag(tag)
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
      </div>

      {/* Second column */}
      <div className="lg:col-span-3 border p-4 rounded">
        {releaseQuery.status === 'pending' && <p>Loading release notes...</p>}

        {releaseQuery.status === 'error' && (
          <p className="text-destructive">{releaseQuery.error.message}</p>
        )}

        {releaseQuery.status === 'success' && (
          <>
            <p className="text-2xl font-semibold mb-4">
              {selectedTag?.name || releaseQuery.data.tag_name}
            </p>
            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
              {releaseQuery.data.body}
            </ReactMarkdown>
          </>
        )}
      </div>
    </div>
  )
}
