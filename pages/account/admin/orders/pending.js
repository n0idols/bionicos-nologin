import { useEffect, useState, useContext } from "react";
import AuthContext from "@/lib/authState";
import Section from "@/components/Section";
import parseCookies from "@/lib/cookie";
import { API_URL } from "@/config/index";
import Link from "next/link";
import moment from "moment";
import { Router } from "next/router";
import Layout from "@/components/Layout";

export default function Dashboard({ orders }) {
  const { user } = useContext(AuthContext);
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
  }

  return (
    <Layout title="Pending Orders">
      <Section>
        <div>
          <div>
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
            <>
              {orders.length === 0 ? (
                <h1>There are no pending orders</h1>
              ) : (
                <div className="overflow-x-auto">
                  <h1 className="text-2xl my-2">Pending Orders</h1>
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>User</th>
                        <th>Order Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => {
                        const entries = Object.entries(order.line_items);
                        return (
                          <Link
                            href={`/account/admin/orders/${order.uuid}`}
                            key={order.id}
                          >
                            <tr className="hover cursor-pointer">
                              <th>{index + 1}</th>
                              <td>
                                {" "}
                                {moment(order.created_at).format(
                                  "MMMM Do YYYY, h:mm:ss a"
                                )}
                              </td>
                              <td>{entries.length}</td>
                              <td>$32.33</td>
                              <td>{order.user.username}</td>
                              <td>
                                <div className={getStatus(1)}>pending</div>
                              </td>
                            </tr>
                          </Link>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          </div>
        </div>
      </Section>
    </Layout>
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
    const res = await fetch(`${API_URL}/orders?estado.id=1`, {
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
