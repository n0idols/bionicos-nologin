import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useStripe } from "@stripe/react-stripe-js";
const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

// function Checkout = () =>  {
//   function handleSubmit(e) {
//     const [error, setError] = useState();
//     const [loading, setLoading] = useState(false);
//     const stripe = useStripe();
//     // 1. Stop the form from submitting, turn on loader
//     e.preventDefault();
//     setLoading(true);
//     console.log("Somethin went wrong..");
//     // 2. starter the page transition
//     nProgress.start();
//     // 3. create the payment method via stripe (Token comes back here if successful)
//     stripe.createPaymentMethod({
//       type: "card",
//       card: Elements.getElement(CardElement),
//     });
//     // 4. Handle any errors from stripe
//     // 5. Send the token from step 3 to supabase
//     // 6. Change the page to view the order
//     // 7. Close the cart
//     // 8. Turn the loader off
//   }
// }
export default function CheckoutForm() {
  return (
    <Elements stripe={stripeLib}>
      <div className="w-[32rem] bg-primary p-8">
        <CardElement />
        <button className="btn btn-block mt-12 mb-2">Check Out Now</button>
      </div>
    </Elements>
  );
}
