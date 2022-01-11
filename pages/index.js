import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import LocationMap from "@/components/LocationMap";
import Featured from "@/components/Products/Featured";
import Reviews from "@/components/Reviews";
import { PLACES_ID, PLACES_KEY } from "@/config/index";

export default function Home({ data }) {
  return (
    <Layout title="Home">
      <Hero />
      <Featured />
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACES_ID}&fields=name,rating,reviews,formatted_phone_number&key=${PLACES_KEY}`
  );
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}
