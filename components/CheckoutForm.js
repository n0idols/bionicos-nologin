import React, { useEffect, useState } from "react";
import StatusMessages, { useMessages } from "./StatusMessages";

import { useStripe, useElements } from "@stripe/react-stripe-js";
import {
  calculateStripeTotal,
  calculateSubAmount,
  calculateTax,
} from "../lib/calcOrder";
import { GrSecure } from "react-icons/gr";
import { FaStripe } from "react-icons/fa";
import Loading from "./icons/Loading";
import Link from "next/link";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import OrderModal from "./OrderModal";
import { destroyCookie } from "nookies";
import { useCart } from "@/lib/cartState";

export default function CheckoutForm({ user, cart, notes }) {
  const { emptyCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [messages, addMessage] = useMessages();

  const paymentBtn = `btn btn-block btn-primary bg-brand-red glass text-gray-700 hover:bg-brand-redhover my-4`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { data: order, error } = await supabaseClient.from("orders").insert([
      {
        user_id: user.id,
        payment_intent: "test",
        line_items: cart,
        username: user.user_metadata.username,
        subtotal: calculateSubAmount(cart),
        total: calculateStripeTotal(cart),
        tax: calculateTax(cart),
        notes: notes,
      },
    ]);

    console.log(order);
    console.log(error);
    //  HANDLE THE POTENTIAL SAVED ORDER ERROR HERE -- CHARGED CUSTOMER BUT ORDER NOT SAVED
    if (error) {
      addMessage("We recieved your order, please visit the store");
    }

    // SEND TRANSACTIONAL EMAIL
    // const res = await axios.post("/api/email", {
    //   order,
    // });
    // setEmailResponse(res);

    setOrderCompleted(true);
    setOrderData(order);
    emptyCart();
    destroyCookie(null, "cart");
    setIsLoading(false);
  };

  return (
    <>
      <OrderModal title="✅ Order Received!" show={orderCompleted}>
        {orderData && (
          <>
            <div className="text-center my-4 space-y-2">
              <h1>Thank you, {orderData[0].username}</h1>
              <p>Come on in and let us know your order ID</p>

              <h1>{orderData[0].id.slice(0, 3)}</h1>
            </div>
            <div className="flex justify-center">
              <Link href={`/orders/${orderData[0].id}`}>
                <a className="btn w-40 btn-primary mb-4">view reciept</a>
              </Link>
            </div>
          </>
        )}
      </OrderModal>

      <div className="p-2 mb-2 border-4 border-dotted shadow-xl bg-base-100 rounded-lg">
        <div className="flex items-center justify-center text-xs">
          <GrSecure className="ml-1 text-lg text-primary" />
          Secure Checkout with{" "}
          <FaStripe className="ml-1 text-4xl text-primary" />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <button
              onClick={handleSubmit}
              className={paymentBtn}
              disabled={isLoading}
              id="submit"
            >
              <span id="button-text">
                {isLoading ? <Loading /> : "Place Order"}
              </span>
            </button>
          </div>
        )}
      </div>

      <StatusMessages messages={messages} />
    </>
  );
}
