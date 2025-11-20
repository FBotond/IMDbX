import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 🎯 SESSION-ONLY LOGIN KEZELÉSE
  // Ha NINCS refresh token cookie, de van access token → engedjük be
  const hasAccessToken = req.cookies.has("sb-access-token");
  const hasRefreshToken = req.cookies.has("sb-refresh-token");

  const sessionOnly = hasAccessToken && !hasRefreshToken;

  const protectedRoutes = ["/favorites", "/recommendation"];
  const pathname = req.nextUrl.pathname;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session && !sessionOnly) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/favorites/:path*", "/recommendation/:path*"],
};
