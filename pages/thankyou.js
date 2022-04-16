import { useEffect } from "react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import parseCookies from "@/lib/cookie";
import { useCart } from "@/lib/cartState";
import { useCookies } from "react-cookie";
import Link from "next/link";
import OrderItem from "@/components/OrderItem";
import Layout from "@/components/Layout";
import {
  supabaseServerClient,
  withAuthRequired,
} from "@supabase/supabase-auth-helpers/nextjs";

import {
  calculateStripeTotal,
  calculateSubAmount,
  calculateTax,
} from "../lib/calcOrder";
import OrderReceiptTy from "../components/OrderReceiptTy";

export default function ThankYouPage({ order, error }) {
  const { emptyCart, cart } = useCart();

  const [cookies, setCookie, removeCookie] = useCookies(["notes", "coupon"]);
  useEffect(() => {
    removeCookie("notes");
    removeCookie("coupon");

    emptyCart();
  }, []);

  return (
    <Layout title="Order Received!">
      <div className="max-w-lg mx-auto ">
        <h1 className="text-center py-4">Order Received!</h1>

        {/* {error && <pre>{JSON.stringify(error, null, 2)}</pre>} */}

        {order.map((pedido) => {
          const last3 = pedido.id.slice(0, 3);
          return (
            <>
              <div className="text-center">
                <p>Come on in and let us know your order</p>

                <p className="font-bold">Your order id: </p>
                <h1>{last3}</h1>
              </div>
              <OrderReceiptTy pedido={pedido} />
              {/* <Link href={`/orders/${order[0].id}`}>
                <a className="btn btn-block">view reciept</a>
              </Link> */}
            </>
          );
        })}
      </div>
    </Layout>
  );
}
const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    const { req, query } = ctx;
    let { cart, notes, coupon, user_id, username } = parseCookies(req);
    cart = JSON.parse(cart);

    const { data: order, error } = await supabaseServerClient(ctx)
      .from("orders")
      .insert([
        {
          user_id: user_id,
          payment_intent: query.payment_intent,
          line_items: cart,
          username: username,
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
