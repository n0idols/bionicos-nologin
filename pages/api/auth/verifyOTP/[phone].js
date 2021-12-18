import { supabase } from "@/lib/supabaseClient";

export default function handler(req, res) {
  let phone = request.params.phone;
  let otp = request.body.get("otp");
  const { error } = await supabase.auth.verifyOTP({ phone, token: otp });
  if (error) {
    res.status(error.status).json({
      body: error.message,
    });
  }

  const { user, data, error: err } = await supabase.auth.refreshSession();
  if (err) {
    res.status(err.status).json({
      body: err.message,
    });
  }

  res
    .status(200)
    .setHeader("Set-Cookie", [
      `user=${
        user.id
      } Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${new Date(
        data.expires_at * 1000
      ).toUTCString()};`,
    ])
    .json({
      body: JSON.stringify(user.id),
    });
}
