import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(null);

  async function signIn() {
    setLoading(true);
    const { error, data } = await supabase.auth.signIn({
      email,
    });
    if (error) {
      console.log({ error });
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  }
  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-16 border border-primary p-4 rounded-xl">
        <h1>Please check your email to sign in</h1>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 border border-primary p-4 rounded-xl ">
      <div className="form-control">
        <h1 className="text-center mt-2">Sign In</h1>
        <p className="description text-center mt-2">
          Sign in via magic link with your email below
        </p>

        <input
          className="input input-primary my-4"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
            className="btn btn-block"
            disabled={loading}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
