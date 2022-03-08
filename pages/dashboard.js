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

const Dashboard = ({ orders }) => {
  const router = useRouter();
  const { user, isLoading, accessToken, error } = useUser();

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
      <div className="w-full max-w-xl px-2">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Profile user={user} orders={orders} />
            <button onClick={handleLogOut}>Log out</button>
          </>
        )}
      </div>
    </div>
  );
};

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    // const { req } = ctx;
    // const { cart } = parseCookies(req);

    console.log(ctx);

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

export default Dashboard;
export { getServerSideProps };
