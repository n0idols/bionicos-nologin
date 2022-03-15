import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
import Modal from "./Modal";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import Image from "next/image";
import { useRouter } from "next/router";
export default function MenuItem({ item, user }) {
  const router = useRouter();
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
  function addItemToCart(e) {
    e.preventDefault();

    addToCart(
      { id: item.id, name: item.title, price: item.price },
      Object.values(modObj),
      parseInt(quantity)
    );
    resetMod();
    setIsModalOpen(false);
    setQuantity(1);
    toast.success(`Added ${item.title}`);
  }

  const icon = ``;
  const card = ``;
  return (
    <div key={item.id}>
      {item.image ? (
        <a
          onClick={() => setIsModalOpen(true)}
          className="card grid grid-cols-[150px_1fr] w-full bordered bg-white cursor-pointer md:hover:shadow-lg transition ease-linear md:hover:-translate-y-1"
        >
          <div className="relative  h-40">
            <Image
              src={item.image.url}
              layout="fill"
              alt={item.title}
              objectFit="cover"
              className=" "
            />
          </div>

          <div className="p-4 space-y-1 flex flex-col justify-center">
            <h2 className="text-lg">
              {" "}
              {item.number && (
                <span className="font-light"> {item.number}. </span>
              )}
              {item.title}
            </h2>
            <p className="text-sm">{item.description}</p>
            <p className="font-bold text-primary">{formatMoney(item.price)}</p>
          </div>
        </a>
      ) : (
        <a
          onClick={() => setIsModalOpen(true)}
          className="card grid w-full bordered bg-white cursor-pointer md:hover:shadow-lg transition ease-linear md:hover:-translate-y-1"
        >
          <div className="p-4 space-y-1 flex flex-col justify-center">
            <h2 className="text-lg">
              {" "}
              {item.number && (
                <span className="font-light"> {item.number}. </span>
              )}
              {item.title}
            </h2>
            <p className="text-sm">{item.description}</p>
            <p className="font-bold text-primary">{formatMoney(item.price)}</p>
          </div>
        </a>
      )}

      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={item.number ? `${item.number}. ${item.title}` : `${item.title}`}
      >
        <div className="min-h-[200px] flex flex-col justify-between">
          {item.image && (
            <div className="relative h-64 w-full">
              <Image
                src={item.image.url}
                layout="fill"
                alt={item.title}
                objectFit="cover"
                className=""
              />
            </div>
          )}
          <div className="px-2 my-2">
            {item.description && <p className="my-2">{item.description}</p>}

            <form onSubmit={addItemToCart} className="py-2">
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
              {item.modifiers?.map((group, i) => (
                <div key={i} className="mb-2">
                  <div className="">
                    <h2>{group.name}</h2>
                    {group.required ? (
                      <div>
                        <div className="badge badge-primary rounded-full text-white">
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
                                  onChange={() => {
                                    selectMod(
                                      group.name,
                                      m.id,
                                      m.name,
                                      m.price
                                    );
                                  }}
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
                                  name={group.id}
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

              <button className="btn bg-brand-red glass text-white hover:bg-brand-redhover btn-block mt-auto">
                Add To Order
              </button>

              {/* <button className="bg-primary-red py-2 text-white w-full rounded-lg">Add To Order</button>  */}
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
