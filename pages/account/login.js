import { useState, useEffect, useContext } from "react";
import AuthContext from "@/lib/authState";
import toast from "react-hot-toast";
import Link from "next/link";
import parseCookies from "@/lib/cookie";
import Layout from "@/components/Layout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, error } = useContext(AuthContext);

  useEffect(() => error && toast.error(error));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    login({ email, password });
    setLoading(false);
  };

  return (
    <Layout title="Login">
      <div className="max-w-md mx-auto  md:mt-24 mt-16  p-4 rounded-xl ">
        <form className="form-control" onSubmit={handleSubmit}>
          <h1 className="text-center mt-2">Login</h1>
          <Link href="/account/signup">
            <a className="description text-center mt-2">
              Need an account?
              <span className="font-semibold underline ml-1">
                Click here to sign up
              </span>
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
            autoComplete="password"
          />

          <div className="mt-6">
            <button type="submit" className="btn btn-block" disabled={loading}>
              Login
            </button>
          </div>
        </form>
      </div>
    </Layout>
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
