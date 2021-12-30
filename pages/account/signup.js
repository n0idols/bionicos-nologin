import { useState, useEffect, useContext } from "react";
import AuthContext from "@/lib/authState";
import toast from "react-hot-toast";

import Link from "next/link";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { register, error } = useContext(AuthContext);

  useEffect(() => error && toast.error(error));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match!");
      return;
    }

    register({ email, password });
  };

  return (
    <div className="max-w-md mx-auto my-16 border border-primary p-4 rounded-xl ">
      <form className="form-control" onSubmit={handleSubmit}>
        <h1 className="text-center mt-2">Sign Up</h1>

        <Link href="/account/signup">
          <a className="description text-center mt-2">
            Already have an account? Login here
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
          <input type="submit" value="Sign Up" className="btn btn-block" />
        </div>
      </form>
    </div>
  );
}
