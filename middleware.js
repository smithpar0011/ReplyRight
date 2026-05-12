import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = "admin@replyrightapp.com";

async function decodeSession(token) {
  if (!token || !JWT_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const sessionToken = req.cookies.get("rr_session")?.value;
  const { pathname } = req.nextUrl;
  const session = await decodeSession(sessionToken);

  // Protect /dashboard — require valid session AND active plan
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const signinUrl = new URL("/signin", req.url);
      const res = NextResponse.redirect(signinUrl);
      res.cookies.delete("rr_session");
      res.cookies.delete("rr_token");
      res.cookies.delete("rr_user");
      res.cookies.delete("rr_plan");
      res.cookies.delete("rr_billing");
      return res;
    }
    // Require a paid plan — redirect unpaid users back into the signup flow
    const planCookie = req.cookies.get("rr_plan")?.value;
    if (!planCookie) {
      return NextResponse.redirect(new URL("/setup", req.url));
    }
  }

  // Protect /admin-dashboard — require admin session
  if (pathname.startsWith("/admin-dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
    if (session.email !== ADMIN_EMAIL) {
      // Logged-in non-admin user — send them to their own dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect /setup, /payment, /upgrade — require session (not plan)
  if (pathname === "/setup" || pathname === "/payment" || pathname === "/upgrade") {
    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // If already signed in with an active plan, skip signin page
  if (pathname === "/signin") {
    if (session) {
      const planCookie = req.cookies.get("rr_plan")?.value;
      if (planCookie) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // Has session but no plan — let them reach /signin to re-auth / pick a plan
    }
  }

  // If already signed in as non-admin, skip admin-login page
  if (pathname === "/admin-login") {
    if (session && session.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (session && session.email === ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin-dashboard/:path*", "/signin", "/admin-login", "/setup", "/payment", "/upgrade"],
};
