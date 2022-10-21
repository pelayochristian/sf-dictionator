import { Footer } from "flowbite-react";
import Image from "next/image";
import React from "react";

const FooterSection = () => {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    return (
        <div className="w-full">
            <Footer container={true}>
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                    <Footer.Copyright
                        href="#"
                        by="Christian Pelayo"
                        year={getCurrentYear()}
                    />
                    <Footer.LinkGroup>
                        <Footer.Link href="#">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/icons/hashnode-icon-svgrepo-com.svg"
                                    alt="Hashnode"
                                    width={20}
                                    height={20}
                                />
                                <p>Hashnode</p>
                            </div>
                        </Footer.Link>
                        <Footer.Link href="https://github.com/pelayochristian/salesforce-next-auth">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/icons/github-svgrepo-com.svg"
                                    alt="Hashnode"
                                    width={25}
                                    height={25}
                                />
                                <p>Github</p>
                            </div>
                        </Footer.Link>
                    </Footer.LinkGroup>
                </div>
            </Footer>
        </div>
    );
};

export default FooterSection;
