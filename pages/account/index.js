import { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/lib/authState";
import { supabase } from "@/lib/supabaseClient";
import moment from "moment";
import { useRouter } from "next/router";
import Section from "@/components/Section";
import Loading from "@/components/icons/Loading";

export default function AccountIndex({ user, data }) {
  const [userOrders, setUserOrders] = useState(null);
  const [userOrdersError, setUserOrdersError] = useState(null);
  const router = useRouter();
  const { authenticatedState } = useAuth();
  // async function fetchOrders() {
  //   const { data, error } = await supabase
  //     .from("orders")
  //     .select("*")
  //     .eq("user_id", user.id);
  //   if (error) {
  //     setUserOrdersError(error);
  //   }
  //   setUserOrders(data);
  // }

  return (
    <Section>
      <div>
        {" "}
        <p>{/* Signed in as <span>{user.email}</span> */}</p>
        <h1 className="text-2xl my-2">Your Order History</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {data?.map((order) => (
            <div
              key={order.id}
              className="card md:card-side bordered bordered bg-white cursor-pointer hover:shadow-lg transition ease-linear hover:-translate-y-1"
            >
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
                <div className="card-actions">Icons</div>
              </div>
            </div>
          ))}
          {userOrdersError && (
            <pre>{JSON.stringify(userOrdersError, null, 2)}</pre>
          )}
        </div>
      </div>
    </Section>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      props: {},
    };
  }
  /* if user is present, fetch their orders */
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id);
  return { props: { user, data } };
}
