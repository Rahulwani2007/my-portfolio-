import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect paths under /app/auth and /dashboard
const protectedPaths = ["/app/auth", "/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If the request matches a protected path
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    // Look for a session cookie (set by your MCP or Firebase server-side exchange)
    const session = req.cookies.get("session")?.value;
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    // Optionally, validate session with MCP server here (omitted)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/auth/:path*", "/dashboard/:path*"],
};
