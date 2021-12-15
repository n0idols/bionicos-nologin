import { ApolloProvider } from "@apollo/client";
import Router from "next/router";
import Page from "@/components/Page";
import NProgress from "nprogress";
import "@/styles/globals.css";
import "@/styles/nprogress.css";

import { CartStateProvider } from "@/lib/cartState";
import client from "../apollo-client";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <ApolloProvider client={client}>
        <CartStateProvider>
          <Page>
            <Component {...pageProps} />
          </Page>
        </CartStateProvider>
      </ApolloProvider>
    </>
  );
}
