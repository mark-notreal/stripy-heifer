import React, { useState, useEffect } from "react";
import "./App.css";
import DonationForm from "./components/DonationForm";
import api from "./Api";

export default function App() {
  // The last 10 Webhooks received, retrieved in useEffect.
  // Requires a hosted + registered URL. See readme.md for
  // more details.
  const [webhooks, setWebhooks] = useState(null);

  useEffect(() => {
    // Fetch recently received Webhooks on page load.
    if (!webhooks) {
      api.getWebhooks().then(res => setWebhooks(res));
    }
  });

  return (
    <div className="App">
      <h1>Stripy Heifer</h1>
      {/* The donation form is the primary UX for this app. */}
      <DonationForm />
      <div>
        <h3>Webhooks</h3>
        <p>
          {/* This is super hokey, but hey. PMs have to choose what to drop. */}
          Refresh to reload <small>(I know, I know)</small>
        </p>
        <p>{webhooks}</p>
      </div>
    </div>
  );
}
