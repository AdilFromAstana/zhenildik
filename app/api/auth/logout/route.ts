// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieStore = await cookies();

    // Удаляем куки с токеном
    cookieStore.delete('token');

    return NextResponse.json({ success: true });
}