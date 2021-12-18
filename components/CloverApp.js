import React, { Component } from "react";

class CloverApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null,
      showUserInfo: false,
      customerId: "",
      user: {
        firstName: "John",
        lastName: "Doe",
        email: "John.Doe@corona.com",
      },
      card_expiry: "04/2022",
      card: {
        number: "4005562231212123",
        brand: "VISA",
        cvv: "123",
        exp_month: "04",
        exp_year: "2022",
        address_zip: "94085",
      },
    };
    this.callCreateTokenAPI = this.callCreateTokenAPI.bind(this);
    this.callCreateChargeAPI = this.callCreateChargeAPI.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  generateMask(cardNumber) {
    const last4Digits = cardNumber.slice(-4);

    return last4Digits.padStart(cardNumber.length, "*");
  }

  callCreateTokenAPI = async () => {
    const data = JSON.stringify({ card: this.state.card });
    const response = await fetch("/api/createToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const resp = await response.json();
    if (response.status !== 200) {
      throw Error(resp.message);
    }

    console.log(`Token Id is - ${resp.id}`);
    this.setState({
      token: resp.id,
    });
    return resp;
  };

  callCreateCustomerAPI = async () => {
    console.log(
      `Saving Card on File '${this.generateMask(
        this.state.card.number
      )}' for '${this.state.user.firstName} ${this.state.user.lastName}'...`
    );

    const data = JSON.stringify({
      source: this.state.token,
      email: this.state.user.email,
    });
    const response = await fetch("/api/createCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const resp = await response.json();
    if (response.status !== 200) {
      throw Error(resp.message);
    }
    let userId = resp.id;
    console.log(`Card Saved Successfully, Confirmation number - ${userId}`);
    this.setState({ customerId: userId });

    return resp;
  };

  callCreateChargeAPI = async () => {
    console.log(
      `Charging Card '${this.generateMask(
        this.state.card.number
      )}' for $25.00...`
    );

    const source = this.state.showUserInfo
      ? this.state.customerId
      : this.state.token;
    const data = JSON.stringify({ source: source });

    const response = await fetch("/api/createCharge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const resp = await response.json();
    if (response.status !== 200) {
      throw Error(resp.message);
    }

    console.log(`Payment Success, Confirmation # is - ${resp.id}`);
    return resp;
  };

  buttonHandler = (e) => {
    e.preventDefault();
    console.log("", true);

    this.callCreateTokenAPI()
      .then(() => {
        if (this.state.showUserInfo) {
          return this.callCreateCustomerAPI();
        }
      })
      .then((customerObj) => {
        return this.callCreateChargeAPI();
      })
      .catch((err) => console.log(err));
  };

  handleCheckbox = (event) => {
    let checkboxState = event.target.checked;
    this.setState({ showUserInfo: checkboxState });
  };

  handleChange = (event) => {
    let value = event.target.value;

    if (event.target.id === "card-number") {
      this.setState((prevState) => {
        let card = { ...prevState.card };
        card.number = value;
        return { card };
      });
    }
    if (event.target.id === "card-cvv") {
      this.setState((prevState) => {
        let card = { ...prevState.card };
        card.cvv = value;
        return { card };
      });
    }
    if (event.target.id === "address-zip") {
      this.setState((prevState) => {
        let card = { ...prevState.card };
        card.address_zip = value;
        return { card };
      });
    }
    if (event.target.id === "card-date") {
      let monthValue, yearValue;
      const tokens = value.split("/");
      // don't set the state if there is more than one "/" character in the given input
      if (tokens.length < 3) {
        const month = Number(tokens[0]);
        const year = Number(tokens[1]);
        //don't set the state if the first two letter is not a valid month
        if (month >= 1 && month <= 12) {
          //I used lodash for padding the month and year with  zero
          monthValue = month.toString().padStart(2, "0");
          //disregard changes for invalid years
          if (year > 2019 && year <= 2100) {
            yearValue = year.toString();
          }
        }
      }
      this.setState((prevState) => {
        let card = { ...prevState.card };
        card.exp_month = monthValue;
        card.exp_year = yearValue;
        return { card };
      });
    }

    if (event.target.id === "user-firstname") {
      this.setState((prevState) => {
        let user = { ...prevState.user };
        user.firstName = value;
        return { user };
      });
    }
    if (event.target.id === "user-lastname") {
      this.setState((prevState) => {
        let user = { ...prevState.user };
        user.lastName = value;
        return { user };
      });
    }
    if (event.target.id === "user-email") {
      this.setState((prevState) => {
        let user = { ...prevState.user };
        user.email = value;
        return { user };
      });
    }
  };

  render() {
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
                onChange={this.handleChange}
                value={this.state.card.number}
              />

              <div className="grid grid-cols-3 gap-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">MM/YYYY</span>
                  </label>
                  <input
                    id="card-date"
                    className="input input-bordered"
                    label="MM/YYYY"
                    onChange={this.handleChange}
                    defaultValue={this.state.card_expiry}
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
                    onChange={this.handleChange}
                    defaultValue={this.state.card.cvv}
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
                    onChange={this.handleChange}
                    defaultValue={this.state.card.address_zip}
                  />
                </div>
              </div>
              <div className="my-2">
                <label htmlFor="save-card" className="label">
                  <span className="label-text">
                    Save Card on File for next time
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    name="saveCard"
                    value="yes"
                    onChange={this.handleCheckbox}
                  />
                </label>
              </div>
            </fieldset>

            {this.state.showUserInfo && (
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
            )}
          </form>
        </div>
        <div className="mt-8">
          <button
            className="btn bg-brand-red glass text-white hover:bg-brand-redhover btn-block mt-auto"
            onClick={this.buttonHandler}
          >
            Pay For Order
          </button>
        </div>
      </div>
    );
  }
}
export default CloverApp;
