import { Flowbite } from 'flowbite-react';
import Head from 'next/head';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>Dictionator</title>
            </Head>
            <Flowbite>
                <Component {...pageProps} />
            </Flowbite>
        </>
    );
};

export default App;
