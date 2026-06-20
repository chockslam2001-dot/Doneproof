import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for service worker, manifest, and other static resources
  if (
    pathname === '/sw.js' ||
    pathname === '/manifest.json' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/.well-known/')
  ) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If user is not authenticated
    if (!user) {
      // Allow access to auth routes only
      if (pathname.startsWith('/auth')) {
        return supabaseResponse
      }
      // Redirect all other routes to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // If user is authenticated and trying to access login page, redirect to home
    if (user && pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.error('[v0] Middleware auth error:', error)
    // On error, allow auth routes, redirect others
    if (pathname.startsWith('/auth')) {
      return supabaseResponse
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

// Add a small delay in middleware to allow Supabase session to be properly set
const middlewareDelay = async () => {
  return new Promise(resolve => setTimeout(resolve, 50))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
