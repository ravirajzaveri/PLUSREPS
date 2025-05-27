import Link from "next/link";
import { Stream, User } from "@prisma/client";

import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "@/components/live-badge";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";

interface ResultCardProps {
  data: {
    user: {
      id: string;
      username: string;
      imageUrl: string;
    };
    isLive: boolean;
    title: string;
    thumbnail: string | null;
  };
}


export const ResultCard = ({ data }: ResultCardProps) => {
  return (
    <Link href={`/${data.user.username}`}>
        <div className="h-full w-full space-y-2 sm:space-y-4">

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
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">{data.user.username}</p>
            {data.isLive && (
              <span className="text-red-500 text-xs font-bold animate-pulse">LIVE</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ResultCardSkeleton = () => {
  return (
    <div className="h-full w-full space-y-4">
      <ThumbnailSkeleton />
      <div className="flex gap-x-3">
        <UserAvatarSkeleton />
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
};
