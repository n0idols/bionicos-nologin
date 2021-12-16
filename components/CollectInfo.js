import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export default function CollectInfo({
  userId,
  setDisableOrderBtn,
  email,
  setEmail,
}) {
  //   const [cookie, setCookie] = useCookies(["user"]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [submittedFirstName, setSubmittedFirstName] = useState("");
  const [submittedLastName, setSubmittedLastName] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  let isDirty =
    firstName !== submittedFirstName ||
    lastName !== submittedLastName ||
    email !== submittedEmail ||
    phone !== submittedPhone;

  let isEmpty =
    firstName.length === 0 ||
    lastName.length === 0 ||
    email.length === 0 ||
    phone.length === 0;

  async function getUserData() {
    try {
      const response = await fetch(`/api/user/${userId}`, { method: "get" });
      if (response.ok) {
        const res = await response.json();
        setFirstName(res.firstName ? res.firstName : "");
        setLastName(res.lastName ? res.lastName : "");
        setEmail(res.email ? res.email : "");
        setPhone(res.phone ? res.phone : "");
        setSubmittedFirstName(firstName);
        setSubmittedLastName(lastName);
        setSubmittedEmail(email);
        setSubmittedPhone(phone);
      } else alert(response.text());
    } catch (e) {
      alert(e);
    }
  }

  useEffect(() => {
    if (userId) {
      getUserData;
    }
  }, [userId]);
  async function collectInfo(e) {
    e.preventDefault();
    let response;
    if (!userId) {
      response = await fetch(`/api/auth/signup`, {
        method: "post",
        body: new FormData(e.target),
      });
    }
    if (userId || response.ok) {
      const id = userId ? userId : await response.json();
      console.log(id);
      response = await fetch(`/api/auth/collectInfo`, {
        method: "post",
        body: JSON.stringify({
          id,
          firstName,
          lastName,
          phone,
          email,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      if (response.ok) {
        const res = await response.json();
        console.log(res);
        setSubmittedFirstName(firstName);
        setSubmittedLastName(lastName);
        setSubmittedPhone(phone);
        setSubmittedEmail(email);
        setCookie("user", JSON.stringify(res.id), {
          path: "/",
          maxAge: 7 * 24 * 3600, // Expires after 1hr
          sameSite: true,
          httpOnly: true,
        });
      } else alert(await response.text());
    } else alert(await response.text());
  }

  return (
    <div>
      <h1>Provide your contact info</h1>
      <p className="mb-4">
        Let's make sure that you and your order can find each other. Provide
        your name, phone number, and email for a flawless pickup.
      </p>
      <form onSubmit={collectInfo}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            className="mb-4"
            type="text"
            id="firstName"
            name="firstName"
            required
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setDisableOrderBtn(isDirty || isEmpty);
            }}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            className="mb-4"
            type="text"
            id="lastName"
            name="lastName"
            required
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setDisableOrderBtn(isDirty || isEmpty);
            }}
          />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input
            className="mb-4"
            type="tel"
            id="phone"
            name="phone"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setDisableOrderBtn(isDirty || isEmpty);
            }}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            className="mb-4"
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setDisableOrderBtn(isDirty || isEmpty);
            }}
          />
        </div>
        {(isDirty || isEmpty) && <button>Submit</button>}
      </form>
    </div>
  );
}
