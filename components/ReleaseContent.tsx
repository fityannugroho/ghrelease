'use client'

import { getRelease } from '@/lib/github'
import { isNextNotFoundError } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'

type Props = {
  repo: string
  tag?: string
}

export default function ReleaseContent({ repo, tag }: Props) {
  const { data: release } = useSuspenseQuery({
    queryKey: ['release', repo, tag],
    queryFn: async () => {
      try {
        return await getRelease(repo, tag)
      } catch (error) {
        if (isNextNotFoundError(error)) {
          return null
        }
        throw error
      }
    },
  })

  if (!release) {
    return <p>Release note not found</p>
  }

  return (
    <>
      <p className="text-2xl font-semibold mb-4">{release.tag_name}</p>
      <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
        {release.body}
      </ReactMarkdown>
    </>
  )
}
