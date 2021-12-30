import Image from "next/image";

export default function Reviews({ data }) {
  function getReviewIndex(i) {
    if (i === 0) {
      return "bg-primary card shadow-lg";
    }
    if (i === 1) {
      return "bg-secondary card shadow-lg";
    }
    if (i === 2) {
      return "bg-yellow-400 card shadow-lg";
    }
    if (i === 3) {
      return "bg-green-300 card shadow-lg";
    }
    if (i === 4) {
      return "bg-base-200 card shadow-lg";
    }
  }
  return (
    <div>
      <h1 className="text-5xl text-center">What our customers have to say</h1>
      <div className="max-w-4xl mx-auto px-4 my-8 ">
        <div className="grid  sm:grid-cols-2 grid-cols-1 gap-6 ">
          {data.result.reviews.slice(0, 4).map((review, i) => (
            <article key={i} className={getReviewIndex(i)}>
              <figure className="flex justify-center items-center p-4">
                <Image
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  height={100}
                  width={100}
                />
                <div className="ml-4">
                  <h2 className="text-2xl ">{review.author_name}</h2>
                  <p className="mb-4">
                    {String(review.relative_time_description)}
                  </p>
                </div>
              </figure>
              <div className="px-8 py-2">
                <p className="">
                  <span className="font-bold text-red-500 text-7xl absolute left-0">
                    “
                  </span>
                  {String(review.text)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
