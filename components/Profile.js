import { useState, useEffect } from "react";

import Loading from "./icons/Loading";
import OrderList from "./OrderList";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

export default function Profile({ orders, usa }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const router = useRouter();
  const handleLogOut = async (e) => {
    e.preventDefault();
    destroyCookie(null, "username");
    destroyCookie(null, "cart");
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert(JSON.stringify(error));
    } else {
      router.push("/");
    }
  };

  const { user_metadata } = usa;
  return (
    <>
      {usa ? (
        <div className="dash">
          <div className="flex justify-between items-center">
            <h1>Hello, {user_metadata.username || user_metadata.full_name}</h1>
            {/* <Link href="/dashboard/settings">
              <a className="flex items-center">
                {" "}
                <FiSettings className="mr-1" />
                Settings
              </a>
            </Link> */}
            <div>
              <button onClick={handleLogOut}>Log out</button>
            </div>
          </div>

          {/* <pre>{JSON.stringify(usa, null, 2)}</pre> */}
          {orders.length > 0 ? (
            <OrderList orders={orders} />
          ) : (
            <div className="flex flex-col space-y-2">
              <h2>No orders yet..</h2>
              <div>
                <Link href="/menu">
                  <a className="btn">Start an order</a>
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
