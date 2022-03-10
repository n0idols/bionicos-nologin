import React from "react";

export default function Tip() {
  return (
    <div className="px-2  flex justify-center flex-col">
      <h6>Tip the staff</h6>
      <div className="btn-group">
        <input
          type="radio"
          name="options"
          id="option1"
          data-title="10%"
          className="btn btn-outline btn-primary"
        />
        <input
          type="radio"
          name="options"
          id="option2"
          data-title="15%"
          checked="checked"
          className="btn btn-outline btn-primary"
        />
        <input
          type="radio"
          name="options"
          id="option3"
          data-title="20%"
          className="btn btn-outline btn-primary"
        />
        <input
          type="radio"
          name="options"
          id="other"
          data-title="other"
          className="btn btn-outline btn-primary"
        />
      </div>
    </div>
  );
}
