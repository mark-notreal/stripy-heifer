// The basic templates for the API calls here were
// obtained from a Stripe sample.
// https://github.com/stripe-samples/react-elements-card-payment/blob/master/client/src/api.js

// Creates a payment intent; input looks like:
// {
//   "lineItems": [{"id": 0, "quantity": 2}]
// }
const createPaymentIntent = options => {
  return window
    .fetch(process.env.REACT_APP_API_BASE + `/paymentIntents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("PaymentIntent API Error");
      } else {
        return data;
      }
    });
};

// Gets the Stripe publishable key for Stripe Elements
const getPublishableKey = () => {
  return window
    .fetch(process.env.REACT_APP_API_BASE + `/publishableKey`)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (data && !data.error) {
        return data.publishable_key;
      } else {
        console.log("API error:", { data });
        throw Error("API Error");
      }
    });
};

// Gets the product catalog
const getProducts = () => {
  return window
    .fetch(process.env.REACT_APP_API_BASE + `/products`)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (data && !data.error && data.products) {
        return data.products;
      } else {
        console.log("API error:", { data });
        throw Error("API Error");
      }
    });
};

// Gets the last 10 Webhooks (if registered)
const getWebhooks = () => {
  return window
    .fetch(process.env.REACT_APP_API_BASE + `/webhookLog`)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      console.log(data);
      return JSON.stringify(data);
    });
};

const api = {
  createPaymentIntent,
  getPublishableKey: getPublishableKey,
  getProducts: getProducts,
  getWebhooks: getWebhooks
};

export default api;
