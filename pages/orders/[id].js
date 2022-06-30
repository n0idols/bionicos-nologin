import {
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useRouter } from "next/router";

import getStatus from "@/lib/getStatus";

import formatMoney from "@/lib/formatMoney";
import OrderSlugItem from "@/components/OrderSlugItem";
import { NextSeo } from "next-seo";
import { format } from "date-fns";
export default function OrderSlug({ order }) {
  const router = useRouter();

  return (
    <>
      <NextSeo title="Your Order" description="Order Details" />
      <section className="max-w-2xl mx-auto py-4">
        <a
          className="btn btn-outline btn-sm "
          onClick={() => router.push("/dashboard")}
        >
          Back to Profile
        </a>

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
              <p className="text-xl border-b pb-1">
                {format(new Date(ordered_at), "PPpp ")}
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

                {notes && (
                  <div className="flex flex-col pt-4">
                    <h2 className="my-4">
                      Notes:
                      <span className="font-light"> {order[0].notes}</span>
                      {/* <span className="font-light"> {notes?.slice(1, -1)}</span> */}
                    </h2>
                  </div>
                )}

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
      </section>
    </>
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
