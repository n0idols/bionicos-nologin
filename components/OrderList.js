import Link from "next/link";
import getStatus from "@/lib/getStatus";
import formatMoney from "@/lib/formatMoney";
import moment from "moment";

export default function OrderList({ orders }) {
  // const card = `bg-white shadow-md flex justify-between my-8 p-4 rounded-lg space-y-2`;
  return (
    <div>
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
        return (
          <div className="card mb-4 p-4 bg-white shadow-lg" key={order.id}>
            <div className="card-title">
              <h1>
                <span className="text-xl font-bold text-gray-600">
                  {moment(order.ordered_at).format("MMMM Do, h:mm A")}
                </span>
              </h1>
            </div>
            <span className={getStatus(order.orderstatus)}>
              {order.orderstatus}
            </span>

            <div className="my-4 text-xl">
              <h1>Order #{last3}</h1>

              <p>
                {quantity === 1 ? <>{quantity} Item</> : <>{quantity} Items</>}
              </p>
              <p>Total: {formatMoney(order.total)}</p>
            </div>

            <div className="card-actions">
              <Link href={`/orders/${order.id}`} key={order.id}>
                <a className="btn btn-outline btn-block ">View Details</a>
              </Link>
            </div>
          </div>
        );
        // return <pre>{JSON.stringify(order, null, 2)}</pre>;
      })}
    </div>
  );
}
