import { useEffect } from "react";
import { useRouter } from "next/router";
import Section from "@/components/Section";
import { supabase } from "@/lib/supabaseClient";
import { parseCookies, destroyCookie } from "nookies";
import { useCart } from "@/lib/cartState";
export default function ThankYouPage({ user }) {
  const [orderReciept, setOrderReciept] = useState(null);
  const { query } = useRouter();
  const { emptyCart } = useCart;

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
      setOrderReciept(data);
    }
    console.log(orderReciept);
  }

  return (
    <Section>
      <h1>Thank you for your order!</h1>
      {/* <pre>{JSON.stringify(orderReciept, null, 2)}</pre> */}
      <p>A copy of your recipet has been sent to your email </p>
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
