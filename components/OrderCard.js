import React from "react";
import moment from "moment";
import Link from "next/link";
import OrderItem from "./OrderItem";
import formatMoney from "@/lib/formatMoney";
import getStatus from "@/lib/getStatus";

export default function OrderCard({ order, user }) {
  const items = order?.line_items;
  const entries = Object.entries(items);

  const markProgress = async () => {
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
  };

  const markPickup = async () => {
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
  };
  const markCompleted = async () => {
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
  };

  return (
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
          <div tabIndex="0" className="m-1 btn btn-success btn-outline">
            Change Order Status
          </div>
          <ul
            tabIndex="0"
            className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 space-y-3"
          >
            <li>
              <button className="btn btn-secondary" onClick={markProgress}>
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
  );
}
