import SearchRepos from '@/components/SearchRepos'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-2 text-center">
        GitHub Release Viewer
      </h1>
      <p className="text-center mb-6 text-pretty max-w-lg mx-auto">
        Search for a repository to view its latest releases. This app uses the
        GitHub API to fetch the releases of a repository.
      </p>
      <SearchRepos />
    </div>
  )
}
