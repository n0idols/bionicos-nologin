import Section from "@/components/Section";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import axios from "axios";
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

export default function AllOrders({ orders }) {
  //listen for new orders
  return (
    <Layout title="All Orders">
      <Section>
        <div>
          <div>
            <PageTitle title="All Orders" />
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}

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
