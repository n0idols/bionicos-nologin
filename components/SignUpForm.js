import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { withSession } from "@/middlewares/session";
import Layout from "@/components/Layout";
import Link from "next/link";
import { set } from "nprogress";
import toast from "react-hot-toast";
import { useCart } from "@/lib/cartState";
import FBLoginBtn from "@/components/FBLoginBtn";

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { cart } = useCart();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    syrrup: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      alert("Password does not match");
      return;
    }
    try {
      const response = await axios.post("/api/signup", values);
      if (response.ok) {
        router.push("/checkout");
      }
      if (response.ok && cart.length === 0) {
        router.push("/menu");
      }
      // if (cart.length > 0) {
      //   router.push("/checkout");
      // } else {
      //   router.push("/account/dashboard");
      // }
    } catch (err) {
      alert("Invalid credentials");
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-24 p-4 rounded-xl bg-white shadow-xl">
      <form
        className="form-control"
        onSubmit={onSubmit}
        action="/api/signup"
        method="post"
      >
        <h1 className="text-center mt-2">Sign Up</h1>

        <Link href="/login">
          <a className="description text-center mt-2 text-sm">
            Already have an account?
            <span className="font-semibold underline ml-1">
              Click here to Login
            </span>
          </a>
        </Link>

        {/* <FBLoginBtn /> */}
        <label htmlFor="username" className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          className="input input-primary"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          name="username"
          value={values.username}
          onChange={handleChange}
        />

        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          className="input input-primary"
          type="email"
          placeholder="Your email"
          autoComplete="email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        {/* 
    <label htmlFor="phone" className="label">
      <span className="label-text">Phone</span>
    </label>
    <input
      className="input input-primary"
      type="phone"
      placeholder="Your phone number"
      autoComplete="phone"
      name="phone"
    /> */}

        <label htmlFor="password" className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          className="input input-primary"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        <label htmlFor="confirm-password" className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <input
          className="input input-primary"
          type="password"
          placeholder="Confirm password"
          autoComplete="passwordConfirm"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
        />
        <input className="syrrup" type="syrrup" name="syrrup" />

        <div className="mt-6">
          <button
            type="submit"
            className="btn btn-block  text-white"
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
