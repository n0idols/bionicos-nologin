import { useState, useEffect, useContext } from "react";
import AuthContext from "@/lib/authState";
import toast from "react-hot-toast";
import Link from "next/link";
import parseCookies from "@/lib/cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, error } = useContext(AuthContext);

  useEffect(() => error && toast.error(error));

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="max-w-md mx-auto my-16 border border-primary p-4 rounded-xl ">
      <form className="form-control" onSubmit={handleSubmit}>
        <h1 className="text-center mt-2">Login</h1>
        <Link href="/account/signup">
          <a className="description text-center mt-2">
            Need an account? Click here to sign up
          </a>
        </Link>
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

        <div className="mt-6">
          <input type="submit" value="Login" className="btn btn-block" />
        </div>
      </form>
    </div>
  );
}

// export async function getServerSideProps({ req }) {
//   const { token } = parseCookies(req);
//   if (token) {
//     return {
//       props: {},
//       redirect: { destination: "/account/dashboard" },
//     };
//   }
// }
