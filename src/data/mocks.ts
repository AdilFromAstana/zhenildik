// src/app/data/mocks.ts
import { Deal, CuratedCollection, FilterState } from '@/types';
import { Pizza, Sparkles, Stethoscope, Shirt, Dumbbell, Laptop, Gift } from 'lucide-react';

// Импортируйте нужные типы иконок

export const categories = [
    { name: 'Еда', icon: Pizza, slug: 'Еда' },
    { name: 'Красота', icon: Sparkles, slug: 'Красота' },
    { name: 'Медицина', icon: Stethoscope, slug: 'Медицина' },
    { name: 'Одежда', icon: Shirt, slug: 'Одежда' },
    { name: 'Спорт', icon: Dumbbell, slug: 'Спорт' },
    { name: 'Техника', icon: Laptop, slug: 'Техника' },
    { name: 'Развлечения', icon: Gift, slug: 'Развлечения' },
];

export const establishments = [
    'Ресторан "Nomad"', 'Кафе "Ас Болсын"', 'Салон "Beauty KZ"', 'Сервис "Tech Fix"', 'Магазин "Sport KZ"',
    'Клиника "Здоровье"', 'Бутик "Trend"', 'Фитнес "Iron"', 'Аптека "Vita"', 'СТО "Fast Repair"',
    'Кофейня "Latte"', 'Барбершоп "Blade"', 'Стоматология "Denta"', 'Йога-центр "Zen"', 'Курсы "IT-Astana"'
];

export const discountTypes: Deal['discountType'][] = ['Процент', 'ФиксированнаяСумма', 'Подарок'];
export const tags: Deal['tag'][] = ['ТОП', 'Новая', null, null, null, null, null];
export const ASTANA_LAT = 51.169392;
export const ASTANA_LON = 71.449074;

export const generateMockDeals = (count: number): Deal[] => {
    const deals: Deal[] = [];
    for (let i = 1; i <= count; i++) {
        const category = categories[i % categories.length].name as Deal['category'];
        const discountType = discountTypes[i % discountTypes.length];
        let discountValue;
        if (discountType === 'Процент') {
            discountValue = `${(i % 5) * 10 + 10}%`;
        } else if (discountType === 'ФиксированнаяСумма') {
            discountValue = `${(i % 5 + 1) * 1000} ₸`;
        } else {
            discountValue = 'Подарок';
        }
        const city = 'Астана' as Deal['city'];
        const isTop = tags[i % tags.length];
        const lat = ASTANA_LAT + (Math.random() - 0.5) * 0.05;
        const lon = ASTANA_LON + (Math.random() - 0.5) * 0.08;
        deals.push({
            id: i,
            title: `Акция ${i}: ${category} со скидкой ${discountValue}`,
            description: `Уникальное предложение по категории "${category}" действует только до конца месяца. Спешите воспользоваться!`,
            category,
            discountType,
            discountValue,
            establishment: establishments[i % establishments.length],
            tag: isTop,
            distance: `${(i * 0.3 % 5 + 0.5).toFixed(1)} км`,
            city,
            area: `р-н ${i % 3 + 1}`,
            imageUrl: `https://placehold.co/600x400/${(i * 1000).toString(16).slice(0, 6)}/ffffff?text=${encodeURIComponent(category + '+' + discountValue)}`,
            validUntil: `31.12.2024`,
            conditions: `Действует только по будням. Ограниченное количество купонов.`,
            contact: {
                phone: `+770${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`,
                website: `https://${establishments[i % establishments.length].replace(/[^a-z0-9]/gi, '').toLowerCase()}.kz`,
                address: `Улица Акции, дом ${i}`,
                hours: i % 2 === 0 ? 'ПН-ПТ: 10:00-22:00' : 'Ежедневно: 09:00-21:00',
                rating: (Math.random() * 0.5 + 4.5).toFixed(1) as unknown as number,
                reviews: Math.floor(Math.random() * 1000) + 50,
            },
            lat,
            lon,
        });
    }
    return deals;
};

export const mockDeals: Deal[] = generateMockDeals(100);
export const BEST_DEALS_MOCK: Deal[] = mockDeals.filter(d => d.tag === 'ТОП').slice(0, 5);
export const CURATED_COLLECTIONS_MOCK: CuratedCollection[] = [
    // ... ваш моковый массив
    {
        id: 1,
        title: 'Лучшее для друзей 🍻',
        items: [
            { id: 101, title: 'Бар "Beer Point"', description: 'Скидка 20% на все закуски', imageUrl: 'https://placehold.co/300x200/50D1AA/ffffff?text=Для+друзей' },
            { id: 102, title: 'Квест-комната "Exit"', description: '30% на командную игру', imageUrl: 'https://placehold.co/300x200/50A0D1/ffffff?text=Квест' },
            { id: 103, title: 'Спорт-бар "Goal"', description: 'Подарок за счет от 10000 ₸', imageUrl: 'https://placehold.co/300x200/D150A0/ffffff?text=Спорт' },
            { id: 104, title: 'Караоке "Star"', description: '1 час бесплатно при заказе 2-х', imageUrl: 'https://placehold.co/300x200/3A54C0/ffffff?text=Караоке' },
            { id: 105, title: 'Настолки "Geek"', description: '15% на аренду игр', imageUrl: 'https://placehold.co/300x200/FF5733/ffffff?text=Настолки' },
        ]
    },
    {
        id: 2,
        title: 'Подарки для мамы 🎁',
        items: [
            { id: 201, title: 'СПА-салон "Harmony"', description: 'Массаж со скидкой 15%', imageUrl: 'https://placehold.co/300x200/F0A0D1/ffffff?text=СПА' },
            { id: 202, title: 'Бутик "Florist"', description: 'Бесплатная доставка букета', imageUrl: 'https://placehold.co/300x200/FFD700/000000?text=Цветы' },
            { id: 203, title: 'Ювелирный "KZ Gold"', description: 'Фиксированная скидка 10000 ₸', imageUrl: 'https://placehold.co/300x200/A0D150/ffffff?text=Ювелир' },
            { id: 204, title: 'Кондитерская "Sweet"', description: 'Бесплатный кофе к десерту', imageUrl: 'https://placehold.co/300x200/4B0082/ffffff?text=Кондитерская' },
        ]
    },
    {
        id: 3,
        title: 'Для любителей техники 💻',
        items: [
            { id: 301, title: 'Сервис "iFix"', description: '20% на ремонт экрана', imageUrl: 'https://placehold.co/300x200/556B2F/ffffff?text=Ремонт' },
            { id: 302, title: 'Магазин "Electro"', description: '10% на аксессуары', imageUrl: 'https://placehold.co/300x200/808000/ffffff?text=Аксессуары' },
            { id: 303, title: 'Антивирус "Secure"', description: '3 месяца подписки в подарок', imageUrl: 'https://placehold.co/300x200/5D6D7E/ffffff?text=Антивирус' },
        ]
    }
];

export const DEALS_PER_PAGE = 12;

// --- Глобальная функция фильтрации ---
export const applyFilters = (deals: Deal[], currentFilters: FilterState) => {
    return deals.filter(deal => {
        // Категория
        if (currentFilters.category && currentFilters.category !== '') {
            if (deal.category !== currentFilters.category) return false;
        }
        // Тип скидки
        if (currentFilters.discountType && currentFilters.discountType !== 'Все') {
            if (deal.discountType !== currentFilters.discountType) return false;
        }
        // Город
        if (currentFilters.city && currentFilters.city !== 'Все' && deal.city !== currentFilters.city) return false;
        // Срок действия (моковая логика)
        if (currentFilters.validity === 'Сегодня' && deal.id % 5 !== 0) return false;
        if (currentFilters.validity === 'До конца недели' && deal.id > 50) return false;
        if (currentFilters.validity === 'Весь месяц' && deal.id > 80) return false;
        return true;
    });
};

export const DEFAULT_FILTERS: FilterState = {
    category: '', // Пустое означает "Все"
    city: 'Астана',
    discountType: 'Все',
    validity: 'Все'
};