import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  // Protect admin API routes - only allow ADMIN role
  if (pathname.startsWith("/api/admin")) {
    if (!req.auth || req.auth.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/api/admin/:path*"],
}
