import React from "react"
import Link from "next/link"
import { logout } from "@/app/auth/actions"
import { LayoutDashboard, PenSquare, Trophy, MessageSquare, Leaf } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#080f1e]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">CarbonMind</span>
              <span className="text-xs text-emerald-400 font-medium hidden sm:block">AI</span>
            </Link>
            
            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
                { href: '/dashboard/log', label: 'Log Activity', icon: <PenSquare className="w-3.5 h-3.5" /> },
                { href: '/dashboard/challenges', label: 'Challenges', icon: <Trophy className="w-3.5 h-3.5" /> },
                { href: '/dashboard/coach', label: 'AI Coach', icon: <MessageSquare className="w-3.5 h-3.5" /> },
              ].map(link => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-150"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <form action={logout}>
              <button 
                type="submit"
                className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#080f1e]/95 backdrop-blur-xl px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {[
            { href: '/dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
            { href: '/dashboard/log', label: 'Log', icon: <PenSquare className="w-5 h-5" /> },
            { href: '/dashboard/challenges', label: 'Challenges', icon: <Trophy className="w-5 h-5" /> },
            { href: '/dashboard/coach', label: 'Coach', icon: <MessageSquare className="w-5 h-5" /> },
          ].map(link => (
            <Link 
              key={link.href}
              href={link.href} 
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-white/40 hover:text-emerald-400 transition-colors"
            >
              {link.icon}
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl mb-16 md:mb-0">
        {children}
      </main>
    </div>
  )
}
