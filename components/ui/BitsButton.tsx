"use client";

export const BitsButton = () => {
  const sendBits = async () => {
    const res = await fetch("/api/payments/bits", { method: "POST" });
    const data = await res.json();

    const razorpay = new window.Razorpay(data);
    razorpay.open();
  };

  return (
    <button
      onClick={sendBits}
      className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500"
    >
      Send 100 Bits (₹10)
    </button>
  );
};
