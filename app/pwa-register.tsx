'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const registerSW = async () => {
      try {
        // Check if user is authenticated by checking for auth cookie
        const hasAuthCookie = document.cookie.includes('sb-')
        
        if (!hasAuthCookie) {
          console.log('[v0] Skipping Service Worker registration - user not authenticated')
          return
        }

        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })
        console.log('[v0] Service Worker registered successfully:', registration.scope)
      } catch (error) {
        console.warn('[v0] Service Worker registration warning (optional feature):', 
          error instanceof Error ? error.message : String(error))
        // Service Worker registration is optional - app works without it
      }
    }

    // Register after page load to ensure all resources are ready
    if (document.readyState === 'complete') {
      // Delay registration to avoid conflicts during initial page load
      setTimeout(registerSW, 1000)
    } else {
      const handleLoad = () => {
        setTimeout(registerSW, 1000)
      }
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  return null
}
