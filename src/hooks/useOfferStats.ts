import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export type OfferStats = {
    total: number;
    ACTIVE: number;
    ARCHIVE: number;
    DRAFT: number;
    REVIEW: number;
    DELETED: number;
};

const fetchOfferStats = async (): Promise<OfferStats> => {
    const { data } = await axiosInstance.get("/offers/stats");
    return data;
};

export function useOfferStats() {
    return useQuery({
        queryKey: ["offers", "stats"],
        queryFn: fetchOfferStats,
        staleTime: 1000 * 60 * 5, // 5 минут кеша
    });
}
