import React, { useEffect, useState } from "react";
import StatusMessages, { useMessages } from "./StatusMessages";
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { useCart } from "@/lib/cartState";
import OrderModal from "./OrderModal";

import {
  calculateStripeTotal,
  calculateSubAmount,
  calculateTax,
} from "@/lib/calcOrder";
import Link from "next/link";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { cardElementOptions } from "./AddCard";
import Loading from "./icons/Loading";
import Image from "next/image";

const paymentBtn = `btn btn-block btn-primary bg-brand-red glass text-white hover:bg-brand-redhover my-4`;

export default function OneTimePayment({ user, notes }) {
  const [messages, addMessage] = useMessages();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderData, setOrderData] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [cardLoaded, setCardLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [customerId, setCustomerId] = useState(
  //   stripeCustomer[0].stripe_customer
  // );

  const stripe = useStripe();
  const elements = useElements();

  const { cart, emptyCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      return;
    }
    // addMessage("Creating payment intent...");
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
      setIsLoading(false);

      return;
    }
    // addMessage("Payment intent created...");

    // confirm payment on client
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
    if (stripeError) {
      addMessage(stripeError.message);
      // toast.error(stripeError.message)
      setIsLoading(false);
      return;
    }
    // addMessage(
    //   `PaymentIntent (${paymentIntent.id}): (${paymentIntent.status})`
    // );

    //ORDER PAID NOW ATTEMPTING TO SAVE ORDER
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
    //  POTENTIAL SAVED ORDER ERROR HERE -- CHARGED CUSTOMER BUT ORDER NOT SAVED
    if (error) {
      addMessage("We recieved your order, please visit the store");
    }

    // // SEND TRANSACTIONAL EMAIL
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

      <>
        <div className="flex justify-between items-center mb-2 ">
          <div className="flex p-2">
            <Image src="/visa.svg" height={25} width={25} alt="visa" />
            <Image
              src="/mastercard.svg"
              height={25}
              width={25}
              alt="mastercard"
            />
            <Image src="/amex.svg" height={25} width={25} alt="amex" />
            {/* <p className="">Use a one time card </p> */}
          </div>

          <Link href="/dashboard">
            <a className="btn btn-sm text-xs btn-primary ml-2 btn-outline">
              Manage Cards
            </a>
          </Link>
        </div>
        <form id="payment-form" onSubmit={handleSubmit}>
          <div className="card-element">
            <CardElement
              id="card-element"
              options={cardElementOptions}
              onChange={(e) => {
                e.complete && setCardLoaded(true);
              }}
            />
          </div>
          {/* <div className="my-8 ">
          <h2 className="text-center w-full border-b leading-[.1em] m-[10px 0 20px]">
          <span className="bg-white px-3">OR</span>
          </h2>
        </div> */}
          <button
            className={paymentBtn}
            disabled={isLoading || !stripe || !elements || !cardLoaded}
            id="submit"
            type="submit"
          >
            <span id="button-text">
              {isLoading ? <Loading /> : "Place Order"}
            </span>
          </button>

          {cardLoaded && (
            <p className="text-center text-sm">Your Card Will Now Be Charged</p>
          )}
        </form>
      </>

      <div className="text-center">
        <StatusMessages messages={messages} />
      </div>
    </>
  );
}
