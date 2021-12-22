import { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/lib/authState";
import { supabase } from "@/lib/supabaseClient";

import { useRouter } from "next/router";

export default function AccountIndex({ user }) {
  // useEffect(() => {
  //   async function fetchOrders() {
  //     const { orders, error } = await supabase
  //       .from("orders")
  //       .select("*")
  //       .eq("user_id", user.id);

  //     setUserOrders(orders);
  //   }
  //   fetchOrders();
  // }, []);
  const { authenticatedState } = useAuth();
  const [userOrders, setUserOrders] = useState(null);
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div>
      {" "}
      hey {user.email}
      {authenticatedState === "authenticated" ? (
        <h1>logged in</h1>
      ) : (
        <h1>not logged in</h1>
      )}
      <button onClick={signOut} className="btn btn-warning">
        log out
      </button>
      Your Order History
      <pre>{JSON.stringify(userOrders, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>
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
