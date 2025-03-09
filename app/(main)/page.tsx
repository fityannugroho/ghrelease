import SearchRepos from '@/components/SearchRepos'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="my-10 lg:my-14">
        <h1 className="text-2xl md:text-4xl mb-4 font-bold text-center">
          GitHub Release Viewer
        </h1>
        <p className="text-center text-sm md:text-base text-pretty mb-2 max-w-lg mx-auto">
          GitHub Release page with <b>better UX</b>. Read and discover GitHub
          release notes with ease.
        </p>
      </div>
      <SearchRepos />
    </div>
  )
}
