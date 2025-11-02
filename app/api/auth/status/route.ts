// app/api/auth/status/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Обрабатывает GET-запрос для проверки статуса аутентификации пользователя.
 * Читает HTTP-only 'token' из куки.
 */
export async function GET() {
    const cookieStore = await cookies();
    // Имя 'token' должно совпадать с тем, что вы установили в set-cookie
    const token = cookieStore.get('token')?.value;

    if (token) {
        // В идеале: Здесь должна быть серверная валидация токена (например, JWT.verify)
        // Для демонстрации наличия токена просто возвращаем true
        return NextResponse.json({ isAuthenticated: true, token });
    } else {
        // Токена нет
        return NextResponse.json({ isAuthenticated: false });
    }
}