'use client'

import { QueryClientProvider as BaseQueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type PropsWithChildren, useState } from 'react'
import { getQueryClient } from '@/lib/queryClient'

export default function QueryClientProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </BaseQueryClientProvider>
  )
}
