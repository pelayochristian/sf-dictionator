import React from 'react';

const ButtonSecondary = ({ children, ...buttonProps }) => {
    return (
        <>
            <button
                type="button"
                className="border-2 bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 font-medium text-sm px-10 py-2.5 text-center mr-3 md:mr-0 rounded-full text-gray-400 hover:text-white-300"
                {...buttonProps}>
                {children}
            </button>
        </>
    );
};

export default ButtonSecondary;
