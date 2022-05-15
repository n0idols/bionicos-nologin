import { useState, useEffect } from "react";

import Loading from "./icons/Loading";
import OrderList from "./OrderList";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import AddCard from "./AddCard";
import axios from "axios";
import toast from "react-hot-toast";
import CardsModal from "./CardsModal";
import Image from "next/image";
import StatusMessages, { useMessages } from "./StatusMessages";
export default function Profile({ orders, user }) {
  const [isLoading, setLoading] = useState(false);
  const [cardsList, setCardsList] = useState(null);
  const [messages, addMessage] = useMessages();

  const router = useRouter();
  const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_KEY}`);
  const [openCards, setOpenCards] = useState(false);

  // const [customerId, setCustomerId] = useState("cus_Lg2rZekSFSHPT6");
  // const [customerId, setCustomerId] = useState(
  //   stripeCustomer[0].stripe_customer
  // );
  const [stripeCustomer, setStripeCustomer] = useState("");

  const handleLogOut = async (e) => {
    e.preventDefault();
    destroyCookie(null, "username");
    destroyCookie(null, "cart");
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert(JSON.stringify(error));
    } else {
      router.push("/");
    }
  };

  const { user_metadata } = user;

  useEffect(() => {
    const getSupaCustomer = async () => {
      try {
        const { data: stripeData, error: customerError } = await supabaseClient
          .from("customers")
          .select("stripe_customer")
          .filter("id", "eq", user.id);

        setStripeCustomer(stripeData);

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
  }, []);

  const handleCardDelete = async (cardId) => {
    const deleteResponse = await axios.post(
      "/api/stripe/detatchPaymentMethod",
      {
        paymentMethod: cardId,
      }
    );
    if (Object.keys(deleteResponse.data).length > 0) {
      toast.success("Card removed");
      handleCardModal();
      window.setTimeout(function () {
        location.reload();
      }, 1500);
    }
  };
  const handleCardModal = () => {
    setOpenCards(false);
  };

  return (
    <>
      {user ? (
        <div className="dash">
          <div className="flex justify-between items-center">
            <h1>Hello, {user_metadata.username || user_metadata.full_name}</h1>

            <div>
              <button onClick={handleLogOut}>Log out</button>
            </div>
          </div>
          {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
          <pre>{JSON.stringify(stripeCustomer, null, 2)}</pre>
          <h1>Payment Methods</h1>
          {isLoading && <Loading />}
          <>
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
                <p className="text-center">Add a new Card</p>
              </div>
            </button>
          </>
          <>
            {cardsList?.map((card, i) => (
              <div key={i} className="flex items-center space-x-4">
                <h1>{card.card.brand}</h1>
                <h1>{card.card.last4}</h1>
                <div className="flex items-center">
                  <h1>
                    {card.card.exp_month}/{card.card.exp_year}
                  </h1>
                </div>
                <button onClick={() => handleCardDelete(card.id)}>
                  delete
                </button>
              </div>
            ))}
          </>

          <CardsModal
            title="Add a card"
            show={openCards}
            onClose={handleCardModal}
          >
            <div className="flex flex-col space-y-12">
              <Elements stripe={stripePromise}>
                <AddCard
                  user={user}
                  stripeCustomer={stripeCustomer}
                  handleCardModal={handleCardModal}
                />
              </Elements>
            </div>
          </CardsModal>
          <div className="my-8">
            <h1>Order History</h1>
            {orders?.length > 0 ? (
              <OrderList orders={orders} />
            ) : (
              <div className="flex flex-col space-y-2">
                <h2>No orders yet..</h2>
                {/* <div>
                  <Link href="/menu">
                    <a className="btn">Start an order</a>
                  </Link>
                </div> */}
              </div>
            )}
          </div>
          <StatusMessages messages={messages} />
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
