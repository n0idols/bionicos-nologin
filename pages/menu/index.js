import CheckoutForm from "@/components/CheckoutForm";
import ProductItem from "@/components/ProductItem";
import Section from "@/components/Section";
import { MAIN_KEY, MAIN_URL, MERCH_ID } from "@/config/index";
import { useCart } from "@/lib/cartState";

export default function MenuIndex({ data: { elements } }) {
  return (
    <Section>
      <div className="grid md:grid-cols-2 gap-4">
        {elements.map((item) => {
          return (
            <div key={item.id}>
              <ProductItem item={item} />
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export async function getServerSideProps() {
  const url = `${MAIN_URL}/v3/merchants/${MERCH_ID}/items?expand=categories%2CmodifierGroups.modifiers`;

  const productRes = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MAIN_KEY}`,
    },
  });
  const data = await productRes.json();

  return {
    props: { data },
  };
}
