'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { searchRepos } from '@/lib/github'
import { debounce } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'

export default function SearchRepos() {
  const [query, setQuery] = useState('')

  const reposQuery = useQuery({
    queryKey: ['repos', query],
    queryFn: () => searchRepos(query),
    enabled: query.length > 0,
  })

  const handleSearch = debounce(async (value: string) => {
    setQuery(value)
  }, 500)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search repositories..."
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-grow"
        />
      </div>

      {reposQuery.isLoading && <p>Loading...</p>}

      {reposQuery.isError && (
        <p className="text-destructive">
          An error occurred: {reposQuery.error.message}
        </p>
      )}

      {reposQuery.isSuccess && reposQuery.data.length === 0 && (
        <p>No repositories found.</p>
      )}

      {reposQuery.isSuccess && reposQuery.data.length > 0 && (
        <ul className="space-y-2">
          {reposQuery.data?.map((repo) => (
            <li
              key={repo.id}
              className="border rounded-lg p-4 hover:bg-accent transition-colors"
            >
              <Link
                href={`/${repo.full_name}`}
                className="flex items-center gap-4"
              >
                <Avatar>
                  <AvatarImage
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                  />
                  <AvatarFallback>
                    {repo.owner.login[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{repo.full_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {repo.description}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
