import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/"];
const AUTH_PATHS = ["/auth"];
const PROTECTED_PREFIXES = ["/dashboard"];

async function hasSession(request: NextRequest): Promise<boolean> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const cookie = request.headers.get("cookie");

  if (!backendUrl || !cookie) return false;

  try {
    const response = await fetch(`${backendUrl}/api/auth/get-session`, {
      method: "GET",
      headers: {
        cookie,
      },
      cache: "no-store",
    });

    if (!response.ok) return false;
    const body = await response.json();

    return Boolean(body);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const sessionExists = await hasSession(request);

  if (sessionExists && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    !sessionExists &&
    isProtectedPath &&
    !PUBLIC_PATHS.includes(pathname) &&
    !AUTH_PATHS.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
