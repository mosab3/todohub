import { Html, Head, Main, NextScript } from 'next/document'
import { Navbar } from '@/components/main'

export default function Document() {
  return (
    <Html lang="en">
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Yet Another TODO List</title>
      <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.ADSENSE_PUB}`} crossOrigin="anonymous"></script>
      <Head />
      <body>
        <Navbar />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
