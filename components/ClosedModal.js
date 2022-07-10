import React from "react";
import ClosedIcon from "./icons/Closed";
import Modal from "./Modal";

export default function ClosedModal() {
  const isClosed = () => {
    const date = new Date();
    date.setHours(date.getUTCHours() - 8);
    date.setMinutes(date.getUTCMinutes());
    date.setSeconds(date.getUTCSeconds());
    date.setMilliseconds(date.getUTCMilliseconds());

    // if (date.getDay() === 0) return true;
    return date.getHours() < 6 || date.getHours() >= 15;
    return false;
  };

  return (
    <>
      <Modal title="⚠️ We are currently closed" show={isClosed()}>
        <div className="flex px-4">
          <div className="flex flex-col justify-center items-center ">
            <p>😔</p>
            <p className="italic text-center mb-2 text-sm">
              Please come back when we open!
            </p>

            <h2>
              MONDAY - SUNDAY: <span className="block ">7:00am - 4:00pm</span>{" "}
            </h2>
          </div>
          <div className="w-1/2 px-4">
            <ClosedIcon />
          </div>
        </div>
      </Modal>
    </>
  );
}
