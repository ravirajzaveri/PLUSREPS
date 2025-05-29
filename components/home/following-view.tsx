"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Follow, User } from "@prisma/client";
import { Following } from "@/app/(browse)/_components/sidebar/following";

interface StreamData extends Follow {
  following: User & {
    stream: { isLive: boolean } | null;
  };
}

export const FollowingView = () => {
  const [data, setData] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch("/api/following-streams");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching followed streams", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-[290px] mb-4" />
        <ul className="space-y-2 px-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </ul>
      </div>
    );
  }
  console.log("my data:",data);
  if (data.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        You aren’t following anyone yet.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 px-2">Your Followed Streams</h2>
      <Following data={data} />
    </div>
  );
};
