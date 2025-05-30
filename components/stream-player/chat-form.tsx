"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInfo } from "./chat-info";

interface ChatFormProps {
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  isHidden: boolean;
  isFollowersOnly: boolean;
  isFollowing: boolean;
  isDelayed: boolean;
  inputClass?: string;
  buttonClass?: string;
}

export const ChatForm = ({
  onSubmit,
  value,
  onChange,
  isHidden,
  isFollowersOnly,
  isFollowing,
  isDelayed,
  inputClass = "",
  buttonClass = "",
}: ChatFormProps) => {
  const [isDelayBlocked, setIsDelayBlocked] = useState(false);

  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled = isHidden || isDelayBlocked || isFollowersOnlyAndNotFollowing;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value || isDisabled) return;

    if (isDelayed && !isDelayBlocked) {
      setIsDelayBlocked(true);
      setTimeout(() => {
        setIsDelayBlocked(false);
        onSubmit();
      }, 3000);
    } else {
      onSubmit();
    }
  };

  if (isHidden) return null;

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <ChatInfo isDelayed={isDelayed} isFollowersOnly={isFollowersOnly} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        placeholder="Send a message..."
        className={cn(
          "text-base lg:text-sm flex-1 px-3 py-2 rounded-md",
          inputClass
        )}
        inputMode="text"
        autoComplete="off"
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className={cn("rounded-md", buttonClass)}
        disabled={isDisabled}
      >
        Chat
      </Button>
    </form>
  );
};

export const ChatFormSkeleton = () => (
  <div className="flex items-center gap-2 p-3">
    <Skeleton className="flex-1 h-10" />
    <Skeleton className="h-10 w-16" />
  </div>
);
