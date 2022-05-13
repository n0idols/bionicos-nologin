import React, { useEffect, useState } from "react";
import StatusMessages, { useMessages } from "./StatusMessages";
import OrderReceiptTy from "./OrderReceiptTy";
import { QueryClient, useMutation, useQuery } from "react-query";
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
import Payments from "./icons/Payments";
import Image from "next/image";
import CardsModal from "./CardsModal";
import useSWR from "swr";
import Select from "react-select";

export default function CheckoutForm({ user, cart, notes, stripeCustomer }) {
  const stripe = useStripe();
  const elements = useElements();
  const { emptyCart } = useCart();
  const queryClient = new QueryClient();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCardsLoading, setCardsIsLoading] = useState(false);
  const [openCards, setOpenCards] = useState(false);
  const [orderData, setOrderData] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderCompletedError, setOrderCompletedError] = useState(null);
  const [messages, addMessage] = useMessages();
  const [cardsList, setCardsList] = useState([]);
  const [chosenMethod, setPaymentMethod] = useState(null);
  const [addNew, setAddNew] = useState(false);
  const [customerId, setCustomerId] = useState("cus_Lg2rZekSFSHPT6");
  // const [customerId, setCustomerId] = useState(
  //   stripeCustomer[0].stripe_customer
  // );

  const paymentBtn = `btn btn-block btn-primary bg-brand-red glass text-white hover:bg-brand-redhover my-4`;
  const linkClasses = `flex items-center justify-center pb-4 hover:cursor-pointer`;
  useEffect(() => {
    getCards();
    // mutation.mutate({ customerId: customerId });
  }, []);

  const getCards = async () => {
    try {
      setCardsIsLoading(true);
      const data = await axios.post("/api/stripe/listCards", {
        customerId: customerId,
      });
      setCardsList(data.data.paymentMethods.data);
      setCardsIsLoading(false);

      return;
    } catch (error) {
      return;
    }
  };

  // async function fetchCards(customerId) {
  //   const response = await fetch("/api/stripe/listcards", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ customerId: customerId }),
  //   });
  //   const { data } = await response.json();
  //   return data;
  // }
  // const [mutate] = useMutation(fetchCards, {});

  const mutation = useMutation((customerId) => {
    return axios.post("/api/stripe/listCards", customerId);
  });

  const handleCardModal = () => {
    setOpenCards(false);
    setAddNew(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        body: JSON.stringify({ cart, customerId, chosenMethod }),
      }
    ).then((res) => res.json());
    if (backendError) {
      addMessage(backendError.message);
      setIsLoading(false);

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
      setIsLoading(false);

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
    setIsLoading(false);
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
      <CardsModal title="Add a card" show={openCards} onClose={handleCardModal}>
        <div className="flex flex-col space-y-12">
          <AddCard stripeCustomer={stripeCustomer} />
          {/* <button
            onClick={() => setAddNew(true)}
            className={addNew ? `hidden` : `btn`}
            >
            Add New Card
          </button> */}
        </div>
      </CardsModal>

      {cardsList.length === 0 ? (
        <>
          {" "}
          <button
            onClick={() => setOpenCards(true)}
            className="btn-block border-2 rouned-lg flex items-center"
          >
            <div className="flex p-2">
              <Image src="/visa.svg" height={25} width={25} alt="visa" />
              <Image
                src="/mastercard.svg"
                height={25}
                width={25}
                alt="mastercard"
              />
              <Image src="/amex.svg" height={25} width={25} alt="amex" />
            </div>
            <div>
              <p className="text-center">Pay with Card</p>
            </div>
          </button>
          <button className={paymentBtn} disabled>
            <span id="button-text">Place Order</span>
          </button>
        </>
      ) : (
        <>
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className=" p-4 rounded-xl"
          >
            {cardsList?.map((card, i) => {
              const options = [
                {
                  value: card.id,
                  label: `Pay with ${card.card.brand} - ${card.card.last4}`,
                },
              ];
              return (
                <Select
                  key={i}
                  options={options}
                  placeholder="Select your card"
                  onChange={() => setPaymentMethod(card.id)}
                />
              );
            })}

            {/* {JSON.stringify(chosenMethod)} */}
            {/* {typeof chosenMethod} */}
            {isCardsLoading && <Loading />}
            <button
              className={paymentBtn}
              disabled={isLoading || !stripe || !elements || !chosenMethod}
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
        </>
      )}

      <StatusMessages messages={messages} />
    </>
  );
}
