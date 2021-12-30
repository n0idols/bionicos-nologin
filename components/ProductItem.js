import { useCart } from "@/lib/cartState";
import formatMoney from "@/lib/formatMoney";
import Modal from "./Modal";
import { useState } from "react";
import toast from "react-hot-toast";

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
      { id: item.id, name: item.name, price: item.price },
      Object.values(modObj)
    );
    resetMod();
    setIsModalOpen(false);
    toast.success(`Added ${item.name}`);
  }

  return (
    <div key={item.id}>
      <a
        onClick={() => setIsModalOpen(true)}
        className="card lg:card-side bordered bg-white cursor-pointer hover:shadow-lg transition ease-linear hover:-translate-y-1"
      >
        <div className="p-4 space-y-2">
          <h2 className="text-xl">{item.name}</h2>
          <p>{item.alternateName}</p>
          <p className="font-bold text-primary">{formatMoney(item.price)}</p>
        </div>
      </a>
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={item.name}
      >
        <div className="min-h-[200px] flex flex-col justify-between my-2">
          {item.alternateName && <p className="my-2">{item.alternateName}</p>}

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

            <button className="btn bg-brand-red glass text-white hover:bg-brand-redhover btn-block mt-auto">
              Add To Order {formatMoney(item.price)}
            </button>

            {/* <button className="bg-primary-red py-2 text-white w-full rounded-lg">Add To Order</button>  */}
          </form>
        </div>
      </Modal>
    </div>
  );
}
