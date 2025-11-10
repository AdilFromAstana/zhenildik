import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://skidka-bar.kz";
    const apiUrl = process.env.SSR_API_URL || process.env.NEXT_PUBLIC_API_URL;

    const resCities = await fetch(`${apiUrl}/cities`, { next: { revalidate: 3600 } });
    const cities = (await resCities.json()) || [];

    const urls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1.0,
        },
        ...cities.map((c: any) => ({
            url: `${baseUrl}/offers/${c.slug}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        })),
    ];

    const limit = 100;
    let page = 1;

    while (true) {
        const res = await fetch(`${apiUrl}/offers?cityCode=astana&page=${page}&limit=${limit}`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) break;
        const { data = [] } = await res.json();
        if (!Array.isArray(data) || data.length === 0) break;

        urls.push(
            ...data.map((offer: any) => ({
                url: `${baseUrl}/offer/${offer.id}`,
                lastModified: new Date(offer.updatedAt || offer.createdAt || new Date()),
                changeFrequency: "weekly" as const,
                priority: 0.6,
            })),
        );

        page++;
        if (page > 100) break;
    }

    return urls;
}
