import React from 'react';

const IndeterminateProgressBar = ({ label }) => {
    return (
        <>
            <p className="mb-1 italic">{label}</p>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700 overflow-hidden">
                <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full animate-indeterminate-loading origin-[0%_50%]"></div>
            </div>
        </>
    );
};

export default IndeterminateProgressBar;
