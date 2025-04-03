import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect add-transaction route
  const isProtected = pathname.startsWith("/add-transaction")

  if (isProtected) {
    const token = await getToken({ req: request })

    // Redirect to login if there is no token
    if (!token) {
      const url = new URL("/signin", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/add-transaction/:path*"],
}

