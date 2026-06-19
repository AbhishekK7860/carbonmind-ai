import { createClient } from "@/lib/supabase/server"
import { joinChallenge } from "@/app/actions/challenges"
import { Trophy, Clock, Zap, CheckCircle2, Car, Leaf, Bolt, Recycle } from "lucide-react"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Transport: <Car className="w-5 h-5" />,
  Food: <Leaf className="w-5 h-5" />,
  Electricity: <Bolt className="w-5 h-5" />,
  Waste: <Recycle className="w-5 h-5" />,
}

const CATEGORY_COLORS: Record<string, string> = {
  Transport: '#10B981',
  Food: '#84CC16',
  Electricity: '#F59E0B',
  Waste: '#14B8A6',
}

export default async function ChallengesPage() {
  const supabase = await createClient()
  
  const { data: challenges } = await supabase
    .from('eco_challenges')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()
  const { data: userChallenges } = await supabase
    .from('user_challenges')
    .select('challenge_id, status, started_at, completed_at')
    .eq('user_id', user?.id || '')
  
  const joinedMap = new Map(userChallenges?.map(uc => [uc.challenge_id, uc]) || [])

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Eco Challenges</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Weekly Missions</h1>
        <p className="text-white/40 mt-1">Join challenges to earn XP and boost your sustainability score.</p>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-4 p-4 glass rounded-2xl gradient-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{userChallenges?.length || 0}</div>
            <div className="text-xs text-white/40">Challenges joined</div>
          </div>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {userChallenges?.reduce((acc, uc) => {
                const ch = challenges?.find(c => c.id === uc.challenge_id)
                return acc + (ch?.xp_reward || 0)
              }, 0) || 0}
            </div>
            <div className="text-xs text-white/40">Total XP earned</div>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {challenges?.map(chal => {
          const joined = joinedMap.get(chal.id)
          const isJoined = !!joined
          const categoryColor = CATEGORY_COLORS[chal.category] || '#10B981'
          const categoryIcon = CATEGORY_ICONS[chal.category] || <Trophy className="w-5 h-5" />
          
          let endDate: Date | null = null
          let daysRemaining: number | null = null
          if (joined?.completed_at) {
            endDate = new Date(joined.completed_at)
            daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          }

          return (
            <div 
              key={chal.id} 
              className={`glass rounded-2xl p-6 gradient-border card-hover transition-all ${isJoined ? 'border-emerald-500/20' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
                  >
                    {categoryIcon}
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide" style={{ color: categoryColor }}>
                      {chal.category}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="text-xs text-white/40">{chal.duration_days} day challenge</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                  <Zap className="w-3 h-3" />
                  +{chal.xp_reward} XP
                </div>
              </div>

              <h3 className="font-bold text-white text-lg mb-2">{chal.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-5">{chal.description}</p>

              {isJoined ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Challenge Joined!</span>
                  </div>
                  {daysRemaining !== null && daysRemaining > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">Days remaining</span>
                        <span className="text-sm font-bold text-emerald-400">{daysRemaining}d</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${Math.max(5, 100 - (daysRemaining / chal.duration_days) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form action={joinChallenge}>
                  <input type="hidden" name="challengeId" value={chal.id} />
                  <button 
                    type="submit"
                    className="w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] hover:bg-opacity-80"
                    style={{ 
                      backgroundColor: `${categoryColor}20`, 
                      color: categoryColor,
                      border: `1px solid ${categoryColor}30`
                    }}
                  >
                    Join Challenge →
                  </button>
                </form>
              )}
            </div>
          )
        })}
        
        {(!challenges || challenges.length === 0) && (
          <div className="md:col-span-2 flex flex-col items-center justify-center py-16 glass rounded-2xl gradient-border">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-amber-400/50" />
            </div>
            <p className="text-white/40">No challenges available right now.</p>
            <p className="text-white/25 text-sm mt-1">Check back soon for new weekly missions!</p>
          </div>
        )}
      </div>
    </div>
  )
}
