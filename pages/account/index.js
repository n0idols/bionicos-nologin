import { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/lib/authState";
import { supabase } from "@/lib/supabaseClient";
import moment from "moment";
import { useRouter } from "next/router";
import Section from "@/components/Section";
import Loading from "@/components/icons/Loading";

export default function AccountIndex({ user }) {
  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        setUserOrdersError(error);
      }
      setUserOrders(data);
    }
    fetchOrders();
  }, []);
  const [userOrders, setUserOrders] = useState(null);
  const [userOrdersError, setUserOrdersError] = useState(null);
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto pt-4">
      <p>
        Signed in as <span>{user.email}</span>
      </p>
      <h1 className="text-2xm">Your Order History</h1>
      <hr />
      <div className="grid grid-cols-2">
        {userOrders?.map((order) => (
          <div key={order.id} className="card lg:card-side card-bordered ">
            <div className="card-body">
              <span className="uppercase">Ordered On:</span>
              <h2 className="card-title">
                {moment(order.ordered_at).format(
                  "dddd, MMMM Do YYYY, h:mm:ss a"
                )}
              </h2>
              <span>
                Order Status:
                <div className="badge mx-2 uppercase  font-bold">
                  {order.type}
                </div>
              </span>
              <div className="card-actions">
                <button className="btn  btn-primary">Order Details</button>
              </div>
            </div>
          </div>
        ))}
        {userOrdersError && (
          <pre>{JSON.stringify(userOrdersError, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
    };
  }
  /* if user is present, do something with the user data here */

  return { props: { user } };
}
