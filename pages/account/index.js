import { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import SignIn from "@/components/SignIn";
import { useAuth } from "@/lib/authState";
import { supabase } from "@/lib/supabaseClient";
import moment from "moment";
import { useRouter } from "next/router";
import Section from "@/components/Section";
import Loading from "@/components/icons/Loading";
import Modal from "@/components/Modal";
import Link from "next/link";

export default function AccountIndex({ user, data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Section>
      <div>
        <h1 className="text-2xl my-2">Your Order History</h1>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Amount</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((order) => (
                <Link href={`/account/orders/${order.id}`} key={order.id}>
                  <tr className="hover cursor-pointer">
                    <th>1</th>
                    <td>
                      {" "}
                      {moment(order.ordered_at).format(
                        "dddd, MMMM Do YYYY, h:mm:ss a"
                      )}
                    </td>
                    <td>$32.33</td>
                    <td>
                      {" "}
                      <div className="badge mx-2 uppercase  font-bold">
                        {order.type}
                      </div>
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      props: {},
      redirect: { destination: "/account/login" },
    };
  }
  /* if user is present, fetch their orders */
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id);
  return { props: { user, data } };
}
