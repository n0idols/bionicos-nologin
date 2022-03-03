import React from "react";
import { FaFacebookSquare } from "react-icons/fa";

export default function FBLoginBtn() {
  return (
    <a
      href={`${process.env.NEXT_PUBLIC_API_URL}/connect/facebook`}
      className="bg-[#4267B2] flex items-center justify-center px-2 py-2 text-white btn mt-2"
    >
      Continue with Facebook <FaFacebookSquare className="text-xl ml-1" />
    </a>
  );
}
