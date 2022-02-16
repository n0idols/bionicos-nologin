import { useState, useEffect } from "react";
// import { appWithTranslation } from "next-i18next";

import Router, { useRouter } from "next/router";
import Page from "@/components/Page";
import NProgress from "nprogress";
import "@/styles/globals.css";
import "@/styles/nprogress.css";
import { SessionProvider, useSession } from "next-auth/react";
import { CartStateProvider } from "@/lib/cartState";
import { CookiesProvider } from "react-cookie";

import Head from "next/head";
import * as Fathom from "fathom-client";

import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    // Initialize Fathom when the app loads
    // Example: yourdomain.com
    //  - Do not include https://
    //  - This must be an exact match of your domain.
    //  - If you're using www. for your domain, make sure you include that here.
    Fathom.load("DPJEOSNV", {
      includedDomains: ["bionicosjuicesrios.com", "www.bionicosjuicesrios.com"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []);
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={client}>
          <CookiesProvider>
            <CartStateProvider>
              <Page>
                <Head>
                  <meta
                    name="viewport"
                    content="initial-scale=1,width=device-width, viewport-fit=cover, user-scalable=no"
                  />
                </Head>

                <Component {...pageProps} />
              </Page>
            </CartStateProvider>
          </CookiesProvider>
        </ApolloProvider>
      </SessionProvider>
    </>
  );
}
// export default appWithTranslation(MyApp);
export default MyApp;
