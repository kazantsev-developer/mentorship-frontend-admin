import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Edge routing middleware validating session tokens and executing access control guards */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    if (token) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

/** Route matcher specification to isolate static assets and optimize edge middleware runtime performance */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
