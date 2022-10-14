import { Footer } from 'flowbite-react';
import React from 'react';

const FooterSection = () => {
    return (
        <Footer container={true}>
            <div className="container flex flex-wrap justify-between items-center mx-auto dark:bg-gray-800">
                <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
                    <Footer.Brand
                        href="/"
                        src="/images/Secondary.png"
                        alt="Flowbite Logo"
                        name="Dactionator"
                    />
                    <Footer.LinkGroup>
                        <Footer.Link href="#">About</Footer.Link>
                        <Footer.Link href="#">Privacy Policy</Footer.Link>
                        <Footer.Link href="#">Licensing</Footer.Link>
                        <Footer.Link href="#">Contact</Footer.Link>
                    </Footer.LinkGroup>
                </div>
                <Footer.Divider />
                <Footer.Copyright href="#" by="Christian Pelayo" year={2022} />
            </div>
        </Footer>
    );
};

export default FooterSection;
