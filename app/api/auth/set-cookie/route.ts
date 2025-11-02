// app/api/auth/set-cookie/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    const response = new NextResponse(JSON.stringify({ success: true }));

    // Устанавливаем токен в куки с флагом HttpOnly для безопасности
    response.cookies.set('token', token, {
        httpOnly: true, // Защита от XSS-атак
        secure: process.env.NODE_ENV === 'production', // Только по HTTPS в production
        maxAge: 60 * 60 * 24 * 7, // Срок действия: 1 неделя
        path: '/', // Доступно для всего сайта
        sameSite: 'lax', // Защита от CSRF
    });

    return response;
}