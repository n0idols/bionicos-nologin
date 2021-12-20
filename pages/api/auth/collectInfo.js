import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  let id = req.body.id;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let phone = req.body.phone;

  const { data, status, error } = await supabase
    .from("users")
    .update({ first_name: firstName, last_name: lastName, email, phone })
    .eq("id", id);

  if (error) {
    res.status(status).json({
      body: error.message,
    });
  } else
    res
      .setHeader("Set-Cookie", [
        `user=${id} Path=/; Secure; SameSite=Strict; Expires=${new Date(
          7 * 24 * 3600 * 1000
        ).toUTCString()};`,
      ])
      .status(200)
      .json({
        data: JSON.stringify(data[0]),
      });
}
