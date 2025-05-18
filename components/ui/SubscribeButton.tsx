"use client";
import { useEffect } from "react";

export const SubscribeButton = () => {
  const handleSubscribe = async () => {
    const res = await fetch("/api/payments/subscribe", { method: "POST" });
    const data = await res.json();

    const razorpay = new window.Razorpay(data);
    razorpay.open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <button
      onClick={handleSubscribe}
      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
    >
      Subscribe ₹199/month
    </button>
  );
};
