import Hero from "@/components/Hero";
import Layout from "@/components/Layout";

import Featured from "@/components/Products/Featured";

export default function Home() {
  return (
    <Layout title="Home">
      <Hero />
      <Featured />
    </Layout>
  );
}
