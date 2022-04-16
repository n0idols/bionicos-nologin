import { useState, useEffect } from "react";

import Loading from "./icons/Loading";
import OrderList from "./OrderList";

import Link from "next/link";
import { FiSettings } from "react-icons/fi";

export default function Profile({ orders, usa }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);

  return (
    <>
      {usa ? (
        <div className="dash">
          <div className="flex justify-between items-center">
            <h1>Hello, {usa.user_metadata.username}</h1>
            <Link href="/dashboard/settings">
              <a className="flex items-center">
                {" "}
                <FiSettings className="mr-1" />
                Settings
              </a>
            </Link>
          </div>

          <pre>{JSON.stringify(usa, null, 2)}</pre>
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
