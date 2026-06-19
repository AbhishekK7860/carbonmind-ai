import { aiRateLimiter } from './rate-limiter';

function scrubPersonalData(input: string): string {
  // Simple regex-based scrubber for SSNs and CC numbers
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
  let scrubbed = input.replace(ssnRegex, '[REDACTED_SSN]');
  scrubbed = scrubbed.replace(ccRegex, '[REDACTED_CC]');
  return scrubbed;
}

function detectPromptInjection(input: string): boolean {
  // Heuristic detection for common injection phrases
  const lowerInput = input.toLowerCase();
  const suspiciousPhrases = [
    'ignore all previous instructions',
    'bypass rules',
    'auto-approve',
    'forget previous prompts',
    'system override',
    'you are now',
  ];
  return suspiciousPhrases.some(phrase => lowerInput.includes(phrase));
}

// Helper for exponential backoff
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function generateAIResponse(prompt: string, context: string, userId: string = 'anonymous', maxTokens: number = 512): Promise<{ response?: string, error?: string, isSecurityEvent?: boolean }> {
  // Rate Limiting Check
  if (!aiRateLimiter.check(userId)) {
    return { error: 'Rate limit exceeded. Please try again in a minute.' };
  }

  // 1. Scrub Personal Data
  const cleanContext = scrubPersonalData(context);
  
  // 2. Defend against prompt injection
  if (detectPromptInjection(cleanContext)) {
    console.error('SECURITY EVENT: Prompt injection detected. Routing to human review.');
    return { error: 'Input flagged for security review.', isSecurityEvent: true };
  }

  const systemPrompt = `You are the CarbonMind AI Coach. Your goal is to provide sustainability insights.
CRITICAL RULES:
1. Explain emissions in simple language.
2. DO NOT fabricate environmental equivalencies. If you reference a numerical equivalency (like tree absorption or laptop usage), you must ONLY use the conversion constants provided in the prompt context. If a specific factor is unavailable, state it is unavailable; DO NOT estimate it.
3. Be encouraging and concise.
4. Adapt all dietary and lifestyle recommendations for an Indian audience. When discussing meat consumption, refer generically to 'meat', 'poultry', or 'mutton'. You must absolutely NOT mention 'beef' or 'pork' under any circumstances.`;

  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Context:\n${cleanContext}\n\nPrompt:\n${prompt}` }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { response: data.choices[0].message.content };
    } catch (e: any) {
      attempt++;
      console.error(`Gemini API Error (Attempt ${attempt}/${MAX_RETRIES}):`, e);
      if (attempt >= MAX_RETRIES) {
        // Graceful fallback response
        return { 
          response: "I'm currently experiencing high demand. Please focus on reducing transport emissions or adopting a plant-based diet for maximum impact today!"
        };
      }
      // Exponential backoff: 1s, 2s, 4s...
      await delay(Math.pow(2, attempt - 1) * 1000);
    }
  }

  return { error: 'Failed to generate response after retries.' };
}
