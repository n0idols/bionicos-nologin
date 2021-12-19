import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    res.status(error.status).json({
      body: error.message,
    });
  } else
    res
      .setHeader("Set-Cookie", [`user=;Expires:${new Date(0).toUTCString()};`])
      .setHeader("Location", "/")
      .status(200);
}
