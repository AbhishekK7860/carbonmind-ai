import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/auth/actions"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold text-primary">
              CarbonMind AI
            </Link>
            <nav className="hidden md:flex gap-4 text-sm font-medium text-foreground/80">
              <Link href="/dashboard" className="hover:text-primary transition-colors">Overview</Link>
              <Link href="/dashboard/log" className="hover:text-primary transition-colors">Log Activity</Link>
              <Link href="/dashboard/challenges" className="hover:text-primary transition-colors">Challenges</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <form action={logout}>
              <Button variant="ghost" size="sm">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
