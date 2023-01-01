import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css"
              integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB"
              crossOrigin="anonymous"/>

        <link rel="icon" href="/favicon.png"/>
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  )
}
