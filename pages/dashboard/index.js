import React, { MouseEventHandler, useEffect, useState } from "react";
import { useUser, logout } from "@supabase/supabase-auth-helpers/react";

import {
  supabaseClient,
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import Link from "next/link";
import Profile from "@/components/Profile";
import Layout from "@/components/Layout";

const Dashboard = ({ orders, usa }) => {
  return (
    <Layout title="Profile">
      <div className="flex items-center justify-between">
        <Profile usa={usa} orders={orders} />
      </div>
    </Layout>
  );
};

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    // const { req } = ctx;
    // const { cart } = parseCookies(req);
    const { user, accessToken } = await getUser(ctx);
    const { data: orders, error } = await supabaseServerClient(ctx)
      .from("orders")
      .select("*")
      .order("ordered_at", { ascending: false });

    return {
      props: {
        orders,
        error,
        usa: user,
      },
    };
  },
});

export default Dashboard;
export { getServerSideProps };
