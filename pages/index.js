import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";
import DaySpecial from "@/components/DaySpecial";
import LeadCapture from "@/components/LeadCapture";
import LocationMap from "@/components/LocationMap";

export default function Home({ reviews, specials }) {
  const d = new Date();
  const da = d.getDay();
  const day = da.toString();
  return (
    <Layout title="Home">
      <Hero />
      {/* {specials.map((special) => {
        if (special.id === day) return <DaySpecial special={special} />;
      })} */}
      <Reviews reviews={reviews} />
      {/* <LeadCapture /> */}
      <MapSection />
      {/* <LocationMap /> */}
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
