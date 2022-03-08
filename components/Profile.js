import { useState, useEffect } from "react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import Loading from "./icons/Loading";
import OrderList from "./OrderList";
export default function Profile({ user, orders }) {
  const customername = user.user_metadata.username;
  return (
    <>
      {user ? (
        <div className="max-w-md mx-auto my-12">
          <h2>Hello, {customername}</h2>
          <p>User ID: {user.id}</p>

          {/* {orders.length} */}
          {orders ? <OrderList orders={orders} /> : <>No orders yet</>}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
