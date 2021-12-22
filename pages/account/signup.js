import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(null);

  async function signUp() {
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.log({ error });
    } else {
      setLoading(false);
    }
  }
  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-16 border border-primary p-4 rounded-xl">
        <h1>Please check your email to sigddn in</h1>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 border border-primary p-4 rounded-xl ">
      <div className="form-control">
        <h1 className="text-center mt-2">Sign Up</h1>
        <p className="description text-center mt-2">
          Sign up to have a better experience
        </p>

        <input
          className="input input-primary my-4"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input input-primary my-4"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              signUp();
            }}
            className="btn btn-block"
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
