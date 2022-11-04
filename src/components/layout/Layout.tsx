import React, { ReactElement } from "react";
import FooterSection from "./FooterSection";
import Navbar from "./Header";

const Layout = ({ children }: { children: ReactElement }) => {
    return (
        <>
            <Navbar />
            {children}
            <FooterSection />
        </>
    );
};

export default Layout;
