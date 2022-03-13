import { useState, useEffect } from "react";
// import { appWithTranslation } from "next-i18next";
import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import Router, { useRouter } from "next/router";
import Page from "@/components/Page";
import NProgress from "nprogress";
import "@/styles/globals.css";
import "@/styles/nprogress.css";
import { CartStateProvider } from "@/lib/cartState";
import { CookiesProvider } from "react-cookie";

import Head from "next/head";
import * as Fathom from "fathom-client";

import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
import OneSignal from "react-onesignal";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    Fathom.load("DPJEOSNV", {
      includedDomains: ["bionicosjuicesrios.com", "www.bionicosjuicesrios.com"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }

    router.events.on("routeChangeComplete", onRouteChangeComplete);
    window.OneSignal = window.OneSignal || [];
    const OneSignal = window.OneSignal;
    OneSignal.push(function () {
      OneSignal.init({
        appId: "5c54727e-3b23-4f47-a819-58a26be08b8f",

        notifyButton: {
          enable: false,
        },

        allowLocalhostAsSecureOrigin: true,
      });
    });

    return () => {
      // router.events.off("routeChangeComplete", onRouteChangeComplete),
      window.OneSignal = undefined;
    };
  }, []);

  return (
    <>
      <UserProvider supabaseClient={supabaseClient}>
        <ApolloProvider client={client}>
          <CookiesProvider>
            <CartStateProvider>
              <Page>
                <Head>
                  <meta
                    name="viewport"
                    content="initial-scale=1,width=device-width, viewport-fit=cover, user-scalable=no"
                  />
                  <script
                    src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
                    async=""
                  ></script>
                </Head>

                <Component {...pageProps} />
              </Page>
            </CartStateProvider>
          </CookiesProvider>
        </ApolloProvider>
      </UserProvider>
    </>
  );
}
// export default appWithTranslation(MyApp);
export default MyApp;
