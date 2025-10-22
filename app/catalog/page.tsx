'use client';
import AllDealsCatalog from '../components/AllDealsCatalog';
import { useState } from 'react';
import { DEFAULT_FILTERS } from '../data/mocks';
import FilterOverlay from '../components/FilterOverlay';

export default function CatalogPage() {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            <AllDealsCatalog
                filters={filters}
                setFilters={setFilters}
                onOpenFilters={() => setShowFilters(true)}
            />
            {showFilters && (
                <FilterOverlay
                    currentFilters={filters}
                    onApply={setFilters}
                    onClose={() => setShowFilters(false)}
                />
            )}
        </>
    );
}
