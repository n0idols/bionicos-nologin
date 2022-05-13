import React, { useEffect, useState } from "react";
import StatusMessages, { useMessages } from "./StatusMessages";
import OrderReceiptTy from "./OrderReceiptTy";
import { useCookies } from "react-cookie";
import {
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
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
import { useUser } from "@supabase/supabase-auth-helpers/react";
import OrderModal from "./OrderModal";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useCart } from "@/lib/cartState";
import AddCard from "./AddCard";
import axios from "axios";

export default function CheckoutForm({ user, cart, notes, stripeCustomer }) {
  const stripe = useStripe();
  const elements = useElements();
  const { emptyCart } = useCart();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [orderData, setOrderData] = useState("");

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderCompletedError, setOrderCompletedError] = useState(null);

  const [messages, addMessage] = useMessages();
  const [cardsList, setCardsList] = useState(null);
  const [chosenMethod, setPaymentMethod] = useState(null);
  const [customerId, setCustomerId] = useState(
    stripeCustomer[0].stripe_customer
  );
  const paymentBtn = `btn btn-block btn-primary bg-brand-red glass text-white hover:bg-brand-redhover mt-4`;
  const linkClasses = `flex items-center justify-center pb-4 hover:cursor-pointer`;
  useEffect(() => {
    getCards();
  }, []);

  const getCards = async () => {
    try {
      const data = await axios.post("/api/stripe/listCards", {
        customerId: customerId,
      });
      setCardsList(data.data.paymentMethods.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    addMessage("Creating payment intent...");
    // create paymentintent on server
    const { error: backendError, clientSecret } = await fetch(
      "/api/stripe/createPaymentIntent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      }
    ).then((res) => res.json());
    if (backendError) {
      addMessage(backendError.message);
      return;
    }
    addMessage("Payment intent created...");

    // confirm payment on client

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        // this will be the saved card on file eventually
        payment_method: chosenMethod,
        // card: elements.getElement(CardElement),
      });
    if (stripeError) {
      addMessage(stripeError.message);
      return;
    }
    addMessage(
      `PaymentIntent (${paymentIntent.id}): (${paymentIntent.status})`
    );
    // on successful order, save order details in supabase
    // HANDLE THE POTENTIAL SAVED ORDER ERROR HERE
    const { data: order, error } = await supabaseClient.from("orders").insert([
      {
        user_id: user.id,
        payment_intent: paymentIntent.id,
        line_items: cart,
        username: user.user_metadata.username || user.user_metadata.full_name,
        subtotal: calculateSubAmount(cart),
        total: calculateStripeTotal(cart),
        tax: calculateTax(cart),
        notes: notes,
      },
    ]);
    setOrderCompleted(true);
    setOrderData(order);

    emptyCart();
    destroyCookie(null, "cart");
  };

  return (
    <>
      <OrderModal title="Order Received!" show={orderCompleted}>
        {orderData && (
          <>
            <div className="text-center my-4 space-y-2">
              <h1>Thank you, {orderData[0].username}</h1>
              <p>Your order id:</p>

              <h1>#{orderData[0].id.slice(0, 3)}</h1>
            </div>
            <div className="flex justify-center">
              <Link href={`/orders/${orderData[0].id}`}>
                <a className="btn w-40 btn-primary mb-4">view reciept</a>
              </Link>
            </div>
          </>
        )}
      </OrderModal>
      {JSON.stringify(stripeCustomer[0].stripe_customer)}
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        className=" p-4 rounded-xl"
      >
        <a className={linkClasses}>
          <GrSecure className="ml-1 text-2xl text-primary" />
          Secure Checkout with{" "}
          <FaStripe className="ml-1 text-5xl text-primary" />
        </a>
        {cardsList && (
          <>
            <select
              value={chosenMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="select select-success w-full max-w-xs"
            >
              {cardsList.map((card, i) => (
                <option name={card.id} key={i} value={card.id} className="flex">
                  {card.card.type}
                  {card.card.last4}
                </option>
              ))}
            </select>
          </>
        )}
        {/* <pre>

        {JSON.stringify(cardsList,null,2)}
        </pre>
 */}

        {JSON.stringify(chosenMethod)}
        {typeof chosenMethod}

        {/* 
        {cardsList.map((card, i) => (
          <div key={i} className="flex items-center space-x-4">
            <h1>{card.id}</h1>
            <h1>{card.card.last4}</h1>
            <div className="flex items-center">
              <h1>
                {card.card.exp_month}/{card.card.exp_year}
              </h1>
            </div>
          </div>
        ))} */}
        {/* <CardElement id="card-element" /> */}
        <button
          className={paymentBtn}
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? <Loading /> : "Place Order"}
          </span>
        </button>
        {/* Show any error or success messages */}

        {/* 
      {message && <div id="payment-message">{message}</div>}
    {orderCompleted && <div id="payment-message">{orderCompleted}</div>} */}
      </form>
      <StatusMessages messages={messages} />
    </>
  );
}
