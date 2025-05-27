"use client";

import { Button } from "@/components/ui/button";

interface BitsButtonProps {
  userId: string;
  compact?: boolean;
}

export const BitsButton = ({ userId, compact }: BitsButtonProps) => {
  const handleSendBits = () => {
    console.log("Sending bits to:", userId);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className={`w-full ${compact ? "text-xs px-2 py-1" : ""}`}
      onClick={handleSendBits}
    >
      {compact ? "Bits" : "Send Bits"}
    </Button>
  );
};
