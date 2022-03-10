import React, { MouseEventHandler, useEffect, useState } from "react";
import { useUser, logout } from "@supabase/supabase-auth-helpers/react";
import {
  supabaseClient,
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";
import Loading from "../components/icons/Loading";
import Profile from "../components/Profile";
import OrdersTable from "@/components/OrdersTable";
import OrderList from "../components/OrderList";

const Admin = ({ orders }) => {
  const router = useRouter();
  const { user, isLoading, accessToken, error } = useUser();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(false);
  const [admin, setIsAdmin] = useState(null);

  //   useEffect(() => {
  //     if (orders) {
  //       const subscription = supabaseClient
  //         .from("orders")
  //         .on("*", (payload) => {
  //           alert("NEW ORDER");
  //           setOrderStatus({ ...orders, ...payload.new });
  //         })
  //         .subscribe();
  //       return () => {
  //         supabaseClient.removeSubscription(orders);
  //       };
  //     }
  //   }, [user]);

  const handleLogOut = async (e) => {
    e.preventDefault();
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert(JSON.stringify(error));
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full px-2">
        {loading ? (
          <Loading />
        ) : (
          <>
            <OrdersTable orders={orders} />
          </>
        )}
      </div>
      {/* <Profile user={user} orders={orders} /> */}
      <button onClick={handleLogOut}>Log out</button>
    </div>
  );
};

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    // const { req } = ctx;
    // const { cart } = parseCookies(req);

    const { data: orders, error } = await supabaseServerClient(ctx)
      .from("orders")
      .select("*")
      .order("ordered_at", { ascending: false });

    return {
      props: {
        orders,
        error,
      },
    };
  },
});

export default Admin;
export { getServerSideProps };
