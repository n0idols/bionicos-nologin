import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function FBLoginBtn() {
  async function signInWithGoogle() {
    const { user, session, error } = await supabaseClient.auth.signIn({
      provider: "google",
    });
  }
  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center justify-center px-2 py-2 btn mt-2 btn-outline"
    >
      Continue with Google <FcGoogle className="text-xl ml-1" />
    </button>
  );
}
