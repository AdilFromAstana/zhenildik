import React from "react";
import SearchResultList from "./SearchResultList";

type SearchInputProps = {
    searchQuery: string;
    onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    results: any[];
    open: boolean;
    onSelect: (item: any) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({
    searchQuery,
    onInput,
    results,
    open,
    onSelect,
}) => {
    return (
        <div className="absolute z-50 top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
            <div className="relative">
                <input
                    value={searchQuery}
                    onChange={onInput}
                    placeholder="Введите адрес или название..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {open && results.length > 0 && (
                    <SearchResultList results={results} onSelect={onSelect} />
                )}
            </div>
        </div>
    );
};

export default SearchInput;