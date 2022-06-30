import Image from "next/image";
import { FaYelp } from "react-icons/fa";
import { format } from "date-fns";
import Stars from "../Stars";

export default function Reviews({ reviews }) {
  function getReviewIndex(i) {
    if (i === 0) {
      return "bg-teal-300 card shadow-lg";
    }
    if (i === 1) {
      return "bg-red-200 card shadow-lg";
    }
    if (i === 2) {
      return "bg-emerald-300 card shadow-lg";
    }
  }

  return (
    <div className="py-20 bg-base-100">
      <h1 className="md:text-4xl text-3xl text-center px-8">
        What our customers have to say
      </h1>
      <div className="flex justify-center items-center">
        <p className="text-center pt-2">Latest reviews from Yelp</p>
        <FaYelp className="text-2xl" />
      </div>
      <div className="max-w-5xl mx-auto md:mt-10 mt-4 mb-10 px-8 ">
        <div className="grid  md:grid-cols-3 grid-cols-1 gap-3 ">
          {reviews.map((review, i) => (
            <article key={i} className={getReviewIndex(i)}>
              <figure className="flex justify-center items-center p-4">
                {review.user.image_url ? (
                  <Image
                    src={review.user.image_url}
                    alt={review.user.name}
                    height={100}
                    width={100}
                    className="rounded-full"
                  />
                ) : (
                  <Image
                    src="/profile.webp"
                    alt={review.user.name}
                    height={100}
                    width={100}
                    className="rounded-full"
                  />
                )}

                <div className="ml-4">
                  <h2 className="md:text-2xl text-xl ">{review.user.name}</h2>
                  <p className="text-sm mb-1">
                    {format(new Date(review.time_created), "PPP")}
                  </p>
                  <Stars value={review.rating} />
                </div>
              </figure>
              <div className="px-8 py-2">
                <p className="mb-6">
                  <span className="font-bold text-gray-800 text-7xl absolute left-0 opacity-20">
                    “
                  </span>
                  {review.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
