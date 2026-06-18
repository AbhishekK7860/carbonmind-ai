import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-foreground/70 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved. 
        Let's get you back on track to reducing your footprint.
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}
