import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// We define a custom interface to handle the auth property on the request
interface AuthRequest extends NextRequest {
  auth: any; 
}

export default auth((req: AuthRequest) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const { nextUrl } = req;

  // 1. Protect Admin Routes
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn || userRole !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // 2. Protect Order Routes
  if (nextUrl.pathname.startsWith("/orders")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};