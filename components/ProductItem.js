import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
import Modal from "./Modal";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ProductItem({ item }) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modObj, setModObj] = useState({});

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
      Object.values(modObj)
    );
    resetMod();
    setIsModalOpen(false);
    toast.success(`Added ${item.title}`);
  }

  return (
    <div key={item.id}>
      <a
        onClick={() => setIsModalOpen(true)}
        className="flex cursor-pointer  w-full transition ease-linear hover:-translate-y-1 bg-gradient-to-br from-white to-gray-100  items-center"
      >
        <div className="relative h-24 w-24">
          {item.image && (
            <Image
              src={item.image.url}
              layout="fill"
              alt={item.title}
              objectFit="cover"
              className="rounded-t-md "
            />
          )}
        </div>
        <div className="space-y-2 p-2">
          <h2 className="text-xl">{item.title}</h2>
          <p>{item.description}</p>
          <p className="font-bold text-primary">${item.price}</p>
        </div>
      </a>
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={item.title}
      >
        <div className="min-h-[200px] flex flex-col justify-between">
          <div className="relative h-64 w-full">
            {item.image && (
              <Image
                src={item.image.url}
                layout="fill"
                alt={item.title}
                objectFit="cover"
                className=""
              />
            )}
          </div>
          {item.description && <p className="my-2">{item.description}</p>}
          {/* <pre>{JSON.stringify(item.modifers[0], null, 2)}</pre>} */}
          {item.modifers.map((mod) => mod.options)}
          <form onSubmit={addItemToCart} className="py-2">
            {item?.modifierGroups?.elements.map((group, index) => (
              <div key={index} className="mb-2">
                <div className="">
                  <h2>{group.name}</h2>
                  {group.minRequired ? (
                    <div>
                      <div className="badge badge-primary rounded-full">
                        Required
                      </div>
                      {group.modifiers.elements.map((mod, i) => (
                        <div key={i}>
                          <div className="flex items-center">
                            <label
                              htmlFor={mod.id}
                              className="cursor-pointer label text-sm"
                            >
                              <input
                                required
                                type="radio"
                                className="radio radio-primary radio-sm mr-2 "
                                name={group.id}
                                id={mod.id}
                                onClick={() =>
                                  selectMod(
                                    group.id,
                                    mod.id,
                                    mod.name,
                                    mod.price
                                  )
                                }
                              />

                              {mod.name}

                              {mod.price === 0 ? (
                                <div />
                              ) : (
                                <span className="ml-1 font-bold ">
                                  + {formatMoney(mod.price)}
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
                      {group.modifiers.elements.map((mod, i) => (
                        <div key={i}>
                          <div className="flex items-center">
                            <label
                              htmlFor={mod.id}
                              className="cursor-pointer label text-sm"
                            >
                              <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-sm mr-2 "
                                name={group.id}
                                id={mod.id}
                                onClick={() =>
                                  selectMod(
                                    group.id,
                                    mod.id,
                                    mod.name,
                                    mod.price
                                  )
                                }
                              />

                              {mod.name}

                              {mod.price === 0 ? (
                                <div />
                              ) : (
                                <span className="ml-1 font-bold ">
                                  + {formatMoney(mod.price)}
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
            <div className="flex justify-center">
              <button className="btn bg-accent border-none text-white hover:bg-accent-focus  mt-auto">
                Add To Order ${item.price}
              </button>
            </div>

            {/* <button className="bg-primary-red py-2 text-white w-full rounded-lg">Add To Order</button>  */}
          </form>
        </div>
      </Modal>
    </div>
  );
}
