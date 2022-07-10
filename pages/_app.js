import { useEffect } from "react";
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

import * as Fathom from "fathom-client";

import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
import { QueryClient, QueryClientProvider } from "react-query";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  const router = useRouter();

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
    <QueryClientProvider client={queryClient}>
      <UserProvider supabaseClient={supabaseClient}>
        <ApolloProvider client={client}>
          <CookiesProvider>
            <CartStateProvider>
              <Page>
                <Component {...pageProps} />
              </Page>
            </CartStateProvider>
          </CookiesProvider>
        </ApolloProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
// export default appWithTranslation(MyApp);
export default MyApp;
