import React from "react";

export default function Stars({ value }) {
  return (
    <div>
      {" "}
      <div class="rating">
        <input
          type="radio"
          name="rating-2"
          class="mask mask-star-2 bg-orange-400"
        />
        <input
          type="radio"
          name="rating-2"
          class="mask mask-star-2 bg-orange-400"
        />
        <input
          type="radio"
          name="rating-2"
          class="mask mask-star-2 bg-orange-400"
        />
        <input
          type="radio"
          name="rating-2"
          class="mask mask-star-2 bg-orange-400"
        />
        <input
          type="radio"
          name="rating-2"
          class="mask mask-star-2 bg-orange-400"
        />
      </div>
    </div>
  );
}
