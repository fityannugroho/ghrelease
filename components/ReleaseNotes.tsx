'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import type { Tag } from '@/lib/github'
import ReleaseContent from './ReleaseContent'
import TagList from './TagList'

type Props = {
  repo: string
}

export default function ReleaseNotes({ repo }: Props) {
  const searchParams = useSearchParams()
  const tag = searchParams.get('tag')
  const [selectedTag, setSelectedTag] = useState<Tag | null>(
    tag ? { name: tag } : null,
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* First column */}
      <div className="lg:col-span-1">
        <TagList repo={repo} tag={selectedTag} onTagSelect={setSelectedTag} />
      </div>

      {/* Second column */}
      <div className="lg:col-span-3">
        <div className="border p-4 rounded">
          {selectedTag ? (
            <Suspense fallback={<p>Loading release note...</p>}>
              <ReleaseContent repo={repo} tag={selectedTag.name} />
            </Suspense>
          ) : (
            <p>Select a tag to view release note</p>
          )}
        </div>
      </div>
    </div>
  )
}
