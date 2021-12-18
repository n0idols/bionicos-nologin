import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  let id = request.body.id;
  let firstName = request.body.firstName;
  let lastName = request.body.lastName;
  let email = request.body.email;
  let phone = request.body.phone;

  const { data, status, error } = await supabase
    .from("users")
    .update({ first_name: firstName, last_name: lastName, email, phone })
    .eq("id", id);

  if (error) {
    res.status(status).json({
      body: error.message,
    });
  }

  res
    .status(200)
    .setHeader("Set-Cookie", [
      `user=${id} Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${new Date(
        7 * 24 * 3600 * 1000
      ).toUTCString()};`,
    ])
    .json({
      body: JSON.stringify(data[0]),
    });
}
