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
import ApplePay from "./ApplePay";
import toast from "react-hot-toast";

export default function CheckoutForm({ user, cart, notes }) {
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
  const [options, setOptions] = useState(null);
  // const [customerId, setCustomerId] = useState("cus_Lg2rZekSFSHPT6");
  const [customerId, setCustomerId] = useState("");
  const [stripeCustomer, setStripeCustomer] = useState("");

  const paymentBtn = `btn btn-block btn-primary bg-brand-red glass text-white hover:bg-brand-redhover my-4`;
  const linkClasses = `flex items-center justify-center pb-4 hover:cursor-pointer`;
  useEffect(() => {
    const getSupaCustomer = async () => {
      try {
        const { data: stripeData, error: customerError } = await supabaseClient
          .from("customers")
          .select("stripe_customer")
          .filter("id", "eq", user.id);

        setStripeCustomer(stripeData);
        setCustomerId(stripeData[0].stripe_customer);
        const data = await axios.post("/api/stripe/listCards", {
          customerId: stripeData[0].stripe_customer,
        });

        setCardsList(data.data.paymentMethods.data);
        return;
      } catch (error) {
        console.log(error);
      }
    };

    getSupaCustomer();

    cardsList?.map((card) => {
      setOptions([
        {
          value: card.id,
          label: (
            <div className="flex items-center space-x-4">
              <Image src="/visa.svg" height={25} width={25} alt="visa" />{" "}
              <p>
                Pay with {card.card.brand} - {card.card.last4}
              </p>
            </div>
          ),
        },
      ]);
    });

    // cardsList?.map((card, i) => {
    //   const options = [
    //     {
    //       value: card.id,
    //       label: (
    //         <div className="flex items-center space-x-4">
    //           <Image
    //             src="/visa.svg"
    //             height={25}
    //             width={25}
    //             alt="visa"
    //           />{" "}
    //           <p>
    //             Pay with {card.card.brand} - {card.card.last4}
    //           </p>
    //         </div>
    //       ),
    //     },
    //   ]}

    // getSupaCustomer();
  }, [cardsList]);

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
    // TODO HANDLE THE POTENTIAL SAVED ORDER ERROR HERE -- CHARGED CUSTOMER BUT ORDER NOT SAVED
    if (error) {
      addMessage("We recieved your order, please visit the store");
    }
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
      <CardsModal title="Add a card" show={openCards} onClose={handleCardModal}>
        <div className="flex flex-col space-y-12">
          <AddCard
            stripeCustomer={stripeCustomer}
            handleCardModal={handleCardModal}
          />
        </div>
      </CardsModal>
      <div className="">
        <div className="flex items-center justify-center">
          <GrSecure className="ml-1 text-2xl text-primary" />
          Secure Checkout with{" "}
          <FaStripe className="ml-1 text-5xl text-primary" />
        </div>
        {cardsList.length === 0 ? (
          <>
            <div>
              {/* <ApplePay user={user} notes={notes} stripeCustomer={stripeCustomer} /> */}

              <div className="my-4">
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
                    <p className="text-center">Add a new card</p>
                  </div>
                </button>
              </div>

              <div>
                <button className={paymentBtn} disabled>
                  <span id="button-text">Place Order</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              {/* <ApplePay /> or */}
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
                      You Card Will Now Be Charged
                    </p>
                  )}
                </div>
                {/* Show any error or success messages */}
                {/* 
        {message && <div id="payment-message">{message}</div>}
      {orderCompleted && <div id="payment-message">{orderCompleted}</div>} */}
              </form>
            </div>
          </>
        )}
      </div>

      <StatusMessages messages={messages} />
    </>
  );
}
