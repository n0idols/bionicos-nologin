import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";

export default function Home({ reviews }) {
  return (
    <Layout title="Home">
      <Hero />
      <Reviews reviews={reviews} />

      <MapSection />
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://api.yelp.com/v3/businesses/bionicos-and-juices-rios-palmdale/reviews`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_YELP_KEY}`,
      },
    }
  );
  const data = await res.json();

  return {
    props: {
      reviews: data.reviews,
    },
  };
}
