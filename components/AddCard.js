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
import toast from "react-hot-toast";
import StatusMessages, { useMessages } from "./StatusMessages";

export const cardElementOptions = {
  style: {
    base: {
      color: "#888",
      fontSize: "20px",
    },
    invalid: {
      color: "#fa755a",
      fontSize: "20px",
    },
  },
};
export default function AddCard({ user, stripeCustomer, handleCardModal }) {
  const stripe = useStripe();
  const elements = useElements();
  const [messages, addMessage] = useMessages();

  const [isLoading, setIsLoading] = useState(false);
  // const [customerId, setCustomerId] = useState("cus_Lg2rZekSFSHPT6");

  const [customerId, setCustomerId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    setCustomerId(stripeCustomer[0].stripe_customer);
    toast("💳 Saving please wait...");

    // addMessage("Saving card");
    //fetch customer, if not create one
    // TODO stripeCustomer HERE

    if (stripeCustomer.length === 0) {
      try {
        const res = await axios.post("/api/stripe/createACustomer", {
          name: user.user_metadata.username || user.user_metadata.full_name,
          email: user.email,
          id: user.id,
        });
        setCustomerId(res.data.customer.id);
        return;
      } catch (error) {
        addMessage(error);
      }
    }

    // create setupIntent on server
    try {
      const response = await axios.post("/api/stripe/createSetupIntent", {
        customerId: customerId,
        // card: elements.getElement(CardElement),
      });

      const clientSecret = response.data.setupIntent.client_secret;
      const setupIntent = response.data.setupIntent;

      // addMessage(`client secret (${clientSecret})`);
      // addMessage(`setupIntent (${setupIntent.id})`);

      const confirmCard = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          // billing_details: {
          //   name: "Jenny Rosen",
          // },
        },
      });

      // console.log(confirmCard);
      // addMessage(`PaymentMethod (${confirmCard.setupIntent.payment_method})`);
      // addMessage(`Attatching PM to Customer..`);

      const res = await axios.post("/api/stripe/attatchPaymentMethod", {
        paymentMethod: confirmCard.setupIntent.payment_method,
        customerId: customerId,
      });

      // console.log(res);
      // addMessage(`Card saved (${res.data.confirmPaymentMethod.card.last4})`);
      toast.success("Card Saved Successfully");
      handleCardModal();
      // window.setTimeout(function () {
      //   location.reload();
      // }, 3000);
    } catch (error) {
      // addMessage(error);
      toast.error("Something went wrong, please try again");
      setIsLoading(false);
      console.log(error);
      return;
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
        {/* {JSON.stringify(stripeCustomer[0].stripe_customer)} */}
        <form
          id="payment-form"
          onSubmit={handleSubmit}
          className=" p-4 rounded-xl"
        >
          <div className="card-element">
            <CardElement id="card-element" options={cardElementOptions} />
          </div>

          <div className="max-w-sm mx-auto mt-4">
            <button
              className={
                isLoading
                  ? "btn-primary btn btn-block loading"
                  : "btn-primary btn btn-block "
              }
              disabled={!stripe || !elements}
              id="add"
            >
              <span id="button-text">Save Card</span>
            </button>
          </div>
        </form>
        <StatusMessages messages={messages} />
      </div>
    </>
  );
}
