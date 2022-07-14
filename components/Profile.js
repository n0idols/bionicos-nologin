import { useState, useEffect } from "react";

import Loading from "./icons/Loading";
import OrderList from "./OrderList";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AddCard from "./AddCard";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import StatusMessages, { useMessages } from "./StatusMessages";
import Modal from "./Modal";
import useGetOrders from "@/hooks/useGetOrders";

export default function Profile({ user }) {
  const [messages, addMessage] = useMessages();
  const router = useRouter();
  const { data: orders } = useGetOrders();
  const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_KEY}`);
  const [openCards, setOpenCards] = useState(false);
  const [stripeCustomer, setStripeCustomer] = useState("cus_M3F1YsPvi1iE06");
  const { user_metadata } = user;

  const handleCardModal = () => {
    setOpenCards(false);
  };

  return (
    <>
      {user ? (
        <div className="dash">
          <div className="flex justify-between items-center mb-8">
            <h1>Hello, {user_metadata.username || user_metadata.full_name}</h1>
          </div>

          <h1 className="profile-title">Payment Methods</h1>
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

          <Modal title="Add a card" show={openCards} onClose={handleCardModal}>
            <div className="flex flex-col space-y-12 border-4 rounded-xl border-primary">
              <Elements stripe={stripePromise}>
                <AddCard
                  user={user}
                  stripeCustomer={stripeCustomer}
                  handleCardModal={handleCardModal}
                />
              </Elements>
            </div>
          </Modal>
          <div className="mt-12">
            <h1 className="profile-title">Order History</h1>

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
