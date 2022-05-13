import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import StatusMessages, { useMessages } from "./StatusMessages";

export default function AddCard({ user, stripeCustomer }) {
  const stripe = useStripe();
  const elements = useElements();
  const [messages, addMessage] = useMessages();

  const [customerId, setCustomerId] = useState(
    stripeCustomer[0].stripe_customer
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    addMessage("Saving card");

    //fetch customer, if not create one

    // const { data: customer, error } = await supabaseClient
    //   .from("customers")
    //   .select("*")
    //   .filter("id", "eq", user.id);
    // setCustomerId(customer[0].stripe_customer);
    // addMessage(`Adding card for customer`);

    // async function createStripeCustomer() {
    //   try {
    //     const res = await axios.post("/api/stripe/createCustomer", {
    //       email: user.email,
    //     });
    //     setCustomerId(res.id);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    // createStripeCustomer();

    // create setupIntent on server
    try {
      const response = await axios.post("/api/stripe/createSetupIntent", {
        customerId: customerId,
        // card: elements.getElement(CardElement),
      });

      const clientSecret = response.data.setupIntent.client_secret;
      const setupIntent = response.data.setupIntent;

      addMessage(`client secret (${clientSecret})`);
      addMessage(`setupIntent (${setupIntent.id})`);

      const confirmCard = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Jenny Rosen",
          },
        },
      });

      console.log(confirmCard);
      addMessage(`PaymentMethod (${confirmCard.setupIntent.payment_method})`);

      addMessage(`Attatching PM to Customer..`);

      const res = await axios.post("/api/stripe/attatchPaymentMethod", {
        paymentMethod: confirmCard.setupIntent.payment_method,
        customerId: customerId,
      });

      console.log(res);
      addMessage(`Card saved (${res.data.confirmPaymentMethod.card.last4})`);
    } catch (error) {
      if (error) {
        // addMessage(error);
        console.log(error);
        return;
      }
    }

    // const { error: backendError, setupIntent } = await fetch(
    //   "/api/stripe/createSetupIntent",
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: { customerId: "cus_Lg2rZekSFSHPT6" },
    //   }
    // ).then((res) => res.json());
    // if (backendError) {
    //   addMessage(backendError.message);
    //   return;
    // }

    // const { error: stripeError, paymentMethod } =
    //   await stripe.createPaymentMethod({
    //     type: "card",

    //     card: elements.getElement(CardElement),
    //   });
    // if (stripeError) {
    //   addMessage(stripeError.message);
    //   return;
    // }

    // addMessage("Card Saved...");

    // addMessage(`PaymentMethod (${paymentMethod.id})`);

    // setOrderCompleted(true);
    // setOrderData(order);

    // emptyCart();
    // destroyCookie(null, "cart");
  };
  return (
    <>
      <div>
        {JSON.stringify(stripeCustomer[0].stripe_customer)}
        <form
          id="payment-form"
          onSubmit={handleSubmit}
          className=" p-4 rounded-xl"
        >
          <CardElement id="card-element" />
          <button className="btn" disabled={!stripe || !elements} id="add">
            <span id="button-text">Add</span>
          </button>
        </form>
        <StatusMessages messages={messages} />
      </div>
    </>
  );
}
