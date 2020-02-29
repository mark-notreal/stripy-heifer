const env = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.SECRET_KEY);
const app = express();
const port = process.env.PORT;
const publishableKey = process.env.PUBLISHABLE_KEY;
let webhooks = [];

// TODO: Get products from Stripe
const products = [
  { id: 0, name: "Cow", price: "500", currency: "USD", quantity: 0 },
  {
    id: 1,
    name: "Flock of chicks",
    price: "20",
    currency: "EUR",
    quantity: 0
  }
];

// Create a substantially reduced view of the full payment
// intent object intended for client-side payment confirmation.
const createClientViewOfPaymentIntent = paymentIntent => {
  return {
    // For display/validation.
    amount: paymentIntent.amount,
    // The client secret is the key property required
    // for payment completion.
    client_secret: paymentIntent.client_secret,
    // For display/validation.
    currency: paymentIntent.currency
  };
};

// Create a reduced view of the full payment intent object,
// primarily intended for server-side logging.
const createServerViewOfPaymentIntent = paymentIntent => {
  return {
    id: paymentIntent.id,
    object: paymentIntent.object,
    amount: paymentIntent.amount,
    client_secret: paymentIntent.client_secret,
    confirmation_method: paymentIntent.confirmation_method,
    created: paymentIntent.created,
    currency: paymentIntent.currency,
    livemode: paymentIntent.livemode,
    payment_method_types: paymentIntent.payment_method_types,
    status: paymentIntent.status
  };
};

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Stripy Heifer API"));

// Return the publishable key for Stripe Elements.
app.get("/publishableKey", (req, res) => {
  console.log(
    "API: Stripe publishable key requested, returning %s",
    publishableKey
  );
  res.send({ publishable_key: publishableKey });
});

// Return the product catalog for the Web client.
app.get("/products", (req, res) => {
  console.log(
    "API: Product catalog requested, returning current products: %o",
    products
  );
  res.send({
    products: products
  });
});

// Allow payment intent creation; input should be like:
// {
//   "lineItems": [{"id": 0, "quantity": 2}]
// }
//
// This object allows the API to calculate the correct
// amount to charge the customer by looking up the
// product and multiplying its price by the line item
// quantity.
//
// Concerns:
// - The decimal-based approach to currency.
// - It seems one payment intent is necessary per
//   type of currency.
app.post("/paymentIntents", (req, res) => {
  console.log("Attempting to create payment intent");
  // Find the first non-0 quantity line item and create
  // a payment intent only for that line item.
  let lineItem = req.body.lineItems.filter(li => li.quantity > 0)[0];
  let product = products.filter(p => p.id === lineItem.id)[0];
  console.log(product);
  let currency = product.currency;
  let amount = product.price * 100 * lineItem.quantity;
  stripe.paymentIntents
    .create({ currency: currency, amount: amount })
    .then(paymentIntent => {
      let serverViewOfPaymentIntent = createServerViewOfPaymentIntent(
        paymentIntent
      );
      let clientViewOfPaymentIntent = createClientViewOfPaymentIntent(
        paymentIntent
      );
      console.log(
        "Successfully created payment intent; server view: %o",
        serverViewOfPaymentIntent
      );
      res.send(clientViewOfPaymentIntent);
    });
});

// Allow Stripe to send us Webhooks but don't attempt
// anything fancy. Only keep the last 10 around.
app.post("/webhook", (req, res) => {
  try {
    webhooks.push(req.body);
    webhooks = webhooks.slice(-10);
    res.send({ received: true });
  } catch (err) {
    res.send(err);
  }
});

// Return the webhooks for display in the Web client.
app.get("/webhookLog", (req, res) => {
  res.send(webhooks.slice(0).reverse());
});

app.listen(port, () =>
  console.log(`Stripy Heifer API listening on port ${port}!`)
);
