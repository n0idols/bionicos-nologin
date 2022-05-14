import { useState, useEffect } from "react";

import Loading from "./icons/Loading";
import OrderList from "./OrderList";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import AddCard from "./AddCard";
import axios from "axios";
export default function Profile({ orders, user, stripeCustomer }) {
  const [loading, setLoading] = useState(false);
  const [cardsList, setCardsList] = useState(null);
  const router = useRouter();
  const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_KEY}`);

  const [customerId, setCustomerId] = useState(
    stripeCustomer[0].stripe_customer
  );

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

  const { user_metadata } = user;

  useEffect(() => {
    getCards();
  }, []);

  const getCards = async () => {
    const data = await axios.post("/api/stripe/listCards", {
      customerId: customerId,
      // customerId: "cus_Lg2rZekSFSHPT6",
    });
    if (data !== undefined) {
      setCardsList(data.data.paymentMethods.data);
    } else {
      return;
    }
  };

  return (
    <>
      {user ? (
        <div className="dash">
          <div className="flex justify-between items-center">
            <h1>Hello, {user_metadata.username || user_metadata.full_name}</h1>

            <div>
              <button onClick={handleLogOut}>Log out</button>
            </div>
          </div>

          <h1>Payment Methods</h1>

          {/* {cardsList && <pre>{JSON.stringify(cardsList, null, 2)}</pre>} */}
          {cardsList && (
            <>
              {cardsList.map((card, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <h1>{card.card.brand}</h1>
                  <h1>{card.card.last4}</h1>
                  <div className="flex items-center">
                    <h1>
                      {card.card.exp_month}/{card.card.exp_year}
                    </h1>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="my-8 bg-purple-300">
            <Elements stripe={stripePromise}>
              <AddCard user={user} stripeCustomer={stripeCustomer} />
            </Elements>
          </div>
          {orders?.length > 0 ? (
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
