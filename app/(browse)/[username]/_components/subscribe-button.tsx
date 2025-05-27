"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";

const perks = [
  "Ad-Free Viewing",
  "Sub-Only Chat",
  "Subscriber Streams",
  "1.2x Channel Points",
];

const badges = [
  { month: "1-Month", color: "bg-amber-500" },
  { month: "3-Month", color: "bg-slate-400" },
  { month: "6-Month", color: "bg-yellow-400" },
  { month: "9-Month", color: "bg-cyan-400" },
];

interface SubscribeButtonProps {
  userId: string;
  compact?: boolean;
}

export const SubscribeButton = ({ userId, compact }: SubscribeButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSubscribe = () => {
    alert("Subscribed with Razorpay for ₹110!");
    setOpen(false);
  };

  if (compact) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="primary"
              size="sm"
              className={`w-full ${compact ? "text-xs px-2 py-1" : ""}`}
            >
              {compact ? "Sub ₹110" : "Subscribe ₹110"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-[90%] rounded-xl p-6 bg-background border">
            {/* same content as before */}
          </DialogContent>
        </Dialog>
      );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="w-full">
          Subscribe ₹110
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-[90%] rounded-xl p-6 bg-background border">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            Subscriber Benefits
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {badges.map((badge) => (
              <div
                key={badge.month}
                className={`flex flex-col items-center p-2 rounded-md text-sm text-white ${badge.color}`}
              >
                <Crown className="w-4 h-4" />
                {badge.month}
              </div>
            ))}
          </div>
          <ul className="grid gap-1 text-sm">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> {perk}
              </li>
            ))}
          </ul>
          <Button variant="primary" onClick={handleSubscribe}>
            Confirm Subscription ₹110
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
