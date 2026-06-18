import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function ChallengesPage() {
  const supabase = await createClient()
  
  // Fetch active challenges
  const { data: challenges } = await supabase
    .from('eco_challenges')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Eco Challenges</h1>
        <p className="text-foreground/70">Join weekly missions to boost your sustainability score.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {challenges?.map(chal => (
          <Card key={chal.id} className="glass">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{chal.title}</CardTitle>
                  <CardDescription>{chal.category} • {chal.duration_days} Days</CardDescription>
                </div>
                <div className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                  +{chal.xp_reward} XP
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-6">{chal.description}</p>
              <form>
                {/* In a real implementation this would call a server action to join */}
                <Button className="w-full">Join Challenge</Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {(!challenges || challenges.length === 0) && (
          <p className="text-foreground/50 italic">No active challenges available right now.</p>
        )}
      </div>
    </div>
  )
}
