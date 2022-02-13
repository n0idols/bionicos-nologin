import { useEffect } from "react";

import parseCookies from "@/lib/cookie";
import { useCart } from "@/lib/cartState";

import Link from "next/link";
import OrderItem from "@/components/OrderItem";
export default function ThankYouPage({ order }) {
  const { emptyCart, cart } = useCart();
  const items = order.line_items;
  const entries = Object.entries(items);
  // useEffect(() => {
  //   if (cart.length > 1) emptyCart();
  //   destroyCookie(null, "cart");
  // }, [emptyCart, cart]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-md p-4 space-y-4">
        <h1 className="text-2xl">Thank you for your order!</h1>

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

export async function getServerSideProps({ req, query }) {
  let { token, cart, notes } = parseCookies(req);
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
    const final = Math.round(total);

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
    const final = Math.round(newTotal);
    console.log(final);
    return final;
  };

  if (!token) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      charge: query.payment_intent,
      line_items: cart,
      estado: { id: 1 },

      tax: `${calculateTax(cart)}`,
      subtotal: `${calculateSubAmount(cart)}`,
      total: `${calculateTotalAmount(cart)}`,
      notes: JSON.parse(notes),
    }),
  });

  const order = await res.json();
  console.log({ order });
  return {
    props: {
      order,
    },
  };
}
