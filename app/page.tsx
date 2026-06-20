'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { signOut } from './auth/actions'
import { loadUserData } from './auth/data-actions'
import { LogOut } from 'lucide-react'
import { getInitialDataForUser } from '@/lib/user-init'

const DoneProofApp = dynamic(() => import('@/components/DoneProofApp'), {
  ssr: false,
})

export default function Page() {
  const router = useRouter()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  const handleSignOut = async () => {
    await signOut()
    // Server action redirects to /auth/login, no need for client-side redirect
  }

  useEffect(() => {
    let isMounted = true

    async function initializeUserData() {
      try {
        const supabase = createClient()
        
        // Get current user - middleware already verified they're authenticated
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (!isMounted) return

        // If we can't get user, something is wrong - show empty app but don't retry
        if (authError || !user || !user.email) {
          console.warn('[v0] Could not verify user session:', authError?.message)
          setInitialData(getInitialDataForUser())
          setLoading(false)
          return
        }

        console.log('[v0] User authenticated:', user.email)

        try {
          // Load user data from database
          const dbData = await loadUserData(user.id, user.email)

          if (!isMounted) return

          // Set data from database or use clean slate if no data exists
          setInitialData(dbData || getInitialDataForUser())
        } catch (dataError) {
          console.warn('[v0] Error loading user data:', dataError instanceof Error ? dataError.message : 'Unknown error')
          // Fallback to empty data if loading fails
          if (isMounted) {
            setInitialData(getInitialDataForUser())
          }
        }
        
        if (isMounted) {
          setLoading(false)
        }
      } catch (error) {
        if (!isMounted) return
        console.error('[v0] Error initializing app:', error instanceof Error ? error.message : 'Unknown error')
        setInitialData(getInitialDataForUser())
        setInitError(error instanceof Error ? error.message : 'Failed to initialize app')
        setLoading(false)
      }
    }

    initializeUserData()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-stone-200 border-t-sky-400 animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading your app...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Logout Button */}
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors active:scale-95"
        title="Sign out"
      >
        <LogOut size={18} />
      </button>
      <DoneProofApp initialData={initialData} />
    </div>
  )
}
