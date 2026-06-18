'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { authRateLimiter } from '@/lib/rate-limiter'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!authRateLimiter.check(email)) {
    redirect('/auth/login?error=Too many requests. Please try again later.')
  }

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    redirect('/auth/login?error=Invalid email or password format.')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!authRateLimiter.check(email)) {
    redirect('/auth/login?error=Too many requests. Please try again later.')
  }

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    redirect('/auth/login?error=Invalid email or password format. Password must be at least 6 characters.')
  }

  const supabase = await createClient()

  const { error, data } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }
  
  revalidatePath('/', 'layout')
  // Go to onboarding after successful signup
  redirect('/onboarding')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
