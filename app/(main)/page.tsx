import SearchRepos from '@/components/SearchRepos'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-4xl font-bold my-4 lg:my-6 text-center">
        GitHub Release Viewer
      </h1>
      <p className="text-center text-sm md:text-base mb-6 text-pretty max-w-lg mx-auto">
        GitHub Release page with <b>better UX</b>. Read and discover GitHub
        repository release notes with ease.
      </p>
      <SearchRepos />
    </div>
  )
}
