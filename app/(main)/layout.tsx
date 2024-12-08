import { Navbar } from '@/components/Navbar'
import type { PropsWithChildren } from 'react'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
