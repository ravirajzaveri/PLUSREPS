"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Follow, User } from "@prisma/client";
import { Following, FollowingSkeleton } from "@/app/(browse)/_components/sidebar/following";

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

  if (loading) return <FollowingSkeleton />;

  return <Following data={data} />;
};
