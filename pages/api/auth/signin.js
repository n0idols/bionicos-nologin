import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  let email = req.body.get("email");
  let password = req.body.get("password");
  let phone = req.body.get("phone");
  let authMethod = req.query.get("authMethod");

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
  } else
    res
      .setHeader(
        "Set-Cookie",
        authMethod === "phone"
          ? []
          : [
              `user=${
                user.id
              } Path=/; Secure; SameSite=Strict; Expires=${new Date(
                session.expires_at * 1000
              ).toUTCString()};`,
            ]
      )
      .status(200)
      .json({
        userId: session?.user.id,
      });
}
