import Section from "@/components/Section";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

import OrdersTable from "@/components/OrdersTable";
import OrdersCards from "@/components/OrdersCards";
import PageTitle from "@/components/PageTitle";
import { useUser, logout } from "@supabase/supabase-auth-helpers/react";
import axios from "axios";
import {
  supabaseClient,
  getUser,
  withAuthRequired,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { useState, useEffect } from "react";

export default function ProgressOrders({ orders }) {
  // const MY_SLACK_WEBHOOK_URL =
  //   "https://hooks.slack.com/services/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";
  // const slack = SlackNotify(MY_SLACK_WEBHOOK_URL);

  // function sendMessage() {
  //   e.preventDefault();
  //   console.log("fired button");

  //   slack
  //     .send("Hello!")
  //     .then(() => {
  //       console.log("done!");
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }
  const [newOrder, setNewOrder] = useState([]);

  // THIS IS WORKING BUT STOPS AFTER A FEW MINS
  useEffect(() => {
    const mySubscription = supabaseClient
      .from("orders")
      .on("*", (payload) => {
        console.log(payload);
        setNewOrder((newOrder) => [...newOrder, payload]);
      })
      .subscribe();

    return () => {
      supabaseClient.removeSubscription(mySubscription);
    };
  }, []);

  // const sendMessage = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const url = `https://hooks.slack.com/services/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`;
  //     const data = await fetch(url, {
  //       method: "POST",
  //       body: JSON.stringify("YO"),

  //       Authorization: "Bearer +"`xoxe.xoxp-1-Mi0yLTMwMzg2MDAxMzQzNzEtMzA0MDg3NzgxODQ2OC0zMjU0MDIzMzE1MTA5LTMyNTAyNTkzNTEwOTQtZTliMjBkMWU5ODQwNTg1OTRhZTFmYWI2OGIxNzNjNTkxNTY1YzU2M2U0NjhkNTI1MWIwMWFkOTkzMzg4MzA1NQ`,
  //       // Authorization: "Bearer +"`${process.env.SLACK_API_TOKEN}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  function checkOrders(e) {
    e.preventDefault();

    window.location.reload();
  }
  return (
    <Layout title="New Orders">
      <Section>
        <div>
          <div>
            <PageTitle title="New Orders" />
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}

            {/* <button onClick={sendMessage}>Send message</button> */}
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
            <div className="flex justify-center w-full  mb-4">
              <button
                className="btn btn-success btn-outline btn-sm"
                onClick={checkOrders}
              >
                Click here to Check New orders
              </button>
            </div>
            {orders.length > 0 ? (
              <OrdersTable orders={orders} />
            ) : (
              <p className="text-center">New Orders Will Be Here</p>
            )}
            {/* <OrdersCards orders={orders} user={user} /> */}
          </div>
        </div>
      </Section>
    </Layout>
  );
}

const getServerSideProps = withAuthRequired({
  redirectTo: "/signin",
  getServerSideProps: async (ctx) => {
    // const { req } = ctx;
    // const { cart } = parseCookies(req);

    const { data: orders, error } = await supabaseServerClient(ctx)
      .from("orders")
      .select("*")
      .eq("orderstatus", "in progress")
      .order("ordered_at", { ascending: false });

    return {
      props: {
        orders,
      },
    };
  },
});

export { getServerSideProps };
