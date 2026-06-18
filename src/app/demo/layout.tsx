import React from "react"
import Link from "next/link"

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium z-50 relative">
        <strong>DEMO MODE:</strong> You are viewing a populated demo account. No registration required. Data is isolated from production.
        <Link href="/auth/login" className="ml-4 underline hover:text-amber-900">
          Exit Demo
        </Link>
      </div>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
