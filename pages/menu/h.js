import { useState } from "react";

import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import Section from "@/components/Section";
import { MAIN_KEY, MAIN_URL, MERCH_ID } from "@/config/index";
import { useCart } from "@/lib/cartState";

export default function MenuIndex({ catData, prodData }) {
  const [current, setCurrent] = useState("");

  return (
    <Layout title="Menu">
      <div className="w-full flex mx-auto">
        <div className="flex overflow-x-auto p-3 max-w-6xl mx-auto space-x-2 items-center">
          <button className="btn btn-accent" onClick={() => setCurrent("")}>
            all
          </button>
          {catData.elements.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => setCurrent(item.id)}
                className="whitespace-nowrap"
              >
                <h2 className={current === item.id ? "font-bold" : "font-thin"}>
                  {item.name}
                </h2>
              </div>
            );
          })}
        </div>
      </div>

      <Section>
        <div className="grid md:grid-cols-2 gap-4">
          {prodData.elements.map((item) => {
            const catId = item.categories.elements[0].id;
            if (current === "") {
              return <ProductItem item={item} />;
            } else {
            }
            if (current === catId) {
              return <ProductItem item={item} />;
            } else {
              return null;
            }
          })}
        </div>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const url = `${MAIN_URL}/v3/merchants/${MERCH_ID}/items?expand=categories%2CmodifierGroups.modifiers`;
  const catUrl = `${MAIN_URL}/v3/merchants/${MERCH_ID}/categories`;
  const productRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MAIN_KEY}`,
    },
  });
  const prodData = await productRes.json();

  const catRes = await fetch(catUrl, {
    headers: {
      Authorization: `Bearer ${MAIN_KEY}`,
    },
  });
  const catData = await catRes.json();

  return {
    props: { prodData, catData },
  };
}
