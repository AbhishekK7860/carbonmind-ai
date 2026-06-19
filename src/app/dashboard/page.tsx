import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"
import { generateRecommendations } from "@/app/actions/ai"
import { Zap, Target, TrendingDown, Award, BarChart3, Leaf, ArrowRight, Plus } from "lucide-react"

const ImpactPulse = dynamic(() => import('@/components/dashboard/ImpactPulse').then(mod => mod.ImpactPulse), { 
  loading: () => <div className="animate-pulse bg-white/5 h-[300px] rounded-full w-[300px] mx-auto" />
})
const FutureProjection = dynamic(() => import('@/components/dashboard/FutureProjection').then(mod => mod.FutureProjection), { 
  loading: () => <div className="animate-pulse bg-white/5 h-[200px] rounded-xl w-full" />
})

export default async function DashboardPage() {
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

  // Fetch Activity Logs with emissions for category breakdown
  const { data: logsData } = await supabase
    .from('activity_logs')
    .select('category, carbon_calculations(calculated_emissions_kg)')
    .eq('user_id', user.id)

  let transportTotal = 0
  let energyTotal = 0
  let foodTotal = 0
  let shoppingTotal = 0
  let wasteTotal = 0
  let totalLogs = 0

  if (logsData) {
    totalLogs = logsData.length
    logsData.forEach(log => {
      const calc = Array.isArray(log.carbon_calculations) ? log.carbon_calculations[0] : log.carbon_calculations
      const em = Number(calc?.calculated_emissions_kg || 0)
      if (log.category === 'Transport') transportTotal += em
      if (log.category === 'Electricity') energyTotal += em
      if (log.category === 'Food') foodTotal += em
      if (log.category === 'Shopping') shoppingTotal += em
      if (log.category === 'Waste') wasteTotal += em
    })
  }

  const totalCatEmissions = transportTotal + energyTotal + foodTotal + shoppingTotal + wasteTotal || 1
  const dynamicCategories = {
    transport: transportTotal / totalCatEmissions,
    energy: energyTotal / totalCatEmissions,
    food: foodTotal / totalCatEmissions,
    shopping: shoppingTotal / totalCatEmissions,
  }

  // Fetch Achievements
  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('unlocked_at, achievements(id, title, description, badge_icon_url)')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false })

  // Deterministic projection data
  const actualLoggedTotal = transportTotal + energyTotal + foodTotal + shoppingTotal + wasteTotal
  const currentMonthlyEmissions = actualLoggedTotal > 0 ? actualLoggedTotal : Number(profile.total_emissions_kg) / 12

  let reductionPotential = 0
  if (recommendations && recommendations.length > 0) {
    recommendations.forEach(rec => {
      reductionPotential += Number(rec.estimated_reduction_kg || 0)
    })
  }
  const optimizedReductionPotential = Math.max(currentMonthlyEmissions * 0.1, reductionPotential)

  const score = profile.sustainability_score || 50
  const totalEmissions = Number(profile.total_emissions_kg || 0)

  // Determine score color
  const scoreColor = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex-1 space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400/70">Carbon Identity</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {profile.carbon_identity}
          </h1>
          <p className="text-foreground/50 mt-1">Your sustainability overview · {totalLogs} activities tracked</p>
        </div>
        <Link 
          href="/dashboard/log"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          <Plus className="w-4 h-4" />
          Log Activity
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Sustainability Score', 
            value: score, 
            suffix: '/100',
            icon: <Zap className="w-4 h-4" />,
            color: scoreColor,
            desc: score >= 70 ? 'Excellent' : score >= 40 ? 'Good progress' : 'Room to improve'
          },
          { 
            label: 'Total CO₂', 
            value: totalEmissions.toFixed(1), 
            suffix: 'kg',
            icon: <BarChart3 className="w-4 h-4" />,
            color: '#14B8A6',
            desc: `${totalLogs} activities logged`
          },
          { 
            label: 'Transport', 
            value: transportTotal.toFixed(1), 
            suffix: 'kg',
            icon: <TrendingDown className="w-4 h-4" />,
            color: '#10B981',
            desc: 'Carbon from travel'
          },
          { 
            label: 'Achievements', 
            value: userAchievements?.length || 0, 
            suffix: '',
            icon: <Award className="w-4 h-4" />,
            color: '#8B5CF6',
            desc: 'Milestones unlocked'
          },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 card-hover gradient-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-foreground/50 font-medium uppercase tracking-wide">{stat.label}</span>
              <span style={{ color: stat.color }} className="p-1.5 rounded-lg bg-white/5">
                {stat.icon}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white stat-value">{stat.value}</span>
              <span className="text-sm text-foreground/50">{stat.suffix}</span>
            </div>
            <p className="text-xs text-foreground/40 mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Impact Pulse - spans 2 cols */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 gradient-border card-hover glow-green">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Impact Pulse</h2>
              </div>
              <p className="text-white font-bold text-xl mt-1">Your Sustainability Ecosystem</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-foreground/40">Pulse Score</div>
              <div className="text-3xl font-bold" style={{ color: scoreColor }}>{score}</div>
            </div>
          </div>
          <ImpactPulse 
            score={score} 
            categories={dynamicCategories} 
          />
        </div>

        {/* AI Action Center */}
        <div className="glass rounded-2xl p-6 gradient-border flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">AI Action Center</span>
          </div>
          <h2 className="text-white font-bold text-lg mb-4">Today's Insights</h2>
          
          <div className="flex-1 space-y-3">
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-white text-sm leading-tight">{rec.title}</h4>
                    <span className="shrink-0 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      -{rec.estimated_reduction_kg}kg
                    </span>
                  </div>
                  <p className="text-xs text-foreground/50 leading-relaxed">{rec.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: rec.difficulty_score || 5 }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < (rec.difficulty_score || 5) ? 'bg-amber-400' : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-foreground/30">Difficulty</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-sm text-foreground/50 mb-4">No recommendations yet.<br/>Generate personalized AI insights.</p>
                <form action={generateRecommendations}>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <Zap className="w-4 h-4" />
                    Generate AI Insights
                  </button>
                </form>
              </div>
            )}
          </div>
          
          {recommendations && recommendations.length > 0 && (
            <form action={generateRecommendations} className="mt-4">
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 text-xs text-foreground/40 hover:text-purple-400 transition-colors py-2"
              >
                <Zap className="w-3 h-3" />
                Regenerate insights
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Future Projection */}
      <div className="glass rounded-2xl p-6 gradient-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">Future Projection Engine</span>
            </div>
            <p className="text-white font-bold text-xl mt-1">Emissions Trajectory</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-foreground/40">Current Monthly</div>
            <div className="text-2xl font-bold text-teal-400">{currentMonthlyEmissions.toFixed(1)} <span className="text-sm font-normal text-foreground/40">kg CO₂</span></div>
          </div>
        </div>
        <FutureProjection 
          currentMonthlyEmissions={currentMonthlyEmissions} 
          optimizedReductionPotential={optimizedReductionPotential} 
        />
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-6 gradient-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Achievements</span>
            </div>
            <p className="text-white font-bold text-xl mt-1">Your Sustainability Milestones</p>
          </div>
          <span className="text-sm text-foreground/40">{userAchievements?.length || 0} unlocked</span>
        </div>

        {userAchievements && userAchievements.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userAchievements.map((ua, i) => {
              const achievement = Array.isArray(ua.achievements) ? ua.achievements[0] : ua.achievements
              if (!achievement) return null
              return (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-amber-400/20 flex items-start gap-4 hover:border-amber-400/40 transition-colors">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-amber-400/10 shrink-0">
                    {achievement.badge_icon_url?.includes('warrior') ? '⚔️' :
                     achievement.badge_icon_url?.includes('champion') ? '🏆' :
                     achievement.badge_icon_url?.includes('guardian') ? '🌍' : '🌱'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-sm">{achievement.title}</h4>
                    <p className="text-xs text-foreground/50 mt-0.5 leading-relaxed">{achievement.description}</p>
                    <p className="text-xs text-amber-400/70 mt-2 font-medium">
                      {new Date(ua.unlocked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-amber-400/50" />
            </div>
            <p className="text-foreground/40 text-sm mb-1">No achievements yet</p>
            <p className="text-foreground/30 text-xs">Log your first activity to earn the Eco Beginner badge!</p>
            <Link href="/dashboard/log" className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Start logging <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
