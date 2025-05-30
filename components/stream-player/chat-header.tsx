// components/stream-player/chat-header.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChatToggle } from "./chat-toggle";
import { VariantToggle } from "./variant-toggle";

export const ChatHeader = () => {
  return (
    <div className="sticky top-0 lg:top-20  z-10 bg-background border-b p-3">
      {/* Toggle button on desktop */}
      <div className="absolute left-2 top-2 hidden lg:block z-20">
        <ChatToggle />
      </div>

      {/* Title centered */}
      <p className="text-center font-semibold">Stream Chat</p>

      {/* View toggle (chat/community) */}
      <div className="absolute right-2 top-2 z-20">
        <VariantToggle />
      </div>
    </div>
  );
};

export const ChatHeaderSkeleton = () => {
  return (
    <div className="sticky top-0 z-10 bg-background border-b p-3 hidden md:block">
      <Skeleton className="absolute left-3 top-3 h-6 w-6" />
      <Skeleton className="mx-auto h-6 w-28" />
    </div>
  );
};
