'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function joinChallenge(formData: FormData): Promise<void> {
  const challengeId = formData.get('challengeId') as string
  if (!challengeId) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Check if already joined
  const { data: existing } = await supabase
    .from('user_challenges')
    .select('id')
    .eq('user_id', user.id)
    .eq('challenge_id', challengeId)
    .maybeSingle()

  if (existing) {
    revalidatePath('/dashboard/challenges')
    return
  }

  // Determine end date based on duration_days from eco_challenges
  const { data: challenge } = await supabase
    .from('eco_challenges')
    .select('duration_days')
    .eq('id', challengeId)
    .single()

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + (challenge?.duration_days || 7))

  const { error } = await supabase.from('user_challenges').insert({
    user_id: user.id,
    challenge_id: challengeId,
    status: 'active',
    started_at: startDate.toISOString(),
    completed_at: endDate.toISOString()
  })

  if (error) {
    console.error('Failed to join challenge:', error)
  }

  revalidatePath('/dashboard/challenges')
}

