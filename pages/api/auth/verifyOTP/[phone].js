import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  let phone = req.params.phone;
  let otp = req.body.get("otp");
  const { error } = await supabase.auth.verifyOTP({ phone, token: otp });
  if (error) {
    res.status(error.status).json({
      body: error.message,
    });
  } else {
    const { user, data, error: err } = await supabase.auth.refreshSession();
    if (err) {
      res.status(err.status).json({
        body: err.message,
      });
    } else
      res
        .setHeader("Set-Cookie", [
          `user=${user.id} Path=/; Secure; SameSite=Strict; Expires=${new Date(
            data.expires_at * 1000
          ).toUTCString()};`,
        ])
        .status(200)
        .json({
          userId: user.id,
        });
  }
}
