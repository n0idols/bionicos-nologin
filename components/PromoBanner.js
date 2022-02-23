import Link from "next/link";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
export default function PromoBanner() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);
  const close = () => setOpen(false);
  const coupon = "22off";

  const copy = () => {
    setCopied(true);
    toast.success(`Copied! Paste it in checkout`);
  };
  return (
    <>
      {open ? (
        <div className="bg-primary fixed bottom-0 inset-x-0 mb-20  flex items-center flex-col  border-gray-600 border-8 border-dotted">
          <span
            className="text-xl cursor-pointer  px-2 rounded-full"
            onClick={close}
          >
            x
          </span>
          <h1 className="text-white">TODAY ONLY</h1>{" "}
          <p className="bg-accent px-2 my-2 text-2xl">
            <span className="font-extrabold ">22% off </span> your order
          </p>
          <small className="text-white">
            No Code Required! Discount Automatically Applied
          </small>
          <div className="my-3">
            <Link href="/menu">
              <a className=" btn-white btn-primary btn btn-sm" onClick={close}>
                Go To Menu
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
