import React from "react";
import { gql, useQuery } from "@apollo/client";
import MenuItem from "./MenuItem";
import FeaturedItem from "./FeaturedItem";
import Loading from "@/components/icons/Loading";
export default function FeaturedProduct() {
  const { loading, error, data } = useQuery(gql`
    query {
      products(where: { id: 110 }) {
        id
        number
        title
        description
        price
        modifiers {
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
  `);

  if (loading) return <Loading />;
  if (error) return `Error! ${error.message}`;
  const logo = `text-center tracking-tighter md:text-4xl text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-900 mb-4`;

  return (
    <div className="pt-20">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data.products.map((item) => (
        <>
          <h1 className="grad-text">Featured Item</h1>

          <FeaturedItem item={item} />
        </>
      ))}
    </div>
  );
}
