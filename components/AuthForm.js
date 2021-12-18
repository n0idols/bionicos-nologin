import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useState } from "react";
import Modal from "react-modal";

export default function AuthForm({ setIsModalOpen }) {
  const [authMethod, setAuthMethod] = useState("email");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [phone, setPhone] = useState("initialState");
  const [cookies, setCookies] = useCookies(["user"]);
  const router = useRouter();
  function changeAuthMethod(newMethod) {
    setAuthMethod(newMethod);
  }

  async function signUp(e) {
    e.preventDefault();
    const response = await fetch(`/api/auth/signup`, {
      method: "post",
      body: new FormData(e.target),
    });
    if (response.ok) {
      const res = await response.json();
      setCookies("user", res, { path: "/" });
      setIsModalOpen(false);
      router.push("/checkout");
    } else alert(await response.text());
  }

  async function signIn(e) {
    e.preventDefault();
    const response = await fetch(`/api/auth/signin?authMethod=${authMethod}`, {
      method: "post",
      body: new FormData(e.target),
    });
    if (response.ok) {
      const res = await response.json();
      if (authMethod === "email") {
        setCookies("user", res, { path: "/" });
        setIsModalOpen(false);
        router.push("/checkout");
      } else {
        setPhone(new FormData(e.target).get("phone").toString());
        setIsOTPModalOpen(true);
        console.log(res);
      }
    } else alert(await response.text());
  }

  async function verifyOTP(e) {
    e.preventDefault();
    alert(phone);
    const response = await fetch(`/api/auth/verifyOTP/${phone}`, {
      method: "post",
      body: new FormData(e.target),
    });
    if (response.ok) {
      const res = await response.json();
      setIsOTPModalOpen(false);

      console.log(res);
      setCookies("user", res, { path: "/" });
      setIsModalOpen(false);
      router.push("/checkout");
    } else alert(await response.text());
  }

  function guestCheckout() {
    setIsModalOpen(false);
    router.push("/checkout");
  }

  <div className="max-w-md mx-auto mt-4">
    <div className="form-control">
      <h1 className="font-bold text-2xl text-gray-700">welcome!</h1>
      {authMethod === "email" && (
        <div>
          <form onSubmit={signUp}>
            <label className="label" htmlFor="email">
              <span className="label-text"> Email </span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input  input-primary input-bordered"
            />
            <label className="label" htmlFor="password">
              <span className="label-text"> Password </span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input input-primary input-bordered"
            />
            <button className="btn btn-block btn-primary">Sign Up</button>
          </form>
          <h2>..or Log in!</h2>
        </div>
      )}
      <form onSubmit={signIn}>
        <label className="label" htmlFor={authMethod}>
          <span className="label-text">
            {authMethod === "email" ? "Email" : "Mobile Number"}
          </span>
        </label>
        <input
          id={authMethod}
          name={authMethod}
          type={authMethod === "email" ? "email" : "tel"}
          className="input input-primary input-bordered"
        />

        {authMethod === "email" && (
          <div>
            <label className="label" htmlFor="password">
              <span className="label-text"> Password </span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input input-primary input-bordered"
            />
          </div>
        )}
        <button className="btn btn-block btn-primary">Login</button>
      </form>

      <p className="p-2">
        Signup or Login with
        <button
          on:click={() =>
            changeAuthMethod(authMethod === "email" ? "phone" : "email")
          }
        >
          <h4>{authMethod === "email" ? "mobile number" : "email"}</h4>
        </button>
        or continue as a
        <button on:click={guestCheckout}>
          <h4>guest</h4>
        </button>
      </p>
    </div>
    <Modal bind:isModalOpen={isOTPModalOpen}>
      <div>
        <form onSubmit={verifyOTP}>
          <h2>Verify OTP</h2>
          <label htmlFor="otp">
            We send you a 6-digit code at your mobile number.Enter it below
          </label>
          <input type="text" name="otp" id="otp" />
          <button>Verify</button>
        </form>
      </div>
    </Modal>
  </div>;
}
