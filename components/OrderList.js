import moment from "moment";
import Link from "next/link";
import getStatus from "@/lib/getStatus";
import formatMoney from "@/lib/formatMoney";

export default function OrderList({ orders }) {
  const card = `bg-white shadow-md flex flex-col my-8 p-4 rounded-lg space-y-2`;
  return (
    <div>
      <h1 className="uppercase">Your order history</h1>
      {orders.map((order) => {
        const items = order.line_items;
        const entries = Object.entries(items);
        const firstItem = Object.values(entries[0]);

        const leading = firstItem[1].item.name;
        let quantity = 0;
        items.forEach((item) => {
          quantity += item.quantity;
        });
        return (
          <div className={card} key={order.id}>
            <span className="text-xl font-bold text-gray-600">
              {moment(order.ordered_at).format("MMMM Do, h:mm A")}
            </span>
            <h1>
              <span className={getStatus(order.type)}>{order.type}</span>
            </h1>
            <p>
              {quantity === 1 ? <>{quantity} Item</> : <>{quantity} Items</>}
              {/* {leading} + {quantity - 1} more */}
            </p>

            <p>{formatMoney(order.total)}</p>
            <Link href={`/orders/${order.id}`} key={order.id}>
              <a className="btn btn-outline mx-4">View Details</a>
            </Link>
          </div>
        );
        // return <pre>{JSON.stringify(order, null, 2)}</pre>;
      })}
    </div>
  );
}
