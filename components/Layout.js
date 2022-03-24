import Head from "next/head";

export default function Layout({ title, keywords, description, children }) {
  return (
    <div>
      <Head>
        <title>
          {process.env.NEXT_PUBLIC_SITE_TITLE} - {title}
        </title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="icon" href="/favicon-196.png" />
      </Head>
      {children}
    </div>
  );
}

Layout.defaultProps = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: "100% Natural juices, smoothies and fruit salads.",
  keywords: "bionicos palmdale, juice bar palmdale, healthy food palmdale",
};
