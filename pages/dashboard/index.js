import {
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import Profile from "@/components/Profile";
import { NextSeo } from "next-seo";

export default function Dashboard() {
  const user = {
    id: "19302bc8-b134-4506-80af-b17029bbcbca",
    email: "good@test.com",
    user_metadata: {
      username: "Test User",
    },
  };
  return (
    <>
      <NextSeo title="Dashboard" description="Dashboard" />
      <div className="flex items-center justify-between">
        <Profile user={user} />
      </div>
    </>
  );
}
