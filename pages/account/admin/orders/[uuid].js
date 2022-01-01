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

  function getStatus(i) {
    if (i === 1) {
      return "badge badge-accent mx-2 uppercase font-bold badge-lg mb-8";
    }
    if (i === 2) {
      return "badge badge-secondary mx-2 uppercase font-bold badge-lg mb-8";
    }
    if (i === 3) {
      return "badge badge-success mx-2 uppercase font-bold badge-lg mb-8";
    }
  }

  useEffect(() => {}, []);

  async function markPending() {
    await fetch(`${API_URL}/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        estado: {
          id: 1,
        },
      }),
    });
    window.location.reload();
  }

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

          <h4>
            Currently:{" "}
            <span className={getStatus(order.estado.id)}>
              {order.estado.title}
            </span>
          </h4>

          <div className="dropdown">
            <div tabIndex="0" className="m-1 btn btn-success">
              Order Status
            </div>
            <ul
              tabIndex="0"
              className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 space-y-3"
            >
              <li>
                <button
                  className="btn btn-accent btn-block"
                  onClick={markPending}
                >
                  pending
                </button>
              </li>
              <li>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={markProgress}
                >
                  in progress
                </button>
              </li>
              <li>
                <button
                  className="btn btn-primary  btn-block"
                  onClick={markCompleted}
                >
                  completed
                </button>
              </li>
            </ul>
          </div>

          {/* <pre>{JSON.stringify(order.estado, null, 2)}</pre> */}
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
                <div key={item.id} className="border rounded-md my-4">
                  <div className="flex justify-between items-center m-4">
                    <div className="flex items-center">
                      <div className="rounded-full bg-base-300 h-8 w-8 flex items-center justify-center text-black">
                        <h6>1 x</h6>
                      </div>
                      <div className="ml-2">
                        <h1>{theItem.item.name}</h1>
                        {theItem.modifications?.map((modification, i) => (
                          <h6 key={i} className="text-gray-600 m-0 p-0">
                            {modification.name}
                            {/* {formatMoney(modification.amount)} */}
                          </h6>
                        ))}
                        {/* <h4 className="mt-1">{calcItemNetPrice()}</h4> */}
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
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
