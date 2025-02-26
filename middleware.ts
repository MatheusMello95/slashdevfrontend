import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/'
  
  // Get the token from cookies or localStorage (for client components)
  const token = request.cookies.get('token')?.value || ''
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login/register page, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  if (!isPublicPath && !token && path !== '/dashboard') {
    // If path requires auth but no token exists, redirect to login
    // We handle dashboard auth check in the component for a better UX
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

// Configure the paths that this middleware will run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ],
}