import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const ImpactPulse = dynamic(() => import('@/components/dashboard/ImpactPulse').then(mod => mod.ImpactPulse), { loading: () => <div className="animate-pulse bg-surface/50 h-[300px] rounded-full w-[300px] mx-auto" /> })
const FutureProjection = dynamic(() => import('@/components/dashboard/FutureProjection').then(mod => mod.FutureProjection), { loading: () => <div className="animate-pulse bg-surface/50 h-[200px] rounded-xl w-full" /> })

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  // Fetch Carbon Profile
  const { data: profile } = await supabase
    .from('carbon_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Fetch Recommendations
  const { data: recommendations } = await supabase
    .from('recommendations')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_completed', false)
    .limit(3)

  // Determine current emissions / categories based on logs (simplified for MVP)
  const currentMonthlyEmissions = Math.max(100, Number(profile.total_emissions_kg) / 12) // Just a rough estimate for visualization
  const optimizedReductionPotential = currentMonthlyEmissions * 0.3 // Assume 30% reduction potential

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-foreground/70">Welcome to your CarbonMind overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-foreground/70">Carbon Identity</p>
          <p className="text-xl font-semibold text-secondary">{profile.carbon_identity}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Feature 2: Impact Pulse */}
        <Card className="col-span-1 lg:col-span-2 glass">
          <CardHeader>
            <CardTitle>Impact Pulse</CardTitle>
            <CardDescription>Your dynamic sustainability ecosystem.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImpactPulse 
              score={profile.sustainability_score || 50} 
              // We'd dynamically calculate these based on user logs in a full implementation
              categories={{ transport: 0.5, energy: 0.5, food: 0.5, shopping: 0.5 }} 
            />
          </CardContent>
        </Card>

        {/* Feature 1: AI Action Center */}
        <Card className="col-span-1 glass flex flex-col">
          <CardHeader>
            <CardTitle>AI Action Center</CardTitle>
            <CardDescription>Top recommendations for today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-lg bg-surface border border-border">
                  <h4 className="font-medium text-primary">{rec.title}</h4>
                  <p className="text-xs text-foreground/70 mt-1 mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent">-{rec.estimated_reduction_kg} kg CO₂</span>
                    <Button size="sm">Complete</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg border border-dashed border-border text-center text-foreground/50">
                No active recommendations. Check back later!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature 3: Future Projection Engine */}
        <Card className="col-span-1 lg:col-span-2 glass">
          <CardHeader>
            <CardTitle>Future Projection Engine</CardTitle>
            <CardDescription>Current trajectory vs AI-Optimized path.</CardDescription>
          </CardHeader>
          <CardContent>
            <FutureProjection 
              currentMonthlyEmissions={currentMonthlyEmissions} 
              optimizedReductionPotential={optimizedReductionPotential} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
