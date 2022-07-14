import moment from "moment";
import { useState } from "react";
import { useCart } from "@/lib/cartState";

import toast from "react-hot-toast";
import OrderSlugItem from "./OrderSlugItem";

export default function OrderList({ orders }) {
  const { cart, setCart, emptyCart } = useCart();
  const [openOrders, setOpenOrders] = useState(false);

  return (
    <div className="flex w-full">
      {orders.map((order) => {
        const items = order.line_items;
        const entries = Object.entries(items);
        const firstItem = Object.values(entries[0]);
        const last3 = order.id.slice(0, 3);
        const leading = firstItem[1].item.name;
        let quantity = 0;
        items.forEach((item) => {
          quantity += item.quantity;
        });

        let additionals = quantity - 1;

        const handleOpen = () => {
          setOpenOrders(!openOrders);
        };

        function reorderItems() {
          if (cart.length > 0) {
            emptyCart();
          }
          setCart(items);
          toast.success("Added to your order!");
          // router.push("/checkout");
        }
        return (
          <div
            className="flex items-center rounded-2xl mb-4 p-4 shadow-lg"
            key={order.id}
          >
            <div className="space-y-1">
              <div className="flex  justify-between">
                <div className="flex flex-col">
                  <p>
                    <span className="text-gray-600">
                      {moment(order.ordered_at).format("MM/DD/YY, h:mm A")}
                    </span>
                  </p>
                  <p>Order #{last3}</p>
                  <p className="font-bold">
                    {quantity === 1 ? (
                      <>
                        {quantity} {leading}
                      </>
                    ) : (
                      <>
                        {leading} + {additionals} Items
                      </>
                    )}
                  </p>{" "}
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => reorderItems()}
                    className="btn btn-outline "
                  >
                    Reorder
                  </button>
                </div>
              </div>
              <div
                tabIndex="0"
                className="collapse collapse-arrow border border-base-300 rounded-box"
              >
                <div className="collapse-title">Details</div>
                <div className="collapse-content">
                  {items.map((item, i) => (
                    <OrderSlugItem key={i} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
