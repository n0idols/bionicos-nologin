import { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/lib/authState";
import { supabase } from "@/lib/supabaseClient";
import moment from "moment";
import { useRouter } from "next/router";

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
  const { authenticatedState } = useAuth();
  const [userOrders, setUserOrders] = useState(null);
  const [userOrdersError, setUserOrdersError] = useState(null);
  const router = useRouter();

  return (
    <div>
      {" "}
      hey {user.email}
      Your Order History
      {userOrders?.map((order) => (
        <div key={order.id} className="card lg:card-side card-bordered">
          <div className="card-body">
            <span className="uppercase">Ordered On:</span>
            <h2 className="card-title">
              {moment(order.ordered_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </h2>
            <span>
              Order Status:
              <div class="badge mx-2 uppercase">{order.type}</div>
            </span>
            <div className="card-actions">
              <button className="btn  btn-primary">Order Details</button>
            </div>
          </div>
        </div>
      ))}
      wtf happen?
      <pre>{JSON.stringify(userOrdersError, null, 2)}</pre>
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
