import { supabase } from "@/lib/supabaseClient";

export default function handler(req, res) {
  let email = request.body.get("email");
  let password = request.body.get("password");
  password = password ? password : "defaultPassword123!4$#";
  const { session, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    res.status(error.status).json({
      body: error.message,
    });
  }

  res
    .status(200)
    .setHeader("Set-Cookie", [
      `user=${
        user.id
      } Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${new Date(
        session.expires_at * 1000
      ).toUTCString()};`,
    ])
    .json({
      body: JSON.stringify(session.user.id),
    });
}
