import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";

import FeaturedProduct from "../components/FeaturedProduct";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home({ reviews, specials }) {
  const d = new Date();
  const da = d.getDay();
  const day = da.toString();
  const router = useRouter();
  const { asPath } = useRouter();
  // useEffect(() => {
  //   if (window.location.hash) {
  //     alert("https://www.bionicosjuicesrios.com/?redirect=/resetpassword#");
  //     router.push("/resetpassword");
  //   } else {
  //     // Fragment doesn't exist
  //   }
  // }, []);
  // useEffect(() => {
  //   const hash = asPath === "/#";
  //   if (hash) {
  //     router.push("/resetpassword");
  //   } else {
  //     return;
  //   }
  // }, [asPath]);
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
  const res = await fetch(
    `https://api.yelp.com/v3/businesses/bionicos-and-juices-rios-palmdale/reviews`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PRIVATE_YELP_KEY}`,
      },
    }
  );
  const reviewData = await res.json();

  return {
    props: {
      reviews: reviewData.reviews,
    },
  };
}
