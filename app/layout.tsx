import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import QueryClientProvider from '@/components/QueryClientProvider'
import { Toaster } from '@/components/ui/sonner'
import { APP_NAME } from '@/lib/const'
import { ThemeProvider } from 'next-themes'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

const title = APP_NAME
const description = 'Read and discover GitHub repository releases with ease.'

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: APP_NAME,
    title,
    description,
    images: '/og-image.png',
  },
  twitter: {
    card: 'summary_large_image',
    site: APP_NAME,
    title,
    description,
  },
  keywords: `${APP_NAME}, github, release, release viewer, github repository, github release, tools`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider>{children}</QueryClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
