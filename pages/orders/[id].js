import {
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";
import Section from "@/components/Section";
import getStatus from "@/lib/getStatus";
import moment from "moment";
import formatMoney from "@/lib/formatMoney";

import Layout from "@/components/Layout";
import OrderSlugItem from "@/components/OrderSlugItem";
export default function OrderSlug({ order }) {
  const router = useRouter();

  // const daorder = order[0];

  return (
    <Layout>
      <Section>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => router.push("/dashboard")}
        >
          Back to Profile
        </button>

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
          } = pedido;
          const last3 = id.slice(0, 3);

          return (
            <div className="receipt-paper" key={id}>
              <p className="">
                {moment(ordered_at).format("MMMM Do YYYY")}

                <span className="font-bold ml-1">@</span>

                {moment(ordered_at).format(" h:mm:ss a")}
              </p>

              <h1>Order #{last3}</h1>
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
                    <span className="font-light"> {order[0].notes}</span>
                    {/* <span className="font-light"> {notes?.slice(1, -1)}</span> */}
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
          );
        })}
      </Section>
    </Layout>
  );
}

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    const { params } = ctx;

    const { data: order, error } = await supabaseServerClient(ctx)
      .from("orders")
      .select("*")
      .filter("id", "eq", params.id);

    if (error) {
      console.log(error.message);
    }
    return {
      props: { order },
    };
  },
});

export { getServerSideProps };
