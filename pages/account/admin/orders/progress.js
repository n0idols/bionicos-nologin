import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Section from "@/components/Section";
import Layout from "@/components/Layout";
import OrdersTable from "@/components/OrdersTable";
import PageTitle from "@/components/PageTitle";

import {
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";

export default function ProgressOrders({ orders }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  };
  useEffect(() => {
    setIsRefreshing(false);
  }, [orders]);

  function checkOrders(e) {
    e.preventDefault();

    window.location.reload();
  }
  return (
    <Layout title="New Orders">
      <Section>
        <div>
          <div>
            <PageTitle title="New Orders" />
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}

            {/* <button onClick={sendMessage}>Send message</button> */}
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
            <div className="flex justify-center w-full  mb-4">
              <button
                className="btn btn-success btn-outline btn-sm"
                onClick={checkOrders}
              >
                Click here to Check New orders
              </button>
            </div>
            {orders.length > 0 ? (
              <OrdersTable orders={orders} />
            ) : (
              <p className="text-center">New Orders Will Be Here</p>
            )}
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
      .eq("orderstatus", "in progress")
      .order("ordered_at", { ascending: false });

    return {
      props: {
        orders,
      },
    };
  },
});

export { getServerSideProps };
