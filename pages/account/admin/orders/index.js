import Section from "@/components/Section";
import Layout from "@/components/Layout";
import OrdersTable from "@/components/OrdersTable";
import PageTitle from "@/components/PageTitle";

import {
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";

export default function AllOrders({ orders }) {
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
