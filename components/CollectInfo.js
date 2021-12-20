import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export default function CollectInfo({
  userId,
  setDisableOrderBtn,
  email,
  setEmail,
}) {
  const [cookies, setCookie] = useCookies([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [submittedFirstName, setSubmittedFirstName] = useState("");
  const [submittedLastName, setSubmittedLastName] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  async function getUserData() {
    try {
      const response = await fetch(`/api/user/${userId}`, { method: "get" });
      if (response.ok) {
        const res = await response.json();
        const resFirstName = res.firstName ? res.firstName : "";
        const resLastName = res.lastName ? res.lastName : "";
        const resEmail = res.email ? res.email : "";
        const resPhone = res.phone ? res.phone : "";
        setFirstName(resFirstName);
        setLastName(resLastName);
        setEmail(resEmail);
        setPhone(resPhone);
        setSubmittedFirstName(resFirstName);
        setSubmittedLastName(resLastName);
        setSubmittedEmail(resEmail);
        setSubmittedPhone(resPhone);
      } else alert(await response.text());
    } catch (e) {
      alert(e);
    }
  }

  useEffect(() => {
    if (userId) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    setIsDirty(
      firstName !== submittedFirstName ||
        lastName !== submittedLastName ||
        email !== submittedEmail ||
        phone !== submittedPhone
    );

    setIsEmpty(
      firstName.length === 0 ||
        lastName.length === 0 ||
        email.length === 0 ||
        phone.length === 0
    );
  }, [
    firstName,
    lastName,
    email,
    phone,
    submittedFirstName,
    submittedLastName,
    submittedEmail,
    submittedPhone,
  ]);

  useEffect(() => {
    setDisableOrderBtn(isDirty || isEmpty);
  }, [isDirty, isEmpty]);

  async function collectInfo(e) {
    e.preventDefault();
    let response;
    if (!userId) {
      response = await fetch(`/api/auth/signup`, {
        method: "post",
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
    }
    if (userId || response.ok) {
      const jsonResponse = await response.json();
      userId = userId ? userId : jsonResponse.userId;
      response = await fetch(`/api/auth/collectInfo`, {
        method: "post",
        body: JSON.stringify({
          id: userId,
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
        // const res = await response.json();
        setSubmittedFirstName(firstName);
        setSubmittedLastName(lastName);
        setSubmittedPhone(phone);
        setSubmittedEmail(email);
        setCookie("user", JSON.stringify(userId), {
          path: "/",
        });
      } else alert(await response.text());
    } else alert(await response.text());
  }

  return (
    <div>
      <h1>Provide your contact info</h1>
      <p className="mb-4">
        Let{"'"}s make sure that you and your order can find each other. Provide
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
            }}
          />
        </div>
        {(isDirty || isEmpty) && <button>Submit</button>}
      </form>
    </div>
  );
}
