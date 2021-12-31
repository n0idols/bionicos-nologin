import { useState } from "react";
import Section from "@/components/Section";
import { API_URL } from "@/config/index";
import moment from "moment";
import formatMoney from "@/lib/formatMoney";
import parseCookies from "@/lib/cookie";

export default function OrderSlug({ orderId }) {
  console.log(orderId);
  const order = orderId[0];
  const items = order.line_items;

  const entries = Object.entries(items);

  return (
    <>
      <Section>
        {/* <pre>{JSON.stringify(orderId, null, 2)}</pre> */}
        <div className="max-w-2xl mx-auto py-8 px-4">
          <h2 className="">
            {moment(order.created_at).format("MMMM Do YYYY, h:mm:ss a")}
          </h2>

          <h1>The order</h1>
          <span className="badge uppercase badge-lg">{order.estado.title}</span>
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

  return {
    props: {
      orderId,
    },
  };
}
// export default function OrderSlug() {
//   return <div>hey</div>;
// }
