import { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import Page from "@/components/Page";
import NProgress from "nprogress";
import "@/styles/globals.css";
import "@/styles/nprogress.css";
import Modal from "react-modal";
import { CartStateProvider } from "@/lib/cartState";
import { CookiesProvider } from "react-cookie";
import { AuthStateProvider } from "@/lib/authState";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps }) {
  Modal.setAppElement("#__next");
  return (
    <>
      <AuthStateProvider>
        <CookiesProvider>
          <CartStateProvider>
            <Page>
              <Component {...pageProps} />
            </Page>
          </CartStateProvider>
        </CookiesProvider>
      </AuthStateProvider>
    </>
  );
}
