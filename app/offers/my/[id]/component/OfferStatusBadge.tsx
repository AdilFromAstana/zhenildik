// src/components/OfferStatusBadge.tsx
"use client";

import React from "react";
import clsx from "clsx";

// enum со значениями статусов (можно синхронизировать с бэком)
export enum OfferStatus {
    ACTIVE = "ACTIVE",
    ARCHIVE = "ARCHIVE",
    DRAFT = "DRAFT",
    REVIEW = "REVIEW",
    DELETED = "DELETED",
}

// словарь с русскими названиями
export const OfferStatusLabels: Record<OfferStatus, string> = {
    [OfferStatus.ACTIVE]: "Активно",
    [OfferStatus.ARCHIVE]: "В архиве",
    [OfferStatus.DRAFT]: "Черновик",
    [OfferStatus.REVIEW]: "На проверке",
    [OfferStatus.DELETED]: "Удалено",
};

// словарь с цветами/классами Tailwind
export const OfferStatusClasses: Record<OfferStatus, string> = {
    [OfferStatus.ACTIVE]: "bg-green-100 text-green-700",
    [OfferStatus.ARCHIVE]: "bg-gray-100 text-gray-700",
    [OfferStatus.DRAFT]: "bg-yellow-100 text-yellow-700",
    [OfferStatus.REVIEW]: "bg-blue-100 text-blue-700",
    [OfferStatus.DELETED]: "bg-red-100 text-red-700",
};

interface Props {
    status: OfferStatus;
    className?: string;
}

export const OfferStatusBadge: React.FC<Props> = ({ status, className }) => {
    return (
        <span
            className={clsx(
                "px-2 py-1 rounded-md text-sm font-medium",
                OfferStatusClasses[status],
                className
            )}
        >
            {OfferStatusLabels[status]}
        </span>
    );
};
