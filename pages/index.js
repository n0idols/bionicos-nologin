import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";
import FeaturedProduct from "../components/FeaturedProduct";

export default function Home({ reviews }) {
  return (
    <Layout title="Home">
      <Hero />
      <FeaturedProduct />
      <Reviews reviews={reviews} />
      {/* <LeadCapture /> */}
      <MapSection />
    </Layout>
  );
}

export async function getStaticProps() {
  const yelpRes = await fetch(
    `https://api.yelp.com/v3/businesses/bionicos-and-juices-rios-palmdale/reviews`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PRIVATE_YELP_KEY}`,
      },
    }
  );
  const reviewData = await yelpRes.json();

  // const productRes = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/products?isFeatured=true`
  // );
  // const productData = await productRes.json();

  return {
    props: {
      reviews: reviewData.reviews,
      // products: productData,
    },
  };
}
