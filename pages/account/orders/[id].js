import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function OrderSlug(data) {
  return (
    <div>
      <Link href="/account">
        <button className="btn">go back</button>
      </Link>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
export async function getServerSideProps({ query: { id } }, req) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id);
  if (!user) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  } else {
    return {
      props: { data },
    };
  }
}
