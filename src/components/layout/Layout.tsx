import React, { ReactElement } from "react";
import Navbar from "./Header";

const Layout = ({ children }: { children: ReactElement }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default Layout;
