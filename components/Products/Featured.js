import { useQuery, gql } from "@apollo/client";
import Image from "next/image";

const FEATURED = gql`
  query Featured {
    featureds {
      name
      desc
      price
      image {
        url
      }
    }
  }
`;

export default function Featured() {
  const { data, loading, error } = useQuery(FEATURED);

  if (loading) {
    return <h1>Hold up</h1>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const featureds = data.featureds;
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <h1 className="my-12 text-center md:text-4xl text-3xl">
          Customer Favorites
        </h1>

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 px-4">
          {featureds.map((f) => (
            <>
              <div className="mb-8   shadow-lg">
                <div className="relative min-h-[250px] min-w-[300px] mb-4 shadow-lg ">
                  <Image
                    src={f.image.url}
                    alt={f.name}
                    layout="fill"
                    className="rounded-t-md object-cover"
                  />
                </div>
                <div className="space-y-3 px-3 mb-3">
                  <h1>{f.name}</h1>
                  <p>{f.desc}</p>
                  <p className="text-lg">${f.price}</p>
                  <button className="btn btn-accent">Add To Order</button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
