import { useQuery } from "@apollo/client";
import React from "react";
import gql from "graphql-tag";
import FeaturedItem from "./FeaturedItem";
import Loading from "./icons/Loading";

export default function FeaturedProduct() {
  const { loading, error, data } = useQuery(gql`
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
  `);
  if (loading) return <Loading />;

  return (
    <div className="pt-10  max-w-4xl mx-auto">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <h1 className="grad-text">Featured Items</h1>
      <div className="md:flex justify-evenly space-y-8 md:space-y-0">
        {data.products.map((item, index) => (
          <FeaturedItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
