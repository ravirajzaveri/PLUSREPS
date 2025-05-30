import Link from "next/link";
import { Stream, User } from "@prisma/client";

import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "@/components/live-badge";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";

interface ResultCardProps {
  data: {
    user: User;
    isLive: boolean;
    title: string;
    thumbnail: string | null;
  };
}

export const ResultCard = ({ data }: ResultCardProps) => {
  return (
    <Link
      href={`/${data.user.username}`}
      aria-label={`View ${data.user.username}'s stream`}
      className="block h-full w-full"
    >
      <div className="space-y-2 sm:space-y-4 p-2 rounded-xl bg-muted hover:bg-accent transition border shadow-sm">
        <Thumbnail
          src={data.thumbnail}
          fallback={data.user.imageUrl}
          isLive={data.isLive}
          username={data.user.username}
        />
        <div className="flex gap-x-2 sm:gap-x-3 items-center">
          <UserAvatar
            username={data.user.username}
            imageUrl={data.user.imageUrl}
            isLive={data.isLive}
          />
          <div className="flex flex-col text-sm overflow-hidden">
            <p className="truncate font-semibold text-sm sm:text-base leading-tight hover:text-blue-500">
              {data.title}
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm truncate">
              @{data.user.username}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};


export const ResultCardSkeleton = () => {
  return (
    <div className="h-full w-full space-y-4 p-2 rounded-xl border shadow-sm bg-muted">
      <ThumbnailSkeleton />
      <div className="flex gap-x-3 items-center">
        <UserAvatarSkeleton />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};

