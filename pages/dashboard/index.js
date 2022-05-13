import React, { MouseEventHandler, useEffect, useState } from "react";

import useSWR from "swr";
import {
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";

import Profile from "@/components/Profile";
import Layout from "@/components/Layout";

// const fetcher = async () => {
//   const response = await fetch("/api/user");
//   const data = await response.json();
//   return data;
// };
const Dashboard = ({ orders, user, accessToken }) => {
  // const { data, error } = useSWR("dashboard", fetcher);

  return (
    <Layout title="Profile">
      <div className="flex items-center justify-between">
        <Profile user={user} orders={orders} />
      </div>
    </Layout>
  );
};

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    // const { req } = ctx;
    // const { cart } = parseCookies(req);
    const { user } = await getUser(ctx);

    const { data: orders, error } = await supabaseServerClient(ctx)
      .from("orders")
      .select("*")
      .order("ordered_at", { ascending: false });

    return {
      props: {
        user,
        orders,
      },
    };
  },
});

export default Dashboard;
export { getServerSideProps };
