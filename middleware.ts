import { NextRequest, NextResponse } from "next/server";
import { getJWTPayload } from "./lib/helper/auth.helper";

export async function middleware(request: NextRequest) {
  const isGuest =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/daftar");

  const token = request.cookies.get("token");
  const refreshToken = request.cookies.get("refresh_token");

  if (!token?.value || !refreshToken?.value) {
    if (isGuest) return NextResponse.next();

    return NextResponse.redirect(new URL("/login", request.url));
  }

  // When the Token exist
  const jwtPayload = await getJWTPayload(token.value, refreshToken.value);

  if (!jwtPayload) {
    if (isGuest) return NextResponse.next();

    request.cookies.set("token", "");
    request.cookies.set("refresh_token", "");

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
    "/",
    "/login",
    "/daftar",
    "/forum/:path*",
    "/profil/:path*",
    "/akun/:path*",
    "/notifikasi/:path*",
    "/reported-post/:path*",
    "/kelola/:path*",
    "/kelola-sirkel/:path*",
    "/sirkel/:path*",
    "/sirkel-baru/:path*",
    "/sirkel-gabung/:path*",
    "/undangan/:path*",
  ],
};
