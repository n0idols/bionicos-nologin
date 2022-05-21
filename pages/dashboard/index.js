import React, { MouseEventHandler, useEffect, useState } from "react";

import {
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";

import Profile from "@/components/Profile";
import Layout from "@/components/Layout";

const Dashboard = ({ orders, user }) => {
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
    const { user } = await getUser(ctx);

    const { data: orders, error: ordersError } = await supabaseServerClient(ctx)
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
