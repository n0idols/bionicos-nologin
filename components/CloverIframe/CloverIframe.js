import { useRef, useEffect, useState } from "react";
import Loading from "../icons/Loading";
import "./CloverIframe.module.css";

export default function CloverIframe({ setToken, setIsModalOpen }) {
  // const clover = new Clover("13043ca841e7ae68f21f0710337a5569");
  // const elements = clover.elements();

  // const cardNumber = elements.create("CARD_NUMBER");
  // const cardDate = elements.create("CARD_DATE");
  // const cardCvv = elements.create("CARD_CVV");
  const [cardNumber, setCardNumber] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardZip, setCardZip] = useState("");
  const [tokenizing, setTokenizing] = useState(false);
  // const [cardSave, setCardSave] = useState(false);

  // let cardNumberRef = useRef(null);
  // let cardDateRef = useRef(null);
  // let cardCvvRef = useRef(null);
  const styles = {
    body: {
      fontFamily: "Roboto, Open Sans, sans-serif",
      fontSize: "16px",
    },
    input: {
      fontSize: "16px",
      // Fixes for https://community.clover.com/questions/24714/issue-in-clover-hosted-iframe-application-running.html
      padding: "0px",
      margin: "0px",
      backgroundColor: "beige",
    },
    "input:focus": { border: "1px solid red" },
  };

  // useEffect(() => {
  //   if (cardNumberRef.current) cardNumber.mount("#card-number", styles);
  //   if (cardDateRef.current) cardDate.mount("#card-date", styles);
  //   if (cardCvvRef.current) cardCvv.mount("#card-cvv", styles);
  // }, [cardNumberRef.current, cardDateRef.current, cardCvvRef.current, styles]);

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   console.log("object1");
  //   // Use the iframe's tokenization method with the user-entered card details
  //   clover
  //     .createToken()
  //     .then(function (result) {
  //       if (result.errors) {
  //         console.log("object2");
  //         Object.values(result.errors).forEach(function (value) {
  //           displayError.textContent = value;
  //         });
  //       } else {
  //         console.log("object3");
  //         setToken(result.token);
  //         setIsModalOpen(false);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("error" + e);
  //     });
  // }

  const createToken = async () => {
    setTokenizing(true);
    const card = {
      number: cardNumber,
      cvv: cardCvv,
      exp_month: cardDate.slice(0, 2),
      exp_year: cardDate.slice(3),
      address_zip: cardZip,
    };
    const response = await fetch("/api/createToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card }),
    });

    const resp = await response.json();
    setTokenizing(false);
    if (response.status !== 200) {
      throw Error(resp.message);
    }

    console.log(`Token Id is - ${resp.id}`);
    setToken(resp.id);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-lg" id="sdkapp">
      <div id="card-errors" role="alert" />
      <div className="mt-16 card bg-red-100 p-4 shadow-xl">
        <form id="payment-form" noValidate autoComplete="off" className="">
          <fieldset>
            <label className="label">
              <span className="label-text">Card Number</span>
            </label>
            <input
              id="card-number"
              className="input input-bordered w-full"
              onChange={(e) => setCardNumber(e.target.value)}
              value={cardNumber}
            />

            <div className="grid grid-cols-3 gap-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">MM/YY</span>
                </label>
                <input
                  id="card-date"
                  className="input input-bordered"
                  label="MM/YY"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value.includes("/")) {
                      if (value.length < 2) setCardDate(value);
                      if (value.length == 2) setCardDate(value + "/");
                      else if (value.length > 2)
                        setCardDate(value.slice(0, 3) + "/" + value.slice(2));
                    } else {
                      if (value.length <= 2 && value[value.length - 1] === "/")
                        setCardDate(value);
                      else if (
                        value.length > 2 &&
                        value.charAt(2) === "/" &&
                        value.length <= 5
                      )
                        setCardDate(value);
                    }
                  }}
                  value={cardDate}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">CVV</span>
                </label>
                <input
                  id="card-cvv"
                  className="input input-bordered"
                  label="CVV"
                  onChange={(e) => setCardCvv(e.target.value)}
                  value={cardCvv}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ZIP</span>
                </label>
                <input
                  id="address-zip"
                  className="input input-bordered"
                  label="Postal code"
                  onChange={(e) => setCardZip(e.target.value)}
                  value={cardZip}
                />
              </div>
            </div>
            {/* <div className="my-2">
              <label htmlFor="save-card" className="label">
                <span className="label-text">
                  Save Card on File for next time
                </span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  name="saveCard"
                  value={cardSave}
                  onChange={(e) => setCardSave(e.target.checked)}
                />
              </label>
            </div> */}
          </fieldset>

          {/* {this.state.showUserInfo && (
            <fieldset className="form-control">
              <div className="grid grid-cols-2 gap-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    id="user-firstname"
                    className="input input-bordered"
                    onChange={this.handleChange}
                    defaultValue={this.state.user.firstName}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    id="user-lastname"
                    className="input input-bordered"
                    onChange={this.handleChange}
                    defaultValue={this.state.user.lastName}
                  />
                </div>
              </div>

              <div className="grid">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id="user-email"
                  label="Email"
                  className="input input-bordered"
                  onChange={this.handleChange}
                  defaultValue={this.state.user.email}
                />
              </div>
            </fieldset>
          )} */}
        </form>
      </div>
      <div className="mt-8">
        <button
          className="btn bg-brand-red glass text-white hover:bg-brand-redhover btn-block mt-auto"
          onClick={createToken}
        >
          {tokenizing ? <Loading /> : "Pay For Order"}
        </button>
      </div>
    </div>
  );
}
