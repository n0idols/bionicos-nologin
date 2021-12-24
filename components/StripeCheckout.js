import Stripe from "stripe";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "./icons/Loading";
import {
  CardElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { supabase } from "@/lib/supabaseClient";

import formatMoney from "@/lib/formatMoney";
import nProgress from "nprogress";
const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
import { destroyCookie, parseCookies, setCookie } from "nookies";

function CheckoutForm({ paymentIntent }) {
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState();
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(null);
  const [orderCompletedError, setOrderCompletedError] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const user = supabase.auth.user();

  async function handleSubmit(e) {
    // 1. Stop the form from submitting, turn on loader
    e.preventDefault();
    setLoading(true);
    console.log("Working on it...");
    // 2. starter the page transition
    nProgress.start();
    // 3 Complete payment intent with the card element
    try {
      const {
        error,
        paymentIntent: { status },
      } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,

        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      // 4. Handle any errors from stripe
      if (error) throw new Error(error.message);

      // 5. On Payment Completion
      if (status === "succeeded") {
        console.log("Succeeded...sending order to supabase");
        saveOrder();
        destroyCookie(null, "paymentIntentId");
        destroyCookie(null, "cart");
        emptyCart();
        setCheckoutSuccess(true);
      }
    } catch (err) {
      setCheckoutError(err.message);
    }

    // 6. Change the page to view the order
    // 7. Close the cart
    // 8. Turn the loader off
    setLoading(false);
    nProgress.done();
  }

  async function saveOrder() {
    const { data, error } = await supabase.from("orders").insert([
      {
        user_id: user.id,
        payment_intent: paymentIntent.id,
      },
    ]);
    if (error) {
      setOrderCompletedError(error);
    } else {
      setOrderCompleted(data);
      console.log("Order saved");
    }
  }

  if (checkoutSuccess)
    return (
      <div>
        <p>Payment Successful!</p>
        Your order {JSON.stringify(orderCompleted)}
        Your order had an error {JSON.stringify(orderCompletedError)}
      </div>
    );
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto h-40 form-control justify-between bg-red-100 shadow-xl rounded-8"
    >
      {checkoutError && <p>{checkoutError}</p>}

      {loading && <Loading />}
      <CardElement />
      <button
        type="submit"
        className="btn btn-block btn-glass"
        disabled={!stripe}
      >
        Confirm and Place Order
      </button>
    </form>
  );
}

export default function StripeCheckout({ paymentIntent }) {
  return (
    <Elements stripe={stripeLib}>
      hey
      <PaymentElement id="payment-element" />
      {/* <CheckoutForm paymentIntent={paymentIntent} /> */}
    </Elements>
  );
}
