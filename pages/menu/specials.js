import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";

export default function SpecialsMenu({ specials }) {
  const d = new Date();
  const da = d.getDay();
  const day = da.toString();

  const active = `text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent-focus-focus`;

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-9">
      <h1 className="text-center lg:text-4xl ">Weekly Specials</h1>
      <p className="text-center text-xl my-4">
        Each special comes with a
        <span className="text-primary font-bold"> Large Agua Fresca</span>
      </p>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-center mx-auto items-center">
        {specials.map((special) => (
          <div
            className={
              day === special.id
                ? "card p-4 bg-base-300 shadow-xl "
                : "card p-4 bg-white opacity-50"
            }
            key={special.id}
          >
            <div className="flex flex-col justify-center items-center rounded-2xl">
              <span
                className={
                  day === special.id ? "px-2 m-2 rounded-2xl uppercase" : ""
                }
              >
                {special.day}
              </span>
              <h1 className="md:text-xl">
                <span className={day === special.id ? " text-gray-500" : ""}>
                  {special.product.title}
                </span>
              </h1>
              <div className="my-2 space-y-2">
                <p className={day === special.id ? " text-gray-500" : ""}>
                  with a {special.side}
                </p>
              </div>
              <div className="text-center">
                <p
                  className={
                    day === special.id ? " text-gray-500 font-bold text-xl" : ""
                  }
                >
                  ${special.price}
                </p>
                <div className="mt-4">
                  {day === special.id ? (
                    <button className="btn bg-brand-red glass text-white hover:bg-brand-redhover btn-block mt-auto">
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
