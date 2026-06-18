import { demoProfile, demoRecommendations, demoChallenges } from "@/lib/demo-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const ImpactPulse = dynamic(() => import('@/components/dashboard/ImpactPulse').then(mod => mod.ImpactPulse), { loading: () => <div className="animate-pulse bg-surface/50 h-[300px] rounded-full w-[300px] mx-auto" /> })
const FutureProjection = dynamic(() => import('@/components/dashboard/FutureProjection').then(mod => mod.FutureProjection), { loading: () => <div className="animate-pulse bg-surface/50 h-[200px] rounded-xl w-full" /> })

export default function DemoDashboardPage() {
  return (
    <div className="flex-1 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-foreground/70">Welcome to your CarbonMind overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-foreground/70">Carbon Identity</p>
          <p className="text-xl font-semibold text-secondary">{demoProfile.carbon_identity}</p>
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
              score={demoProfile.sustainability_score} 
              categories={{ transport: 0.6, energy: 0.8, food: 0.4, shopping: 0.9 }} 
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
            {demoRecommendations.map(rec => (
              <div key={rec.id} className="p-4 rounded-lg bg-surface border border-border">
                <h4 className="font-medium text-primary">{rec.title}</h4>
                <p className="text-xs text-foreground/70 mt-1 mb-3">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-accent">-{rec.estimated_reduction_kg} kg CO₂</span>
                  <Button size="sm">Complete</Button>
                </div>
              </div>
            ))}
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
              currentMonthlyEmissions={320} 
              optimizedReductionPotential={80} 
            />
          </CardContent>
        </Card>

        {/* Challenges Overview */}
        <Card className="col-span-1 glass">
          <CardHeader>
            <CardTitle>Active Challenges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoChallenges.map(chal => (
              <div key={chal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{chal.title}</span>
                  <span className="text-secondary">{chal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-secondary" style={{ width: `${chal.progress}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
