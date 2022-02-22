import axios from "axios";
import { withIronSessionSsr } from "next-iron-session";
import { withSession } from "../../../middlewares/session";

export default function CallbackPage() {
  return (
    <div>
      Thank you
      <p>You'll be redirected to checkout in </p>
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
    req.session.set("user", user);
    req.session.set("token", jdub);
    await req.session.save();
    console.log(res);
  } catch (err) {
    console.log(err);
  }

  return {
    props: {},
  };
});
