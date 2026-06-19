'use server'

import { createClient } from '@/lib/supabase/server'
import { CarbonEngine } from '@/lib/carbon-engine'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const logActivitySchema = z.object({
  category: z.enum(['Transport', 'Food', 'Electricity', 'Shopping', 'Waste']),
  activity_name: z.string().min(1),
  amount: z.number().positive(),
  unit: z.string().min(1),
})

import { redirect } from 'next/navigation'

export async function logActivity(formData: FormData) {
  const parsed = logActivitySchema.safeParse({
    category: formData.get('category'),
    activity_name: formData.get('activity_name'),
    amount: Number(formData.get('amount')),
    unit: formData.get('unit'),
  })

  if (!parsed.success) {
    redirect('/dashboard/log?error=Invalid input parameters')
  }

  const { category, activity_name, amount, unit } = parsed.data

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login?error=Unauthorized')
  }

  // 1. Calculate emissions using Carbon Engine
  let calculation;
  switch (category) {
    case 'Transport': calculation = await CarbonEngine.calculateTransport(activity_name, amount); break;
    case 'Food': calculation = await CarbonEngine.calculateFood(activity_name, amount); break;
    case 'Electricity': calculation = await CarbonEngine.calculateElectricity(activity_name, amount); break;
    case 'Shopping': calculation = await CarbonEngine.calculateShopping(activity_name, amount); break;
    case 'Waste': calculation = await CarbonEngine.calculateWaste(activity_name, amount); break;
    default:
      redirect('/dashboard/log?error=Invalid category')
  }

  // 2. Insert Activity Log
  const { data: activityLog, error: logError } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      category,
      activity_name,
      amount,
      unit
    })
    .select('id')
    .single()

  if (logError || !activityLog) {
    redirect('/dashboard/log?error=Failed to save activity log.')
  }

  // 3. Insert Carbon Calculation record
  if (calculation.emissions_kg !== 0) {
    const { error: calcError } = await supabase
      .from('carbon_calculations')
      .insert({
        activity_log_id: activityLog.id,
        emission_factor_id: calculation.factor_id,
        calculated_emissions_kg: calculation.emissions_kg
      })

    if (calcError) {
      console.error('Failed to log calculation:', calcError);
      // Rollback activity log
      await supabase.from('activity_logs').delete().eq('id', activityLog.id);
      redirect('/dashboard/log?error=Failed to save carbon calculation.');
    } else {
      // 4. Update carbon_profiles total_emissions_kg and sustainability_score
      const { data: profile } = await supabase
        .from('carbon_profiles')
        .select('total_emissions_kg')
        .eq('user_id', user.id)
        .single()
      
      if (profile) {
        const newTotal = Number(profile.total_emissions_kg) + calculation.emissions_kg;
        // Sustainability score: inverse of emissions, capped 1-100
        // Baseline: 10000kg/yr = score 1, 0kg = score 100
        const newScore = Math.max(1, Math.min(100, Math.round(100 - (newTotal / 10000) * 100)));
        
        await supabase
          .from('carbon_profiles')
          .update({ 
            total_emissions_kg: newTotal,
            sustainability_score: newScore
          })
          .eq('user_id', user.id)
      }
      
      // 5. Achievements Engine
      const { data: beginnerAchievement } = await supabase
        .from('achievements')
        .select('id')
        .eq('title', 'Eco Beginner')
        .single();
        
      if (beginnerAchievement) {
        const { data: existingAchieve } = await supabase
          .from('user_achievements')
          .select('id')
          .eq('user_id', user.id)
          .eq('achievement_id', beginnerAchievement.id)
          .maybeSingle();
          
        if (!existingAchieve) {
          await supabase
            .from('user_achievements')
            .insert({ user_id: user.id, achievement_id: beginnerAchievement.id });
        }
      }
    }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?success=Activity logged successfully')
}
