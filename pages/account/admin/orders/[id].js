import {
  supabaseClient,
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import Section from "@/components/Section";
import getStatus from "@/lib/getStatus";
import moment from "moment";
import formatMoney from "@/lib/formatMoney";
import parseCookies from "@/lib/cookie";
import Layout from "@/components/Layout";
import OrderItem from "@/components/OrderItem";
import { useEffect, useState } from "react";
import Loading from "@/components/icons/Loading";
import OrderSlugItem from "@/components/OrderSlugItem";
export default function OrderSlug({ order }) {
  const router = useRouter();

  const [orderId, setOrder] = useState("");

  // useEffect(() => {
  //   if (order) {
  //     const mySubscription = supabaseClient
  //       .from(`orders:id=eq.${daorder.id}`)
  //       .on("UPDATE", (payload) => {
  //         console.log("nice");
  //         setOrderStatus(payload.new.orderstatus);
  //       })
  //       .subscribe();

  //     return () => {
  //       supabaseClient.removeSubscription(mySubscription);
  //     };
  //   }
  // }, [order]);

  async function readyPickUp(id) {
    try {
      const { data, error } = await supabaseClient
        .from("orders")
        .update({ orderstatus: "ready for pickup" })
        .match({ id: id });
      if (data) window.location.reload();
    } catch (error) {}
  }
  async function completedOrder(id) {
    try {
      const { data, error } = await supabaseClient
        .from("orders")
        .update({ orderstatus: "completed" })
        .match({ id: id });

      if (data) window.location.reload();
    } catch (error) {}
  }

  return (
    <Layout>
      <Section>
        {/* <button onClick={() => router.push("/da")}>
          Back to Profile
        </button> */}

        {order?.map((pedido) => {
          const {
            id,
            line_items,
            subtotal,
            tax,
            total,
            coupon,
            notes,
            ordered_at,
            orderstatus,
            username,
          } = pedido;
          return (
            <div className="receipt-paper" key={id}>
              <div className="flex flex-end justify-end">
                <div className="dropdown">
                  <div tabIndex="0" className="m-1 btn btn-success btn-outline">
                    Change Order Status
                  </div>
                  <ul
                    tabIndex="0"
                    className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 space-y-3"
                  >
                    <li>
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => readyPickUp(id)}
                      >
                        ready for pickup
                      </button>
                    </li>
                    <li>
                      <button
                        className="btn btn-block btn-success"
                        onClick={() => completedOrder(id)}
                      >
                        completed
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <p className="">
                  {moment(ordered_at).format("MMMM Do YYYY")}

                  <span className="font-bold ml-1">@</span>

                  {moment(ordered_at).format(" h:mm:ss a")}
                </p>

                <h1>
                  <span className="font-light mr-2">Customer:</span>
                  {username}
                </h1>
                <div>
                  <small>Status:</small>
                  <span className={getStatus(orderstatus)}>{orderstatus}</span>
                </div>
                <div className="rounded-lg my-2">
                  {line_items.map((item, i) => {
                    return <OrderSlugItem key={i} item={item} />;
                  })}

                  <div className="flex flex-col pt-4">
                    <h2 className="my-4">
                      Notes:
                      <span className="font-light"> {notes?.slice(1, -1)}</span>
                    </h2>
                  </div>

                  <div className=" p-2 tracking-wide flex justify-between">
                    <div>
                      <h6>Subtotal</h6>
                    </div>
                    <div>
                      <h6>{formatMoney(subtotal)}</h6>
                    </div>
                  </div>
                  <hr />

                  <div className=" p-2 tracking-wide flex justify-between">
                    <div>
                      <h6>Tax</h6>
                    </div>
                    <div>
                      <h6>{formatMoney(tax)}</h6>
                    </div>
                  </div>
                  <hr />
                  <div className=" p-2 tracking-wide flex justify-between">
                    <div>
                      <h6 className="font-bold">Total</h6>
                    </div>
                    <div>
                      <h6 className="font-bold">{formatMoney(total)}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Section>
    </Layout>
  );
}

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async ({ params }) => {
    const { id } = params;

    const { data: order, error } = await supabaseClient
      .from("orders")
      .select("*")
      .filter("id", "eq", id);

    if (error) {
      console.log(error.message);
    }
    return {
      props: { order },
    };
  },
});

export { getServerSideProps };
