import { Button } from "flowbite-react";
import React from "react";

const FilterComponent = ({
    filterText,
    onFilter,
    onClear,
}: {
    filterText: string;
    onFilter: React.ChangeEventHandler<HTMLInputElement>;
    onClear: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <>
            <div className="w-96">
                <div className="flex gap-3">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <div className="relative w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="search"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            placeholder="Search By Label..."
                            value={filterText}
                            onChange={onFilter}
                        />
                    </div>
                    <div className="w-32">
                        <Button gradientDuoTone="greenToBlue" onClick={onClear}>
                            Clear
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterComponent;
