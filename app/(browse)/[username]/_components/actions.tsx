"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { onBlock, onUnblock } from "@/actions/block";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { SubscribeButton } from "./subscribe-button";
import { BitsButton } from "./bits-button";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
}

export const Actions = ({ isFollowing, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onClickFollow = () => {
    isFollowing ? handleUnfollow() : handleFollow();
  };

  const handleBlock = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((data) =>
          toast.success(`Unblocked the user ${data.blocked.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Compact Row for Mobile */}
      <div className="flex justify-between gap-2 w-full text-sm">
        <Button
          disabled={isPending}
          onClick={onClickFollow}
          className="flex-1 px-3 py-1"
          variant="primary"
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>

        <Button
          onClick={() => toast.info("Subscribe clicked")}
          className="flex-1 bg-purple-600 text-white px-3 py-1"
        >
          Sub ₹110
        </Button>

        <Button
          onClick={() => toast.info("Bits clicked")}
          className="flex-1 bg-red-500 text-white px-3 py-1"
        >
          Bits
        </Button>
      </div>

      {/* Optional block button below */}
      <div>
        <Button onClick={handleBlock} disabled={isPending} size="sm" variant="ghost">
          Block
        </Button>
      </div>
    </div>
  );
};
