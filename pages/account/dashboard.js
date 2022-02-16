import { useSession, signIn, signOut, getSession } from "next-auth/react";

import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Dashboard({ orders }) {
  const { data: session } = useSession();

  // useEffect(() => {
  //   if (user?.role.type === "merchant") {
  //     router.push("/account/admin/orders");
  //   }
  // }, []);
  function getStatus(i) {
    if (i === 1) {
      return "badge badge-accent mx-2 uppercase font-bold";
    }
    if (i === 2) {
      return "badge badge-secondary mx-2 uppercase font-bold";
    }
    if (i === 3) {
      return "badge badge-success mx-2 uppercase font-bold";
    }
    if (i === 4) {
      return "badge badge-primary mx-2 uppercase font-bold";
    }
  }
  return (
    <Layout title="Dashboard">
      <div className="max-w-xl p-2 mx-auto">
        <div className="flex justify-between mt-4">
          {/* <h1>Welcome, {user ? user.username : ""}</h1> */}

          {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
          <button className="btn btn-ghost btn-small" onClick={() => signOut()}>
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  return {
    props: { session },
  };
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/orders/me?_sort=date:DESC`,
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }
  // );

  // const orders = await res.json();
  // return {
  //   props: {
  //     orders,
  //     token,
  //   },
  // };
}
