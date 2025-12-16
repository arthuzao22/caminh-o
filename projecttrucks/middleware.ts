import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if user has session cookie
  const sessionToken = request.cookies.get("next-auth.session-token") || 
                       request.cookies.get("__Secure-next-auth.session-token")
  
  const isAuth = !!sessionToken
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isProtectedPage = pathname.startsWith("/dashboard")
  
  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  // Redirect unauthenticated users to login
  if (isProtectedPage && !isAuth) {
    const from = pathname + (request.nextUrl.search || "")
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
}
