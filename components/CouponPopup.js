import Link from "next/link";
import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { CopyToClipboard } from "react-copy-to-clipboard";
const card = `bg-primary h-64 w-96 rounded-md shadow-2xl border-4 border-secondary border-dotted text-white bg-gradient-to-br from-primary to-primary-focus`;
const grad = `text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-focus `;

export default function CouponPopup() {
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(false);
  const coupon = "22off";

  function handleModal(modal) {
    if (modal === true) {
      return "modal modal-open";
    } else {
      return "modal";
    }
  }
  function closeModal() {
    setModal(false);
  }
  function openModal() {
    setModal(true);
  }

  useEffect(() => {
    setTimeout(() => {
      setModal(true);
    }, 3000);
  }, []);

  return (
    <div className={handleModal(modal)}>
      <div className="modal-box">
        <h1 className={grad}>Today Only!</h1>
        <p className="underline">2/22/2022</p>
        <p className="bg-accent px-2 my-2 text-2xl">
          <span className="font-extrabold">22% off </span> your order
        </p>
        <p className="text-sm">use code "22off" at checkout</p>
        {copied ? (
          <span style={{ color: "red" }}>
            Copied code, now you can paste it into the coupon box at checkout
          </span>
        ) : null}
        <div className="modal-action">
          <CopyToClipboard text={coupon} onCopy={() => setCopied(true)}>
            <button className="btn btn-outline">Click to copy code</button>
          </CopyToClipboard>

          {/* <Link href="/menu">
            <a className="btn-primary btn" onClick={closeModal}>
              Go To Menu
            </a>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
