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
  const daorder = order[0];
  const items = daorder.line_items;

  const [orderStatus, setOrderStatus] = useState(daorder.orderstatus);

  useEffect(() => {
    if (order) {
      const mySubscription = supabaseClient
        .from(`orders:id=eq.${daorder.id}`)
        .on("UPDATE", (payload) => {
          console.log("nice");
          setOrderStatus(payload.new.orderstatus);
        })
        .subscribe();

      return () => {
        supabaseClient.removeSubscription(mySubscription);
      };
    }
  }, [order]);

  async function readyPickUp() {
    try {
      const { data, error } = await supabaseClient
        .from("orders")
        .update({ orderstatus: "ready for pickup" })
        .match({ id: daorder.id });
      // if (data) window.location.reload();
    } catch (error) {}
  }
  async function completedOrder(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabaseClient
        .from("orders")
        .update({ orderstatus: "completed" })
        .match({ id: daorder.id });

      // if (data) window.location.reload();
    } catch (error) {}
  }
  return (
    <Layout title={order.id}>
      <Section>
        <button onClick={() => router.back()}>Go Back</button>
        <div className="max-w-2xl my-4 mx-auto py-8 px-4 bg-white rounded-xl shadow-xl">
          <div className="flex justify-between">
            <div>
              <h2 className="">
                {moment(daorder.ordered_at).format("MMMM Do YYYY")}

                <span className="font-bold ml-1">@</span>

                {moment(daorder.ordered_at).format(" h:mm:ss a")}
              </h2>
              <h1>
                <span className="font-light mr-2">Customer:</span>

                {daorder.username}
              </h1>
              <div>
                <small>Status:</small>
                <span className={getStatus(orderStatus)}>{orderStatus}</span>
              </div>
            </div>

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
                    onClick={readyPickUp}
                  >
                    ready for pickup
                  </button>
                </li>
                <li>
                  <button
                    className="btn  btn-block btn-success"
                    onClick={completedOrder}
                  >
                    completed
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg my-2">
            {items.map((item, i) => {
              // return JSON.stringify(item);
              return <OrderSlugItem key={i} item={item} />;
            })}

            <div className="flex flex-col pt-4">
              <h2 className="my-4">
                Notes:{" "}
                <span className="font-light">
                  {daorder.notes !== "" ? <>None</> : <>{daorder.notes}</>}
                </span>
              </h2>
            </div>

            <div className=" p-2 tracking-wide flex justify-between">
              <div>
                <h6>Subtotal</h6>
              </div>
              <div>
                <h6>{formatMoney(daorder.subtotal)}</h6>
              </div>
            </div>
            <hr />

            <div className=" p-2 tracking-wide flex justify-between">
              <div>
                <h6>Tax</h6>
              </div>
              <div>
                <h6>{formatMoney(daorder.tax)}</h6>
              </div>
            </div>
            <hr />
            <div className=" p-2 tracking-wide flex justify-between">
              <div>
                <h6 className="font-bold">Total</h6>
              </div>
              <div>
                <h6 className="font-bold">{formatMoney(daorder.total)}</h6>
              </div>
            </div>
          </div>
        </div>
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
