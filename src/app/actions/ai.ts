'use server'

import { createClient } from '@/lib/supabase/server'
import { generateAIResponse } from '@/lib/gemini'
import { revalidatePath } from 'next/cache'

export async function generateRecommendations(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  // Fetch context for the AI
  const { data: profile } = await supabase.from('carbon_profiles').select('*').eq('user_id', user.id).single()
  const { data: logs } = await supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
  const { data: calcs } = await supabase.from('carbon_calculations').select('*').in('activity_log_id', logs?.map(l => l.id) || [])

  let context = `User Profile: Identity=${profile?.carbon_identity}, Emissions=${profile?.total_emissions_kg}kg. Recent logs: ${JSON.stringify(logs)}. Calcs: ${JSON.stringify(calcs)}`
  // Context sanitization for Indian localization
  context = context.replace(/Beef \(Average\)/gi, 'Meat (Average)').replace(/beef/gi, 'meat');
  const prompt = `Based on the user's profile and recent activity, generate 3 specific, actionable recommendations to reduce carbon emissions. 
  Respond ONLY with a valid JSON array of objects. Do not include markdown formatting or backticks.
  Format each object exactly as: {"title": "string", "description": "string", "estimated_reduction_kg": number, "difficulty_score": number}`

  const aiResult = await generateAIResponse(prompt, context, user.id, 1024)

  if (aiResult.error || !aiResult.response) return

  try {
    const rawResponse = aiResult.response.replace(/```json/g, '').replace(/```/g, '').trim()
    const recommendations = JSON.parse(rawResponse)
    
    // Clear existing incomplete recommendations to avoid buildup
    await supabase.from('recommendations').delete().eq('user_id', user.id).eq('is_completed', false)

    // Insert into database
    for (const rec of recommendations) {
      await supabase.from('recommendations').insert({
        user_id: user.id,
        title: rec.title,
        description: rec.description,
        estimated_reduction_kg: rec.estimated_reduction_kg,
        difficulty_score: rec.difficulty_score
      })
    }

    revalidatePath('/dashboard')
  } catch (e) {
    console.error('Failed to parse AI response:', e, aiResult.response)
  }
}
