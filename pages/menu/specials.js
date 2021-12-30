import { useState } from "react";
import Section from "@/components/Section";
import { API_URL } from "@/config/index";
import { useAuth } from "@/lib/authState";

import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";
import { useCart } from "@/lib/cartState";

export default function SpecialsMenu({ specials }) {
  const d = new Date();
  const da = d.getDay();
  const day = da.toString();

  const active = `text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent-focus-focus`;

  return (
    <div className="max-w-lg mx-auto px-4 space-y-9">
      <h1 className="text-center lg:text-4xl ">Weekly Specials</h1>
      <p className="text-center text-xl my-4">
        Each special comes with a
        <span className="text-primary font-bold"> Large Agua Fresca</span>
      </p>
      <div className="grid grid-cols-1 gap-4 justify-center mx-auto">
        {specials.map((special) => (
          <div
            className={
              day === special.id
                ? "card p-4 bg-primary shadow-xl "
                : "card p-4 bg-white opacity-30"
            }
            key={special.id}
          >
            <div className="border flex flex-col justify-center items-center rounded-2xl  border-zinc-200">
              <span
                className={
                  day === special.id
                    ? "px-2 m-2 rounded-2xl uppercase bg-red-100"
                    : ""
                }
              >
                {special.day}
              </span>
              <h1 className="text-2xl">
                <span className={day === special.id ? " text-white" : ""}>
                  {special.product.title}
                </span>
              </h1>
              <div className="my-4 space-y-2">
                <p className={day === special.id ? " text-white" : ""}>
                  with a {special.side}
                </p>
              </div>
              <div className="text-center">
                <p
                  className={
                    day === special.id ? " text-white font-semibold" : ""
                  }
                >
                  ${special.price}
                </p>
                <div className="my-4">
                  {day === special.id ? (
                    <button className="btn  btn-ghost text-white border-zinc-500">
                      Add To Order
                    </button>
                  ) : (
                    // <button className="btn bg-brand-red glass text-white hover:bg-brand-redhover btn-block mt-auto">
                    //   Add To Order
                    // </button>
                    <></>
                  )}
                </div>
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
