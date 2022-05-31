import { useState } from "react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle(e) {
    e.preventDefault();

    const { user, session, error } = await supabaseClient.auth.signIn(
      {
        provider: "google",
      },
      { redirectTo: `${process.env.NEXT_PUBLIC_CLIENT_URL}/checkout` }
    );
    if (error) {
      alert(JSON.stringify(error));
      setLoading(false);
    }
  }
  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center justify-center px-2 py-2 btn mt-2 btn-outline btn-block"
    >
      Continue with Google <FcGoogle className="text-xl ml-1" />
    </button>
  );
}
