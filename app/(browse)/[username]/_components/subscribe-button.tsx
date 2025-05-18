"use client";

import { Button } from "@/components/ui/button";

export const SubscribeButton = ({ userId }: { userId: string }) => {
  const handleSubscribe = () => {
    // TODO: Open Razorpay subscription checkout here
    console.log("Subscribing to:", userId);
  };

  return (
    <Button variant="secondary" onClick={handleSubscribe}>
      Subscribe
    </Button>
  );
};
