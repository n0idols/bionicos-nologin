import { useUser } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import Link from "next/link";

import toast from "react-hot-toast";
import { useCart } from "@/lib/cartState";
import FBLoginBtn from "@/components/FBLoginBtn";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useUser();
  const { cart } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabaseClient.auth.signIn({
      email,
      password,
    });
    if (error) {
      alert(JSON.stringify(error));
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user && cart.length === 0) {
      router.push("/menu");
    }
    if (user && cart.length > 0) {
      router.push("/checkout");
    }
  }, [user, router]);

  return (
    <Layout title="Sign In">
      <div className="max-w-md mx-auto mt-24 p-4 rounded-xl bg-white shadow-xl">
        <form className="form-control" onSubmit={onSubmit} method="post">
          <h1 className="text-center mt-2">Sign In</h1>
          <Link href="/signup">
            <a className="description text-center mt-2 text-sm">
              Need an account?
              <span className="font-semibold underline ml-1">Sign up here</span>
            </a>
          </Link>
          {/* <Link href="/forgotpassword">
            <a className="description text-center mt-2 text-sm">
              Forgot Password?
              <span className="font-semibold underline ml-1">
                Get Help Logging In
              </span>
            </a>
          </Link> */}
          {/* <FBLoginBtn /> */}

          {/* <div className="mt-8 mb-4">
            <h2 className="text-center w-full border-b leading-[.1em] m-[10px 0 20px]">
              <span className="bg-white px-3">Or</span>
            </h2>
          </div> */}
          {/* <label htmlFor="username" className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            className="input input-primary"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            name="username"
            value={values.username}
            onChange={handleChange}
          /> */}
          {/* <h2 className="text-center font-light">Use email</h2> */}

          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            className="input input-primary"
            type="email"
            placeholder="Your email"
            autoComplete="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <input className="syrrup" type="syrrup" name="syrrup" /> */}
          <div className="mt-6">
            <button
              type="submit"
              className="btn btn-block  text-white"
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
