import { supabase } from "@/lib/supabaseClient";

export default function handler(req, res) {
  let email = request.body.get("email");
  let password = request.body.get("password");
  let phone = request.body.get("phone");
  let authMethod = request.query.get("authMethod");

  if (authMethod !== "email" && authMethod !== "phone")
    return {
      status: 404,
      body: "Invalid method",
    };
  let signInObj = authMethod === "email" ? { email, password } : { phone };
  const { session, error } = await supabase.auth.signIn(signInObj);
  if (error) {
    res.status(error.status).json({
      body: error.message,
    });
  }

  res
    .status(200)
    .setHeader(
      "Set-Cookie",
      authMethod === "phone"
        ? []
        : [
            `user=${
              user.id
            } Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${new Date(
              session.expires_at * 1000
            ).toUTCString()};`,
          ]
    )
    .json({
      body: JSON.stringify(session?.user.id),
    });
}
