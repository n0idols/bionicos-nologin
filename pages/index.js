import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";

export default function Home({ reviews, specials }) {
  return (
    <Layout title="Home">
      <Hero />
      <Reviews reviews={reviews} />
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

  const { data } = await client.query({
    query: gql`
      query Specials {
        specials(sort: "id:asc") {
          id
          day
          product {
            title
            description
            modifiers {
              name
              max
              required
              mod {
                name
                price
              }
            }
          }
          side
          price
          image {
            url
            hash
          }
        }
      }
    `,
  });

  return {
    props: {
      reviews: reviewData.reviews,
      specials: data.specials,
    },
  };
}
