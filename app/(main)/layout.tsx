import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  )
}
