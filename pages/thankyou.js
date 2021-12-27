import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Section from "@/components/Section";

import parseCookies from "@/lib/cookie";
import { useCart } from "@/lib/cartState";
import { toast } from "react-toastify";
import { API_URL } from "../config";
import { useContext } from "react";
import AuthContext from "@/lib/authState";
export default function ThankYouPage({ token }) {
  const [orderReciept, setOrderReciept] = useState(null);
  const { query } = useRouter();
  const { emptyCart, cart } = useCart;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    saveOrder();
  }, []);

  const saveOrder = async (e) => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_permissions_user: user.id,
        Stripe_transaction: query.payment_intent,
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
    }
  };
  // async function saveOrder() {
  //   const { data, error } = await supabase.from("orders").insert([
  //     {
  //       user_id: user.id,
  //       payment_intent: query.payment_intent,
  //       ordered_items: cart,
  //     },
  //   ]);
  //   if (error) {
  //     console.log(error);
  //     alert(error);
  //   } else {
  //     setOrderReciept(data);
  //   }
  // }

  return (
    <Section>
      {/* {JSON.stringify(cart)}cart
      <h1>Thank you for your order!</h1>
      <pre>{JSON.stringify(orderReciept, null, 2)}</pre> */}
      <p>A copy of your reciept has been sent to your email </p>
      <p>You can also view your orders here</p>
      CONFIRMED: {query.payment_intent}
    </Section>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);

  if (!token) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  }

  return {
    props: {
      token,
    },
  };
}
