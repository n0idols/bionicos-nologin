import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import axios from "axios";
import { withSession } from "@/middlewares/session";
import getStatus from "@/lib/getStatus";
import { useCart } from "@/lib/cartState";
import { useEffect, useState } from "react";

export default function Dashboard({ user }) {
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    if (user) {
      const res = axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/me?_sort=date:DESC`,
        {
          headers: {
            Authorization: `Bearer ${user.strapiToken}`,
          },
        }
      );

      setOrders(res);
    } else {
      return;
    }
  }, [user]);
  const router = useRouter();
  const { emptyCart } = useCart();

  const onLogout = (e) => {
    e.preventDefault();
    axios.post("/api/logout").then(() => {
      emptyCart();

      router.push("/");
    });
  };

  return (
    <Layout title="Dashboard">
      <div className="max-w-xl p-2 mx-auto">
        <div className="flex justify-between">
          <h1>Hello, {user ? user.username : ""}</h1>

          <button className="btn btn-ghost" onClick={onLogout}>
            Logout
          </button>
        </div>

        {orders.length > 0 ? (
          <>
            <h1>Your Order History</h1>
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
          </>
        ) : (
          <>
            <p>Your order history will be displayed here</p>
            <Link href="/menu">
              <a className="btn btn-primary mt-2 btn-sm btn-outline">
                Go to menu
              </a>
            </Link>
          </>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps = withSession(async (context) => {
  const { req } = context;
  return {
    props: {
      user: req.session.get("user") || null,
    },
  };
});
