import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/", "/login", "/register", "/legal", "/forgot-password", "/reset-password"];

function isPublic(pathname: string) {
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/webhooks")) return true;
  if (pathname.startsWith("/marketplace")) return true;
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (isPublic(pathname)) return NextResponse.next();

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/homeowner") && role !== "HOMEOWNER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/developer") && role !== "DEVELOPER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
