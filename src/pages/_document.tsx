import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="theme-light">
      <Head>
        {/* 添加 viewport 元标签禁止移动端缩放 */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta> */}
        {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
        {/* rest of your scripts go under */}
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
