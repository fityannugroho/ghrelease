'use client'

import { APP_NAME, SHORT_APP_NAME } from '@/lib/const'
import { HeartHandshakeIcon, MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import GithubIcon from './icons/GithubIcon'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

type MenuItem = {
  label: string
  href: string
  target?: string
  accessories?: React.ReactNode
}

const menuItems: MenuItem[] = [
  {
    href: 'https://github.com/fityannugroho/ghrelease',
    label: 'Source Code',
    target: '_blank',
  },
  {
    href: 'https://linktr.ee/fityannugroho',
    label: 'Support Me',
    target: '_blank',
    accessories: <HeartHandshakeIcon className="h-5 w-5" />,
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      className={
        'sticky top-0 z-50 py-2 border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'
      }
    >
      <div className="container flex items-center justify-between flex-wrap mx-auto px-4">
        {/* Left */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <div className="flex items-center gap-4 order-first">
            <Link href="/" className="flex items-center gap-2">
              <GithubIcon className="w-6 h-6" />
              <span className="text-primary">{SHORT_APP_NAME}</span>
            </Link>
          </div>

          <ul className="hidden md:flex gap-4 lg:gap-6 text-sm *:text-foreground/70 *:hover:text-foreground *:focus:text-foreground">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  target={item.target}
                  className="flex items-center gap-1"
                >
                  {item.label}
                  {item.accessories}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Icon group */}
        <div className="flex gap-1 md:order-last">
          <ThemeToggle variant="ghost" />

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="sr-only">{APP_NAME}</SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={item.target}
                      className="flex items-center gap-2 text-lg text-foreground/70 hover:text-foreground focus:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                      {item.accessories}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
