import DealDetailClient from "@/app/components/DealDetailClient";
import { mockDeals } from "@/app/data/mocks";

// Имитация загрузки данных с API
async function getDealById(id: string) {
    await new Promise((r) => setTimeout(r, 300)); // имитация запроса
    return mockDeals.find((d) => d.id.toString() === id) || null;
}

// SEO-мета
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const deal = await getDealById(id);
    if (!deal) return { title: "Акция не найдена" };

    return {
        title: `${deal.title} — ${deal.establishment}`,
        description: deal.description.slice(0, 150),
    };
}

// Основной компонент страницы
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const deal = await getDealById(id);

    if (!deal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-600">Акция не найдена</h1>
            </div>
        );
    }

    return (
        <DealDetailClient
            deal={deal}
        />
    );
}
