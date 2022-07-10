import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useQuery } from "react-query";

const getOrders = async () => {
  const { data, error } = await supabaseClient.from("orders").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export default function useGetOrders() {
  return useQuery("orders", () => getOrders());
}
