import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('carbon_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="flex-1 space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Your Profile</h1>
        <p className="text-foreground/70">Manage your CarbonMind identity.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your registered details and carbon status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="text-sm text-foreground/50">Email</span>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-sm text-foreground/50">Carbon Identity</span>
            <p className="font-medium text-secondary">{profile?.carbon_identity || 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-foreground/50">Total Lifetime Emissions</span>
            <p className="font-medium text-accent">{profile?.total_emissions_kg} kg CO₂</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
