import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 border border-primary p-4 rounded-xl ">
      <div className="form-control">
        <h1 className="text-center mt-2">Login</h1>
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
              handleLogin(email);
            }}
            className="btn btn-block"
            disabled={loading}
          >
            <span>{loading ? "Loading" : "Send magic link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
