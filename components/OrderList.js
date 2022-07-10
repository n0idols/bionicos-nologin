import moment from "moment";
import { useState } from "react";
import { useCart } from "@/lib/cartState";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import OrderSlugItem from "./OrderSlugItem";

export default function OrderList({ orders }) {
  // const card = `bg-white shadow-md flex justify-between my-8 p-4 rounded-lg space-y-2`;
  const { cart, setCart, emptyCart } = useCart();
  const router = useRouter();

  const [openOrders, setOpenOrders] = useState(false);

  return (
    <div>
      {orders.map((order) => {
        const items = order.line_items;
        const entries = Object.entries(items);
        const firstItem = Object.values(entries[0]);
        const last3 = order.id.slice(0, 3);
        const [selectedOrder, setSelectedOrder] = useState(order);
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
            className="flex justify-between  items-center rounded-2xl  mb-4 p-4 bg-white shadow-lg"
            key={order.id}
          >
            <div className=" w-96 ">
              <p>
                <span className="text-gray-600">
                  {moment(order.ordered_at).format("MM/DD/YY, h:mm A")}
                </span>
              </p>
              <p>Order #{last3}</p>
              <p>
                {quantity === 1 ? (
                  <>
                    {quantity} {leading}
                  </>
                ) : (
                  <>
                    {leading} + {additionals} Items
                  </>
                )}
              </p>
              <div
                tabindex="0"
                class="collapse collapse-arrow border border-base-300 rounded-box"
              >
                <div class="collapse-title">Details</div>
                <div class="collapse-content">
                  {items.map((item, i) => (
                    <OrderSlugItem key={i} item={item} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => reorderItems()}
                className="btn btn-outline btn-block"
              >
                Reorder
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
