import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-primary tracking-tight">CarbonMind AI</div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-foreground/80">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background pt-24 pb-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
              Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Carbon Footprint</span> with AI
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
              Understand, track, and reduce your emissions through personalized recommendations, habit formation, and actionable AI insights.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg shadow-lg shadow-primary/25">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/demo/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg bg-surface hover:text-foreground">
                  Try Demo Mode
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-surface/50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Intelligent Sustainability</h2>
              <p className="text-foreground/70 max-w-xl mx-auto">Everything you need to make a measurable impact on the planet, powered by deterministic AI analysis.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: "AI Action Center", desc: "Top 3 personalized daily actions tailored to your unique lifestyle to maximize reduction." },
                { title: "Impact Pulse", desc: "A dynamic ecosystem visualization representing your sustainability score in real-time." },
                { title: "Future Projection Engine", desc: "See your current trajectory vs. an AI-optimized path to measure long-term impact." }
              ].map(f => (
                <div key={f.title} className="p-8 rounded-2xl bg-background border border-border glass hover:border-primary/50 transition-colors">
                  <h3 className="text-xl font-semibold mb-3 text-primary">{f.title}</h3>
                  <p className="text-foreground/70">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials (Placeholder) */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
            <p className="text-foreground/50 italic mb-8">* Illustrative placeholder content</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-surface border border-border italic shadow-sm">
                "CarbonMind AI helped me cut my footprint by 30% without feeling like a chore. The AI coach is incredible."
                <div className="font-semibold text-primary mt-4 not-italic">- Sarah J., Urban Commuter</div>
              </div>
              <div className="p-6 rounded-xl bg-surface border border-border italic shadow-sm">
                "I love the Future Projection Engine. Seeing exactly how many trees I'm saving over a year keeps me motivated."
                <div className="font-semibold text-primary mt-4 not-italic">- Mike T., Eco Champion</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface py-12">
        <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
          <div className="font-semibold text-lg text-primary mb-2">CarbonMind AI</div>
          <p className="mb-6">Built for a sustainable future.</p>
          <div className="flex justify-center gap-6">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
          <p className="mt-8 text-xs opacity-50">© 2026 CarbonMind AI. Data sourced from US EPA and UK DEFRA.</p>
        </div>
      </footer>
    </div>
  )
}
