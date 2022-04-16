import React, { useEffect, useState, useContext } from "react";

import { useCookies } from "react-cookie";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { GrSecure } from "react-icons/gr";
import { FaStripe } from "react-icons/fa";
import Loading from "./icons/Loading";
import Link from "next/link";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";

export default function CheckoutForm({ notes, coupon, user }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState("");
  const [userId, setUserId] = useState(user.id);
  const [cookies, setCookie, removeCookie] = useCookies([
    "notes",
    "coupon",
    "user_id",
    "customer",
  ]);

  const [orderCompleted, setOrderCompleted] = useState(null);
  const [orderCompletedError, setOrderCompletedError] = useState(null);

  // const [email, setEmail] = useState("");

  useEffect(() => {
    getProfile();

    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent, email }) => {
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }, [stripe]);

  async function getProfile() {
    setIsLoading(true);

    try {
      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`*`)
        .eq("id", userId);
      console.log(data, error, status);
      setCustomer(data.username || data.full_name);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setCustomer(data.username || data.full_name);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    setCookie("coupon", JSON.stringify(coupon), {
      sameSite: "lax",
      path: "/",
    });
    setCookie("notes", JSON.stringify(notes), {
      path: "/",
      sameSite: "lax",
    });
    setCookie("user_id", user.id, {
      path: "/",
      sameSite: "lax",
    });
    setCookie("customer", customer, {
      path: "/",
      sameSite: "lax",
    });
    // destroyCookie(null, "cart");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page

        return_url: `${process.env.NEXT_PUBLIC_RETURN_URL}`,
        receipt_email: user.email,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className=" p-4 rounded-xl">
      {/* <Link href="https://stripe.com"> */}
      <a className="flex items-center justify-center pb-4 hover:cursor-pointer">
        <GrSecure className="ml-1 text-2xl text-primary" />
        Secure Checkout with <FaStripe className="ml-1 text-5xl text-primary" />
      </a>
      {/* <span className="font-bold ml-1">{user.email}</span> */}
      {/* </Link> */}

      <PaymentElement id="payment-element" />
      <button
        className="btn btn-block btn-primary bg-brand-red glass text-white hover:bg-brand-redhover mt-4"
        disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        <span id="button-text">{isLoading ? <Loading /> : "Place Order"}</span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
      {orderCompleted && <div id="payment-message">{orderCompleted}</div>}
    </form>
  );
}
