// src/app/business/page.tsx
'use client'; // Используем клиентские хуки
import BusinessPage from '../../app/components/BusinessPage'; // Путь может отличаться в зависимости от структуры

const BusinessPageWrapper = () => {
    const handleBack = () => {
        // Возвращаем на главную
        window.location.href = '/'; // Или используйте next/router
    };

    return <BusinessPage onBack={handleBack} />;
};

export default BusinessPageWrapper;