import { useState, useEffect } from "react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import Loading from "./icons/Loading";
import OrderList from "./OrderList";
import OrdersTable from "@/components/OrdersTable";

export default function Profile({ user, orders }) {
  const customername = user.user_metadata.username;
  const adminId = "77b3c995-ba11-4f28-92cd-cc3a0943af38";
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(false);
  const [admin, setIsAdmin] = useState(null);

  return (
    <>
      {/* admin dash */}
      {user && admin && (
        <>
          {" "}
          <OrdersTable orders={orders} />
        </>
      )}
      {/* customer dash */}
      {user && !admin && (
        <>
          <div className="max-w-xl mx-auto my-12">
            <h2>Hello, {username}</h2>
            {orders ? <OrderList orders={orders} /> : <>No orders yet</>}
          </div>
        </>
      )}
    </>
  );
}
