import { useEffect } from "react";

import parseCookies from "@/lib/cookie";
import { useCart } from "@/lib/cartState";
import { useCookies } from "react-cookie";
import Link from "next/link";
import OrderItem from "@/components/OrderItem";
import { withSession } from "../middlewares/session";
export default function ThankYouPage({ order, user }) {
  const { emptyCart, cart } = useCart();
  const items = order.line_items;
  const entries = Object.entries(items);
  const [cookies, setCookie, removeCookie] = useCookies(["notes", "coupon"]);

  // useEffect(() => {
  //   if (cart.length > 1) emptyCart();
  //   destroyCookie(null, "cart");
  // }, [emptyCart, cart]);
  useEffect(() => {
    removeCookie("notes");
    removeCookie("coupon");

    emptyCart();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-md p-4 space-y-4">
        <h1 className="text-2xl">{user.username}, Thank you for your order!</h1>
        <p>It will be ready within 9 - 15 minutes</p>
        <p>See you soon!</p>

        {entries.map((item, i) => {
          const theItem = item[1];

          return <OrderItem key={i} item={item} />;
        })}
        <Link href={`/account/orders/${order.uuid}`}>
          <a className="btn btn-ghost btn-block">view reciept</a>
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps = withSession(async ({ req, query }) => {
  const user = req.session.get("user");
  if (!user)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  let { cart, notes, coupon } = parseCookies(req);
  console.log(`From thank you: ${coupon}`);

  cart = JSON.parse(cart);

  const calculateTax = (cart) => {
    let total = 0;
    let taxTotal = 0;
    cart.forEach((value) => {
      let itemTotal = value.item.price;
      value.modifications.forEach((modification) => {
        itemTotal += modification.amount;
      });
      itemTotal *= value.quantity;
      total += itemTotal;
    });
    taxTotal = total * 0.1025;
    const final = Math.round(taxTotal);
    return final;
  };

  const calculateSubAmount = (cart) => {
    let total = 0;
    cart.forEach((value) => {
      let itemTotal = value.item.price;
      value.modifications.forEach((modification) => {
        itemTotal += modification.amount;
      });
      itemTotal *= value.quantity;
      total += itemTotal;
    });
    const final = Math.round(total - total * coupon);

    return final;
  };

  const calculateTotalAmount = (cart) => {
    let total = 0;
    let newTotal = 0;
    let plusTax = 1.1025;

    cart.forEach((value) => {
      let itemTotal = value.item.price;
      value.modifications.forEach((modification) => {
        itemTotal += modification.amount;
      });
      itemTotal *= value.quantity;
      total += itemTotal;
    });

    newTotal = total * plusTax;
    const final = Math.round(newTotal - newTotal * coupon);
    console.log(final);
    return final;
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.strapiToken}`,
    },
    body: JSON.stringify({
      charge: query.payment_intent,
      line_items: cart,
      estado: { id: 2 },

      tax: `${calculateTax(cart)}`,
      subtotal: `${calculateSubAmount(cart)}`,
      total: `${calculateTotalAmount(cart)}`,
      notes: JSON.parse(notes),
    }),
  });

  const order = await res.json();

  return {
    props: {
      order,
      user,
    },
  };
});
