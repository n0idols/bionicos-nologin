import {
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import Profile from "@/components/Profile";
import { NextSeo } from "next-seo";

const Dashboard = ({ user }) => {
  return (
    <>
      <NextSeo title="Dashboard" description="Dashboard" />
      <div className="flex items-center justify-between">
        <Profile user={user} />
      </div>
    </>
  );
};

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    const { user } = await getUser(ctx);

    return {
      props: {
        user,
      },
    };
  },
});

export default Dashboard;
export { getServerSideProps };
