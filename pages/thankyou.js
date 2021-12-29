import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Section from "@/components/Section";

import parseCookies from "@/lib/cookie";
import { useCart } from "@/lib/cartState";
import { toast } from "react-toastify";
import { API_URL } from "../config";
import { useContext } from "react";
import AuthContext from "@/lib/authState";
import { destroyCookie } from "nookies";
import Link from "next/link";
export default function ThankYouPage({ token, cart }) {
  const [orderReciept, setOrderReciept] = useState(null);
  const { query } = useRouter();

  const { emptyCart } = useCart();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    saveOrder();
  }, []);

  async function saveOrder() {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        // user_permissions_user: user.id,
        charge: query.payment_intent,
        line_items: JSON.stringify(cart),
      }),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("No token included");
        return;
      }
      toast.error("Something Went Wrong");
    } else {
      const order = await res.json();
      console.log(order);
      console.log(cart);
      destroyCookie(null, "cart");
    }
  }

  return (
    <Section>
      <h1 className="text-2xl">
        Thank you {JSON.stringify(user.email)}for your order! Your order:{" "}
      </h1>
      <p>A copy of your reciept has been sent to your email </p>
      <Link href="/account/dashboard">
        <a className="btn btn ghost">You can also view your orders here</a>
      </Link>
      CONFIRMED: {query.payment_intent}
    </Section>
  );
}

export async function getServerSideProps({ req }) {
  const { token, cart } = parseCookies(req);

  if (!token) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  }

  return {
    props: {
      token,
      cart,
    },
  };
}
