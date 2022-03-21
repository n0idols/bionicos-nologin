import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/Layout";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";

export default function ResetPassword() {
  const router = useRouter();
  const { asPath } = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // useEffect(() => {
  //   const accessToken = router.query.access_token;
  //   console.log(accessToken);
  //   if (!accessToken) {
  //     return;
  //   } else {
  //     return;
  //   }
  // }, []);
  const accessToken = router.query.access_token;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      notify.error("passwords-do-not-match");
      return;
    }
    setLoading(true);

    supabaseClient.auth.api
      .updateUser(accessToken, { password })
      .then(() => {
        router.push("/dashboard");
      })
      .catch(() => {
        notify.error(t("error-token-expired"));
        setLoading(false);
      });
  };

  return (
    <Layout title="Enter new password">
      <div className="max-w-md mx-auto  md:mt-24 mt-16  p-4 rounded-xl bg-white shadow">
        <form className="form-control" onSubmit={handleSubmit}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
