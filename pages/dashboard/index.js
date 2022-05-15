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
const Dashboard = ({ orders, user, accessToken, stripeCustomer }) => {
  // const { data, error } = useSWR("dashboard", fetcher);

  return (
    <Layout title="Profile">
      <div className="flex items-center justify-between">
        <Profile user={user} orders={orders} stripeCustomer={stripeCustomer} />
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

    const { data: orders, error: ordersError } = await supabaseServerClient(ctx)
      .from("orders")
      .select("*")
      .order("ordered_at", { ascending: false });

    const { data: stripeCustomer, error: customerError } =
      await supabaseServerClient(ctx)
        .from("customers")
        .select("stripe_customer")
        .filter("id", "eq", user.id);

    console.log("supabase customer error", customerError);
    console.log("supabase orders error", ordersError);
    return {
      props: {
        user,
        orders,
        stripeCustomer,
      },
    };
  },
});

export default Dashboard;
export { getServerSideProps };
