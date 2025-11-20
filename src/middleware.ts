import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Supabase session lekérése
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // VÉDETT OLDALAK
  const protectedRoutes = ["/favorites", "/recommendation"];

  const pathname = req.nextUrl.pathname;

  // Ha a user ezekre a route-okra megy --> session kötelező
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      // Ha nincs session → átirányítás login-re
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
    console.log("Session OK → oldal engedélyezve");
  }

  return res;
}

export const config = {
  matcher: ["/favorites/:path*", "/recommendation/:path*"],
};