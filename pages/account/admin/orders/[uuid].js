import Section from "@/components/Section";

import moment from "moment";
import formatMoney from "@/lib/formatMoney";
import parseCookies from "@/lib/cookie";

import Layout from "@/components/Layout";
import OrderItem from "@/components/OrderItem";
import { withSession } from "../../../../middlewares/session";

export default function OrderSlug({ user, orderId }) {
  const order = orderId[0];
  const items = order?.line_items;
  const entries = Object.entries(items);

  function getStatus(i) {
    if (i === 1) {
      return "badge badge-accent mx-2 uppercase font-bold";
    }
    if (i === 2) {
      return "badge badge-secondary mx-2 uppercase font-bold";
    }
    if (i === 3) {
      return "badge badge-success mx-2 uppercase font-bold";
    }
    if (i === 4) {
      return "badge badge-primary mx-2 uppercase font-bold";
    }
  }

  async function markPending() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.strapiToken}`,
      },
      body: JSON.stringify({
        estado: {
          id: 1,
        },
      }),
    });
    window.location.reload();
  }

  async function markProgress() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.strapiToken}`,
      },
      body: JSON.stringify({
        estado: {
          id: 2,
        },
      }),
    });
    window.location.reload();
  }

  async function markPickup() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.strapiToken}`,
      },
      body: JSON.stringify({
        estado: {
          id: 4,
        },
      }),
    });
    window.location.reload();
  }
  async function markCompleted() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.strapiToken}`,
      },
      body: JSON.stringify({
        estado: {
          id: 3,
        },
      }),
    });
    window.location.reload();
  }

  return (
    <Layout title={order.id}>
      <Section>
        {/* <pre>{JSON.stringify(orderId, null, 2)}</pre> */}
        <div className="max-w-2xl my-4 mx-auto py-8 px-4 bg-white rounded-xl shadow-xl">
          <div className="flex justify-between">
            <div>
              <h2>{moment(order.created_at).format("dddd MMMM Do YYYY")}</h2>

              {/* <span className="">Ordered at: </span> */}

              <h2>{moment(order.created_at).format("h:mm:ss a")}</h2>
              {/* <span className="text-xs block -mb-2 p-0 font-bold">
                Customer:
              </span> */}
              <h1 className="font-light">{order.user.username}</h1>
              <h6 className="mb-2">{order.user.email}</h6>
              {/* <h4>Currently: </h4> */}

              <div>
                <small>Status:</small>
                <span className={getStatus(order.estado.id)}>
                  {order.estado.title}
                </span>
              </div>
            </div>
            <div className="dropdown">
              <div tabIndex="0" className="m-1 btn btn-success">
                Change Order Status
              </div>
              <ul
                tabIndex="0"
                className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 space-y-3"
              >
                <li>
                  <button
                    className="btn btn-accent btn-block"
                    onClick={markPending}
                  >
                    pending
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={markProgress}
                  >
                    in progress
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={markPickup}
                  >
                    ready for pickup
                  </button>
                </li>
                <li>
                  <button
                    className="btn  btn-block btn-success"
                    onClick={markCompleted}
                  >
                    completed
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* <pre>{JSON.stringify(order.estado, null, 2)}</pre> */}
          <div className="rounded-lg">
            {entries.map((item, i) => {
              return <OrderItem key={i} item={item} />;
            })}
          </div>

          <div className="flex flex-col pt-4">
            <h2 className="my-4">
              Notes: <span className="font-light">{order.notes}</span>
            </h2>
          </div>

          <div className=" p-2 tracking-wide flex justify-between">
            <div>
              <h6>Subtotal</h6>
            </div>
            <div>
              <h6>{formatMoney(order.subtotal)}</h6>
            </div>
          </div>
          <hr />

          <div className=" p-2 tracking-wide flex justify-between">
            <div>
              <h6>Tax</h6>
            </div>
            <div>
              <h6>{formatMoney(order.tax)}</h6>
            </div>
          </div>
          <hr />
          <div className=" p-2 tracking-wide flex justify-between">
            <div>
              <h6 className="font-bold">Total</h6>
            </div>
            <div>
              <h6 className="font-bold">{formatMoney(order.total)}</h6>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

export const getServerSideProps = withSession(
  async ({ req, query: { uuid } }) => {
    const user = req.session.get("user");
    if (!user)
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders?uuid=${uuid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.strapiToken}`,
        },
      }
    );
    const orderId = await res.json();

    const statusRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/estados`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.strapiToken}`,
        },
      }
    );

    const statuses = await statusRes.json();

    return {
      props: {
        orderId,
        statuses,
        user,
      },
    };
  }
);
