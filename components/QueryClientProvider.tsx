'use client'

import { getQueryClient } from '@/lib/queryClient'
import { QueryClientProvider as BaseQueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'

export default function QueryClientProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <BaseQueryClientProvider client={queryClient}>
      {children}
    </BaseQueryClientProvider>
  )
}
