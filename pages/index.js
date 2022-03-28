import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";

import FeaturedProduct from "../components/FeaturedProduct";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home({ reviews, products }) {
  return (
    <Layout title="Home">
      <Hero />
      <FeaturedProduct products={products} />
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

  const productRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?isFeatured=true`
  );
  const productData = await productRes.json();

  return {
    props: {
      reviews: reviewData.reviews,
      products: productData,
    },
  };
}
