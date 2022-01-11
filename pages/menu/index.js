import { useState } from "react";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import ProductItem from "@/components/ProductItem";

export default function Menu({ categories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const active = `text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent-focus-focus`;

  return (
    <div className="max-w-5xl mx-auto px-4 ">
      <h1 className="text-center lg:text-4xl mt-24 mb-12 ">Menu</h1>

      {categories.map((category, index) => {
        const products = Object.values(category.products);

        return (
          <>
            <div key={index}>
              <div>
                <div id={category.name} className="my-4">
                  <h1 className="capitalize">{category.name}</h1>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {products.map((item, i) => (
                    <ProductItem key={i} item={item} />
                  ))}
                </div>

                {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
              </div>
            </div>
          </>
        );
      })}

      {/* <div className="grid md:grid-cols-2 gap-4">
        {products.map((item, index) => (
          <ProductItem key={index} item={item} />
        ))}
      </div> */}
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        categories {
          name
          products {
            title
            price
            image {
              url
            }
            modifers {
              title
              options
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      categories: data.categories,
    },
  };
}
