'use client'

import { getRelease } from '@/lib/github'
import { isNextNotFoundError } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ClockIcon, LinkIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkGithub, {
  defaultBuildUrl,
  type Options as RemarkGithubOptions,
} from 'remark-github'
import { toast } from 'sonner'
import { Button } from './ui/button'

type Props = {
  repo: string
  tag?: string
}

const remarkGithubConfig: Readonly<RemarkGithubOptions> = {
  mentionStrong: false,
  buildUrl: (values) => {
    // Don't link package names, e.g. `@types/node`
    // Github username can't have `/` character
    if (values.type === 'mention' && values.user.includes('/')) {
      return false
    }

    return defaultBuildUrl(values)
  },
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
      <div className="mb-2 flex gap-2">
        <p className="text-2xl font-semibold">{release.tag_name}</p>
        <Button
          size={null}
          variant="ghost"
          className="text-xs flex items-center gap-2 p-1"
          onClick={() => {
            try {
              navigator.clipboard.writeText(
                `${window.location.origin}/${repo}?tag=${release.tag_name}`,
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

      <div className="flex items-center gap-4">
        <div className="flex gap-2 items-center">
          <ClockIcon className="h-4 w-4" />
          <span className="text-sm">
            {dayjs(release.published_at).format('D MMMM YYYY HH:mm A (Z)')}
          </span>
        </div>
      </div>

      <hr className="mt-4 mb-6" />

      <ReactMarkdown
        className="prose prose-sm dark:prose-invert max-w-none"
        remarkPlugins={[
          remarkGfm,
          [
            remarkGithub,
            {
              ...remarkGithubConfig,
              repository: repo,
            },
          ],
        ]}
      >
        {release.body}
      </ReactMarkdown>
    </>
  )
}
