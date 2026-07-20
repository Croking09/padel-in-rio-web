import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import {
  isAdminPath,
  isBypassPath,
  isProtectedPath,
} from "./lib/auth/route-rules";
import { isAdmin } from "./lib/auth/permissions";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabaseResponse, user } = await updateSession(request);

  if (isBypassPath(pathname)) {
    return supabaseResponse;
  }

  if (isAdminPath(pathname)) {
    if (!isAdmin(user)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (isProtectedPath(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|telegram|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
