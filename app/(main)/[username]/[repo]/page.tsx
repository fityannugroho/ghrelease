import type { PageProps } from '@/app/types'
import ReleaseNotes from '@/components/ReleaseNotes'
import { getRepo } from '@/lib/github'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

type Params = {
  username: string
  repo: string
}

type SearchParams = {
  tag?: string
}

export async function generateMetadata({
  params,
}: PageProps<Params, SearchParams>): Promise<Metadata> {
  const { username, repo } = await params
  const title = `${username}/${repo}`
  const description = `Read and discover GitHub repository releases of ${username}/${repo} with ease.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  }
}

export default async function ReleasePage({ params }: PageProps<Params>) {
  const { username, repo } = await params
  const ghRepo = await getRepo(`${username}/${repo}`)

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex gap-4 items-center">
        <Image
          src={ghRepo.owner.avatar_url}
          alt={ghRepo.owner.login}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full"
        />
        <div className="">
          {/* Avatar */}
          <h1 className="text-3xl font-bold mb-2">
            <Link
              href={`https://github.com/${username}/${repo}`}
              target="_blank"
              className="hover:underline"
            >
              <code>
                {username}/{repo}
              </code>
            </Link>
          </h1>
          <p>{ghRepo.description}</p>
        </div>
      </div>

      <ReleaseNotes repo={ghRepo.full_name} />
    </div>
  )
}
