import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = ['/dashboard', '/admin', '/checkout']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const session = request.cookies.get('session')?.value
    const payload = await decrypt(session)
    
    if (!payload?.userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based protection
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
