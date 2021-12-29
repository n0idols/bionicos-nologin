import { useState } from "react";
import Section from "@/components/Section";
import { API_URL } from "@/config/index";
import { useAuth } from "@/lib/authState";

import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";
import { useCart } from "@/lib/cartState";

export default function SpecialsMenu({ specials }) {
  const { addToCart } = useCart();

  const d = new Date();
  const da = d.getDay();
  const day = da.toString();

  const active = `text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent-focus-focus`;

  return (
    <div className="lg:px-12 px-2 space-y-9">
      <h1 className="text-center lg:text-4xl ">Weekly Specials</h1>
      <p className="text-center text-xl my-4">
        Each special comes with a
        <span className="text-primary font-bold"> Large Agua Fresca</span>
      </p>
      <div className="grid lg:grid-cols-5  md:grid-cols-3  grid-cols-1 gap-4 justify-center mx-auto">
        {specials.map((special) => (
          <div
            className={
              day === special.id
                ? "card p-4 bg-gray-50 shadow-xl"
                : "card p-4 bg-white opacity-30"
            }
            key={special.id}
          >
            <div className="">
              <span className={day === special.id ? " " : ""}>
                {special.day}
              </span>
              <h1 className="text-2xl">
                <span className={day === special.id ? " text-primary" : ""}>
                  {special.product.title}
                </span>
              </h1>
            </div>
            <div className="my-4 space-y-2">
              <p>Includes {special.side}</p>
            </div>
            <div className="card-actions items-center">
              <p className="p-2">${special.price}</p>
              <div>
                {day === special.id ? (
                  <button className="btn  btn-outline">Add To Order</button>
                ) : (
                  // <button className="btn bg-brand-red glass text-white hover:bg-brand-redhover btn-block mt-auto">
                  //   Add To Order
                  // </button>
                  <></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <pre>{JSON.stringify(specials, null, 2)}</pre> */}
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query Specials {
        specials {
          id
          day
          product {
            title
          }
          side
          price
        }
      }
    `,
  });

  return {
    props: {
      specials: data.specials,
    },
  };
}
