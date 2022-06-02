import {
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import Profile from "@/components/Profile";
import { NextSeo } from "next-seo";

const Dashboard = ({ orders, user }) => {
  return (
    <>
      <NextSeo title="Dashboard" description="Dashboard" />
      <div className="flex items-center justify-between">
        <Profile user={user} orders={orders} />
      </div>
    </>
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
