"use client";

import { SubscribeButton } from "@/app/(browse)/[username]/_components/subscribe-button";
import { BitsButton } from "@/app/(browse)/[username]/_components/bits-button"; // renamed to GiftButton if desired

import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { onFollow, onUnfollow } from "@/actions/follow";

interface ActionsProps {
  hostIdentity: string;
  isFollowing: boolean;
  isHost: boolean;
}

export const Actions = ({
  hostIdentity,
  isFollowing,
  isHost,
}: ActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { userId } = useAuth();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(hostIdentity)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(hostIdentity)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const toggleFollow = () => {
    if (!userId) return router.push("/sign-in");
    if (isHost) return;
    isFollowing ? handleUnfollow() : handleFollow();
  };

  return (
    <div className="flex w-full lg:w-auto gap-2 items-center">
      {/* Just Heart icon */}
      <Button
        disabled={isPending || isHost}
        onClick={toggleFollow}
        variant="ghost"
        size="icon"
        className="p-2"
      >
        <Heart
          className={cn("h-5 w-5", isFollowing ? "fill-white" : "fill-none")}
        />
      </Button>

      {/* Subscribe popup button */}
      <div className="flex-1">
        <SubscribeButton userId={hostIdentity} compact />
      </div>

      {/* Gift subs */}
      <div className="flex-1">
        <BitsButton userId={hostIdentity} compact />
      </div>
    </div>
  );
};

export const ActionsSkeleton = () => {
  return <Skeleton className="h-10 w-full lg:w-24" />;
};
