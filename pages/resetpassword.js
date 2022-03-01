import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/Layout";

export default function ResetPassword({ code }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    syrrup: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        code: code,
        password: values.password,
        passwordConfirmation: values.confirmPassword,
      })
      .then((response) => {
        // Handle success.
        console.log("Your user's password has been changed.");
        alert("Password Changed Successfuly! Use it to Login");
        router.push("/login");
      })
      .catch((error) => {
        // Handle error.
        alert("An error occurred:", error.response);
        console.log("An error occurred:", error.response);
      });
  };
  return (
    <Layout title="Enter new password">
      <div className="max-w-md mx-auto  md:mt-24 mt-16  p-4 rounded-xl bg-white shadow">
        <form className="form-control" onSubmit={onSubmit} method="post">
          <h1 className="text-center mt-2">Enter new password</h1>
          <label htmlFor="new-password" className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            className="input input-primary"
            type="password"
            placeholder="New Password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
          />
          <label htmlFor="confirm-password" className="label">
            <span className="label-text">Confirm New Password</span>
          </label>
          <input
            className="input input-primary"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
          />
          <input
            className="syrrup"
            type="syrrup"
            name="syrrup"
            value={values.syrrup}
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
