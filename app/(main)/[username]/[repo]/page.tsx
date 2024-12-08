import type { PageProps } from '@/app/types'
import ReleaseNotes from '@/components/ReleaseNotes'
import { type Repo, getRepo } from '@/lib/github'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Params = {
  username: string
  repo: string
}

export async function generateMetadata({ params }: PageProps<Params>) {
  const { username, repo } = await params

  return {
    title: `${username}/${repo} releases`,
    description: `Read and discover GitHub repository releases of ${username}/${repo} with ease.`,
  }
}

export default async function ReleasePage({ params }: PageProps<Params>) {
  const { username, repo } = await params
  let ghRepo: Repo | undefined

  try {
    ghRepo = await getRepo(`${username}/${repo}`)
  } catch {
    return notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex gap-4 items-center">
        <Image
          src={ghRepo.owner.avatar_url}
          alt={ghRepo.owner.login}
          className="w-12 h-12 rounded-full"
        />
        <div className="">
          {/* Avatar */}
          <h1 className="text-4xl font-bold mb-2">
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

      <ReleaseNotes repo={`${username}/${repo}`} />
    </div>
  )
}
