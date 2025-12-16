import { auth } from "@/lib/auth/auth-options"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuth = !!req.auth
  
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isProtectedPage = pathname.startsWith("/dashboard")
  
  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
  
  // Redirect unauthenticated users to login
  if (isProtectedPage && !isAuth) {
    const from = pathname + (req.nextUrl.search || "")
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    )
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
}
