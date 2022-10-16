import type { NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Layout from "../components/layout/Layout";
import { CtxOrReq } from "next-auth/client/_utils";
import SObjectDuelPicklist from "../components/SObjectDuelPicklist";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Dictionator</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <SObjectDuelPicklist />
            </Layout>
        </>
    );
};

export const getServerSideProps = async (ctx: CtxOrReq | undefined) => {
    const session = await getSession(ctx);
    /**
     * If session is available then redirect to main page.
     */
    if (!session) {
        return {
            redirect: { destination: "/signin", permanent: false },
        };
    }

    /**
     * Return providers and CSRF Token
     */
    return {
        props: { session },
    };
};

export default Home;

// const AuthShowcase: React.FC = () => {
//     const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

//     const { data: sessionData } = useSession();

//     return (
//         <div className="flex flex-col items-center justify-center gap-2">
//             {sessionData && (
//                 <p className="text-2xl text-blue-500">
//                     Logged in as {sessionData?.user?.name}
//                 </p>
//             )}
//             {secretMessage && (
//                 <p className="text-2xl text-blue-500">{secretMessage}</p>
//             )}
//             <Button onClick={sessionData ? () => signOut() : () => signIn()}>
//                 {sessionData ? "Sign out" : "Sign in"}
//             </Button>
//         </div>
//     );
// };
