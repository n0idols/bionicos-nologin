import { useRouter } from "next/router";
import Section from "@/components/Section";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { parseCookies } from "nookies";
export default function ThankYouPage({ user }) {
  const { query } = useRouter();

  useEffect(() => {
    saveOrder();
  }, []);

  async function saveOrder() {
    console.log(user, query);
    const { data, error } = await supabase.from("orders").insert([
      {
        user_id: user.id,
        payment_intent: query.payment_intent,
      },
    ]);
    if (error) {
      alert(error);
    } else {
      alert(data);
      console.log("Order saved");
    }
    destroyCookie(null, "cart");
  }

  return (
    <Section>
      <h1>Thank you for your order!</h1>
      <p>Please check your email for receipt</p>
      <p>You can also view your orders here</p>
      CONFIRMED: {query.payment_intent}
    </Section>
  );
}

export async function getServerSideProps({ req, ctx }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  // const { cart } = await parseCookies(ctx);

  if (user) {
    return {
      props: { user },
    };
  }
}
