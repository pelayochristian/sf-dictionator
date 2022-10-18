import React from "react";
import { CtxOrReq } from "next-auth/client/_utils";
import {
    getProviders,
    signIn,
    getCsrfToken,
    getSession,
} from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { Card } from "flowbite-react";
import Image from "next/image";

const providersIcons = {
    Salesforce: "/icons/salesforce-svgrepo-com.svg",
};

interface Providers {
    callbackUrl?: string;
    id?: string;
    name?: string;
    signinUrl?: string;
    type?: string;
}

const SignIn = ({
    providers,
    csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const providerArray: Providers[] = providers;
    return (
        <>
            <div className="flex h-screen">
                <div className="m-auto">
                    <div className="max-w-md">
                        <Card>
                            <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white lg:text-xl">
                                Connect to Salesforce
                            </h5>
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                For this demo, we use Salesforce as the
                                provider. Click the salesforce button to get
                                authenticated.
                            </p>
                            <ul className="my-4 space-y-3">
                                {providerArray && csrfToken ? (
                                    Object.values(providerArray).map(
                                        (item, index) => {
                                            if (item.id !== "email") {
                                                return (
                                                    <li
                                                        key={index}
                                                        onClick={() =>
                                                            signIn(item.id)
                                                        }
                                                    >
                                                        <button className="group flex w-full items-center rounded-md bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                                                            {/* <Image
                                                                src={
                                                                    providersIcons[
                                                                        item
                                                                            .name
                                                                    ]
                                                                }
                                                                alt="Hashnode"
                                                                width={25}
                                                                height={25}
                                                            /> */}
                                                            <span className="ml-3 whitespace-nowrap">
                                                                {item.name}
                                                            </span>
                                                        </button>
                                                    </li>
                                                );
                                            }
                                        }
                                    )
                                ) : (
                                    <p>No Available Providers</p>
                                )}
                            </ul>
                            <div>
                                <a
                                    href="https://next-auth.js.org/providers/salesforce"
                                    className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
                                >
                                    <svg
                                        className="mr-2 h-3 w-3"
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="far"
                                        data-icon="question-circle"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
                                        />
                                    </svg>
                                    Salesforce as a provider in NextAuth
                                </a>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;

export const getServerSideProps = async (ctx: CtxOrReq | undefined) => {
    const providers = await getProviders();
    const csrfToken = await getCsrfToken(ctx);
    const session = await getSession(ctx);

    /**
     * If session is available then redirect to main page.
     */
    if (session) {
        return {
            redirect: { destination: "/", permanent: false },
        };
    }

    /**
     * Return providers and CSRF Token
     */
    return {
        props: { providers, csrfToken },
    };
};
