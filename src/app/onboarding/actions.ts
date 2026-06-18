'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const onboardingSchema = z.object({
  transport: z.string(),
  food: z.string(),
  electricity: z.string(),
  shopping: z.string(),
  waste: z.string(),
})

function determineCarbonIdentity(data: z.infer<typeof onboardingSchema>): string {
  let score = 0;
  
  // Simple heuristic scoring
  if (data.transport.includes('EV') || data.transport.includes('Bicycle')) score += 2;
  else if (data.transport.includes('Public')) score += 1;
  
  if (data.food.includes('Vegan') || data.food.includes('Vegetarian')) score += 2;
  
  if (data.electricity.includes('Renewable')) score += 2;
  else if (data.electricity.includes('Advanced')) score += 1;
  
  if (data.shopping.includes('Minimalist') || data.shopping.includes('Mostly second-hand')) score += 2;
  
  if (data.waste.includes('Zero Waste') || data.waste.includes('Compost')) score += 2;
  
  if (score >= 8) return 'Earth Guardian'
  if (score >= 6) return 'Climate Champion'
  if (score >= 4) return 'Conscious Consumer'
  if (score >= 2) return 'Green Starter'
  return 'Eco Beginner'
}

export async function saveOnboardingData(formData: Record<string, string>) {
  const parsed = onboardingSchema.safeParse(formData)
  
  if (!parsed.success) {
    return { success: false, error: 'Invalid data format.' }
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Unauthorized.' }
  }

  const identity = determineCarbonIdentity(parsed.data)

  // Basic estimation of total_emissions_kg based on survey to initialize
  const initialEmissions = 5000 // Arbitrary placeholder for initial setup

  const { error: dbError } = await supabase
    .from('carbon_profiles')
    .insert({
      user_id: user.id,
      carbon_identity: identity,
      total_emissions_kg: initialEmissions,
      sustainability_score: 50 // initial
    })

  if (dbError) {
    return { success: false, error: dbError.message }
  }

  return { success: true, identity }
}
