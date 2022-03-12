import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import React from "react";
import { FaFacebookSquare } from "react-icons/fa";

export default function FBLoginBtn() {
  async function signInWithFacebook() {
    const { user, session, error } = await supabaseClient.auth.signIn({
      provider: "facebook",
    });
    alert(error);
    console.log(session);
  }
  return (
    <button
      onClick={signInWithFacebook}
      className="bg-[#4267B2] flex items-center justify-center px-2 py-2 text-white btn mt-2"
    >
      Continue with Facebook <FaFacebookSquare className="text-xl ml-1" />
    </button>
  );
}
