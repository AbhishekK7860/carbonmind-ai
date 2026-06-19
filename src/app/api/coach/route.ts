import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateAIResponse } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user context for personalised coaching
    const { data: profile } = await supabase
      .from('carbon_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const { data: recentLogs } = await supabase
      .from('activity_logs')
      .select('category, activity_name, amount, unit, logged_at')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(10)

    const context = `
User Profile:
- Carbon Identity: ${profile?.carbon_identity || 'Unknown'}
- Total Emissions: ${profile?.total_emissions_kg || 0} kg CO₂
- Sustainability Score: ${profile?.sustainability_score || 50}/100

Recent Activities (last 10):
${recentLogs?.map(l => `- ${l.category}: ${l.activity_name}, ${l.amount} ${l.unit}`).join('\n') || 'No activities logged yet.'}
`.trim()

    // Get the last user message as the prompt
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()
    if (!lastUserMessage) {
      return NextResponse.json({ error: 'No user message' }, { status: 400 })
    }

    // Build conversation history for context
    const conversationHistory = messages
      .slice(-8) // last 8 messages for context window efficiency
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n')

    const prompt = `${conversationHistory}\n\nUser: ${lastUserMessage.content}`
    
    const result = await generateAIResponse(prompt, context, user.id, 512)

    if (result.error) {
      return NextResponse.json({ reply: result.response || "I'm experiencing a hiccup. Please try again! 🌿" })
    }

    return NextResponse.json({ reply: result.response })
  } catch (e) {
    console.error('Coach API error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
