"use client";

import { Button } from "@/components/ui/button";

export const BitsButton = ({ userId }: { userId: string }) => {
  const handleSendBits = () => {
    // TODO: Open Razorpay payment modal here
    console.log("Sending bits to:", userId);
  };

  return (
    <Button variant="secondary" onClick={handleSendBits}>
      Send Bits
    </Button>
  );
};
