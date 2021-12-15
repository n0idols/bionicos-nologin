import CheckoutForm from "@/components/CheckoutForm";
import ProductItem from "@/components/ProductItem";
import { API_URL } from "@/config/index";

export default function MenuIndex({ products }) {
  return (
    <div>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
      <CheckoutForm />
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/products`);

  const products = await res.json();

  return {
    props: { products },
  };
}
