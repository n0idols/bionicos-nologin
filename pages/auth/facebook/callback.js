import axios from "axios";

import { withSession } from "@/middlewares/session";
import { parseCookies } from "@/lib/cookie";

export default function CallbackPage({}) {
  return (
    <div>
      Thank you
      <p>
        Youll be redirected to dashboard, if not, click the
        &quote;account&quote; link.
      </p>
    </div>
  );
}

export const getServerSideProps = withSession(async ({ query, req }) => {
  let { cart } = parseCookies(req);

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
  if (cart.length > 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/checkout",
      },
      props: {},
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/account/dashboard",
    },
    props: {},
  };
});
