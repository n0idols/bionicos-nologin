import { useState, useEffect, useContext } from "react";
import AuthContext from "@/lib/authState";
import toast from "react-hot-toast";

import Link from "next/link";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);

  const { register, error } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => error && toast.error(error));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match!");
      setLoading(false);

      return;
    }
    register({ username, email, password });
    error && setLoading(false);
  };

  return (
    <Layout title="Sign Up">
      <div className="max-w-md mx-auto md:mt-24 mt-16  p-4 rounded-xl ">
        <form
          className="form-control"
          onSubmit={handleSubmit}
          action="submit"
          method="post"
        >
          <h1 className="text-center mt-2">Sign Up</h1>

          <Link href="/account/login">
            <a className="description text-center mt-2">
              Already have an account?
              <span className="font-semibold underline ml-1">
                Click here to Login
              </span>
            </a>
          </Link>

          <label htmlFor="email" className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            className="input input-primary"
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="name"
          />

          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            className="input input-primary"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            className="input input-primary"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confirm-password" className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            className="input input-primary"
            type="password"
            placeholder="confirm password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          <div className="mt-6">
            <button type="submit" className="btn btn-block" disabled={loading}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
