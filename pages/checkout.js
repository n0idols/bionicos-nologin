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
  const [notes, setNotes] = useState("");
  const tax = totalCartPrice * 0.1025;
  const total = totalCartPrice + tax;

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
              <div className="form-control px-2">
                <label className="label">
                  <span className="label-text">Any special instructions? </span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.currentTarget.value)}
                  className="textarea h-24 textarea-bordered textarea-primary"
                  placeholder="Add a note for us here"
                ></textarea>
              </div>
              <div className="my-2 ">
                <div className="p-2 tracking-wide flex justify-between">
                  <div>
                    <h6>Subtotal</h6>
                  </div>
                  <div>
                    <h6>{formatMoney(totalCartPrice)}</h6>
                  </div>
                </div>
                <hr />

                <div className=" p-2 tracking-wide flex justify-between">
                  <div>
                    <h6>Tax</h6>
                  </div>
                  <div>
                    <h6>{formatMoney(tax)}</h6>
                  </div>
                </div>
                <hr />
                {/* 
                {/* Tip */}

                <div className="px-2">
                  <h6>Tip the staff</h6>
                  <div className="">
                    <div className="btn-group">
                      <input
                        type="radio"
                        name="options"
                        id="option1"
                        data-title="10%"
                        className="btn btn-outline btn-primary"
                      />
                      <input
                        type="radio"
                        name="options"
                        id="option2"
                        data-title="15%"
                        checked="checked"
                        className="btn btn-outline btn-primary"
                      />
                      <input
                        type="radio"
                        name="options"
                        id="option3"
                        data-title="20%"
                        className="btn btn-outline btn-primary"
                      />
                      <input
                        type="radio"
                        name="options"
                        id="other"
                        data-title="other"
                        className="btn btn-outline btn-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className=" p-2 tracking-wide flex justify-between">
                  <div>
                    <h6 className="font-bold">Total</h6>
                  </div>
                  <div>
                    <h6 className="font-bold">{formatMoney(total)}</h6>
                  </div>
                </div>
              </div>
              <div className="rounded-lg">
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
