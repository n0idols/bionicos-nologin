import { withAuthRequired } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import CartItem from "@/components/Cart/CartItem";
import Loading from "@/components/icons/Loading";
import formatMoney from "@/lib/formatMoney";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cartState";
import client from "@/lib/apollo-client";
import gql from "graphql-tag";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import ClosedIcon from "@/components/icons/Closed";
import { FiPlusCircle } from "react-icons/fi";
import { useRouter } from "next/router";
import {
  calculateStripeTotal,
  calculateSubAmount,
  calculateTax,
} from "../lib/calcOrder";
import { parseCookies, setCookie } from "nookies";
export default function CheckoutPage({ paymentIntent }) {
  const router = useRouter();
  const { user } = useUser();
  const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_KEY}`);
  const { cart, totalCartPrice } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState(true);
  const [couponOff, setCouponOff] = useState(0);
  const [couponDetail, setCouponDetail] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/menu");
    } else {
      // Create PaymentIntent as soon as the page loads
      fetch("/api/stripe/createPaymentIntent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, couponOff }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        });
    }
  }, [cart, couponOff, router]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  const isClosed = () => {
    const date = new Date();
    date.setHours(date.getUTCHours() - 8);
    date.setMinutes(date.getUTCMinutes());
    date.setSeconds(date.getUTCSeconds());
    date.setMilliseconds(date.getUTCMilliseconds());

    // if (date.getDay() === 0) return true;
    return date.getHours() < 6 || date.getHours() >= 16;
  };

  const applyCoupon = async () => {
    const { data, error } = await client.query({
      query: gql`
        query getCoupon($id: String!) {
          coupons(where: { code: $id }) {
            id
            code
            details
            isActive
            percentOff
          }
        }
      `,
      variables: { id: couponCode },
    });
    if (!data || !data.coupons[0].isActive) {
      alert("Invalid coupon");
      setCouponOff(0);
      setCouponDetail("");
    } else {
      setCouponOff(data.coupons[0].percentOff / 100);
      setCouponDetail(data.coupons[0].details);
      alert("Coupon applied");
    }
  };
  return (
    <Layout title="Checkout">
      {/* <Modal title="⚠️ We are currently closed" show={isClosed()}>
        <div className="flex px-4">
          <div className="flex flex-col justify-center items-center ">
            <p>😔</p>
            <p className="italic text-center mb-2 text-sm">
              Please come back when we open!
            </p>
            <h2>
              MONDAY - SUNDAY: <span className="block ">7:00am - 4:00pm</span>{" "}
            </h2>
          </div>
          <div className="w-1/2 px-4">
            <ClosedIcon />
          </div>
        </div>
      </Modal> */}

      <div className="max-w-2xl mx-auto pt-12 mt-24 px-4 bg-white shadow-xl rounded-xl">
        <Link href="/menu">
          <a className="btn btn-sm btn-primary">
            {" "}
            <FiPlusCircle className="text-xl mr-1" /> Add More Items
          </a>
        </Link>

        <div>
          <div>
            <div>
              <div className="my-4">
                <h1>YOUR ORDER SUMMARY</h1>

                {cart.map((item, index) => {
                  return (
                    <div key={index}>
                      <CartItem item={item} index={index} />
                    </div>
                  );
                })}
              </div>

              <div className="form-control px-2">
                <label className="label">
                  <span className="label-text font-bold">
                    Any special instructions?{" "}
                  </span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.currentTarget.value)}
                  className="textarea h-24 textarea-bordered textarea-primary"
                  placeholder="Add a note for us here"
                ></textarea>

                {/* <label className="label" htmlFor="coupon">
                  <span className="label-text font-bold mt-2">
                    Enter a coupon
                  </span>
                </label>
                <input
                  className="input-bordered input input-primary"
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.currentTarget.value);
                  }}
                />
                <button onClick={applyCoupon} className="btn btn-ghost mt-2">
                  Apply Coupon
                </button> */}
              </div>
              {/* <div>{couponDetail}</div> */}
              <div className="my-2 ">
                <div className="p-2 tracking-wide flex justify-between">
                  <div>
                    <h6>Subtotal</h6>
                  </div>
                  <div>
                    <h6>{formatMoney(calculateSubAmount(cart, couponOff))}</h6>
                  </div>
                </div>
                <hr />

                <div className=" p-2 tracking-wide flex justify-between">
                  <div>
                    <h6>Tax</h6>
                  </div>
                  <div>
                    <h6>{formatMoney(calculateTax(cart, couponOff))}</h6>
                  </div>
                </div>
                <hr />

                <div className=" p-2 tracking-wide flex justify-between">
                  <div>
                    <h6 className="font-bold">Total</h6>
                  </div>
                  <div>
                    <h6 className="font-bold">
                      {formatMoney(calculateStripeTotal(cart, couponOff))}
                    </h6>
                  </div>
                </div>
              </div>
              {couponOff !== 0 ? (
                <h4 className="text-center text-primary">
                  You saved {formatMoney(totalCartPrice * couponOff)}
                </h4>
              ) : (
                <></>
              )}
              <div className="rounded-lg">
                {!clientSecret && <Loading />}
                {clientSecret && (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm
                      notes={notes}
                      coupon={couponOff}
                      user={user}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    return {
      props: {},
    };
  },
});

export { getServerSideProps };

// export async function getServerSideProps() {
//   const stripe = new Stripe(process.env.NEXT_PRIVATE_STRIPE_KEY);
//   const paymentIntent = await stripe.paymentIntents.create({
//     // amount: calculateStripeTotal(cartItems, couponOff),
//     amount: 3000,
//     currency: "usd",
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   return {
//     props: { paymentIntent },
//   };
// }
