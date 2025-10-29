"use client";

type Props = {
    activeFilter: string;
    onChange: (status: string) => void;
    stats?: {
        total: number;
        ACTIVE: number;
        DRAFT: number;
        ARCHIVE: number;
        REVIEW: number;
        DELETED: number;
    };
};

const STATUS_LABELS: Record<string, string> = {
    ALL: "Все",
    ACTIVE: "Активные",
    DRAFT: "Черновики",
    ARCHIVE: "Архив",
    REVIEW: "На проверке",
    DELETED: "Удалённые",
};

export default function OfferStatusFilter({ activeFilter, onChange, stats }: Props) {
    const statuses = ["ALL", "ACTIVE", "DRAFT", "ARCHIVE", "REVIEW", "DELETED"];

    // Фильтруем статусы, если есть stats
    const filteredStatuses = stats
        ? statuses.filter((status) => status === "ALL" || stats[status as keyof typeof stats] > 0)
        : statuses;

    return (
        <div className="w-full overflow-x-auto scrollbar-hide mb-4">
            <div className="flex gap-2 min-w-max">
                {filteredStatuses.map((status) => {
                    const isActive = activeFilter === status;
                    const label = STATUS_LABELS[status];
                    const count = stats ? stats[status as keyof typeof stats] ?? 0 : 0;

                    return (
                        <button
                            key={status}
                            onClick={() => onChange(status)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all ${isActive
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {label}
                            {status !== "ALL" && count > 0 && (
                                <span
                                    className={`ml-2 text-xs ${isActive ? "text-blue-100" : "text-gray-600"
                                        }`}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
