import Section from "@/components/Section";
import Layout from "@/components/Layout";
import OrdersTable from "@/components/OrdersTable";
import PageTitle from "@/components/PageTitle";
import {
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";

export default function CompletedOrders({ orders }) {
  return (
    <Layout title="Completed Orders">
      <Section>
        <div>
          <div>
            <PageTitle title="Completed Orders" />
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
    const { data: orders, error } = await supabaseServerClient(ctx)
      .from("orders")
      .select("*")
      .eq("orderstatus", "completed")
      .order("ordered_at", { ascending: false });

    return {
      props: {
        orders,
      },
    };
  },
});

export { getServerSideProps };
