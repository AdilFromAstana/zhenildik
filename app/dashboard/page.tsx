'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../lib/auth';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const user = getUser();
        if (!user || user.role !== 'business') {
            router.push('/login');
        }
    }, []);

    return <div className="p-6">👤 Кабинет бизнеса</div>;
}
