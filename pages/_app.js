import "../styles/globals.css";
import Head from "next/head";
import Page from "../components/Page";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Bionicos Juices & Rios</title>
      </Head>
      <Page>
        <Component {...pageProps} />
      </Page>
    </>
  );
}
