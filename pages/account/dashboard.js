import { useEffect, useState, useContext } from "react";
import AuthContext from "@/lib/authState";
import Section from "@/components/Section";
import parseCookies from "@/lib/cookie";
import { API_URL } from "@/config/index";

export default function Dashboard({ orders }) {
  const { user } = useContext(AuthContext);

  return (
    <Section>
      <div>
        <h1 className="text-2xl my-2">Your Order History</h1>
        {JSON.stringify(orders)}
        {/* 
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Amount</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((order) => (
                <Link href={`/account/orders/${order.id}`} key={order.id}>
                  <tr className="hover cursor-pointer">
                    <th>1</th>
                    <td>
                      {" "}
                      {moment(order.ordered_at).format(
                        "dddd, MMMM Do YYYY, h:mm:ss a"
                      )}
                    </td>
                    <td>$32.33</td>
                    <td
                      {" "}
                      <div className="badge mx-2 uppercase  font-bold">
                        {order.type}
                      </div>
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </Section>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);

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
