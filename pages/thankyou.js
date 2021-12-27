import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Section from "@/components/Section";

import parseCookies from "@/lib/cookie";
import { useCart } from "@/lib/cartState";
export default function ThankYouPage() {
  const [orderReciept, setOrderReciept] = useState(null);
  const { query } = useRouter();
  const { emptyCart, cart } = useCart;

  // useEffect(() => {
  //   saveOrder();
  // }, []);

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

