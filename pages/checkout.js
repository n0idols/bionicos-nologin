import CartItem from "@/components/Cart/CartItem";
import Loading from "@/components/icons/Loading";
import formatMoney from "@/lib/formatMoney";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cartState";
import { withSession } from "../middlewares/session";
import client from "@/lib/apollo-client";
import gql from "graphql-tag";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import parseCookies from "@/lib/cookie";
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import ClosedIcon from "@/components/icons/Closed";
export default function CheckoutPage({ user }) {
  const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_KEY}`);
  const { cart, totalCartPrice } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponOff, setCouponOff] = useState(0.22);
  const [couponDetail, setCouponDetail] = useState("");
  const tax = totalCartPrice * 0.1025;
  const total = totalCartPrice + tax;

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/stripe/createPaymentIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [cart]);

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
      <Modal title="⚠️ We are currently closed" show={isClosed()}>
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
      </Modal>
      <div className="max-w-2xl mx-auto pt-12 mt-24 px-4 bg-white shadow-xl rounded-xl">
        <Link href="/menu">
          <a className="btn btn-sm btn-primary text-white">Go Back To Menu</a>
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
                </button>{" "} */}
              </div>
              <div>{couponDetail}</div>
              <div className="my-2 ">
                <div className="p-2 tracking-wide flex justify-between">
                  <div>
                    <h6>Subtotal</h6>
                  </div>
                  <div>
                    <h6>
                      {formatMoney(totalCartPrice - totalCartPrice * couponOff)}
                    </h6>
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

                {/* Tip */}
                {/* 
                <div className="px-2  flex justify-center flex-col">
                  <h6>Tip the staff</h6>

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
                </div> */}

                <div className=" p-2 tracking-wide flex justify-between">
                  <div>
                    <h6 className="font-bold">Total</h6>
                  </div>
                  <div>
                    <h6 className="font-bold">
                      {formatMoney(total - total * couponOff)}
                    </h6>
                  </div>
                </div>
              </div>
              {couponCode && (
                <div>You saved {formatMoney(total * couponOff)}</div>
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

export const getServerSideProps = withSession(({ req }) => {
  const user = req.session.get("user");
  // if cartn, redirect to login page

  let { cart } = parseCookies(req);
  if (!cart) {
    return {
      redirect: {
        destination: "/menu",
        permanent: false,
      },
    };
  }
  // if not logged in, redirect to login page

  if (!user)
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };
  return {
    props: {
      user,
    },
  };
});
