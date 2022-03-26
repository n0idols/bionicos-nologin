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
import Loading from "@/components/icons/Loading";

export default function ReadyForPickup({ orders }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
    setIsRefreshing(true);
  };
  useEffect(() => {
    setIsRefreshing(false);
  }, [orders]);
  return (
    <Layout title="Ready For Pickup">
      <Section>
        <div>
          <div>
            <PageTitle title="Ready For Pickup" />
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
            {/* {newOrder && <pre>{JSON.stringify(newOrder, null, 2)}</pre>} */}
            {isRefreshing && <Loading />}

            {orders.length > 0 ? (
              <OrdersTable orders={orders} />
            ) : (
              <p className="text-center">
                Orders Marked Ready For Pickup Will Be Here
              </p>
            )}
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
