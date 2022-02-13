import { useEffect, useState, useContext } from "react";
import AuthContext from "@/lib/authState";
import Section from "@/components/Section";
import parseCookies from "@/lib/cookie";

import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Dashboard({ orders }) {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  // const { loading, error, data } = useQuery(ORDERS);
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>error :(</p>;
  // console.log(data);

  useEffect(() => {
    if (user?.role.type === "merchant") {
      router.push("/account/admin/orders");
    }
  }, []);
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
    <Layout title="Dashboard">
      <div className="max-w-xl p-2 mx-auto">
        <h1>Hello, {user ? user.username : ""}</h1>

        {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
        <button className="btn btn-ghost" onClick={logout}>
          Logout
        </button>

        {orders && <h1>Your Order History</h1>}

        {orders?.map((order, i) => {
          const items = order.line_items;
          const entries = Object.entries(items);
          let quantity = 0;
          items.forEach((item) => {
            quantity += item.quantity;
          });
          return (
            <div
              key={i}
              className="bg-white shadow-md flex flex-col my-8 p-4 rounded-lg space-y-2"
            >
              <span className="text-xl font-bold text-gray-600">
                {moment(order.created_at).format("MMMM Do, h:mm A")}
              </span>
              <div className={getStatus(order.estado.id)}>
                {order.estado.title}
              </div>
              <h4>Items: {quantity}</h4>
              <Link href={`/account/orders/${order.uuid}`} key={order.id}>
                <a className="btn btn-outline mx-4">View Details</a>
              </Link>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const { token, cart } = parseCookies(req);

  // if (cart.length > 1) {
  //   return {
  //     props: {},
  //     redirect: { destination: "/checkout" },
  //   };
  // }
  if (!token) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  } else {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/me?_sort=date:DESC`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const orders = await res.json();
    return {
      props: {
        orders,
        token,
      },
    };
  }
}
