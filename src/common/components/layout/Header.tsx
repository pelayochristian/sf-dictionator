import { DarkThemeToggle, Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../../utils/trpc";

const Header = () => {
    const router = useRouter();
    const { data: sessionData } = useSession();

    const serverTest = trpc.example.serverTest.useQuery({
        text: "Server test from tRPC",
    });

    console.log("Client Server Test: ", serverTest.data);

    return (
        <nav className="fixed top-0 left-0 z-20 w-full border-b border-gray-200 bg-white px-2 py-5 dark:border-gray-600 dark:bg-gray-800 sm:px-4">
            <Navbar fluid={true} rounded={true}>
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                    <Navbar.Brand href="/">
                        <span className="self-center whitespace-nowrap text-xl font-semibold">
                            Dictionator
                        </span>
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
                            <Dropdown.Item>Hasnode</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => signOut()}>
                                Sign out
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
