import Head from "next/head";

export default function Layout({ title, keywords, description, children }) {
  return (
    <div>
      <Head>
        <title>Bionicos &amp; Juices Rions - {title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Head>
      {children}
    </div>
  );
}

Layout.defaultProps = {
  title: "Bionicos Juices & Rios",
  description: "100% Natural juices, smoothies and fruit salads.",
  keywords: "bionicos palmdale, juice bar palmdale, healthy food palmdale",
};
