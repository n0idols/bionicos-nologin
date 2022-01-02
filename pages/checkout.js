import CartItem from "@/components/Cart/CartItem";
import Loading from "@/components/icons/Loading";
import formatMoney from "@/lib/formatMoney";
import { useState, useEffect, useContext } from "react";
import { useCart } from "@/lib/cartState";
import AuthContext from "@/lib/authState";

import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import parseCookies from "@/lib/cookie";
import Layout from "@/components/Layout";

export default function CheckoutPage({}) {
  const stripePromise = loadStripe(
    "pk_test_51JxjYrJpULzH3yu6DXMLPw75VXMRoiLLGrs2kYJ1tia0yYOEuxCVcf0z1Gvdxchwls3B3YdtWOgVOFwGQGskvNh800unU5MDnr"
  );
  const { cart, totalCartPrice } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/stripe/createPaymentIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
      // body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Layout title="Checkout">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/menu">
          <a className="btn btn-sm btn-primary">Go Back To Menu</a>
        </Link>
        <div>
          <div>
            <div>
              <div className="my-4">
                <h1>YOUR ORDER SUMMARY</h1>

                {cart.map((item, index) => {
                  console.log(item);

                  return (
                    <div key={index}>
                      <CartItem item={item} index={index} />
                    </div>
                  );
                })}
              </div>
              <h1>Subtotal: {formatMoney(totalCartPrice)}</h1>
              <div className="p-6 my-8 rounded-lg shadow-lg">
                {clientSecret && (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                )}
                {/* <StripeCheckout paymentIntent={paymentIntent} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);

  if (!token) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  }

  return {
    props: {
      token,
    },
  };
}
