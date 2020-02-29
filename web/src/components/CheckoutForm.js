import React, { useState, useEffect } from "react";
import { FormattedNumber, IntlProvider } from "react-intl";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../Api";

export default function CheckoutForm({ totals, products }) {
  // Initialize Stripe and Stripe Elements.
  const stripe = useStripe();
  const elements = useElements();
  // Stateful variables for controlling checkout experience.
  const [primaryAmount, setPrimaryAmount] = useState(0);
  const [primaryCurrency, setPrimaryCurrency] = useState("USD");
  const [clientSecret, setClientSecret] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [declinedMessage, setDeclinedMessage] = useState(null);

  // This is an odd bit of code to write. I wanted to support
  // multiple amounts in different currencies, but it seems
  // like Stripe does not allow the creation of payment intents
  // with more than one amount/currency. This code works
  // around that limitation in a bad way, taking the first
  // viable product total.
  useEffect(() => {
    if (Object.entries(totals).length > 0) {
      let primaryTotal = Object.entries(totals)[0];
      setPrimaryAmount(primaryTotal[1]);
      setPrimaryCurrency(primaryTotal[0]);
    } else {
      setPrimaryAmount(0);
      setPrimaryCurrency("USD");
    }
  }, [totals]);

  // Handle a checkout event by creating a payment intent.
  // This would normally fire on transition to a checkout
  // page or clicking of a checkout confirmation.
  const checkout = async event => {
    event.preventDefault();
    console.log("Checking out");
    api
      .createPaymentIntent({
        // The API should calculate the total amount/currency.
        // As with other comments, we are sending in multiple
        // line items here but since Stripe cannot handle
        // multiple amounts, we work around it by taking the
        // first viable line item received by the API.
        lineItems: products.map(product => {
          return { id: product.id, quantity: product.quantity };
        })
      })
      .then(paymentIntent => setClientSecret(paymentIntent.client_secret));
  };

  // This event handles the payment confirmation. More
  // sophisticated handling would be desirable in a
  // real application.
  const submitPayment = async event => {
    event.preventDefault();
    setSucceeded(false);
    setDeclinedMessage(null);
    setProcessing(true);
    console.log("Paying.");
    // Here the client code calls the Stripe API directly,
    // bypassing the Stripy Heifer API.
    const response = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        // Why isn't name part of the CardElement?
        billing_details: { name: event.target.name.value }
      }
    });
    if (response.error) {
      // If the payment was declined, display the message.
      // Obviously this code needs to be more robust.
      if (response.error.code === "card_declined") {
        setDeclinedMessage(response.error.message);
      } else {
        console.log(response);
      }
    } else {
      // If the payment was accepted, display a success
      // message.
      setSucceeded(true);
    }
    setProcessing(false);
    console.log(response);
  };

  // These functions are long because they contain explanatory
  // text. This function renders the first of two steps
  // (create payment intent).
  const renderCreatePaymentIntent = () => {
    return (
      <div style={{ border: "2px dashed gray" }}>
        <h3>1. Create payment intent</h3>
        <div>
          <p>
            The first step of the Stripe payment process is to create a payment
            intent. This occurs in the Stripy Heifer API and requires the Stripe
            secret key. In this app:
          </p>
          <ol>
            <li>
              The Web client calls the Stripy Heifer API with the product id and
              quantity requested.
            </li>
            <li>
              The Stripy Heifer API calculates the amount and currency for the
              donation.
            </li>
            <li>
              The Stripy Heifer API calls the Stripe API (using the secret key)
              to create a payment intent for that amount and currency.
            </li>
            <li>
              The Stripe API creates and returns the payment intent to the
              Stripy Heifer API.
            </li>
            <li>
              The Stripy Heifer API strips down the payment intent and
              logs/returns relevant portions to the Web client for payment
              confirmation.
            </li>
          </ol>
          <p>
            Presumably the triggering of the payment intent would be triggered
            by clicking "Checkout" or something similar. In our case, we'll do
            it manually by clicking the button (if it's not enabled, check to
            make sure you put a quantity of products above):
          </p>
        </div>
        {/* Only allow a payment intent to be created if items
        have been selected. */}
        <button onClick={checkout} disabled={primaryAmount === 0}>
          1. Create payment intent for{" "}
          {/* Here and elsewhere, FormattedNumber makes amounts
          look good. */}
          <IntlProvider locale="en">
            <FormattedNumber
              value={primaryAmount}
              style={`currency`}
              currency={primaryCurrency}
            />{" "}
            ({primaryCurrency})
          </IntlProvider>
        </button>
        {renderClientSecret()}
      </div>
    );
  };

  // This function displays the client secret. While you would
  // not typically display this in a Web client (obviously), it
  // does make this particular app experience more insightful.
  const renderClientSecret = () => {
    if (clientSecret) {
      return (
        <div>
          Payment intent created; client secret obtained successfully:{" "}
          <span style={{ font: "15px monospace", color: "red" }}>
            {clientSecret}
          </span>
        </div>
      );
    }
  };

  // This function renders the second of the two major steps
  // for checkout. The most interesting logic is in renderPaymentForm.
  const renderPaymentSection = () => {
    if (clientSecret) {
      return (
        <div style={{ border: "2px dashed gray" }}>
          <h3>2. Confirm card payment</h3>
          <div>
            <p>
              Using a combination of the publishable key (obtained from the API,
              used to initialize the CardElement) and the client secret from the
              payment intent, we can render the CardElement to allow the
              customer to complete payment.
            </p>
            <p>
              When the customer clicks to submit the payment, the form directly
              invokes the Stripe API as opposed to the Stripy Heifer API.
            </p>
            <p>
              The form gracefully handles authentication challenges, but does
              not automatically handle "processing" status or declined
              transactions.
            </p>
          </div>
          {renderPaymentForm()}
        </div>
      );
    }
  };

  // Wipes out the client secret and resets key state variables.
  const startOver = () => {
    setClientSecret(null);
    setSucceeded(false);
    setDeclinedMessage(null);
    setProcessing(false);
  };

  // This function controls the rendering of the payment form,
  // including hiding the form when payment is processing or
  // has succeeded.
  const renderPaymentForm = () => {
    // Replace the payment form if payment has succeeded.
    if (succeeded) {
      return (
        <div>
          <p>
            <IntlProvider locale="en">
              <FormattedNumber
                value={primaryAmount}
                style={`currency`}
                currency={primaryCurrency}
              />{" "}
              ({primaryCurrency})
            </IntlProvider>{" "}
            payment succeeded!
          </p>
          <button onClick={startOver}>Start over</button>
        </div>
      );
    } else {
      return (
        <div>
          {/* If payment failed and there is a declinedMessage,
          display it. */}
          <div hidden={!declinedMessage} style={{ color: "red" }}>
            {declinedMessage}
          </div>
          {/* If payment is still processing, hide the form
          to prevent resubmission. */}
          <form onSubmit={submitPayment} hidden={processing}>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              autoComplete="cardholder"
            />
            <CardElement />
            <button disabled={!clientSecret || !stripe}>
              2. Confirm card payment
            </button>
          </form>
        </div>
      );
    }
  };

  return (
    <div>
      <h2>Checkout form</h2>
      {renderCreatePaymentIntent()}
      {renderPaymentSection()}
    </div>
  );
}
