'use client'

import { CoffeeIcon } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/95 py-3 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center text-xs md:text-sm text-foreground/70">
          {/* Copyright and info */}
          <p className="mt-1">
            © {year}, built with{' '}
            <span role="img" aria-label="coffee">
              <CoffeeIcon className="inline mx-0.5 h-4 w-4" />
            </span>{' '}
            by{' '}
            <Link
              href="https://github.com/fityannugroho"
              target="_blank"
              className="underline"
            >
              fityannugroho
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
