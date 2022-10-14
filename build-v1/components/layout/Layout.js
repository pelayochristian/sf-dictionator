import React from 'react';
import FooterSection from './FooterSection';
import HeaderSection from './HeaderSection';

const Layout = ({ children }) => {
    return (
        <>
            <HeaderSection />
            {children}
            <FooterSection />
        </>
    );
};

export default Layout;
