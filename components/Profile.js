import { useState, useEffect } from "react";

import Loading from "./icons/Loading";
import OrderList from "./OrderList";

import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";

export default function Profile({ orders }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`username`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {user ? (
        <div className="dash">
          <div className="flex justify-between items-center">
            <h1>Hello, {username}</h1>
            <Link href="/dashboard/settings">
              <a className="flex items-center">
                {" "}
                <FiSettings className="mr-1" />
                Settings
              </a>
            </Link>
          </div>
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
