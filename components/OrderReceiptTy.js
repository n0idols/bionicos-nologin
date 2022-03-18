import {
  supabaseClient,
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import Section from "@/components/Section";
import getStatus from "@/lib/getStatus";
import moment from "moment";
import formatMoney from "@/lib/formatMoney";
import parseCookies from "@/lib/cookie";
import Layout from "@/components/Layout";
import OrderItem from "@/components/OrderItem";
import { useEffect, useState } from "react";
import Loading from "@/components/icons/Loading";
import OrderSlugItem from "@/components/OrderSlugItem";
export default function OrderReceipt({ pedido }) {
  const {
    id,
    line_items,
    subtotal,
    tax,
    total,
    coupon,
    notes,
    ordered_at,
    orderstatus,
    username,
  } = pedido;
  return (
    <div className="receipt-paper" key={id}>
      <p className="">
        {moment(ordered_at).format("MMMM Do YYYY")}

        <span className="font-bold ml-1">@</span>

        {moment(ordered_at).format(" h:mm:ss a")}
      </p>

      <h1>Your order</h1>
      <div>
        <small>Status:</small>
        <span className={getStatus(orderstatus)}>{orderstatus}</span>
      </div>
      <div className="rounded-lg my-2">
        {line_items.map((item, i) => {
          return <OrderSlugItem key={i} item={item} />;
        })}

        <div className="flex flex-col pt-4">
          <h2 className="my-4">
            Notes:
            <span className="font-light"> {notes?.slice(1, -1)}</span>
          </h2>
        </div>

        <div className=" p-2 tracking-wide flex justify-between">
          <div>
            <h6>Subtotal</h6>
          </div>
          <div>
            <h6>{formatMoney(subtotal)}</h6>
          </div>
        </div>
        <hr />

        <div className=" p-2 tracking-wide flex justify-between">
          <div>
            <h6>Tax</h6>
          </div>
          <div>
            <h6>{formatMoney(tax)}</h6>
          </div>
        </div>
        <hr />
        <div className=" p-2 tracking-wide flex justify-between">
          <div>
            <h6 className="font-bold">Total</h6>
          </div>
          <div>
            <h6 className="font-bold">{formatMoney(total)}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
