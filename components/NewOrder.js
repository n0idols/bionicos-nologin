import React from "react";
import moment from "moment";
import Link from "next/link";
import OrderItem from "./OrderItem";
import formatMoney from "@/lib/formatMoney";
import getStatus from "@/lib/getStatus";

export default function NewOrder({ order }) {
  const items = order?.line_items;
  const entries = Object.entries(items);

  return (
    <div className="max-w-2xl my-4 mx-auto py-8 px-4 bg-white rounded-xl shadow-xl">
      {JSON.stringify(order)}
    </div>
  );
}
