import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { withSession } from "../middlewares/session";
import Layout from "@/components/Layout";
import Link from "next/link";
import { set } from "nprogress";
import toast from "react-hot-toast";

import { useCart } from "@/lib/cartState";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { cart } = useCart();
  // const fburl = `${process.env.NEXT_PUBLIC_API_URL}/connect/facebook`;

  // const handleFacebook = async () => {
  //   try {
  //     const res = await axios.get(fburl);
  //     console.log(res);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const onSubmit = (event) => {
    event.preventDefault();
    if (
      event.currentTarget.password.value !==
      event.currentTarget.confirmPassword.value
    ) {
      alert("Password does not match");
      return;
    }
    const body = {
      username: event.currentTarget.username.value,
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };

    setLoading(true);

    axios
      .post("/api/signup", body)
      .then((user) => {
        console.log(user);
        if (cart.length > 0) {
          router.push("/checkout");
        } else {
          router.push("/menu");
        }
      })
      .catch((e) => {
        setLoading(false);

        toast.error(e);
      });
  };
  return (
    <Layout title="Sign Up">
      <div className="max-w-md mx-auto md:mt-24 mt-16  p-4 rounded-xl bg-white">
        {/* <a href={`${process.env.NEXT_PUBLIC_API_URL}/connect/facebook`}>
          Continue with Facebook
        </a> */}
        {/* <button onClick={handleFacebook}>Continue with Facebook</button> */}

        <form
          className="form-control"
          onSubmit={onSubmit}
          action="/api/signup"
          method="post"
        >
          <h1 className="text-center mt-2">Sign Up</h1>

          <Link href="/login">
            <a className="description text-center mt-2">
              Already have an account?
              <span className="font-semibold underline ml-1">
                Click here to Login
              </span>
            </a>
          </Link>

          <label htmlFor="email" className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            className="input input-primary"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            name="username"
          />

          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            className="input input-primary"
            type="email"
            placeholder="Your email"
            autoComplete="email"
            name="email"
          />
          {/* 
          <label htmlFor="phone" className="label">
            <span className="label-text">Phone</span>
          </label>
          <input
            className="input input-primary"
            type="phone"
            placeholder="Your phone number"
            autoComplete="phone"
            name="phone"
          /> */}

          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            className="input input-primary"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            name="password"
          />
          <label htmlFor="confirm-password" className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            className="input input-primary"
            type="password"
            placeholder="Confirm password"
            autoComplete="passwordConfirm"
            name="confirmPassword"
          />

          <div className="mt-6">
            <button type="submit" className="btn btn-block" disabled={loading}>
              Sign Up
            </button>
          </div>
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
