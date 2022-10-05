import React from 'react';

const ButtonPrimary = ({ children, addClass, ...buttonProps }) => {
    return (
        <>
            <button
                type="button"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 font-semibold text-sm px-10 py-2.5 text-center mr-3 md:mr-0 rounded-full text-white"
                {...buttonProps}>
                {children}
            </button>
        </>
    );
};

export default ButtonPrimary;
