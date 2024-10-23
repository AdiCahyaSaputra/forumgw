import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const body = await request.json();

  cookieStore.set("token", body.token, {
    maxAge: 60 * 60 * 2, // 2 Hour
    sameSite: true,
    secure: true,
    httpOnly: true 
  });

  cookieStore.set("refresh_token", body.refreshToken, {
    maxAge: 60 * 60 * 24, // 1 Day
    sameSite: true,
    secure: true,
    httpOnly: true 
  });

  return NextResponse.json({ message: "Berhasil", status: 200 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("token");

  return NextResponse.json({ message: "Berhasil", status: 200 });
}
