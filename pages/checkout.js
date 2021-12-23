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

export default function CheckoutPage({ total, paymentIntent }) {
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
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link href="/menu">
        <a className="btn btn-sm btn-primary">Go Back To Menu</a>
      </Link>
      <div>
        <div>
          <div>
            <div className="my-4">
              <h1>YOUR ORDER SUMMARY</h1>
              {JSON.stringify(total)}
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

  if (paymentIntentId && cart) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      props: {
        paymentIntent,
      },
    };
  }
  paymentIntent = await stripe.paymentIntents.create({
    amount: 3412,
    currency: "usd",
  });

  setCookie(ctx, "paymentIntentId", paymentIntent.id);

  return {
    props: {
      paymentIntent,
    },
  };
};
