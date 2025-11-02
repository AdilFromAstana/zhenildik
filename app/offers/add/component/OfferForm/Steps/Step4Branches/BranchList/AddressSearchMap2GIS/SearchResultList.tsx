import React from "react";

type SearchResultListProps = {
    results: any[];
    onSelect: (item: any) => void;
};

const SearchResultList: React.FC<SearchResultListProps> = ({ results, onSelect }) => {
    return (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {results.map((r: any, i: number) => (
                <div
                    key={`${r.id || r.name}-${i}`}
                    onClick={() => onSelect(r)}
                    className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                >
                    <div className="font-medium">
                        {r.full_address_name || r.name}
                    </div>
                    {r.address_name && (
                        <div className="text-sm text-gray-500">
                            {r.address_name}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SearchResultList;