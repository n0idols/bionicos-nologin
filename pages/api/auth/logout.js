import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { error } = await supabase.auth.signOut();

  if (error) {
    res.status(error.status).json({
      body: error.message,
    });
  }

  res.status(200).setHeader("Set-Cookie", ["user="]).setHeader("Location", "/");
}
