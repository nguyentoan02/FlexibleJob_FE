import React from "react";

const SearchBar = ({ searchInput, setSearchInput, onSearch }) => {
    return (
        <div className="mb-4 flex space-x-2">
            <input
                type="text"
                placeholder="Search jobs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                }}
                className="border p-2 rounded w-full md:w-1/3"
            />
            <button
                onClick={onSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
