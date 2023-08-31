import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "./lib/helper/auth.helper";

export async function middleware(request: NextRequest) {
  const isGuest =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/daftar");

  const token = request.cookies.get("token");

  if (!token?.value) {
    if (isGuest) return NextResponse.next();

    return NextResponse.redirect(new URL("/login", request.url));
  }

  // When the Token exist
  const payload = await getAuthUser(token.value);

  if (!payload) {
    if (isGuest) return NextResponse.next();

    request.cookies.set("token", "");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // When the Payload is returning the auth user
  if (isGuest || request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/forum?c=fyp", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/daftar",
    "/forum/:path*",
    "/profil/:path*",
    "/me/:path*",
    "/kelola/:path*",
    "/reported-post/:path*",
  ],
};
