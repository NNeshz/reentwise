import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@reentwise/auth/utils/auth";

const PUBLIC_PATHS = ["/"];
const AUTH_PATHS = ["/auth"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session && !PUBLIC_PATHS.includes(pathname) && !AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
