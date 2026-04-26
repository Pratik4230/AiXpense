import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = [
  "/aixpense",
  "/transactions",
  "/reports",
  "/premium",
  "/profile",
  "/budgets",
  "/admin",
];
const authRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

async function hasValidSession(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return false;

  try {
    const res = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { session?: unknown };
    return Boolean(data?.session);
  } catch {
    return false;
  }
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isAuthRoute = authRoutes.includes(path);

  const sessionCookie = getSessionCookie(req);
  const validSession = sessionCookie ? await hasValidSession(req) : false;

  if (isProtectedRoute && !validSession) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthRoute && validSession) {
    return NextResponse.redirect(new URL("/aixpense", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)", "/"],
};
