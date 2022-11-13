// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { Flowbite } from "flowbite-react";
import { Analytics } from "@vercel/analytics/react";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Flowbite>
                <Component {...pageProps} />
                <Analytics />
            </Flowbite>
        </SessionProvider>
    );
};

export default trpc.withTRPC(MyApp);
