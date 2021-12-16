import { useRef, useEffect } from "react";
import "./CloverIframe.module.css";

export default function CloverIframe({ setToken, setIsModalOpen }) {
  const clover = new Clover("13043ca841e7ae68f21f0710337a5569");
  const elements = clover.elements();

  const cardNumber = elements.create("CARD_NUMBER");
  const cardDate = elements.create("CARD_DATE");
  const cardCvv = elements.create("CARD_CVV");

  let cardNumberRef = useRef(null);
  let cardDateRef = useRef(null);
  let cardCvvRef = useRef(null);
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

  useEffect(() => {
    if (cardNumberRef.current) cardNumber.mount("#card-number", styles);
    if (cardDateRef.current) cardDate.mount("#card-date", styles);
    if (cardCvvRef.current) cardCvv.mount("#card-cvv", styles);
  }, [cardNumberRef.current, cardDateRef.current, cardCvvRef.current, styles]);

  function handleSubmit(event) {
    event.preventDefault();
    // Use the iframe's tokenization method with the user-entered card details
    clover.createToken().then(function (result) {
      if (result.errors) {
        console.log("object");
        Object.values(result.errors).forEach(function (value) {
          displayError.textContent = value;
        });
      } else {
        setToken(result.token);
        setIsModalOpen(false);
      }
    });
  }

  return (
    <div className="container">
      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="form-row top-row">
          <div
            id="card-number"
            className="field card-number"
            ref={cardNumberRef}
          />
          <div className="input-errors" id="card-number-errors" role="alert" />
        </div>
        <div className="form-row">
          <div id="card-date" className="field third-width" ref={cardDateRef} />
          <div className="input-errors" id="card-date-errors" role="alert" />
        </div>
        <div className="form-row">
          <div id="card-cvv" className="field third-width" ref={cardCvvRef} />
          <div className="input-errors" id="card-cvv-errors" role="alert" />
        </div>
        <div id="card-errors" role="alert" />
        <div id="card-response" role="alert" />
        <div className="button-container">
          <button>Submit Payment</button>
        </div>
      </form>
    </div>
  );
}
