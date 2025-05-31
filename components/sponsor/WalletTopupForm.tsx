"use client";

import { useState } from "react";

export const WalletTopupForm = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopup = async () => {
    if (!amount || isNaN(+amount)) return alert("Enter valid INR amount");

    setLoading(true);
    try {
      const res = await fetch("/api/razorpay/create-checkout", {
        method: "POST",
        body: JSON.stringify({ amountINR: parseFloat(amount) }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!data.orderId) throw new Error("Checkout init failed");

      const razorpay = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: parseFloat(amount) * 100,
        currency: "INR",
        name: "PLUSREPS",
        description: "Wallet Recharge",
        order_id: data.orderId,
        handler: () => {
          alert("Payment initiated. Wallet will be updated shortly.");
        },
        prefill: {},
        theme: { color: "#F59E0B" },
      });

      razorpay.open();
    } catch (err) {
      console.error("❌ Razorpay top-up error:", err);
      alert("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-background shadow w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-2">Recharge Wallet</h2>
      <input
        type="number"
        placeholder="Enter INR amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded mb-3 text-black"
      />
      <button
        onClick={handleTopup}
        disabled={loading}
        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
      >
        {loading ? "Processing..." : "Top Up with Razorpay"}
      </button>
    </div>
  );
};
