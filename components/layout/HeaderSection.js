import React, { useEffect, useState } from 'react';
import ButtonPrimary from '../misc/ButtonPrimary';
import axios from 'axios';
import { Avatar, DarkThemeToggle, Dropdown } from 'flowbite-react';
import { useRouter } from 'next/router';

const HeaderSection = () => {
    const router = useRouter();

    const [userData, getUserData] = useState({
        displayName: '',
        username: '',
        userType: '',
    });
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        userInfo();
    }, []);

    const userIcon = () => {
        return (
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
        );
    };

    const terminalIcon = () => {
        return (
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
        );
    };

    const orgIcon = () => {
        return (
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>
        );
    };

    const signoutIcon = () => {
        return (
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
        );
    };

    /**
     * Retrieve Salesforce User Information.
     */
    const userInfo = async () => {
        setLoading(true);
        await axios
            .get('/user/sf-who-am-i')
            .then((response) => {
                console.log(response.data);
                getUserData({
                    username: response.data.username,
                    userType: response.data.user_type,
                    displayName: response.data.display_name,
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
            });
    };

    /**
     * Call API to authenticate user to Salesforce
     * Oauth2.
     */
    const login = async () => {
        const loginType = 'login';

        const clientId = await (await axios.get('/oauth2/clientId')).data;
        const baseURL = `https://${loginType}.salesforce.com`;
        const authEndPoint = `${baseURL}/services/oauth2/authorize`;
        const redirectURI = encodeURIComponent(
            `${window.location.origin}/oauth2/callback`
        );
        const state = JSON.stringify({
            baseURL: baseURL,
            redirectURI: redirectURI,
        });

        const requestURL = `${authEndPoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectURI}&state=${state}&prompt=select_account`;
        window.location = requestURL;
    };

    /**
     * Call API to destroy user session.
     */
    const signoutUser = async () => {
        await axios
            .get('/user/signout')
            .then((response) => {
                if (response.data?.is_success) {
                    router.reload(window.location.pathname);
                }
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
            });
    };

    /**
     * Return DOM for Header Profile Section.
     */
    const profileInfo =
        isLoading === true ? (
            <ButtonPrimary onClick={login}>Login</ButtonPrimary>
        ) : (
            <Dropdown
                arrowIcon={true}
                inline={true}
                label={
                    <div className="flex">
                        <span className="mr-2">{userIcon()}</span>
                        <p>{userData.displayName}</p>
                    </div>
                }>
                <Dropdown.Header>
                    <span className="block text-sm capitalize">
                        {userData.userType.toLowerCase()}
                        {' User'}
                    </span>
                    <span className="block text-sm font-medium truncate">
                        {userData.username}
                    </span>
                </Dropdown.Header>
                <Dropdown.Item icon={orgIcon}>
                    <span className="ml-2">Go to Org</span>
                </Dropdown.Item>
                <Dropdown.Item icon={terminalIcon}>
                    <span className="ml-2">Github</span>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={signoutUser} icon={signoutIcon}>
                    <span className="ml-2">Sign out</span>
                </Dropdown.Item>
            </Dropdown>
        );

    return (
        <nav className="bg-white px-2 sm:px-4 py-5 dark:bg-gray-800 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <a href="/" className="flex items-center">
                    <img
                        src="/images/Secondary.png"
                        className="mr-3 h-6 sm:h-9 rounded-md"
                        alt="Dictionator Logo"
                    />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                        Dictionator
                    </span>
                </a>
                <div className="flex items-center md:order-2 gap-4">
                    <div>{profileInfo}</div>
                    <DarkThemeToggle />
                </div>
            </div>
        </nav>
    );
};

export default HeaderSection;
