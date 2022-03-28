import React from "react";

import FeaturedItem from "./FeaturedItem";

export default function FeaturedProduct({ products }) {
  // const { loading, error, data } = useQuery(gql`
  //   query {
  //     products(where: { id: 114 }) {
  //       id
  //       number
  //       title
  //       description
  //       price
  //       modifiers {
  //         name
  //         required
  //         max
  //         mod {
  //           name
  //           price
  //         }
  //       }
  //       image {
  //         url
  //       }
  //     }
  //   }
  // `);

  return (
    <div className="pt-10  max-w-4xl mx-auto">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <h1 className="grad-text">Featured Items</h1>
      <div className="md:flex justify-center md:space-x-4 space-y-8">
        {products.map((item, index) => (
          <FeaturedItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
