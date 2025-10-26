import { TriangleAlertIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-[10em] p-4">
      <div className="flex gap-2 items-center mb-2 text-warning">
        <TriangleAlertIcon className="h-5 w-5" />
        <span className="text-2xl font-bold">Not Found!</span>
      </div>

      <p className="text-center text-pretty font-medium mb-6 text-muted-foreground max-w-xl">
        We couldn&apos;t find the page you were looking for. It may have been
        moved, removed, or the repository name might be slightly off. Try
        heading back home and searching again to discover other releases.
      </p>

      <div className="flex justify-center mb-4 gap-2">
        <Button asChild variant="outline">
          <Link href="/">Go to Main Page</Link>
        </Button>
      </div>
    </div>
  )
}
