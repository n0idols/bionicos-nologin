import React, { useEffect, useState, useContext } from "react";

import { useCookies } from "react-cookie";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import AuthContext from "@/lib/authState";
import Loading from "./icons/Loading";

export default function CheckoutForm({ notes }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["notes"]);

  const [orderCompleted, setOrderCompleted] = useState(null);
  const [orderCompletedError, setOrderCompletedError] = useState(null);
  const { user } = useContext(AuthContext);

  // const [email, setEmail] = useState("");

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    setCookie("notes", JSON.stringify(notes), {
      path: "/",
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
      {/* <p className="mb-6">
        Reciept will be sent to:
        <span className="font-bold ml-1">{user.email}</span>
      </p> */}

      <PaymentElement id="payment-element" />
      <button
        className="btn btn-block btn-primary bg-brand-red glass text-white hover:bg-brand-redhover mt-4"
        disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        <span id="button-text">{isLoading ? <Loading /> : "Pay now"}</span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
      {orderCompleted && <div id="payment-message">{orderCompleted}</div>}
    </form>
  );
}
