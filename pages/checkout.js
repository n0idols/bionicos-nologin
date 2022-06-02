import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  withAuthRequired,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import CartItem from "@/components/Cart/CartItem";
import Loading from "@/components/icons/Loading";
import formatMoney from "@/lib/formatMoney";
import { useState, useEffect, useContext } from "react";
import { useCart } from "@/lib/cartState";
import client from "@/lib/apollo-client";
import gql from "graphql-tag";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { FiPlusCircle } from "react-icons/fi";
import { useRouter } from "next/router";
import {
  calculateStripeTotal,
  calculateSubAmount,
  calculateTax,
} from "../lib/calcOrder";
import ClosedModal from "@/components/ClosedModal";

import { NextSeo } from "next-seo";

export default function CheckoutPage({ user }) {
  const router = useRouter();
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_KEY}`)
  );

  const { cart, totalCartPrice } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState(true);
  const [couponOff, setCouponOff] = useState(0);
  const [couponDetail, setCouponDetail] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/dashboard");
    } else {
      return;
    }
  }, [router, cart.length]);
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
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

  const title = `Checkout`;
  const description = `Complete your order`;
  return (
    <>
      <NextSeo title={title} description={description} />

      <ClosedModal />

      <div className="max-w-2xl mx-auto pt-12 lg:my-24 px-4 bg-white shadow-xl rounded-xl">
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
                    Any special instructions?
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

                <div className="p-2 tracking-wide flex justify-between">
                  <div>
                    <h6>Tax</h6>
                  </div>
                  <div>
                    <h6>{formatMoney(calculateTax(cart, couponOff))}</h6>
                  </div>
                </div>
                <hr />

                <div className="p-2 tracking-wide flex justify-between">
                  <div>
                    <h1 className="font-bold">Total</h1>
                  </div>
                  <div>
                    <h1 className="font-bold">
                      {formatMoney(calculateStripeTotal(cart, couponOff))}
                    </h1>
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
              <div className="rounded-lg pb-2">
                <Elements stripe={stripePromise}>
                  <CheckoutForm user={user} notes={notes} cart={cart} />
                </Elements>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    const { user } = await getUser(ctx);

    // const { data, error } = await supabaseServerClient(ctx)
    //   .from("customers")
    //   .select("stripe_customer")
    //   .filter("id", "eq", user.id);

    return {
      props: { user },
    };
  },
});

export { getServerSideProps };
