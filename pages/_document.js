import { Html, Head, Main, NextScript } from 'next/document'
import { Navbar } from '@/components/main'

export default function Document() {
  return (
    <Html lang="en">
      <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.ADSENSE_PUB}`} crossorigin="anonymous"></script>
      <Head />
      <body>
        <Navbar />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
