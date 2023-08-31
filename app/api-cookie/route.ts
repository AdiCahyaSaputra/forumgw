import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const body = await request.json();

  cookieStore.set("token", body.token, {
    maxAge: 60 * 60 * 60 * 2, // 2 Hour
  });

  return NextResponse.json({ message: "Berhasil", status: 200 });
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("token");

  return NextResponse.json({ message: "Berhasil", status: 200 });
}
