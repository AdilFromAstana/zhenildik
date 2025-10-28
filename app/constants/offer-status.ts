// src/constants/offer-status.ts

export enum OfferStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    ARCHIVE = 'ARCHIVE',
    DELETED = 'DELETED',
    REVIEW = 'REVIEW',
}

export const OfferStatusLabels: Record<OfferStatus, string> = {
    [OfferStatus.DRAFT]: 'Черновик',
    [OfferStatus.ACTIVE]: 'Активно',
    [OfferStatus.ARCHIVE]: 'Архив',
    [OfferStatus.DELETED]: 'Удалено',
    [OfferStatus.REVIEW]: 'На проверке',
};
