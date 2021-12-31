import { useState, useEffect } from "react";
import Section from "@/components/Section";
import { API_URL } from "@/config/index";
import moment from "moment";
import formatMoney from "@/lib/formatMoney";
import parseCookies from "@/lib/cookie";
import { useRouter } from "next/router";

export default function OrderSlug({ token, orderId, statuses }) {
  const { query } = useRouter();
  console.log(orderId);
  const order = orderId[0];
  const items = order.line_items;
  const entries = Object.entries(items);

  useEffect(() => {}, []);

  async function markProgress() {
    await fetch(`${API_URL}/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        estado: {
          id: 2,
        },
      }),
    });
    window.location.reload();
  }
  async function markCompleted() {
    await fetch(`${API_URL}/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        estado: {
          id: 3,
        },
      }),
    });
    window.location.reload();
  }

  return (
    <>
      <Section>
        {/* <pre>{JSON.stringify(orderId, null, 2)}</pre> */}
        <div className="max-w-2xl mx-auto py-8 px-4">
          <h2 className="">
            {moment(order.created_at).format("MMMM Do YYYY, h:mm:ss a")}
          </h2>

          <h1>The order</h1>

          <span className="badge uppercase badge-lg mb-8">
            {order.estado.title}
          </span>

          <div className="max-w-xs space-y-8">
            <button
              className="btn btn-secondary btn-block"
              onClick={markProgress}
            >
              Mark order as in progress
            </button>
            <button
              className="btn btn-primary  btn-block"
              onClick={markCompleted}
            >
              Mark order as completed
            </button>
          </div>

          <pre>{JSON.stringify(order.estado, null, 2)}</pre>
          <div className="rounded-lg p-4 my-2">
            {entries.map((item) => {
              const theItem = item[1];

              function calcItemNetPrice() {
                let sum = 0;
                theItem.modifications?.forEach((modification) => {
                  sum += modification.amount;
                });
                sum += theItem.item.price;
                return formatMoney(sum);
              }
              return (
                <div key={item.id}>
                  <div className="flex justify-between items-center m-4">
                    <div className="flex items-center">
                      <div className="rounded-full bg-black h-8 w-8 flex items-center justify-center text-white">
                        <h6>1x</h6>
                      </div>
                      <div className="ml-2">
                        <h4>{theItem.item.name}</h4>
                        {theItem.modifications?.map((modification, i) => (
                          <h6 key={i} className="text-gray-600 m-0 p-0">
                            {modification.name} +{" "}
                            {formatMoney(modification.amount)}
                          </h6>
                        ))}
                        <h4 className="mt-1">{calcItemNetPrice()}</h4>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
            <div className="card-actions">Total:</div>
          </div>
        </div>
        <div className="card  bordered bg-white cursor-pointer hover:shadow-lg transition ease-linear hover:-translate-y-1">
          <h1></h1>
        </div>
      </Section>
    </>
  );
}

export async function getServerSideProps({ req, query: { uuid } }) {
  const { token } = parseCookies(req);
  if (!token) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  }

  const res = await fetch(`${API_URL}/orders?uuid=${uuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const orderId = await res.json();

  const statusRes = await fetch(`${API_URL}/estados`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const statuses = await statusRes.json();

  return {
    props: {
      token,
      orderId,
      statuses,
    },
  };
}
// export default function OrderSlug() {
//   return <div>hey</div>;
// }
