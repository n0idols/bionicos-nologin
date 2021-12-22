import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(null);

  async function logIn() {
    setLoading(true);
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) {
      console.log({ error });
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-16 border border-primary p-4 rounded-xl ">
      <div className="form-control">
        <h1 className="text-center mt-2">Login to manage your orders</h1>

        <Link href="/account/signup">
          <a className="description text-center mt-2">
            Need to sign up? Click Here
          </a>
        </Link>

        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          className="input input-primary"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          className="input input-primary "
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mt-12">
          <button
            onClick={(e) => {
              e.preventDefault();
              logIn();
            }}
            className="btn btn-block"
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
