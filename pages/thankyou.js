import { useEffect } from "react";
import Section from "@/components/Section";
import parseCookies from "@/lib/cookie";
import { useCart } from "@/lib/cartState";
import { API_URL } from "../config";
import { destroyCookie } from "nookies";
import Link from "next/link";
export default function ThankYouPage() {
  const { emptyCart } = useCart();

  useEffect(() => {
    emptyCart();
    destroyCookie(null, "cart");
  }, []);

  return (
    <Section>
      <h1 className="text-2xl">Thank you for your order!</h1>
      <p>A copy of your reciept has been sent to your email </p>
      <Link href="/account/dashboard">
        <a className="btn btn ghost">You can also view your orders here</a>
      </Link>
    </Section>
  );
}

export async function getServerSideProps({ req, query }) {
  const { token, cart } = parseCookies(req);

  let subtotal = 212;
  let total = 322;
  // const subtotal = entries.map((item) => {
  //   let sum = 0;
  //   item.modifications?.forEach((modification) => {
  //     sum += modification.amount;
  //   });
  //   sum += item.price;
  //   return sum;
  // });

  // const total = subtotal * 0.105;

  if (!token) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  }

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      // user_permissions_user: user.id,
      charge: query.payment_intent,
      line_items: cart,
      estado: { id: 1 },
      subtotal: subtotal,
      total: total,
    }),
  });

  const order = await res.json();

  return {
    props: {
      order,
    },
  };
}
