import { useEffect, useState, useContext } from "react";
import AuthContext from "@/lib/authState";
import Section from "@/components/Section";
import parseCookies from "@/lib/cookie";
import formatMoney from "@/lib/formatMoney";
import Link from "next/link";
import moment from "moment";
import { Router } from "next/router";
import Layout from "@/components/Layout";
import { withSession } from "../../../../middlewares/session";

export default function Dashboard({ orders, user }) {
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
    <Layout title="Admin Orders">
      <Section>
        <div>
          <div>
            <>
              <h1 className="text-2xl my-2">Order History</h1>
              {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Customer</th>
                      <th>Order Status</th>
                    </tr>
                  </thead>
                  {orders ? (
                    <>
                      <tbody>
                        {orders.map((order, i) => {
                          const entries = Object.entries(order.line_items);
                          return (
                            <Link
                              href={`/account/admin/orders/${order.uuid}`}
                              key={order.id}
                            >
                              <tr className="hover cursor-pointer">
                                <th>{i + 1}</th>
                                <td>
                                  {" "}
                                  {moment(order.created_at).format(
                                    "MMMM Do YYYY, h:mm:ss a"
                                  )}
                                </td>
                                <td>{entries.length}</td>
                                <td>{formatMoney(order.total)}</td>
                                <td>{order.user.username}</td>
                                <td>
                                  <div className={getStatus(order.estado.id)}>
                                    {order.estado.title}
                                  </div>
                                </td>
                              </tr>
                            </Link>
                          );
                        })}
                      </tbody>
                    </>
                  ) : (
                    <></>
                  )}
                </table>
              </div>
            </>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export const getServerSideProps = withSession(async ({ req }) => {
  const user = req.session.get("user");
  // if not logged in, redirect to login page
  if (!user)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  // get users orders
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders?_sort=created_at:DESC`,

    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.strapiToken}`,
      },
    }
  );

  const orders = await res.json();
  return {
    props: {
      orders,
      user,
    },
  };
});
