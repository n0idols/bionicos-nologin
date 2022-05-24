import { useUser } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import Link from "next/link";

import toast from "react-hot-toast";
import { useCart } from "@/lib/cartState";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { cart } = useCart();
  const { user } = useUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerId, setCustomerId] = useState("");

  // const createStripeCustomer = async (user) => {
  //   try {
  //     const res = await axios.post("/api/stripe/createCustomer", {
  //       id: user.id,
  //       email: email,
  //     });
  //     setCustomerId(res.id);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { user, error } = await supabaseClient.auth.signUp(
      {
        email,
        password,
      },
      { data: { username } }
    );
    if (error) {
      toast.error(error.message);

      setLoading(false);
    }

    // createStripeCustomer(user);
    setLoading(false);
  };
  useEffect(() => {
    if (user && cart.length === 0) {
      router.push("/menu");
    }
    if (user && cart.length > 0) {
      router.push("/checkout");
    }
  }, [user, router, cart.length]);

  return (
    <Layout title="Sign Up">
      <div className="max-w-md mx-auto mt-24 p-4 rounded-xl bg-white shadow-xl">
        <form className="form-control" onSubmit={onSubmit} method="post">
          <h1 className="text-center mt-2">Create a new account</h1>
          <Link href="/signin">
            <a className="description text-center mt-2 text-sm">
              Already have an account?
              <span className="font-semibold underline ml-1">
                Click here to Login
              </span>
            </a>
          </Link>

          <label htmlFor="username" className="label">
            <span className="label-text">Your Name</span>
          </label>
          <input
            className="input input-primary"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
