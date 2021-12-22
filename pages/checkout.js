import CartItem from "@/components/Cart/CartItem";
import Loading from "@/components/icons/Loading";
import formatMoney from "@/lib/formatMoney";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cartState";
import { useCookies } from "react-cookie";
import { parseCookies, setCookie } from "nookies";

import StripeCheckout from "@/components/StripeCheckout";
import Stripe from "stripe";
import { parse } from "cookie";
import Link from "next/link";

export default function CheckoutPage({ orderSummary, paymentIntent }) {
  const [cookies] = useCookies(["user"]);
  const router = useRouter();
  const { cart, emptyCart } = useCart();
  const [disableOrderBtn, setDisableOrderBtn] = useState(false);
  const [email, setEmail] = useState("");

  const [orderInProgress, setOrderInProgress] = useState(false);

  const [token, setToken] = useState("");

  useEffect(() => {
    console.log(cookies);
  }, [cookies.user]);
  console.log(cookies, disableOrderBtn, token);

  return (
    <div>
      <a href="/menu/order" className="mb-4">
        <h1 className="text-red-600 mb-4">Back to Menu</h1>
      </a>
      <pre>{JSON.stringify(paymentIntent.id, null, 2)}</pre>
      <div className="flex flex-col space-y-8 md:space-y-0 md:space-x-12 md:flex-row justify-center">
        <div className="md:w-1/2">
          <div>
            <div className="my-4">
              <h1>SUMMARY</h1>
              {cart.map((item, index) => {
                console.log(item);

                return (
                  <div key={index}>
                    <CartItem item={item} index={index} />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mb-4">
              <Link href="/menu">
                <a className="bg-gray-200 rounded-2xl px-4 py-1 text-xl">
                  Add more items
                </a>
              </Link>
            </div>
            <hr />
            <div>
              <StripeCheckout paymentIntent={paymentIntent} />
            </div>
            {/* 
            {cart.length !== 0 && (
              <button
                disabled={!cookies.user || disableOrderBtn || !token}
                className="btn btn-block btn bg-brand-red glass text-white hover:bg-brand-redhover"
              >
                {!orderInProgress ? (
                  <h3 className="text-white">Place Order</h3>
                ) : (
                  <Loading />
                )}
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps = async (ctx) => {
  const stripe = new Stripe(
    "sk_test_51JxjYrJpULzH3yu6Vy486PK87ceDaxQa7bfXUwSP0UiCfbpB8XFnAmpXziOx6U1HcRnQPfwQCHPgSTXoUoXxAsTs00LcEiUEeZ"
  );

  const { paymentIntentId, cart } = await parseCookies(ctx);
  let paymentIntent;
  console.log(cart);
  const total = 430422;

  if (paymentIntentId) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      props: {
        paymentIntent,
      },
    };
  }
  paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  setCookie(ctx, "paymentIntentId", paymentIntent.id);

  return {
    props: {
      paymentIntent,
    },
  };
};
