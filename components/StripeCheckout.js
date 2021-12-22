import Stripe from "stripe";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "./icons/Loading";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import formatMoney from "@/lib/formatMoney";
import nProgress from "nprogress";
const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useCart } from "@/lib/cartState";

function CheckoutForm({ paymentIntent }) {
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState();
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);
  const [cardId, setCardId] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const { emptyCart } = useCart();

  const [token, setToken] = useState(null);
  async function handleSubmit(e) {
    // 1. Stop the form from submitting, turn on loader
    e.preventDefault();
    setLoading(true);
    console.log("Working on it...");
    // 2. starter the page transition
    nProgress.start();

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

      if (error) throw new Error(error.message);
      if (status === "succeeded") {
        destroyCookie(null, "paymentIntentId");
        destroyCookie(null, "cart");
        setCheckoutSuccess(true);
        emptyCart();
      }
    } catch (err) {
      setCheckoutError(err.message);
    }

    // 4. Handle any errors from stripe

    // 5. Send the token from step 3 to supabase

    // 6. Change the page to view the order
    // 7. Close the cart
    // 8. Turn the loader off
    setLoading(false);
    nProgress.done();
  }

  if (checkoutSuccess) return <p>Payment Successful!</p>;
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto h-40 form-control justify-between bg-red-100 shadow-xl rounded-8"
    >
      {checkoutError && <p>{checkoutError}</p>}

      {loading && <Loading />}
      <CardElement />
      <button className="btn btn-block btn-glass" disabled={!stripe}>
        Confirm and Place Order
      </button>
    </form>
  );
}

export default function StripeCheckout({ paymentIntent }) {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm paymentIntent={paymentIntent} />
    </Elements>
  );
}
