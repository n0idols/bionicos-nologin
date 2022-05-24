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

import axios from "axios";

import Select from "react-select";
import ApplePay from "./ApplePay";
import OneTimePayment from "./OneTimePayment";

export default function CheckoutForm({ user, cart, notes }) {
  const stripe = useStripe();
  const elements = useElements();
  const { emptyCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [messages, addMessage] = useMessages();
  const [cardsList, setCardsList] = useState([]);
  const [chosenMethod, setPaymentMethod] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [stripeCustomer, setStripeCustomer] = useState("");

  const paymentBtn = `btn btn-block btn-primary bg-brand-red glass text-white hover:bg-brand-redhover my-4`;

  useEffect(() => {
    // From Customers table, grab the matching user id
    const getSupaCustomer = async () => {
      try {
        setIsLoading(true);

        const { data: stripeData, error: customerError } = await supabaseClient
          .from("customers")
          .select("stripe_customer")
          .filter("id", "eq", user.id);
        // Set the stripeCustomer data to send off to paymentIntent
        setStripeCustomer(stripeData);
        setCustomerId(stripeData[0].stripe_customer);
        // from the fetched supabase ID, grab the customer's listed cards (if any)
        const data = await axios.post("/api/stripe/listCards", {
          customerId: stripeData[0].stripe_customer,
        });
        setCardsList(data.data.paymentMethods.data);
        return;
      } catch (error) {
        // todo handle this properly
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getSupaCustomer();
    // I would like to refresh this I think i need to seperate these functions because right now, it keeps running the function and spamming stripe
  }, [user.id]);

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
        body: JSON.stringify({ cart, customerId, chosenMethod }),
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
        payment_method: chosenMethod,
        // card: elements.getElement(CardElement),
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
        <ApplePay user={user} notes={notes} />

        {isLoading ? (
          <Loading />
        ) : (
          <>
            {cardsList.length === 0 && (
              <OneTimePayment user={user} notes={notes} />
            )}
            {cardsList.length > 0 && (
              <>
                <>
                  <div>
                    <form
                      id="payment-form"
                      onSubmit={handleSubmit}
                      className="p-4 rounded-xl"
                    >
                      {cardsList?.map((card, i) => {
                        const options = [
                          {
                            value: card.id,
                            label: (
                              <div className="flex items-center space-x-4">
                                {/* <Image
                            src="/visa.svg"
                            height={25}
                            width={25}
                            alt="visa"
                          />{" "} */}
                                <p>
                                  Pay with {card.card.brand} - {card.card.last4}
                                </p>
                              </div>
                            ),
                          },
                        ];
                        return (
                          <Select
                            key={i}
                            options={options}
                            placeholder="Select your card"
                            onChange={() => setPaymentMethod(card.id)}
                            className="mb-4"
                          />
                        );
                      })}
                      <div>
                        <button
                          className={paymentBtn}
                          disabled={
                            isLoading || !stripe || !elements || !chosenMethod
                          }
                          id="submit"
                        >
                          <span id="button-text">
                            {isLoading ? <Loading /> : "Place Order"}
                          </span>
                        </button>
                        {chosenMethod && (
                          <p className="text-center text-sm">
                            Your Card Will Now Be Charged
                          </p>
                        )}
                      </div>
                    </form>
                  </div>
                </>
              </>
            )}
          </>
        )}
      </div>

      <StatusMessages messages={messages} />
    </>
  );
}
