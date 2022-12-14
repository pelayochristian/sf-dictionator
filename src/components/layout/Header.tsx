import { DarkThemeToggle, Dropdown, Navbar } from "flowbite-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Header = () => {
    const router = useRouter();
    const { data: sessionData } = useSession();
    useEffect(() => {
        if (sessionData?.user?.isAuthenticated === false) {
            signIn();
        }
    }, [sessionData]);

    return (
        <nav className="fixed top-0 left-0 z-20 w-full border-b border-gray-200 bg-white px-2 py-3 dark:border-gray-600 dark:bg-gray-800 sm:px-4">
            <Navbar fluid={true} rounded={true}>
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                    <Navbar.Brand href="/">
                        <div className="flex gap-3">
                            <Image
                                src="/icons/Secondary.png"
                                alt="Dictionator Logo"
                                width={40}
                                height={40}
                                className="mr-3 h-6 rounded-md sm:h-9"
                            />
                            <span className="self-center whitespace-nowrap text-xl font-semibold">
                                Dictionator
                            </span>
                        </div>
                    </Navbar.Brand>

                    <div className="flex gap-5 md:order-2">
                        <DarkThemeToggle />
                        <Dropdown
                            arrowIcon={true}
                            inline={true}
                            label={
                                <div className="flex py-2">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        ></path>
                                    </svg>
                                </div>
                            }
                        >
                            <Dropdown.Header>
                                <span className="block text-sm">
                                    {sessionData?.user?.name}
                                </span>
                                <span className="block truncate text-sm font-medium">
                                    {sessionData?.user?.email}
                                </span>
                            </Dropdown.Header>
                            <Dropdown.Item
                                onClick={() =>
                                    router.push(
                                        "https://github.com/pelayochristian/salesforce-next-auth"
                                    )
                                }
                            >
                                Github
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() =>
                                    router.push(
                                        "https://github.com/pelayochristian/salesforce-next-auth"
                                    )
                                }
                            >
                                Hasnode
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => signOut()}>
                                <div className="flex gap-2">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        ></path>
                                    </svg>
                                    <p>Sign out</p>
                                </div>
                            </Dropdown.Item>
                        </Dropdown>
                        <Navbar.Toggle />
                    </div>
                </div>
            </Navbar>
        </nav>
    );
};

export default Header;
