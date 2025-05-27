"use client";

import { SubscribeButton } from "@/app/(browse)/[username]/_components/subscribe-button";
import { BitsButton } from "@/app/(browse)/[username]/_components/bits-button";

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
    <div className="flex flex-col w-full lg:w-auto">
      {/* Compact inline row for all actions */}
      <div className="flex items-center gap-2 w-full">
        <Button
          disabled={isPending || isHost}
          onClick={toggleFollow}
          variant="primary"
          size="sm"
          className="flex-1 px-2 py-1 text-sm"
        >
          <Heart
            className={cn("h-4 w-4 mr-1", isFollowing ? "fill-white" : "fill-none")}
          />
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>

        <div className="flex-1">
          <SubscribeButton userId={hostIdentity} compact />
        </div>

        <div className="flex-1">
          <BitsButton userId={hostIdentity} compact />
        </div>
      </div>
    </div>
  );
};

export const ActionsSkeleton = () => {
  return <Skeleton className="h-10 w-full lg:w-24" />;
};
