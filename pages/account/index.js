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

export default function AccountIndex({ user, data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { authenticatedState } = useAuth();

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
                <>
                  <Modal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={order.id}
                  >
                    <h1>Items</h1>
                    <h1>Total</h1>
                  </Modal>
                  <tr
                    key={order.id}
                    className="hover cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
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
                </>
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
    };
  }
  /* if user is present, fetch their orders */
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id);
  return { props: { user, data } };
}
