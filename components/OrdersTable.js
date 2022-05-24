import Link from "next/link";
import React from "react";
import moment from "moment";
import formatMoney from "@/lib/formatMoney";
import getStatus from "@/lib/getStatus";
export default function OrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date and Time</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => {
            const entries = Object.entries(order.line_items);
            const orderId = order.id;
            const last3 = orderId.slice(0, 3);
            const { orderstatus } = order;
            return (
              <Link
                href={`/account/admin/orders/${order.id}`}
                key={order.id}
                passHref
              >
                <tr className="hover cursor-pointer">
                  <th>{last3}</th>
                  <td>{moment(order.ordered_at).format("M/DD, h:mm:ss a")}</td>
                  <td>{order.username}</td>
                  <td>{entries.length}</td>
                  <td>{formatMoney(order.total)}</td>

                  <td>
                    <div className={getStatus(orderstatus)}>{orderstatus}</div>
                  </td>
                </tr>
              </Link>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
