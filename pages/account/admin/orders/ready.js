import Section from "@/components/Section";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

import OrdersTable from "@/components/OrdersTable";
import OrdersCards from "@/components/OrdersCards";
import PageTitle from "@/components/PageTitle";
import { useUser, logout } from "@supabase/supabase-auth-helpers/react";
import {
  supabaseClient,
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useState, useEffect } from "react";

export default function ReadyForPickup({ orders }) {
  // const [newOrder, setNewOrder] = useState([]);

  // // THIS IS WORKING BUT STOPS AFTER A FEW MINS
  // useEffect(() => {
  //   const mySubscription = supabaseClient
  //     .from("orders")
  //     .on("*", (payload) => {
  //       console.log(payload);
  //       setNewOrder((newOrder) => [...newOrder, payload]);
  //     })
  //     .subscribe();

  //   return () => {
  //     supabaseClient.removeSubscription(mySubscription);
  //   };
  // }, []);
  //listen for new orders
  return (
    <Layout title="Ready For Pickup">
      <Section>
        <div>
          <div>
            <PageTitle title="Ready For Pickup" />
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
            {/* {newOrder && <pre>{JSON.stringify(newOrder, null, 2)}</pre>} */}

            <OrdersTable orders={orders} />
            {/* <OrdersCards orders={orders} user={user} /> */}
          </div>
        </div>
      </Section>
    </Layout>
  );
}

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    // const { req } = ctx;
    // const { cart } = parseCookies(req);

    const { data: orders, error } = await supabaseServerClient(ctx)
      .from("orders")
      .select("*")
      .eq("orderstatus", "ready for pickup")
      .order("ordered_at", { ascending: false });

    return {
      props: {
        orders,
      },
    };
  },
});

export { getServerSideProps };
