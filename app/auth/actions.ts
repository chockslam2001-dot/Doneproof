'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: {
  email: string
  password: string
  fullName: string
}) {
  // Validate inputs
  if (!formData.email || !formData.password || !formData.fullName) {
    return { error: 'All fields are required' }
  }

  const trimmedEmail = formData.email.trim().toLowerCase()
  const trimmedPassword = formData.password.trim()
  const trimmedName = formData.fullName.trim()

  if (trimmedPassword.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  if (!trimmedEmail.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }

  if (trimmedName.length < 2) {
    return { error: 'Please enter a valid name' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password: trimmedPassword,
    options: {
      data: {
        full_name: trimmedName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    console.error('[v0] Sign up error:', error.code, error.message, error.status)
    
    // Handle rate limit errors (429)
    if (error.status === 429 || error.message.includes('too many requests') || error.message.includes('rate limit') || error.message.includes('over_email_send_rate_limit')) {
      return { 
        error: 'Too many signup attempts with this email. Please wait 5-10 minutes before trying again, or use a different email address.' 
      }
    }
    
    // Provide user-friendly error messages
    if (error.message.includes('already registered')) {
      return { error: 'This email is already registered. Please sign in instead.' }
    }
    if (error.message.includes('invalid email')) {
      return { error: 'Please enter a valid email address.' }
    }
    if (error.message.includes('password')) {
      return { error: 'Password does not meet requirements.' }
    }
    
    return { error: error.message || 'Failed to create account. Please try again.' }
  }

  // Check if email confirmation is required
  if (data.user && !data.user.confirmed_at) {
    return { 
      success: true, 
      message: 'Account created! Check your email to confirm your account.' 
    }
  }

  return { success: true }
}

export async function signIn(formData: {
  email: string
  password: string
}) {
  // Validate inputs
  if (!formData.email || !formData.password) {
    return { error: 'Email and password are required' }
  }

  const trimmedEmail = formData.email.trim().toLowerCase()
  const trimmedPassword = formData.password.trim()

  if (!trimmedEmail.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }

  if (trimmedPassword.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password: trimmedPassword,
  })

  if (error) {
    console.error('[v0] Sign in error:', error.code, error.message, error.status)
    
    // Handle rate limit errors (429)
    if (error.status === 429 || error.message.includes('too many requests') || error.message.includes('rate limit')) {
      return { 
        error: 'Too many login attempts. Please wait a few minutes and try again.' 
      }
    }
    
    // Provide user-friendly error messages
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password. Don\'t have an account? Sign up to create one.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Please confirm your email before logging in. Check your inbox for a confirmation link.' }
    }
    if (error.message.includes('User not found')) {
      return { error: 'No account found with this email. Create a new account to get started.' }
    }
    
    return { error: error.message || 'Failed to sign in. Please try again.' }
  }

  if (!data.session) {
    return { error: 'Failed to create session. Please try again.' }
  }

  // Redirect server-side after successful signin to ensure session is set
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('[v0] Sign out error:', error.message)
    return { error: error.message }
  }
  
  // Redirect server-side after successful signout to ensure session is cleared
  redirect('/auth/login')
}
