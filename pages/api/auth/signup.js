import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  password = password ? password : "defaultPassword123!4$#";
  const { session, error } = await supabase.auth.signUp({ email, password });
  console.log(session);
  if (error) {
    res.status(error.status).json({
      body: error.message,
    });
  } else
    res
      .setHeader("Set-Cookie", [
        `user=${
          session.user.id
        }; Path=/; Secure; SameSite=Strict; Expires=${new Date(
          session.expires_at * 1000
        ).toUTCString()};`,
      ])
      .status(200)
      .json({
        userId: session.user.id,
      });
}
