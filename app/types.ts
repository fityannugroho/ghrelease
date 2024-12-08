export type PageProps<Params = unknown, SearchParams = unknown> = {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}
