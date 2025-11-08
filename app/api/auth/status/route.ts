import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value; // или "token", но везде одинаково

    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    if (!res.ok) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    const data = await res.json();

    return NextResponse.json(
      {
        isAuthenticated: true,
        user: {
          name: data.name,
          identifier: data.identifier,
          avatar: data.avatar,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("err in /api/auth/status:", err);
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}
