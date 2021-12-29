import { useState } from "react";
import Section from "@/components/Section";
import { API_URL } from "@/config/index";
import moment from "moment";

export default function OrderSlug({ orderId }) {
  const order = orderId[0];
  const [current, setCurrent] = useState(null);

  return (
    <>
      <Section>
        <ul className="w-full steps">
          <li className="step step-primary"></li>
          <li className="step step-primary">Choose plan</li>
          <li className="step">Purchase</li>
          <li className="step">Receive Product</li>
        </ul>

        <div className="card lg:card-side card-bordered">
          <div className="card-body">
            <h2 className="card-title">
              {moment(order.created_at).format("MMMM Do YYYY, h:mm:ss a")}
            </h2>
            {order.line_items}

            <div className="card-actions">
              <div className="badge badge-primary uppercase badge-lg">
                {order.status}
              </div>
            </div>
          </div>
        </div>
        <div className="card  bordered bg-white cursor-pointer hover:shadow-lg transition ease-linear hover:-translate-y-1">
          <h1></h1>
        </div>
        <pre>{JSON.stringify(orderId, null, 2)}</pre>
      </Section>
    </>
  );
}

export async function getServerSideProps({ query: { uuid } }) {
  const res = await fetch(`${API_URL}/orders?uuid=${uuid}`);
  const orderId = await res.json();

  return {
    props: {
      orderId,
    },
  };
}
// export default function OrderSlug() {
//   return <div>hey</div>;
// }
