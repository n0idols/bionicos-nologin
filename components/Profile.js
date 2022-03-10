import { useState, useEffect } from "react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import Loading from "./icons/Loading";
import OrderList from "./OrderList";
import OrdersTable from "@/components/OrdersTable";

export default function Profile({ user, orders }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user);

  return (
    <>
      {user ? (
        <div className="max-w-xl w-full mx-auto my-12">
          <h2>Hello, </h2>

          {orders ? <OrderList orders={orders} /> : <>No orders yet</>}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
