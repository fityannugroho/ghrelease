import type { Metadata } from 'next'
import type { PageProps } from '@/app/types'
import ReleasePageClient from './page.client'

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
  const description = `Read and discover release notes of ${username}/${repo} repository with ease.`

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

  return <ReleasePageClient repoFullName={`${username}/${repo}`} />
}
