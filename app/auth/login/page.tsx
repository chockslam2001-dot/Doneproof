'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signUp, signIn } from '../actions'
import { Wind } from 'lucide-react'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const router = useRouter()

  // Rate limit cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Prevent double submissions
    if (loading || cooldown > 0) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSignUp) {
        const result = await signUp({ email, password, fullName })
        if (result.error) {
          setError(result.error)
          setLoading(false)
          // Set cooldown if rate limited
          if (result.error.includes('Too many signup attempts')) {
            setCooldown(60) // 60 second cooldown
          }
        } else {
          setEmail('')
          setPassword('')
          setFullName('')
          setSuccess(result.message || 'Account created! Check your email to confirm your account.')
          // Switch to sign in after successful signup
          setTimeout(() => {
            setIsSignUp(false)
            setLoading(false)
          }, 2000)
        }
      } else {
        const result = await signIn({ email, password })
        if (result?.error) {
          setError(result.error)
          setLoading(false)
          // Set cooldown if rate limited
          if (result.error.includes('Too many login attempts')) {
            setCooldown(30) // 30 second cooldown
          }
        } else if (result?.success) {
          setSuccess('Signing in...')
          setError('')
          // Server action redirects us, no need for client-side redirect
          // Just wait for page navigation
        }
      }
    } catch (err) {
      console.error('[v0] Auth error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center">
          <Wind size={24} className="text-sky-600" />
        </div>
        <h1 className="text-2xl font-display text-stone-900">DoneProof</h1>
        <p className="text-sm text-stone-500">Routine & Anxiety Management</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 rounded-2xl text-sm bg-sky-50 text-sky-700 border border-sky-200 animate-softFade">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl text-sm bg-rose-50 text-rose-700 border border-rose-200 animate-softFade">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label htmlFor="auth-fullname" className="block text-sm font-medium text-stone-700 mb-1.5">
                Full Name
              </label>
              <input
                id="auth-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                minLength={2}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-stone-700 mb-1.5">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-stone-700 mb-1.5">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full py-3.5 rounded-2xl bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 active:scale-95 disabled:opacity-60 transition-all"
          >
            {loading ? 'Loading...' : cooldown > 0 ? `Wait ${cooldown}s` : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-sm text-stone-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="font-semibold text-sky-600 hover:text-sky-700 active:scale-95 transition-all"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Getting Started Info */}
        <div className="mt-8 p-4 rounded-2xl bg-sky-50 border border-sky-200">
          <p className="text-xs text-sky-700 leading-relaxed">
            <span className="font-semibold">First time here?</span>
            <br />
            Create an account to get started with DoneProof. Use any email and a secure password of at least 6 characters.
          </p>
          {isSignUp && (
            <p className="text-xs text-sky-600 mt-2 leading-relaxed">
              After signing up, you&apos;ll start with a clean Morning Routine to customize and build from.
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-stone-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
