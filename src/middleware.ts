import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = ['/dashboard', '/admin', '/checkout']

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // 1. Check for referral code in URL
  const refCode = searchParams.get('ref');
  
  // Create response object early so we can attach cookies if needed
  let response = NextResponse.next();

  // 2. Auth Protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const session = request.cookies.get('session')?.value
    const payload = await decrypt(session)
    
    if (!payload?.userId) {
      response = NextResponse.redirect(new URL('/login', request.url))
    } else if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      response = NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 3. Set Referral Cookie if present
  if (refCode) {
    // Set cookie for 30 days
    response.cookies.set('ref_code', refCode, { 
      path: '/', 
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true, // we will read it server-side in registerAction
      sameSite: 'lax'
    });
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
