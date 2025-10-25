import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="max-w-dvw overflow-x-hidden">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className="antialiased overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
