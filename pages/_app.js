import { Flowbite } from 'flowbite-react';
import Head from 'next/head';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Dictionator</title>
            </Head>
            <Flowbite>
                <Component {...pageProps} />
            </Flowbite>
        </>
    );
};

export default App;
