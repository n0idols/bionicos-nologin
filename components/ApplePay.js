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

export default function ApplePay({ user, notes, stripeCustomer }) {
  const [messages, addMessage] = useMessages();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderData, setOrderData] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);

  const [customerId, setCustomerId] = useState("cus_Lg2rZekSFSHPT6");
  // const [customerId, setCustomerId] = useState(
  //   stripeCustomer[0].stripe_customer
  // );

  const stripe = useStripe();
  const elements = useElements();

  const { cart, totalCartPrice } = useCart();

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    const pr = stripe.paymentRequest({
      currency: "usd",
      country: "US",
      requestPayerEmail: true,
      requestPayerName: true,
      total: { label: "demo", amount: calculateStripeTotal(cart) },
    });
    pr.canMakePayment().then((result) => {
      if (result) {
        //show button on page
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (e) => {
      // create payment intent
      // create paymentintent on server
      console.log(e.paymentMethod.id);
      setPaymentMethod(e.paymentMethod.id);
      const { error: backendError, clientSecret } = await fetch(
        "/api/stripe/createPaymentIntent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart, customerId, paymentMethod }),
        }
      ).then((res) => res.json());
      if (backendError) {
        addMessage(backendError.message);

        return;
      }
      // confirm on client
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: paymentMethod,
            // card: elements.getElement(CardElement),
          },
          {
            handleActions: false,
          }
        );
      if (stripeError) {
        addMessage(stripeError.message);
        // toast.error(stripeError.message)
        e.complete("fail");

        return;
      }
      //ORDER PAID NOW ATTEMPTING TO SAVE ORDER
      const { data: order, error } = await supabaseClient
        .from("orders")
        .insert([
          {
            user_id: user.id,
            payment_intent: paymentIntent.id,
            line_items: cart,
            username:
              user.user_metadata.username || user.user_metadata.full_name,
            subtotal: calculateSubAmount(cart),
            total: calculateStripeTotal(cart),
            tax: calculateTax(cart),
            notes: notes,
          },
        ]);
      // TODO HANDLE THE POTENTIAL SAVED ORDER ERROR HERE -- CHARGED CUSTOMER BUT ORDER NOT SAVED

      setOrderCompleted(true);
      setOrderData(order);
      emptyCart();
      destroyCookie(null, "cart");
    });
  }, [stripe, elements, addMessage]);

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
      {paymentRequest && (
        <>
          <p className="text-center text-sm">Use Apple Pay</p>
          {JSON.stringify(calculateStripeTotal(cart))}
          <PaymentRequestButtonElement options={{ paymentRequest }} />
          <div className="my-8 ">
            <h2 className="text-center w-full border-b leading-[.1em] m-[10px 0 20px]">
              <span className="bg-white px-3">OR</span>
            </h2>
          </div>
        </>
      )}
      <StatusMessages messages={messages} />
    </>
  );
}
