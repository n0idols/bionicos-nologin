import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(null);

  async function handleSubmit() {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: email,
        password,
      });
      if (res.ok) {
        console.log("signed up a user");
      }
    } catch (err) {
      toast.error(`${err.message}`);
      setLoading(false);
    }
  }

  async function signUp() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(`${error.message}`);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-16 border border-primary p-4 rounded-xl ">
      <div className="form-control">
        <h1 className="text-center mt-2">Sign Up</h1>
        <p className="description text-center mt-2">
          Sign up to have a better experience
        </p>
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
        <label htmlFor="password" className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          className="input input-primary"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mt-6">
          <button onClick={signUp} className="btn btn-block" disabled={loading}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
