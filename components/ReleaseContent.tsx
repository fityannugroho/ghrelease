'use client'

import { getRelease } from '@/lib/github'
import { isNextNotFoundError } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { LinkIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'sonner'
import { Button } from './ui/button'

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
      <div className="mb-4 flex gap-2">
        <p className="text-2xl font-semibold">{release.tag_name}</p>
        <Button
          size={null}
          variant="ghost"
          className="text-xs flex items-center gap-2 p-1"
          onClick={() => {
            try {
              navigator.clipboard.writeText(
                `${window.location.origin}/${repo}?tag=${tag ?? ''}`,
              )
              toast.success('Copied')
            } catch {
              toast.error('Failed to copy the link')
            }
          }}
        >
          <LinkIcon className="h-4 w-4" />
          <span className="sr-only">Copy Link</span>
        </Button>
      </div>
      <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
        {release.body}
      </ReactMarkdown>
    </>
  )
}
