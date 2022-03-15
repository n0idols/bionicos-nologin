import { useState, useEffect } from "react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import Loading from "./icons/Loading";
import OrderList from "./OrderList";
import OrdersTable from "@/components/OrdersTable";
import Link from "next/link";

export default function Profile({ user, orders }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user.user_metadata.username);

  return (
    <>
      {user ? (
        <div className="max-w-xl w-full mx-auto my-4 px-4">
          <h1>Hello, {username}</h1>

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
