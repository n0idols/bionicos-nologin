import Hero from "@/components/Hero";
import MapSection from "@/components/MapSection";
import Reviews from "@/components/Reviews";
import client from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { NextSeo } from "next-seo";
import FeaturedProduct from "../components/FeaturedProduct";

export default function Home({ reviews, featuredProducts }) {
  const title = `${process.env.NEXT_PUBLIC_SITE_TITLE} - Home`;
  const description = `Order ahead today | 100% Natural juices, smoothies and fruit salads`;
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_CLIENT_URL}`,
          title: title,
          description: description,
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/ogbio.jpg`,
              width: 800,
              height: 600,
              alt: "Bionicos Home Image",
              type: "image/jpeg",
            },
          ],
        }}
      />
      <Hero />
      <FeaturedProduct featuredProducts={featuredProducts} />
      <Reviews reviews={reviews} />
      {/* <LeadCapture /> */}
      <MapSection />
    </>
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
