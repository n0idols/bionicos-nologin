import { useState } from "react";
import { useCart } from "@/lib/cartState";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";
import Image from "next/image";
import Modal from "@/components/Modal";
import { buildUrl } from "cloudinary-build-url";
import formatMoney from "@/lib/formatMoney";
import toast from "react-hot-toast";

import { NextSeo } from "next-seo";

export default function SpecialsMenu({ specials }) {
  const d = new Date();
  const da = d.getDay();
  const day = da.toString();
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modObj, setModObj] = useState({});

  function selectMod(modGroupId, id, name, price) {
    modObj[modGroupId] = { modifier: { id }, amount: price, name };
  }
  function resetMod() {
    setModObj({});
  }
  function addSpecialToCart(e) {
    e.preventDefault();
    const item = specials.find((special) => special.id === day);
    addToCart(
      { id: item.id, name: `${item.day} Special`, price: item.price },
      Object.values(modObj)
    );

    setIsModalOpen(false);
    toast.success(`Added ${item.day} Special`);
  }
  const active = `text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent-focus-focus`;
  const title = `${process.env.NEXT_PUBLIC_SITE_TITLE} - Specials Menu`;
  const description = `Browse our daily special. Each special comes with a Large Agua Fresca.`;

  return (
    <>
      <NextSeo title={title} description={description} />

      <div className="max-w-7xl mx-auto px-4">
        <div className="md:py-8 py-2">
          <h1 className="grad-text">Daily Specials</h1>
          <p className="text-center md:text-xl my-4">
            Each special comes with a
            <span className="text-primary font-bold"> Large Agua Fresca</span>
          </p>
        </div>{" "}
        {day === "6" ? (
          <h1 className="text-center">
            {" "}
            Please come back during the week, we do not offer any specials on
            the weekend.
          </h1>
        ) : (
          <></>
        )}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 justify-center mx-auto items-center">
          {specials.map((special) => {
            const url = buildUrl(special.image.hash, {
              cloud: {
                cloudName: "swdb",
              },
            });
            const urlBlurred = buildUrl(special.image.hash, {
              cloud: {
                cloudName: "swdb",
              },
              transformations: {
                effect: "blur:1000",
                quality: 1,
              },
            });
            const urlCustom = buildUrl(special.image.hash, {
              cloud: {
                cloudName: "swdb",
              },
              transformations: {
                effect: {
                  name: "cartoonify:20",
                },
              },
            });
            return (
              <div
                className={
                  day === special.id
                    ? "card p-4 bg-primary shadow-xl"
                    : "card p-4 bg-white opacity-50"
                }
                key={special.id}
              >
                {special.image ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={url}
                      layout="fill"
                      objectFit="cover"
                      alt={special.product.title}
                    />
                  </div>
                ) : (
                  <>hi</>
                )}
                <div className="flex flex-col justify-center items-center rounded-2xl">
                  <span
                    className={
                      day === special.id
                        ? "px-2 m-2 rounded-2xl uppercase text-white"
                        : ""
                    }
                  >
                    {special.day}
                  </span>
                  <h1 className="md:text-xl">
                    <span className={day === special.id ? " text-white" : ""}>
                      {special.product.title}
                    </span>
                  </h1>
                  <div className="my-2 space-y-2">
                    <p className={day === special.id ? " text-white" : ""}>
                      with a {special.side}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={
                        day === special.id ? "text-white font-bold text-xl" : ""
                      }
                    >
                      {formatMoney(special.price)}
                    </p>
                    <div className="mt-4">
                      {day === special.id ? (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="order-btn"
                        >
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
                <Modal
                  show={isModalOpen && special.id === day}
                  onClose={() => setIsModalOpen(false)}
                  title={`${special.day}'s Special`}
                >
                  <div className="min-h-[200px] flex flex-col justify-between">
                    <div className="relative h-64 w-full">
                      {special.image && (
                        <Image
                          src={special.image.url}
                          layout="fill"
                          alt={special.title}
                          objectFit="cover"
                          className=""
                        />
                      )}
                    </div>

                    <div className="px-4 pt-4">
                      <h1>{special.product.title}</h1>
                      {special.product && (
                        <p className="my-2">{special.product.description}</p>
                      )}

                      <p className="text-sm italic">with a {special.side}</p>
                      <hr className="my-2" />
                      <form onSubmit={addSpecialToCart} className="py-2">
                        {special.product.modifiers?.map((group, i) => (
                          <div key={i} className="mb-2">
                            <div className="">
                              <h2>{group.name}</h2>
                              {group.required ? (
                                <div>
                                  <div className="badge badge-primary rounded-full">
                                    Required
                                  </div>
                                  {group.mod.map((m, i) => (
                                    <div key={i}>
                                      <div className="flex items-center">
                                        <label
                                          htmlFor={m.id}
                                          className="cursor-pointer label text-sm"
                                        >
                                          <input
                                            required
                                            type="radio"
                                            className="radio radio-primary radio-sm mr-2 "
                                            name={group.name}
                                            id={m.id}
                                            onChange={() =>
                                              selectMod(
                                                group.id,
                                                m.id,
                                                m.name,
                                                m.price
                                              )
                                            }
                                          />

                                          {m.name}

                                          {m.price === 0 ? (
                                            <div />
                                          ) : (
                                            <span className="ml-1 font-bold ">
                                              + {formatMoney(m.price)}
                                            </span>
                                          )}
                                        </label>
                                      </div>
                                      <hr />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div>
                                  <div className="badge badge-ghost rounded-full">
                                    Optional
                                  </div>
                                  {group.mod.map((m, i) => (
                                    <div key={i}>
                                      <div className="flex items-center">
                                        <label
                                          htmlFor={m.id}
                                          className="cursor-pointer label text-sm"
                                        >
                                          <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary checkbox-sm mr-2 "
                                            name={group.name}
                                            id={m.id}
                                            onClick={() =>
                                              selectMod(
                                                group.name,
                                                m.id,
                                                m.name,
                                                m.price
                                              )
                                            }
                                          />

                                          {m.name}

                                          {m.price === 0 ? (
                                            <div />
                                          ) : (
                                            <span className="ml-1 font-bold ">
                                              + {formatMoney(m.price)}
                                            </span>
                                          )}
                                        </label>
                                      </div>
                                      <hr />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* <input type="textarea" placeholder="Special Instructions" />  */}

                        {/* {#each Object.values(modObj) as mod}
					{mod.modifier.id + ' '}
					{/each} 

			 TODO Add price + modifiers 
			 {item.price}  */}

                        <button className="btn bg-brand-red glass text-white hover:bg-brand-redhover btn-block my-2">
                          Add To Order
                        </button>

                        {/* <button className="bg-primary-red py-2 text-white w-full rounded-lg">Add To Order</button>  */}
                      </form>
                    </div>
                  </div>
                </Modal>
              </div>
            );
          })}
        </div>
        {/* <pre>{JSON.stringify(specials, null, 2)}</pre> */}
      </div>
    </>
  );
}

export async function getStaticProps() {
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
      specials: data.specials,
    },
  };
}
