'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import ReleaseNotes from '@/components/ReleaseNotes'
import { getRepo, type Repo } from '@/lib/github'

type Props = {
  repoFullName: string
}

function RepoHeader({ repo }: { repo: Repo }) {
  return (
    <div className="mb-6 flex gap-4 items-center">
      <Image
        src={repo.owner.avatar_url}
        alt={repo.owner.login}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full"
      />
      <div className="overflow-x-hidden">
        <h1 className="text-3xl font-bold mb-2">
          <Link
            href={`https://github.com/${repo.full_name}`}
            target="_blank"
            className="hover:underline"
          >
            <code className="block line-clamp-2 text-ellipsis">
              {repo.full_name}
            </code>
          </Link>
        </h1>
        <p>{repo.description}</p>
      </div>
    </div>
  )
}

export default function ReleasePageClient({ repoFullName }: Props) {
  const { data: repo } = useSuspenseQuery({
    queryKey: ['repo', repoFullName],
    queryFn: () => getRepo(repoFullName),
  })

  return (
    <div className="container mx-auto p-4">
      <RepoHeader repo={repo} />
      <ReleaseNotes repo={repo.full_name} />
    </div>
  )
}
