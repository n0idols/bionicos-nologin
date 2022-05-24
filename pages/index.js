import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";
import client from "@/lib/apollo-client";
import { gql, useQuery } from "@apollo/client";
import axios from "axios";
import { useState } from "react";
import FeaturedProduct from "../components/FeaturedProduct";

export default function Home({ reviews, featuredProducts }) {
  const [order, setOrder] = useState(null);
  const [response, setResponse] = useState("yo");
  const handleThat = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/email", {
        order,
      });

      setResponse(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title="Home">
      <button className="btn btn-outline" onClick={handleThat}>
        sendmail
      </button>
      {JSON.stringify(response)}
      <Hero />
      <FeaturedProduct featuredProducts={featuredProducts} />
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

  const { data } = await client.query({
    query: gql`
      query {
        products(where: { isFeatured: true }) {
          id
          number
          title
          description
          price
          modifiers(sort: "number:asc") {
            name
            required
            max
            mod {
              name
              price
            }
          }
          image {
            url
          }
        }
      }
    `,
  });

  return {
    props: {
      reviews: reviewData.reviews,
      featuredProducts: data,
    },
  };
}
