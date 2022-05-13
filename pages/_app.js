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
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const queryClient = new QueryClient();
  useEffect(() => {
    Fathom.load("DPJEOSNV", {
      includedDomains: ["bionicosjuicesrios.com", "www.bionicosjuicesrios.com"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }

    router.events.on("routeChangeComplete", onRouteChangeComplete);
  }, [router]);

  return (
    <>
      <UserProvider supabaseClient={supabaseClient}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </UserProvider>
    </>
  );
}
// export default appWithTranslation(MyApp);
export default MyApp;
