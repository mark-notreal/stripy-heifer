import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import api from "../Api";
import DonatableProduct from "./DonatableProduct";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Stripe is needed by Stripe Elements
//
// Concerns:
// - Not sure why Stripe Elements needs to be up here
//   up here rather than in CheckoutForm, where I
//   wanted it.
const stripePromise = api
  .getPublishableKey()
  .then(publishableKey => loadStripe(publishableKey));

export default function DonationForm() {
  // The product catalog, retrieved in useEffect.
  const [products, setProducts] = useState([]);
  // The totals to display. Probably not necessary any
  // longer but I ran out of time to clean up this code.
  const [totals, setTotals] = useState({});

  useEffect(() => {
    // Fetch the product catalog.
    // TODO: Improve this, what if catalog updates after
    // page is loaded?
    if (products.length === 0) {
      api.getProducts().then(products => setProducts(products));
    }
  });

  // As mentioned previously, the totals here are
  // an artifact of how I built/iterated on the app.
  // This is probably no longer necessary.
  const onQuantityChange = (i, value) => {
    let tempProducts = products;
    tempProducts[i].quantity = value;
    setProducts(tempProducts);
    let tempTotals = {};
    for (let product of tempProducts) {
      if (product.quantity > 0) {
        if (!tempTotals[products.currency]) {
          tempTotals[product.currency] = 0;
        }
        tempTotals[product.currency] += product.price * product.quantity;
      }
    }
    setTotals(tempTotals);
  };

  return (
    <div>
      <h2>Donation form</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => {
            {
              /* Populates the table with the product catalog. */
            }
            return (
              <DonatableProduct
                key={product.id}
                index={i}
                name={product.name}
                price={product.price}
                currency={product.currency}
                quantity={product.quantity}
                onQuantityChange={onQuantityChange}
              />
            );
          })}
        </tbody>
      </table>
      {/* Stripe Elements gives us the nice React component for 
          gathering card info. */}
      <Elements stripe={stripePromise}>
        {/* The checkout form has most of the app logic. */}
        <CheckoutForm totals={totals} products={products} />
      </Elements>
    </div>
  );
}
