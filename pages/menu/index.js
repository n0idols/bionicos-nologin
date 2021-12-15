import CheckoutForm from "@/components/CheckoutForm";
import ProductItem from "@/components/ProductItem";
import { MAIN_KEY, MAIN_URL, MERCH_ID } from "@/config/index";

export default function MenuIndex({ data: { elements } }) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {elements.map((item) => {
          return <ProductItem key={item.id} item={item} />;
        })}
        <CheckoutForm />
      </div>
    </div>
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
