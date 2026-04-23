import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"
import type { NextFetchEvent, NextMiddleware } from "next/server"
import type { NextAuthRequest } from "next-auth"

const middleware: NextMiddleware = auth(
  (req: NextAuthRequest, _event: NextFetchEvent) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith("/sign-")
    const isBackoffice =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/access-management") ||
      req.nextUrl.pathname.startsWith("/manage") ||
      req.nextUrl.pathname.startsWith("/settings")

    // Redirect to dashboard if already logged in and trying to access auth pages
    if (isLoggedIn && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Redirect to sign-in if trying to access protected routes while logged out
    if (!isLoggedIn && isBackoffice) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    return NextResponse.next()
  }
)

export default middleware

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
