"use client";

import { toast } from "sonner";
import { useTransition } from "react";

import { onBlock, onUnblock } from "@/actions/block";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";

// New imports
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

  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
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
      <div className="flex gap-2">
        <Button disabled={isPending} onClick={onClick} variant="primary">
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button onClick={handleBlock} disabled={isPending}>
          Block
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="primary">Subscribe Test</Button>
        <Button variant="secondary">Bits Test</Button>

        //<SubscribeButton userId={userId} />
        //<BitsButton userId={userId} />
      </div>
    </div>
  );
};
