import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE_NAME = 'access_token'

const PROTECTED_ROUTES = [
  '/dashboard',
  '/predios',
  '/lotes',
  '/cultivos',
  '/sensores',
  '/riego',
  '/predicciones',
  '/reportes',
  '/clima',
  '/usuarios',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`),
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (token) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/predios/:path*',
    '/lotes/:path*',
    '/cultivos/:path*',
    '/sensores/:path*',
    '/riego/:path*',
    '/predicciones/:path*',
    '/reportes/:path*',
    '/clima/:path*',
    '/usuarios/:path*',
  ],
}
