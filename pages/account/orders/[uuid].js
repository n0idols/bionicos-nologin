import Section from "@/components/Section";
import { API_URL } from "@/config/index";

export default function OrderSlug({ orderId }) {
  return (
    <>
      <Section>
        <pre>{JSON.stringify(orderId, null, 2)}</pre>

        {orderId[0].status}
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
