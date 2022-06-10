import { useQuery } from "@apollo/client";
import React from "react";
import gql from "graphql-tag";
import FeaturedItem from "./FeaturedItem";
import Loading from "./icons/Loading";

export default function FeaturedProduct({ featuredProducts }) {
  return (
    <div className="pt-10 max-w-3xl mx-auto px-2">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <h1 className="grad-text">Featured Items</h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 ">
        {featuredProducts.products.map((item, index) => (
          <FeaturedItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
