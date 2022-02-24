import { useState } from "react";

import { useRouter } from "next/router";
import axios from "axios";
import { withSession } from "../middlewares/session";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function ResetPassword({ code }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    //ADD HONEYPOT FIELD HERE
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        code: code,
        password: password,
        passwordConfirmation: confirmPassword,
      })
      .then((response) => {
        // Handle success.
        console.log("Your user's password has been changed.");
      })
      .catch((error) => {
        // Handle error.
        console.log("An error occurred:", error.response);
      });
  };
  return (
    <Layout title="Enter new password">
      <div className="max-w-md mx-auto  md:mt-24 mt-16  p-4 rounded-xl bg-white shadow">
        <form className="form-control" onSubmit={onSubmit} method="post">
          <h1 className="text-center mt-2">Enter new password</h1>
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            className="input input-primary"
            type="password"
            placeholder="New Password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          <input
            className="input input-primary"
            type="password"
            placeholder="New Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
          />

          <div className="mt-6">
            <button
              type="submit"
              className="btn btn-block text-white"
              disabled={loading}
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const code = query.code;
  return {
    props: { code },
  };
}
