import { useState } from "react";

import buildUrl from "cloudinary-build-url";
import Image from "next/image";
import Modal from "@/components/Modal";
import React from "react";
import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
import toast from "react-hot-toast";
import {
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
export default function DaySpecial({ special }) {
  const {
    day,
    product,
    side,
    price,
    image: { hash },
  } = special;
  const url = buildUrl(hash, {
    cloud: {
      cloudName: "swdb",
    },
  });
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modObj, setModObj] = useState({});
  const [quantity, setQuantity] = useState(1);

  function selectMod(modGroupId, id, name, price) {
    modObj[modGroupId] = { modifier: { id }, amount: price, name };
  }
  function resetMod() {
    setModObj({});
  }
  function addSpecialToCart(e) {
    e.preventDefault();
    const item = special;
    addToCart(
      { id: item.id, name: item.title, price: item.price },
      Object.values(modObj),
      parseInt(quantity)
    );

    setIsModalOpen(false);
    toast.success(`Added ${item.day} Special`);
  }
  const icon = ``;

  return (
    <>
      <div className="max-w-md mx-auto  text-center px-4 pt-10">
        <h1 className="grad-text">{day} Special</h1>
        <div className="card shadow-xl bg-white">
          <div className="relative w-full h-60">
            <Image
              src={url}
              layout="fill"
              objectFit="cover"
              alt={product.title}
            />
          </div>

          <div className="p-4">
            <h1 className="text-gray-600">{product.title}</h1>

            <p className="mb-4">{product.description}</p>
            <p className="mb-4">Includes: {side}</p>

            <button className="order-btn" onClick={() => setIsModalOpen(true)}>
              Add To Order
            </button>
          </div>
        </div>
      </div>

      <Modal
        show={isModalOpen}
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
              <div className="flex  items-center my-4">
                <h2 className="">Quantity</h2>

                <div className="flex border border-primary rounded-full mx-4">
                  <button
                    disabled={quantity < 2}
                    type="button"
                    onClick={() => setQuantity(quantity - 1)}
                    className="btn btn-sm btn-ghost disabled:btn-ghost"
                  >
                    <AiOutlineMinus className={icon} />
                  </button>

                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    disabled
                    // onChange={(e) => {
                    //   const newQuantity = e.currentTarget.value;
                    //   if (newQuantity > 0) setQuantity(newQuantity);
                    // }}
                    className="spin-button-none w-[2.5rem] text-center rounded-md text-xl font-bold bg-white"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn btn-primary btn-sm text-white"
                  >
                    <AiOutlinePlus className={icon} />
                  </button>
                </div>
              </div>
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
                                    selectMod(group.name, m.id, m.name, m.price)
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
                                    selectMod(group.id, m.id, m.name, m.price)
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
    </>
  );
}
