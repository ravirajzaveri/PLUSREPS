"use client";

import { Button } from "@/components/ui/button";

export const BitsButton = ({ userId }: { userId: string }) => {
  return (
    <Button variant="secondary">
      Send Bits
    </Button>
  );
};
