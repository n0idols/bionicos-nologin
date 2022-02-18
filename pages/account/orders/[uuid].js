import { useState, useEffect } from "react";
import Section from "@/components/Section";

import moment from "moment";
import formatMoney from "@/lib/formatMoney";
import parseCookies from "@/lib/cookie";
import Layout from "@/components/Layout";
import OrderItem from "@/components/OrderItem";
import { withSession } from "../../../middlewares/session";

export default function OrderSlug({ orderId }) {
  console.log("hello");
  const order = orderId[0];
  const items = order.line_items;

  const entries = Object.entries(items);
  console.log(orderId);
  function getStatus(i) {
    if (i === 1) {
      return "badge badge-accent mx-2 uppercase font-bold";
    }
    if (i === 2) {
      return "badge badge-secondary mx-2 uppercase font-bold";
    }
    if (i === 3) {
      return "badge badge-success mx-2 uppercase font-bold";
    }
    if (i === 4) {
      return "badge badge-primary mx-2 uppercase font-bold";
    }
  }
  return (
    <Layout title={order.uuid}>
      <Section>
        {/* <pre>{JSON.stringify(orderId, null, 2)}</pre> */}
        <div className="max-w-2xl my-4 mx-auto py-8 px-4 bg-white rounded-xl shadow-xl">
          <p className="">{moment(order.created_at).format("MMMM Do YYYY")}</p>
          <p>
            <span className="font-bold">Placed at:</span>

            {moment(order.created_at).format(" h:mm:ss a")}
          </p>

          <h1>Your order</h1>
          <div>
            <small>Status:</small>
            <span className={getStatus(order.estado.id)}>
              {order.estado.title}
            </span>
          </div>
          <div className="rounded-lg my-2">
            {entries.map((item, i) => {
              const theItem = item[1];

              return <OrderItem key={i} item={item} />;
            })}

            <div className="flex flex-col pt-4">
              <h2 className="my-4">
                Notes: <span className="font-light">{order.notes}</span>
              </h2>
            </div>

            <div className=" p-2 tracking-wide flex justify-between">
              <div>
                <h6>Subtotal</h6>
              </div>
              <div>
                <h6>{formatMoney(order.subtotal)}</h6>
              </div>
            </div>
            <hr />

            <div className=" p-2 tracking-wide flex justify-between">
              <div>
                <h6>Tax</h6>
              </div>
              <div>
                <h6>{formatMoney(order.tax)}</h6>
              </div>
            </div>
            <hr />
            <div className=" p-2 tracking-wide flex justify-between">
              <div>
                <h6 className="font-bold">Total</h6>
              </div>
              <div>
                <h6 className="font-bold">{formatMoney(order.total)}</h6>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export const getServerSideProps = withSession(
  async ({ req, query: { uuid } }) => {
    const user = req.session.get("user");
    if (!user)
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders?uuid=${uuid}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.strapiToken}`,
        },
      }
    );

    const orderId = await res.json();

    return {
      props: {
        orderId,
      },
    };
  }
);
