import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  let id = req.query.id;

  const { data, status, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id);

  if (error) {
    res.status(status).json({ error: error.message });
  } else
    res.status(200).json({
      ...data[0],
      firstName: data[0].first_name,
      lastName: data[0].last_name,
    });
}
