import { LucideIcon, Clock, CheckCircle2, Archive, Trash2, Hourglass } from "lucide-react";

export const offerStatusMap: Record<
    string,
    { label: string; color: string; icon: LucideIcon }
> = {
    DRAFT: { label: "Черновик", color: "text-gray-500 bg-gray-100 border-gray-200", icon: Clock },
    ACTIVE: { label: "Активно", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
    ARCHIVED: { label: "В архиве", color: "text-gray-600 bg-gray-100 border-gray-200", icon: Archive },
    DELETED: { label: "Удалено", color: "text-red-700 bg-red-50 border-red-200", icon: Trash2 },
    PENDING: { label: "На проверке", color: "text-blue-700 bg-blue-50 border-blue-200", icon: Hourglass },
};
