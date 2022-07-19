import React from "react";

import FeaturedItem from "./FeaturedItem";

export default function FeaturedProduct({ featuredProducts }) {
  return (
    <div className="pt-10 max-w-6xl mx-auto px-2">
      <h1 className="grad-text">Featured Items</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-4 lg:gap-8 ">
        {featuredProducts?.map((item, index) => {
          return <FeaturedItem key={index} item={item} />;
        })}
      </div>
    </div>
  );
}
