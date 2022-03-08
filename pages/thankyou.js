import { useEffect } from "react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import parseCookies from "@/lib/cookie";
import { useCart } from "@/lib/cartState";
import { useCookies } from "react-cookie";
import Link from "next/link";
import OrderItem from "@/components/OrderItem";
import Layout from "@/components/Layout";
import {
  getUser,
  supabaseClient,
  supabaseServerClient,
  withAuthRequired,
} from "@supabase/supabase-auth-helpers/nextjs";

import {
  calculateStripeTotal,
  calculateSubAmount,
  calculateTax,
} from "../lib/calcOrder";

export default function ThankYouPage({ order, error }) {
  const { emptyCart, cart } = useCart();
  const { user } = useUser();
  // const items = order.line_items;
  // const entries = Object.entries(items);
  const [cookies, setCookie, removeCookie] = useCookies(["notes", "coupon"]);
  const lineItems = Object.entries(order[0].line_items);

  // useEffect(() => {
  //   if (cart.length > 1) emptyCart();
  //   destroyCookie(null, "cart");
  // }, [emptyCart, cart]);
  useEffect(() => {
    removeCookie("coupon");
    emptyCart();
  }, []);

  return (
    <Layout title="Order Receieved!">
      <div className="max-w-lg mx-auto">
        <h1 className="text-center py-4">Order Receieved!</h1>
        <div className="bg-white rounded-md p-4 space-y-4">
          {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
          {lineItems.map((item) => {
            const itemski = item[1];
            return <OrderItem itemski={itemski} />;
          })}

          <p>It will be ready within 9 - 15 minutes</p>
          <p>See you soon!</p>

          <Link href={`/orders/${order[0].id}`}>
            <a className="btn btn-ghost btn-block">view reciept</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    const { req, query } = ctx;
    let { cart, notes, coupon, user_id } = parseCookies(req);
    cart = JSON.parse(cart);
    console.log(user_id);

    const { data: order, error } = await supabaseServerClient(ctx)
      .from("orders")
      .insert([
        {
          user_id: user_id,
          payment_intent: query.payment_intent,
          line_items: cart,
          subtotal: calculateSubAmount(cart, coupon),
          total: calculateStripeTotal(cart, coupon),

          tax: calculateTax(cart, coupon),
          notes: notes,
          coupon: coupon,
        },
      ]);

    return {
      props: {
        order,
        error,
      },
    };
  },
});

export { getServerSideProps };
