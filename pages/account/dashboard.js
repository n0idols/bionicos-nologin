import { useEffect, useState, useContext } from "react";
import AuthContext from "@/lib/authState";
import Section from "@/components/Section";
import parseCookies from "@/lib/cookie";
import { API_URL } from "@/config/index";
import Link from "next/link";
import moment from "moment";

export default function Dashboard({ orders }) {
  const { user } = useContext(AuthContext);

  return (
    <Section>
      <div>
        <h1 className="text-2xl my-2">Your Order History</h1>
        {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => {
                console.log(order.line_items);
                return (
                  <Link href={`/account/orders/${order.uuid}`} key={order.id}>
                    <tr className="hover cursor-pointer">
                      <th>1</th>
                      <td> {moment(order.created_at).format("MMM Do YY")}</td>
                      <td>Item titles go here</td>
                      <td>$32.33</td>
                      <td>
                        <div className="badge mx-2 uppercase font-bold">
                          {order.status}
                        </div>
                      </td>
                    </tr>
                  </Link>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);
  if (!token) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  } else {
    const res = await fetch(`${API_URL}/orders/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const orders = await res.json();
    return {
      props: {
        orders,
        token,
      },
    };
  }
}
