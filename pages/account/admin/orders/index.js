import Section from "@/components/Section";
import Layout from "@/components/Layout";
import OrdersTable from "@/components/OrdersTable";
import PageTitle from "@/components/PageTitle";

import {
  supabaseClient,
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useState, useEffect } from "react";

export default function AllOrders({ orders }) {
  const [newOrder, setNewOrder] = useState([]);

  // THIS IS WORKING BUT STOPS AFTER A FEW MINS
  useEffect(() => {
    const mySubscription = supabaseClient
      .from("orders")
      .on("*", (payload) => {
        console.log(payload);
        setNewOrder((newOrder) => [...newOrder, payload]);
      })
      .subscribe();
    //payload.new.id, payload.new.username

    // const beamsClient = new PusherPushNotifications.Client({
    //   instanceId: "30838142-3ef2-40a7-8bed-04c591160247",
    // });

    // beamsClient
    //   .start()
    //   .then(() => beamsClient.addDeviceInterest("hello"))
    //   .then(() => console.log("Successfully registered and subscribed!"))
    //   .catch(console.error);

    // return () => {
    //   supabaseClient.removeSubscription(mySubscription);
    // };
  }, []);
  //listen for new orders

  return (
    <Layout title="All Orders">
      <Section>
        <div>
          <div>
            <PageTitle title="All Orders" />
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
      .order("ordered_at", { ascending: false });

    return {
      props: {
        orders,
      },
    };
  },
});

export { getServerSideProps };
