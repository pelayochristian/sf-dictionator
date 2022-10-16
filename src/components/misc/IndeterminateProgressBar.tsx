import React from "react";

const IndeterminateProgressBar = ({ label }: { label: string }) => {
    return (
        <>
            <p className="mb-1 italic">{label}</p>
            <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2.5 origin-[0%_50%] animate-indeterminate-loading rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
            </div>
        </>
    );
};

export default IndeterminateProgressBar;
