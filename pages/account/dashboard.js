import { useEffect, useState, useContext } from "react";
import AuthContext from "@/lib/authState";
import Section from "@/components/Section";
import parseCookies from "@/lib/cookie";
import { API_URL } from "@/config/index";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
export default function Dashboard({ orders }) {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user.role.type === "merchant") {
      router.push("/account/admin/orders");
    }
  }, []);

  function getStatus(i) {
    if (i === 1) {
      return "badge badge-accent mx-2 uppercase font-bold badge-lg";
    }
    if (i === 2) {
      return "badge badge-secondary mx-2 uppercase font-bold badge-lg";
    }
    if (i === 3) {
      return "badge badge-success mx-2 uppercase font-bold badge-lg";
    }
  }

  return (
    <Layout title="Dashboard">
      <Section>
        <div>
          <div>
            <>
              <h1 className="text-2xl my-2">Your Order History</h1>
              {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
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
                    {orders?.map((order, i) => {
                      const items = order.line_items;
                      const entries = Object.entries(items);

                      return (
                        <Link
                          href={`/account/orders/${order.uuid}`}
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
                            <td>$32.33</td>
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
                </table>
              </div>
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
