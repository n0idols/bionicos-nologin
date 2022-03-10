import Link from "next/link";
import React from "react";
import OrderCard from "./OrderCard";
export default function OrdersCards({ orders, user }) {
  return (
    <>
      {orders.map((order) => {
        return <OrderCard order={order} user={user} key={order.id} />;
      })}
    </>
  );
}
