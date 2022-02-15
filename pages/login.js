import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
//import styles from '../../styles/Login.module.css'

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginError, setError] = useState("");
  const router = useRouter();
  function handleUpdate(update) {
    setCredentials({ ...credentials, ...update });
  }
  return (
    <div>
      <div>
        <div>
          <label htmlFor="username">Email</label>
          <input
            name="username"
            type="email"
            onChange={(e) => handleUpdate({ username: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            onChange={(e) => handleUpdate({ password: e.target.value })}
          />
        </div>
        <span>{loginError}?</span>
        <button
          onClick={async () => {
            const response = await signIn("credentials", {
              redirect: false,
              ...credentials,
            });
            if (response.error) {
              setError(response.error);
            } else if (response.ok) {
              router.push("/");
            }
          }}
        >
          Sign in ?
        </button>
      </div>
    </div>
  );
}
