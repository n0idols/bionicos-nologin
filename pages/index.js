import Layout from "@/components/Layout";
import LocationMap from "@/components/LocationMap";
import { PLACES_ID, PLACES_KEY } from "@/config/index";
import Link from "next/link";
import heroImage from "../public/hero.jpg";
export default function Home({ data }) {
  return (
    <Layout title="Home">
      <div className="">
        <div className="max-w-7xl mx-auto py-36 prose-sm flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <Link href="/menu">
            <a className="btn btn-primary">View Menu</a>
          </Link>
        </div>
      </div>
      <h1 className="text-5xl text-center">What our customers have to say</h1>
      <div className="max-w-5xl mx-auto px-4 my-8">
        <div className="grid grid-cols-1 gap-4">
          {data.result.reviews.map((review) => (
            <>
              <article className="bg-white shadow-lg mx-auto rounded-xl py-4 px-24 grid grid-cols-[200px]-[auto]">
                <div className="flex items-center mt-4 bg-base-200 rounded-2xl">
                  <div className="flex flex-col ml-2 justify-between">
                    <span className="font-semibold text-red-500 text-sm">
                      {String(review.author_name)}
                    </span>
                    <figure>
                      <img
                        src={review.profile_photo_url}
                        alt={review.author_name}
                        className="mx-auto object-cover rounded-full h-16 w-16"
                      />
                    </figure>
                    <span className="flex items-center  text-xs ">
                      {String(review.relative_time_description)}
                    </span>
                  </div>
                </div>

                <p className="">
                  <span className="font-bold text-red-500 text-5xl">“</span>
                  {String(review.text)}

                  <span className="font-bold text-red-500 text-lg">“</span>
                </p>
              </article>
            </>
          ))}
        </div>
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACES_ID}&fields=name,rating,reviews,formatted_phone_number&key=${PLACES_KEY}`
  );
  const data = await res.json();
  console.log(data);
  return {
    props: {
      data,
    },
  };
}
