import axios from "axios";

import { withSession } from "@/middlewares/session";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useCart } from "@/lib/cartState";
import { useRouter } from "next/router";

export default function CallbackPage({}) {
  const router = useRouter();
  const { cart } = useCart();
  useEffect(() => {
    if (cart.length > 0) {
      router.push("/checkout");
    } else {
      router.push("/account/dashboard");
    }
  }, []);
  return (
    <div>
      Thank you
      <p>Youll be redirected</p>
    </div>
  );
}

export const getServerSideProps = withSession(async ({ query, req }) => {
  try {
    const res = await axios.get(
      `https://bionicos.herokuapp.com/auth/facebook/callback?access_token=${query.access_token}`
    );

    const user = res.data.user;
    const jdub = res.data.jwt;
    console.log(res.data);
    req.session.set("user", user);
    req.session.set("token", jdub);
    await req.session.save();
  } catch (err) {
    console.log(err);
  }

  return {
    props: {},
  };
});
