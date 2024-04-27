"use client";

import React from "react";

const AddServiceWorker = () => {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
      navigator.serviceWorker.ready.then((registration) => {
        console.log("Service Worker Ready");
      });
    }
    else {
      console.log("Service Worker is not supported.");
    }
  }, []);
  return null;
};

export default AddServiceWorker;