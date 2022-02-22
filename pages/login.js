import { useState } from "react";
import { applySession } from "next-iron-session";
import { useRouter } from "next/router";
import axios from "axios";
import { withSession } from "../middlewares/session";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useCart } from "@/lib/cartState";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { cart } = useCart();

  const onSubmit = (event) => {
    event.preventDefault();

    const body = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };

    axios
      .post("/api/login", body)
      .then((user) => {
        console.log(user);
        if (cart.length > 0) {
          router.push("/checkout");
        } else {
          router.push("/account/dashboard");
        }
      })
      .catch((e) => {
        alert("Invalid credentials");
      });
  };
  return (
    <Layout title="Login">
      <div className="max-w-md mx-auto md:mt-24 mt-16 p-4 rounded-xl bg-white shadow">
        <form
          className="form-control "
          onSubmit={onSubmit}
          action="/api/login"
          method="post"
        >
          <h1 className="text-center mt-2">Login</h1>
          <Link href="/signup">
            <a className="description text-center mt-2">
              Need an account?
              <span className="font-semibold underline ml-1">
                Click here to sign up
              </span>
            </a>
          </Link>
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            className="input input-primary"
            type="email"
            placeholder="Your email"
            name="email"
          />
          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            className="input input-primary"
            type="password"
            placeholder="password"
            autoComplete="password"
            name="password"
          />

          <div className="mt-6">
            <button type="submit" className="btn btn-block" disabled={loading}>
              Login
            </button>
          </div>
          {/* <div className="flex flex-col my-4 ">
            <span className="text-sm">Forgot password?</span>
            <Link href="/forgotpassword">
              <a className=" font-bold underline">Reset password</a>
            </Link>
          </div> */}
        </form>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withSession((context) => {
  const { req } = context;
  const user = req.session.get("user");
  if (user)
    return {
      redirect: {
        destination: "/account/dashboard",
        permanent: false,
      },
    };
  return {
    props: {},
  };
});
