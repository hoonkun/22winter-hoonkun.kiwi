import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no"/>
        <title>극지대의 키위새</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App;
