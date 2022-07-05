import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en-US" data-theme="cupcake">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;700&display=swap"
            rel="stylesheet"
          />

          <link rel="manifest" href="/site.webmanifest" />

          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />

          <meta name="theme-color" content="#eeeae6" />
          <link
            rel="icon"
            type="image/png"
            sizes="196x196"
            href="favicon-196.png"
          />
          <link rel="apple-touch-icon" href="apple-icon-180.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <link
            rel="apple-touch-startup-image"
            href="/apple-splash-828-1792.jpg"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/apple-splash-1792-828.jpg"
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
          />
          <link
            rel="apple-touch-startup-image"
            href="/apple-splash-1242-2208.jpg"
            media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          />

          <link
            rel="apple-touch-startup-image"
            href="/apple-splash-750-1334.jpg"
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />

          <link
            rel="apple-touch-startup-image"
            href="/apple-splash-640-1136.jpg"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
          <div id="modal-root"></div>
          <div id="drawer-root"></div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
