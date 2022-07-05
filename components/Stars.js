import React from "react";

export default function Stars({ count }) {
  const numsArr = Object.values(count);

  return (
    <div>
      {JSON.stringify(numsArr)}
      <div class="rating rating-sm">
        {numsArr.map((i) => (
          <Star key={i} />
        ))}
      </div>
    </div>
  );
}

function Star() {
  const rating = `mask mask-star-2 bg-orange-400 disabled`;
  return (
    <>
      <label htmlFor="rating" />
      <input type="radio" name="rating" class={rating} />
    </>
  );
}
