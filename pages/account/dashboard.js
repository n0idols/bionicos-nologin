import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import axios from "axios";
import { withSession } from "@/middlewares/session";
import getStatus from "@/lib/getStatus";

export default function Dashboard({ orders, user }) {
  // useEffect(() => {
  //   if (user?.role.type === "merchant") {
  //     router.push("/account/admin/orders");
  //   }
  // }, []);
  const router = useRouter();

  const onLogout = (e) => {
    e.preventDefault();
    axios.post("/api/logout").then(() => {
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
  // if not user is merchant, redirect to orders page
  if (user.role.type === "merchant")
    return {
      redirect: {
        destination: "/account/admin/orders",
        permanent: false,
      },
    };
  // get users orders
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/me?_sort=date:DESC`,
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
